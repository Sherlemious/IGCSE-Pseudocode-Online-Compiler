import { NextResponse } from 'next/server';
import { EventName, type Paddle } from '@paddle/paddle-node-sdk';
import type { Plan } from '@prisma/client';
import { prisma } from '@/shared/db';
import { getPaddleEnv } from '@/modules/billing/paddle/env';
import { getPaddleServer } from '@/modules/billing/paddle/server';
import { BAND_SLUGS, TIER_TO_PLAN, tierSlugForPriceId } from '@/modules/billing/paddle/plan';
import { expiryForPurchase, isTeacherPlan, passForPriceId } from '@/modules/billing/paddle/passes';
import { planUpdateFromPaddle, type PaddleSubscriptionLike } from '@/modules/billing/paddle/subscriptionState';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';
import { revalidatePremiumAccess } from '@/modules/billing/entitlements';
import {
  claimPaddleEvent,
  isOtherSubscription,
  isStaleEvent,
  releasePaddleEvent,
} from '@/modules/billing/paddle/webhookEvents';
import { logger } from '@/shared/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SubscriptionData extends PaddleSubscriptionLike {
  id: string;
  status: string;
  customerId: string;
  customData?: Record<string, unknown> | null;
  items?: Array<{ price?: { id?: string | null } | null }>;
}

interface TransactionData {
  id: string;
  status: string;
  origin?: string | null;
  customerId: string | null;
  customData?: Record<string, unknown> | null;
  currencyCode?: string | null;
  details?: { totals?: { total?: string | null } | null } | null;
  items?: Array<{ price?: { id?: string | null } | null }>;
}

