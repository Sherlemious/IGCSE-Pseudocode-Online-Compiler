/**
 * Teacher-tier entitlements — the single source of truth for what a user's plan
 * allows. API routes, the classes UI, and the Paddle billing webhook all read
 * tiers and limits from here so the rules never drift.
 *
 * The paid ladder is priced by **total student capacity**, not a flat
 * unlimited tier. Bands (class-capacity axis):
 *   free       — 1 class, 5 students (the "taste"); also where paid *student*
 *                plans/passes land, since a student plan buys student features,
 *                not teaching capacity.
 *   starter    — 3 classes, 30 students.
 *   classroom  — 6 classes, 90 students. (the tier formerly sold as "Pro")
 *   department — 15 classes, 250 students.
 *   school     — 40 classes, 750 students.
 *   campus     — unlimited (contact-only; the tier formerly sold as "Advanced").
 */
import { prisma } from '@/shared/db';
import type { Plan, Prisma } from '@prisma/client';

export type Tier = 'free' | 'starter' | 'classroom' | 'department' | 'school' | 'campus';

export interface TierLimits {
  maxClasses: number;
  /** Total students across ALL of the teacher's classes — the priced axis. */
  maxStudentsTotal: number;
  /** Per-class cap (kept for per-class UI); never tighter than the total makes sense. */
  maxStudentsPerClass: number;
}

export const LIMITS: Record<Tier, TierLimits> = {
  free: { maxClasses: 1, maxStudentsTotal: 5, maxStudentsPerClass: 5 },
  starter: { maxClasses: 3, maxStudentsTotal: 30, maxStudentsPerClass: 30 },
  classroom: { maxClasses: 6, maxStudentsTotal: 90, maxStudentsPerClass: 90 },
  department: { maxClasses: 15, maxStudentsTotal: 250, maxStudentsPerClass: 250 },
  school: { maxClasses: 40, maxStudentsTotal: 750, maxStudentsPerClass: 750 },
  campus: { maxClasses: Infinity, maxStudentsTotal: Infinity, maxStudentsPerClass: Infinity },
};

/**
 * Marketing tier slug (recorded on `User.planTier` by the billing webhook) →
 * capacity tier. Legacy slugs are kept so already-subscribed users keep resolving:
 * "pro" → classroom, "advanced" → campus.
 */
const SLUG_TO_TIER: Record<string, Tier> = {
  starter: 'starter',
  classroom: 'classroom',
  pro: 'classroom', // legacy: the tier once sold as "Pro" is now Classroom
  department: 'department',
  school: 'school',
  campus: 'campus',
  advanced: 'campus', // legacy: the tier once sold as "Advanced" is now Campus
};

/** Coarse Plan enum → capacity tier, used when the precise planTier slug is absent. */
const PLAN_TO_TIER: Record<Plan, Tier> = {
  FREE: 'free',
  STUDENT: 'free', // a student plan/pass buys student features, not teaching capacity
  STARTER: 'starter',
  PRO: 'classroom',
  SCHOOL: 'school',
};

interface PlanHolder {
  plan: Plan;
  trialEndsAt: Date | null;
  /** Set for one-time student passes; null/undefined for subscriptions & free. */
  planExpiresAt?: Date | null;
}

/** True when a paid plan is present and not past its (optional) expiry. */
export function isPlanActive(user: Pick<PlanHolder, 'plan' | 'planExpiresAt'>): boolean {
  if (user.plan === 'FREE') return false;
  if (user.planExpiresAt && user.planExpiresAt.getTime() <= Date.now()) return false;
  return true;
}

/**
 * Coarse tier from the Plan enum alone (no slug). Used where we only have a
 * user's plan — notably the "is this class owner a paying teacher?" check. An
 * active trial lifts to Classroom-level access.
 */
export function resolveTier(user: { plan: Plan; trialEndsAt: Date | null }): Tier {
  if (user.trialEndsAt && user.trialEndsAt.getTime() > Date.now()) return 'classroom';
  return PLAN_TO_TIER[user.plan] ?? 'free';
}

/**
 * Precise capacity tier for a user, preferring the exact `planTier` slug and
 * honouring pass expiry. This is what gates class/seat creation.
 */
export function tierForUser(user: PlanHolder & { planTier?: string | null }): Tier {
  // Active trial lifts to Classroom-level teaching access regardless of stored plan.
  if (user.trialEndsAt && user.trialEndsAt.getTime() > Date.now()) return 'classroom';
  // An expired pass (or no paid plan) confers no teaching capacity.
  if (!isPlanActive(user)) return 'free';
  if (user.planTier && SLUG_TO_TIER[user.planTier]) return SLUG_TO_TIER[user.planTier];
  return PLAN_TO_TIER[user.plan] ?? 'free';
}

export function limitsFor(tier: Tier): TierLimits {
  return LIMITS[tier];
}

/** Fetch a user and return their resolved tier + limits (defaults to free). */
export async function getEntitlements(userId: string): Promise<{ tier: Tier; limits: TierLimits }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planTier: true, trialEndsAt: true, planExpiresAt: true },
  });
  const tier = user ? tierForUser(user) : 'free';
  return { tier, limits: LIMITS[tier] };
}

// ── Premium question access ─────────────────────────────────
// Distinct from the class-capacity tier above: this is the *student-facing* axis
// that gates premium practice/exam questions.

/**
 * Whether a student is entitled to premium (gated) questions. Two independent
 * paths grant access:
 *   1. Their own plan is paid and not expired (Student/Starter/…/School, incl. a
 *      still-valid one-time pass) or they have an active trial.
 *   2. They're enrolled in at least one class whose teacher (owner) is on a paid
 *      teacher tier, i.e. resolveTier(owner) !== 'free'. A teacher on the plain
 *      Student plan does NOT confer this (Student buys features, not a class),
 *      which falls out of PLAN_TO_TIER mapping STUDENT → 'free'.
 */
export function hasPremiumAccess(input: PlanHolder & { classOwners: PlanHolder[] }): boolean {
  // Path 1 — own paid, unexpired plan or active trial.
  if (isPlanActive(input)) return true;
  if (input.trialEndsAt && input.trialEndsAt.getTime() > Date.now()) return true;
  // Path 2 — a teacher who paid.
  return input.classOwners.some((owner) => resolveTier(owner) !== 'free');
}

/** Fetch a user + the plans of every class they're enrolled in, then resolve access. */
export async function getPremiumAccess(
  userId: string,
  db: Pick<Prisma.TransactionClient, 'user'> = prisma,
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      trialEndsAt: true,
      planExpiresAt: true,
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
    planExpiresAt: user.planExpiresAt,
    classOwners: user.classEnrollments.map((m) => m.class.owner),
  });
}
