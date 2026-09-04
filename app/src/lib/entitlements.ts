/**
 * Teacher-tier entitlements — the single source of truth for what a user's plan
 * allows. API routes (and, in later phases, the dashboard and Paddle billing
 * webhook) all read tiers and limits from here so the rules never drift.
 *
 * Tiers (class-capacity axis):
 *   free    — 1 class, 5 students (the "taste"); also where paid *student* plans land,
 *             since the Student plan buys student features, not teaching capacity.
 *   starter — up to 3 classes / 30 students (the entry teacher plan).
 *   pro     — unlimited (Teacher Pro, or an active trial).
 *   school  — unlimited (School Licence).
 */
import { prisma } from '@/lib/prisma';
import type { Plan } from '@prisma/client';

export type Tier = 'free' | 'starter' | 'pro' | 'school';

export interface TierLimits {
  maxClasses: number;
  maxStudentsPerClass: number;
}

export const LIMITS: Record<Tier, TierLimits> = {
  free: { maxClasses: 1, maxStudentsPerClass: 5 },
  starter: { maxClasses: 3, maxStudentsPerClass: 30 },
  pro: { maxClasses: Infinity, maxStudentsPerClass: Infinity },
  school: { maxClasses: Infinity, maxStudentsPerClass: Infinity },
};

/** Resolve a user's tier from their plan + any active trial. */
export function resolveTier(user: { plan: Plan; trialEndsAt: Date | null }): Tier {
  // An active trial grants Pro-level access regardless of the stored plan.
  if (user.trialEndsAt && user.trialEndsAt.getTime() > Date.now()) return 'pro';
  switch (user.plan) {
    case 'SCHOOL':
      return 'school';
    case 'PRO':
      return 'pro';
    case 'STARTER':
      return 'starter';
    // STUDENT (paid student plan) and FREE both get the free class-capacity tier —
    // a student plan doesn't grant teaching capacity.
    default:
      return 'free';
  }
}

export function limitsFor(tier: Tier): TierLimits {
  return LIMITS[tier];
}

/** Fetch a user and return their resolved tier + limits (defaults to free). */
export async function getEntitlements(userId: string): Promise<{ tier: Tier; limits: TierLimits }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, trialEndsAt: true },
  });
  const tier = user ? resolveTier(user) : 'free';
  return { tier, limits: LIMITS[tier] };
}
