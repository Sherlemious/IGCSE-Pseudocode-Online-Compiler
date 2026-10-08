import { NextResponse } from 'next/server';
import { EventName } from '@paddle/paddle-node-sdk';
import { getPaddleServer } from '@/modules/billing/paddle/server';
import { claimPaddleEvent, releasePaddleEvent } from '@/modules/billing/paddle/webhookEvents';
import {
  applyPassPurchase,
  applySubscription,
  downgrade,
  recordCheckoutOpened,
  type SubscriptionData,
  type TransactionData,
} from '@/modules/billing/paddle/webhookHandlers';
import { logger } from '@/shared/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
