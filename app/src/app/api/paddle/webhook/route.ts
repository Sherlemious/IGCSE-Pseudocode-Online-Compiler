import { NextResponse } from 'next/server';
import { EventName, type Paddle } from '@paddle/paddle-node-sdk';
import type { Plan } from '@prisma/client';
import { prisma } from '@/shared/db';
import { getPaddleEnv } from '@/modules/billing/paddle/env';
import { getPaddleServer } from '@/modules/billing/paddle/server';
import { BAND_SLUGS, TIER_TO_PLAN, tierSlugForPriceId } from '@/modules/billing/paddle/plan';
import { expiryForPurchase, isTeacherPlan, passForPriceId } from '@/modules/billing/paddle/passes';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SubscriptionData {
  id: string;
  status: string;
  customerId: string;
  customData?: Record<string, unknown> | null;
  items?: Array<{ price?: { id?: string | null } | null }>;
}

interface TransactionData {
  id: string;
  status: string;
  customerId: string;
  customData?: Record<string, unknown> | null;
  items?: Array<{ price?: { id?: string | null } | null }>;
}

const ENTITLED_STATUSES = new Set(['active', 'trialing']);

export async function POST(req: Request) {
  const signature = req.headers.get('paddle-signature');
  const raw = await req.text();

  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  const paddle = getPaddleServer();
  if (!secret || !paddle) {
    console.error('[paddle/webhook] missing PADDLE_WEBHOOK_SECRET or PADDLE_API_KEY');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  let event;
  try {
    event = await paddle.webhooks.unmarshal(raw, secret, signature);
  } catch (err) {
    console.error('[paddle/webhook] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }
  if (!event) {
    return NextResponse.json({ error: 'Unparseable event.' }, { status: 400 });
  }

  try {
    switch (event.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionResumed:
      case EventName.SubscriptionTrialing:
        await applySubscription(event.data as unknown as SubscriptionData, paddle);
        break;
      case EventName.SubscriptionCanceled:
      case EventName.SubscriptionPaused:
      case EventName.SubscriptionPastDue:
        await downgrade(event.data as unknown as SubscriptionData);
        break;
      case EventName.TransactionCompleted:
        await applyPassPurchase(event.data as unknown as TransactionData, paddle);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`[paddle/webhook] handler error for ${event.eventType}`, err);
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function applySubscription(data: SubscriptionData, paddle: Paddle) {
  const user = await resolveUser(data, paddle);
  if (!user) {
    console.warn(
      `[paddle/webhook] no app user for subscription ${data.id} (customer ${data.customerId})`,
    );
    return;
  }

  if (!ENTITLED_STATUSES.has(data.status)) {
    await setPlan(user.id, {
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

  const priceId = data.items?.[0]?.price?.id ?? '';
  const slug = await tierSlugForPriceId(priceId, getPaddleEnv());
  const mapped = slug ? TIER_TO_PLAN[slug] : undefined;
  if (!mapped) {
    console.warn(`[paddle/webhook] unmapped price ${priceId} on subscription ${data.id}`);
    await linkPaddleIds(user.id, data);
    return;
  }

  await setPlan(user.id, {
    plan: mapped.plan,
    planTier: mapped.tier,
    planExpiresAt: null,
    subscriptionId: data.id,
    customerId: data.customerId,
    // New band SKUs drop grandfathered unlimited/3×30 limits. Renewals of the
    // existing Starter/Pro prices omit this so `legacyCapacity` stays put.
    ...(BAND_SLUGS.has(mapped.tier) ? { legacyCapacity: false } : {}),
  });
  await captureServerEvent(user.id, 'subscription_plan_granted', {
    plan: mapped.plan,
    plan_tier: mapped.tier,
    price_id: priceId,
    paddle_env: getPaddleEnv(),
    subscription_id: data.id,
    status: data.status,
  });
}

async function downgrade(data: SubscriptionData) {
  const user = await findLinkedUser(data);
  if (!user) {
    console.warn(`[paddle/webhook] no app user to downgrade for subscription ${data.id}`);
    return;
  }
  await setPlan(user.id, {
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
async function applyPassPurchase(data: TransactionData, paddle: Paddle) {
  const env = getPaddleEnv();
  let pass = null as ReturnType<typeof passForPriceId>;
  for (const item of data.items ?? []) {
    pass = passForPriceId(item.price?.id ?? '', env);
    if (pass) break;
  }
  if (!pass) return;

  const user = await resolveUser(data as unknown as SubscriptionData, paddle);
  if (!user) {
    console.warn(
      `[paddle/webhook] no app user for pass transaction ${data.id} (customer ${data.customerId})`,
    );
    return;
  }
  if (user.role === 'TEACHER' || isTeacherPlan(user.plan)) {
    console.warn(
      `[paddle/webhook] ignoring student pass for teacher user ${user.id} (role=${user.role} plan=${user.plan})`,
    );
    return;
  }

  await setPlan(user.id, {
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
      console.error('[paddle/webhook] customer email lookup failed', err);
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
      planUpdatedAt: new Date(),
      ...(opts.legacyCapacity !== undefined ? { legacyCapacity: opts.legacyCapacity } : {}),
    },
  });
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