export async function POST(req: Request) {
  const signature = req.headers.get('paddle-signature');
  const raw = await req.text();

  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  const paddle = getPaddleServer();
  if (!secret || !paddle) {
    logger.error('Paddle webhook: missing PADDLE_WEBHOOK_SECRET or PADDLE_API_KEY');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  let event;
  try {
    event = await paddle.webhooks.unmarshal(raw, secret, signature);
  } catch (err) {
    logger.warn('Paddle webhook: signature verification failed', { error: String(err) });
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }
  if (!event) {
    return NextResponse.json({ error: 'Unparseable event.' }, { status: 400 });
  }

  // A redelivered event was already applied; applying it again would, for
  // example, extend a pass twice.
  const occurredAt = new Date(event.occurredAt);
  if (!(await claimPaddleEvent(event.eventId, event.eventType, occurredAt))) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionResumed:
      case EventName.SubscriptionTrialing:
        await applySubscription(event.data as unknown as SubscriptionData, paddle, occurredAt);
        break;
      case EventName.SubscriptionCanceled:
      case EventName.SubscriptionPaused:
      case EventName.SubscriptionPastDue:
        await downgrade(event.data as unknown as SubscriptionData, occurredAt);
        break;
      case EventName.TransactionCompleted:
        await applyPassPurchase(event.data as unknown as TransactionData, paddle, occurredAt);
        break;
      case EventName.TransactionCreated:
        await recordCheckoutOpened(event.data as unknown as TransactionData);
        break;
      default:
        break;
    }
  } catch (err) {
    logger.error('Paddle webhook: handler error', { event_type: event.eventType, event_id: event.eventId, error: String(err) });
    // Let Paddle's retry run the handler again.
    await releasePaddleEvent(event.eventId).catch(() => {});
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function applySubscription(data: SubscriptionData, paddle: Paddle, occurredAt: Date) {
  const user = await resolveUser(data, paddle);
  if (!user) {
    logger.warn('Paddle webhook: no app user for subscription', {
      subscription_id: data.id,
      customer_id: data.customerId,
    });
    return;
  }
  // Ordering only means something within one subscription: a new purchase's
  // events may legitimately arrive after the old subscription's cancellation.
  if (user.paddleSubscriptionId === data.id && isStaleEvent(occurredAt, user.planUpdatedAt)) {
    logger.warn('Paddle webhook: skipped out-of-date subscription event', {
      user_id: user.id,
      subscription_id: data.id,
      status: data.status,
    });
    return;
  }

  const priceId = data.items?.[0]?.price?.id ?? '';
  const slug = await tierSlugForPriceId(priceId, getPaddleEnv());
  const mapped = slug ? TIER_TO_PLAN[slug] : undefined;
  const update = planUpdateFromPaddle(data, mapped);

  if (update.outcome === 'revoke') {
    if (isOtherSubscription(user.paddleSubscriptionId, data.id)) {
      logger.warn('Paddle webhook: ignored revoke of a subscription the user no longer uses', {
        user_id: user.id,
        subscription_id: data.id,
        status: data.status,
      });
      return;
    }
    await setPlan(user.id, {
      occurredAt,
      plan: 'FREE',
      planTier: null,
      subscriptionId: data.id,
      customerId: data.customerId,
    });
    await captureServerEvent(user.id, 'subscription_plan_revoked', {
      reason: data.status,
      paddle_env: getPaddleEnv(),
      subscription_id: data.id,
    });
    return;
  }

  if (update.outcome === 'unmapped') {
    logger.warn('Paddle webhook: unmapped price on subscription', { price_id: priceId, subscription_id: data.id });
    await linkPaddleIds(user.id, data);
    return;
  }

  await setPlan(user.id, {
    occurredAt,
    plan: update.plan,
    planTier: update.planTier,
    planExpiresAt: update.planExpiresAt,
    subscriptionId: data.id,
    customerId: data.customerId,
    // New band SKUs drop grandfathered unlimited/3×30 limits. Renewals of the
    // existing Starter/Pro prices omit this so `legacyCapacity` stays put.
    ...(BAND_SLUGS.has(update.planTier) ? { legacyCapacity: false } : {}),
  });
  const env = getPaddleEnv();
  if (update.outcome === 'scheduled_cancel' && update.planExpiresAt) {
    await captureServerEvent(user.id, 'subscription_cancel_scheduled', {
      plan: update.plan,
      plan_tier: update.planTier,
      price_id: priceId,
      paddle_env: env,
      subscription_id: data.id,
      status: data.status,
      effective_at: update.planExpiresAt.toISOString(),
    });
    return;
  }
  await captureServerEvent(user.id, 'subscription_plan_granted', {
    plan: update.plan,
    plan_tier: update.planTier,
    price_id: priceId,
    paddle_env: env,
    subscription_id: data.id,
    status: data.status,
  });
}

async function downgrade(data: SubscriptionData, occurredAt: Date) {
  const user = await findLinkedUser(data);
  if (!user) {
    logger.warn('Paddle webhook: no app user to downgrade', { subscription_id: data.id });
    return;
  }
  // findLinkedUser falls back to the customer, which also matches a user who
  // has since moved to a new subscription: cancelling the old one mustn't
  // take away the new plan.
  if (isOtherSubscription(user.paddleSubscriptionId, data.id)) {
    logger.warn('Paddle webhook: ignored downgrade of a subscription the user no longer uses', {
      user_id: user.id,
      subscription_id: data.id,
      status: data.status,
    });
    return;
  }
  if (isStaleEvent(occurredAt, user.planUpdatedAt)) {
    logger.warn('Paddle webhook: skipped out-of-date downgrade', { user_id: user.id, subscription_id: data.id });
    return;
  }
  await setPlan(user.id, {
    occurredAt,
    plan: 'FREE',
    planTier: null,
    subscriptionId: data.id,
    customerId: data.customerId,
    legacyCapacity: false,
  });
  await captureServerEvent(user.id, 'subscription_plan_revoked', {
    reason: data.status,
    paddle_env: getPaddleEnv(),
    subscription_id: data.id,
  });
}

/**
 * Student-only one-time pass. Ignored for teacher accounts (role or plan) and
 * for transactions that aren't a known pass price (subscription renewals).
 */
async function applyPassPurchase(data: TransactionData, paddle: Paddle, occurredAt: Date) {
  const env = getPaddleEnv();
  let pass = null as ReturnType<typeof passForPriceId>;
  for (const item of data.items ?? []) {
    pass = passForPriceId(item.price?.id ?? '', env);
    if (pass) break;
  }
  if (!pass) return;

  const user = await resolveUser(data as unknown as SubscriptionData, paddle);
  if (!user) {
    logger.warn('Paddle webhook: no app user for pass transaction', {
      transaction_id: data.id,
      customer_id: data.customerId,
    });
    return;
  }
  if (user.role === 'TEACHER' || isTeacherPlan(user.plan)) {
    logger.warn('Paddle webhook: ignored student pass for a teacher', {
      user_id: user.id,
      role: user.role,
      plan: user.plan,
    });
    return;
  }

  await setPlan(user.id, {
    occurredAt,
    plan: 'STUDENT',
    planTier: pass.tier,
    planExpiresAt: expiryForPurchase(pass, {
      now: new Date(),
      existingExpiresAt: user.planExpiresAt,
    }),
    customerId: data.customerId,
  });
  await captureServerEvent(user.id, 'student_pass_granted', {
    pass_kind: pass.kind,
    plan_tier: pass.tier,
    paddle_env: env,
    transaction_id: data.id,
  });
}

/**
 * A signed-in buyer opened checkout (Paddle creates the transaction when the
 * overlay loads). Captured here rather than only in the browser because ad
 * blockers hide some buyers from PostHog entirely; the "checkout not finished"
 * follow-up workflow triggers on it. Email and name are `$set` so that workflow
 * can reach someone PostHog never identified.
 */
async function recordCheckoutOpened(data: TransactionData) {
  if (data.origin !== 'web') return;
  const appUserId = readAppUserId(data as unknown as SubscriptionData);
  if (!appUserId) return;
  const user = await prisma.user.findUnique({
    where: { id: appUserId },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user?.email) return;

  const env = getPaddleEnv();
  const priceId = data.items?.[0]?.price?.id ?? '';
  const pass = passForPriceId(priceId, env);
  await captureServerEvent(user.id, 'checkout_opened', {
    transaction_id: data.id,
    price_id: priceId,
    tier: pass?.tier ?? (await tierSlugForPriceId(priceId, env)),
    sku_type: pass ? 'session_pass' : 'subscription',
    currency: data.currencyCode ?? null,
    total: data.details?.totals?.total ?? null,
    role: user.role,
    paddle_env: env,
    // Also on the event: a person PostHog has never seen may not have the
    // `$set` applied yet when the workflow reads it.
    email: user.email,
    name: user.name ?? null,
    $set: { email: user.email, ...(user.name ? { name: user.name } : {}) },
  });
}

async function resolveUser(data: SubscriptionData, paddle: Paddle) {
  const appUserId = readAppUserId(data);
  if (appUserId) {
    const byId = await prisma.user.findUnique({ where: { id: appUserId } });
    if (byId) return byId;
  }
  if (data.customerId) {
    const byCustomer = await prisma.user.findFirst({ where: { paddleCustomerId: data.customerId } });
    if (byCustomer) return byCustomer;
  }
  if (data.customerId) {
    try {
      const customer = await paddle.customers.get(data.customerId);
      const email = customer?.email?.toLowerCase();
      if (email) {
        const byEmail = await prisma.user.findUnique({ where: { email } });
        if (byEmail) return byEmail;
      }
    } catch (err) {
      logger.error('Paddle webhook: customer email lookup failed', { error: String(err) });
    }
  }
  return null;
}

async function findLinkedUser(data: SubscriptionData) {
  if (data.id) {
    const bySub = await prisma.user.findFirst({ where: { paddleSubscriptionId: data.id } });
    if (bySub) return bySub;
  }
  if (data.customerId) {
    const byCustomer = await prisma.user.findFirst({ where: { paddleCustomerId: data.customerId } });
    if (byCustomer) return byCustomer;
  }
  const appUserId = readAppUserId(data);
  if (appUserId) return prisma.user.findUnique({ where: { id: appUserId } });
  return null;
}

function readAppUserId(data: SubscriptionData): string | null {
  const raw = data.customData?.app_user_id;
  return typeof raw === 'string' && raw.length > 0 ? raw : null;
}

async function setPlan(
  userId: string,
  opts: {
    /** When Paddle says the change happened; orders later events against it. */
    occurredAt: Date;
    plan: Plan;
    planTier: string | null;
    planExpiresAt?: Date | null;
    subscriptionId?: string | null;
    customerId?: string | null;
    legacyCapacity?: boolean;
  },
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: opts.plan,
      planTier: opts.planTier,
      planExpiresAt: opts.planExpiresAt ?? null,
      paddleSubscriptionId: opts.subscriptionId || undefined,
      paddleCustomerId: opts.customerId || undefined,
      planUpdatedAt: opts.occurredAt,
      ...(opts.legacyCapacity !== undefined ? { legacyCapacity: opts.legacyCapacity } : {}),
    },
  });
  revalidatePremiumAccess(userId);
}

async function linkPaddleIds(userId: string, data: SubscriptionData) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      paddleSubscriptionId: data.id || undefined,
      paddleCustomerId: data.customerId || undefined,
    },
  });
}
