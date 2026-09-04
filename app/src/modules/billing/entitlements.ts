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
import { prisma } from '@/shared/db';
import { isPaidPlan } from '@/modules/billing/planDisplay';
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

// ── Premium question access ─────────────────────────────────
// Distinct from the class-capacity tier above: this is the *student-facing* axis
// that gates premium practice/exam questions.

interface PlanHolder {
  plan: Plan;
  trialEndsAt: Date | null;
}

/**
 * Whether a student is entitled to premium (gated) questions. Two independent
 * paths grant access:
 *   1. Their own plan is paid (Student/Starter/Pro/School) or they have an active
 *      trial — a paid student.
 *   2. They're enrolled in at least one class whose teacher (owner) is on a paid
 *      teacher tier, i.e. resolveTier(owner) !== 'free'. A teacher on the plain
 *      Student plan does NOT confer this (Student buys features, not a class),
 *      which falls out of resolveTier mapping STUDENT → 'free'.
 */
export function hasPremiumAccess(input: PlanHolder & { classOwners: PlanHolder[] }): boolean {
  // Path 1 — own paid plan or active trial.
  if (isPaidPlan(input.plan)) return true;
  if (input.trialEndsAt && input.trialEndsAt.getTime() > Date.now()) return true;
  // Path 2 — a teacher who paid.
  return input.classOwners.some((owner) => resolveTier(owner) !== 'free');
}

/** Fetch a user + the plans of every class they're enrolled in, then resolve access. */
export async function getPremiumAccess(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      trialEndsAt: true,
      classEnrollments: {
        select: {
          class: { select: { owner: { select: { plan: true, trialEndsAt: true } } } },
        },
      },
    },
  });
  if (!user) return false;
  return hasPremiumAccess({
    plan: user.plan,
    trialEndsAt: user.trialEndsAt,
    classOwners: user.classEnrollments.map((m) => m.class.owner),
  });
}
