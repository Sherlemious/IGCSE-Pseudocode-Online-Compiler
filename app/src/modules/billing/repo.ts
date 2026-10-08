import type { Plan } from '@prisma/client';
import { prisma } from '@/shared/db';

/** Billing writes and lookups on the User row (plan, Paddle ids, expiry). */

const BILLING_USER_SELECT = {
  id: true,
  role: true,
  plan: true,
  planExpiresAt: true,
  planUpdatedAt: true,
  paddleSubscriptionId: true,
  paddleCustomerId: true,
} as const;

export type BillingUser = NonNullable<Awaited<ReturnType<typeof findBillingUserById>>>;

export function findBillingUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: BILLING_USER_SELECT });
}

export function findBillingUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: BILLING_USER_SELECT });
}

export function findBillingUserByCustomer(paddleCustomerId: string) {
  return prisma.user.findFirst({ where: { paddleCustomerId }, select: BILLING_USER_SELECT });
}

export function findBillingUserBySubscription(paddleSubscriptionId: string) {
  return prisma.user.findFirst({ where: { paddleSubscriptionId }, select: BILLING_USER_SELECT });
}

/** Who opened a checkout, for the server-side `checkout_opened` capture. */
export function findCheckoutContact(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, role: true } });
}

export function findPaddleIds(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { paddleCustomerId: true, paddleSubscriptionId: true },
  });
}

export function setPlan(
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
  return prisma.user.update({
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
}

export function linkPaddleIds(userId: string, ids: { subscriptionId?: string; customerId?: string }) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      paddleSubscriptionId: ids.subscriptionId || undefined,
      paddleCustomerId: ids.customerId || undefined,
    },
  });
}

/** Paid plans whose expiry has passed drop to Free. Returns how many changed. */
export async function expirePlans(now: Date): Promise<number> {
  const result = await prisma.user.updateMany({
    where: { plan: { not: 'FREE' }, planExpiresAt: { lte: now } },
    data: { plan: 'FREE', planTier: null, planExpiresAt: null },
  });
  return result.count;
}
