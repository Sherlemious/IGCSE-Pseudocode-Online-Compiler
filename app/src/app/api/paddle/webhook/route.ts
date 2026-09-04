import { NextResponse } from 'next/server';
import { EventName, type Paddle } from '@paddle/paddle-node-sdk';
import type { Plan } from '@prisma/client';
import { prisma } from '@/shared/db';
import { getPaddleEnv } from '@/modules/billing/paddle/env';
import { getPaddleServer } from '@/modules/billing/paddle/server';
import { TIER_TO_PLAN, tierSlugForPriceId } from '@/modules/billing/paddle/plan';

// The Paddle SDK verifies signatures with Node crypto, so this can't run on edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Minimal shape we read off a subscription event (the SDK types are richer).
interface SubscriptionData {
  id: string;
  status: string;
  customerId: string;
  customData?: Record<string, unknown> | null;
  items?: Array<{ price?: { id?: string | null } | null }>;
}

// Statuses that should grant entitlement. Anything else drops the user to Free.
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

  // Signature verification is the security gate — a forged body fails here.
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
      default:
        // Acknowledged and ignored — we only act on subscription lifecycle events.
        break;
    }
  } catch (err) {
    // The signature was valid but our handling failed (e.g. a transient DB error).
    // Return 500 so Paddle retries the delivery.
    console.error(`[paddle/webhook] handler error for ${event.eventType}`, err);
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Grant/refresh entitlement from an active subscription. */
async function applySubscription(data: SubscriptionData, paddle: Paddle) {
  const user = await resolveUser(data, paddle);
  if (!user) {
    console.warn(
      `[paddle/webhook] no app user for subscription ${data.id} (customer ${data.customerId})`,
    );
    return; // acknowledged, nothing to update
  }

  if (!ENTITLED_STATUSES.has(data.status)) {
    // A non-entitling status arrived as an update (e.g. past_due) — drop to Free.
    await setPlan(user.id, { plan: 'FREE', planTier: null, data });
    return;
  }

  const priceId = data.items?.[0]?.price?.id ?? '';
  const slug = await tierSlugForPriceId(priceId, getPaddleEnv());
  const mapped = slug ? TIER_TO_PLAN[slug] : undefined;
  if (!mapped) {
    console.warn(`[paddle/webhook] unmapped price ${priceId} on subscription ${data.id}`);
    // Keep the Paddle linkage so future events resolve, but don't guess a plan.
    await linkPaddleIds(user.id, data);
    return;
  }

  await setPlan(user.id, { plan: mapped.plan, planTier: mapped.tier, data });
}

/** Cancellation / pause / past-due → revoke entitlement. */
async function downgrade(data: SubscriptionData) {
  const user = await findLinkedUser(data);
  if (!user) {
    console.warn(`[paddle/webhook] no app user to downgrade for subscription ${data.id}`);
    return;
  }
  await setPlan(user.id, { plan: 'FREE', planTier: null, data });
}

/** Find the app user behind a subscription, trying the most reliable signals first. */
async function resolveUser(data: SubscriptionData, paddle: Paddle) {
  // 1) custom_data.app_user_id — set at checkout for signed-in users (most reliable).
  const appUserId = readAppUserId(data);
  if (appUserId) {
    const byId = await prisma.user.findUnique({ where: { id: appUserId } });
    if (byId) return byId;
  }
  // 2) already linked by Paddle customer id.
  if (data.customerId) {
    const byCustomer = await prisma.user.findFirst({ where: { paddleCustomerId: data.customerId } });
    if (byCustomer) return byCustomer;
  }
  // 3) match by the Paddle customer's email (requires an API lookup).
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

/** Downgrade lookups don't need the email API round-trip. */
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
  opts: { plan: Plan; planTier: string | null; data: SubscriptionData },
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: opts.plan,
      planTier: opts.planTier,
      paddleSubscriptionId: opts.data.id || undefined,
      paddleCustomerId: opts.data.customerId || undefined,
      planUpdatedAt: new Date(),
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
