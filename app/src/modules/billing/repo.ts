import type { Plan } from '@prisma/client';
import { prisma } from '@/shared/db';

/** Billing writes and lookups on the User row (plan, Paddle ids, expiry). */

const BILLING_USER_SELECT = {
  id: true,
  email: true,
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

/**
 * The account for a buyer who paid without signing in: no password (they set
 * one from the claim email, or sign in with Google). If two webhook events race
 * on the same new email, the loser reads the winner's row.
 */
export async function createBillingUserForPayer(input: {
  email: string;
  name: string | null;
  role: 'STUDENT' | 'TEACHER';
}): Promise<{ user: BillingUser; created: boolean }> {
  try {
    const user = await prisma.user.create({
      data: { email: input.email, name: input.name, role: input.role, roleChosen: true },
      select: BILLING_USER_SELECT,
    });
    return { user, created: true };
  } catch (err) {
    const existing = await findBillingUserByEmail(input.email);
    if (existing) return { user: existing, created: false };
    throw err;
  }
}

/** Who opened a checkout, for the server-side `checkout_opened` capture. */
export function findCheckoutContact(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, role: true } });
}

/** The student a parent-pay link was made for: who to name on the page, and whether they already have a plan. */
export function findPayForStudent(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, role: true, plan: true, planTier: true, planExpiresAt: true },
  });
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
