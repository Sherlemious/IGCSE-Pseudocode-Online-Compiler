/**
 * Teacher-tier entitlements — the single source of truth for what a user's plan
 * allows. API routes (and, in later phases, the dashboard and Paddle billing
 * webhook) all read tiers and limits from here so the rules never drift.
 *
 * Tiers:
 *   free   — 1 class, 5 students (the "taste").
 *   pro    — unlimited (Teacher Pro, or an active trial).
 *   school — unlimited (School Licence).
 */
import { prisma } from '@/lib/prisma';
import type { Plan } from '@prisma/client';

export type Tier = 'free' | 'pro' | 'school';

export interface TierLimits {
  maxClasses: number;
  maxStudentsPerClass: number;
}

export const LIMITS: Record<Tier, TierLimits> = {
  free: { maxClasses: 1, maxStudentsPerClass: 5 },
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
    case 'PREMIUM': // legacy value — treat as Pro
      return 'pro';
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
