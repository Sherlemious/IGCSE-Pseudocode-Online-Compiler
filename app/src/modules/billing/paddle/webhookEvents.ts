import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';

/**
 * Paddle retries webhooks and doesn't guarantee order. These guards keep a
 * redelivered event from applying twice and an old event from overwriting a
 * newer plan change.
 */

/**
 * Record the event as being handled. Returns false when it was already
 * recorded (a redelivery, or a concurrent duplicate), so the caller skips it.
 */
export async function claimPaddleEvent(id: string, type: string, occurredAt: Date): Promise<boolean> {
  try {
    await prisma.paddleEvent.create({ data: { id, type, occurredAt } });
    return true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') return false;
    throw e;
  }
}

/** Forget a claim whose handling failed, so Paddle's retry is processed. */
export async function releasePaddleEvent(id: string): Promise<void> {
  await prisma.paddleEvent.deleteMany({ where: { id } });
}

/**
 * True when the user's plan was last changed by something that happened after
 * this event (a later webhook or an admin edit), so the event is out of date.
 * Equal timestamps are not stale: created/activated events share one.
 */
export function isStaleEvent(occurredAt: Date, planUpdatedAt: Date | null | undefined): boolean {
  return planUpdatedAt != null && occurredAt.getTime() < planUpdatedAt.getTime();
}

/**
 * True when the event is about a subscription other than the user's current
 * one, e.g. the cancellation of a plan they already replaced. Such events
 * must not revoke the current plan.
 */
export function isOtherSubscription(
  currentSubscriptionId: string | null | undefined,
  eventSubscriptionId: string,
): boolean {
  return Boolean(currentSubscriptionId) && currentSubscriptionId !== eventSubscriptionId;
}
