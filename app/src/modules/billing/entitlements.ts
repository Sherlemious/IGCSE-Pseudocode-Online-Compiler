/**
 * Teacher-tier entitlements — the single source of truth for what a user's plan
 * allows. API routes, the classes UI, and the Paddle billing webhook all read
 * tiers and limits from here so the rules never drift.
 *
 * Paid ladder is priced by **total student capacity** for new checkouts.
 * Teachers who already had a paid plan at cutover keep `legacyCapacity` and
 * the limits they bought (Starter: 3 classes × 30 per class, no cross-class
 * total; Pro/School: unlimited). Student session passes never grant teaching
 * capacity and never set `legacyCapacity`.
 *
 * Bands (class-capacity axis):
 *   free       — 1 class, 5 students; also where student passes land.
 *   starter    — 3 classes, 30 students total (new checkouts).
 *   classroom  — 6 classes, 90 students. Sold as the $15 tier (was "Pro").
 *   department — 15 classes, 250 students.
 *   school     — 40 classes, 750 students.
 *   campus     — unlimited (contact-only; was "Advanced").
 *   pro        — unlimited; grandfathered Pro subscribers only.
 */
import { prisma } from '@/shared/db';
import type { Plan, Prisma } from '@prisma/client';

export type Tier = 'free' | 'starter' | 'pro' | 'classroom' | 'department' | 'school' | 'campus';

export interface TierLimits {
  maxClasses: number;
  /** Total students across ALL of the teacher's classes — the priced axis for new bands. */
  maxStudentsTotal: number;
  /** Per-class cap. Legacy Starter is enforced here (30) with no total cap. */
  maxStudentsPerClass: number;
}

const UNLIMITED: TierLimits = {
  maxClasses: Infinity,
  maxStudentsTotal: Infinity,
  maxStudentsPerClass: Infinity,
};

/** Pre-band Starter: 3 classes, 30 students each, no cross-class total. */
export const LEGACY_STARTER_LIMITS: TierLimits = {
  maxClasses: 3,
  maxStudentsTotal: Infinity,
  maxStudentsPerClass: 30,
};

export const LIMITS: Record<Tier, TierLimits> = {
  free: { maxClasses: 1, maxStudentsTotal: 5, maxStudentsPerClass: 5 },
  starter: { maxClasses: 3, maxStudentsTotal: 30, maxStudentsPerClass: 30 },
  classroom: { maxClasses: 6, maxStudentsTotal: 90, maxStudentsPerClass: 90 },
  department: { maxClasses: 15, maxStudentsTotal: 250, maxStudentsPerClass: 250 },
  school: { maxClasses: 40, maxStudentsTotal: 750, maxStudentsPerClass: 750 },
  campus: UNLIMITED,
  pro: UNLIMITED,
};

/**
 * Marketing slug → capacity tier. `pro` maps to Classroom for *new* buyers of
 * the existing $15 price; grandfathered Pro users are handled in `tierForUser`
 * via `legacyCapacity` and stay on unlimited `pro`.
 */
const SLUG_TO_TIER: Record<string, Tier> = {
  starter: 'starter',
  classroom: 'classroom',
  pro: 'classroom',
  department: 'department',
  school: 'school',
  campus: 'campus',
  advanced: 'campus',
};

const PLAN_TO_TIER: Record<Plan, Tier> = {
  FREE: 'free',
  STUDENT: 'free',
  STARTER: 'starter',
  PRO: 'classroom',
  SCHOOL: 'school',
};

export interface PlanHolder {
  plan: Plan;
  trialEndsAt: Date | null;
  planExpiresAt?: Date | null;
  planTier?: string | null;
  legacyCapacity?: boolean | null;
}

/** Fields needed to resolve a class owner's seat cap. */
export const OWNER_PLAN_SELECT = {
  plan: true,
  planTier: true,
  trialEndsAt: true,
  planExpiresAt: true,
  legacyCapacity: true,
} as const;

/** True when a paid plan is present and not past its (optional) expiry. */
export function isPlanActive(user: Pick<PlanHolder, 'plan' | 'planExpiresAt'>): boolean {
  if (user.plan === 'FREE') return false;
  if (user.planExpiresAt && user.planExpiresAt.getTime() <= Date.now()) return false;
  return true;
}

/**
 * Coarse tier from the Plan enum (no slug). Used for "is this class owner a
 * paying teacher?" — a student pass maps to free and does not confer a class.
 * An active trial lifts to Classroom-level access.
 */
export function resolveTier(user: { plan: Plan; trialEndsAt: Date | null }): Tier {
  if (user.trialEndsAt && user.trialEndsAt.getTime() > Date.now()) return 'classroom';
  return PLAN_TO_TIER[user.plan] ?? 'free';
}

/**
 * Precise capacity tier. Grandfathered teachers keep `pro` (unlimited) or
 * Starter-with-legacy-limits rather than the new Classroom/30-total bands.
 */
export function tierForUser(user: PlanHolder): Tier {
  if (user.trialEndsAt && user.trialEndsAt.getTime() > Date.now()) return 'classroom';
  if (!isPlanActive(user)) return 'free';
  if (user.legacyCapacity) {
    if (user.plan === 'STARTER') return 'starter';
    if (user.plan === 'PRO') return 'pro';
    if (user.plan === 'SCHOOL') return 'campus';
  }
  if (user.planTier && SLUG_TO_TIER[user.planTier]) return SLUG_TO_TIER[user.planTier];
  return PLAN_TO_TIER[user.plan] ?? 'free';
}

export function limitsFor(tier: Tier): TierLimits {
  return LIMITS[tier];
}

/** Limits the owner actually has, including frozen pre-band Starter seats. */
export function limitsForUser(user: PlanHolder): TierLimits {
  if (user.trialEndsAt && user.trialEndsAt.getTime() > Date.now()) return LIMITS.classroom;
  if (!isPlanActive(user)) return LIMITS.free;
  if (user.legacyCapacity && user.plan === 'STARTER') return LEGACY_STARTER_LIMITS;
  if (user.legacyCapacity && (user.plan === 'PRO' || user.plan === 'SCHOOL')) return UNLIMITED;
  return LIMITS[tierForUser(user)];
}

export function isAtStudentCap(opts: {
  limits: TierLimits;
  studentsInClass: number;
  studentsAcrossClasses: number;
}): boolean {
  if (opts.studentsInClass >= opts.limits.maxStudentsPerClass) return true;
  if (Number.isFinite(opts.limits.maxStudentsTotal) && opts.studentsAcrossClasses >= opts.limits.maxStudentsTotal) {
    return true;
  }
  return false;
}

export async function getEntitlements(userId: string): Promise<{ tier: Tier; limits: TierLimits }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: OWNER_PLAN_SELECT,
  });
  if (!user) return { tier: 'free', limits: LIMITS.free };
  return { tier: tierForUser(user), limits: limitsForUser(user) };
}

/**
 * Whether a student is entitled to premium (gated) questions. Two independent
 * paths grant access:
 *   1. Their own plan is paid and not expired (incl. a still-valid student pass)
 *      or they have an active trial.
 *   2. They're enrolled in a class whose teacher is on a paid teacher tier.
 *      A student pass on the *teacher* does not confer this (STUDENT → free).
 */
export function hasPremiumAccess(input: PlanHolder & { classOwners: PlanHolder[] }): boolean {
  if (isPlanActive(input)) return true;
  if (input.trialEndsAt && input.trialEndsAt.getTime() > Date.now()) return true;
  return input.classOwners.some((owner) => resolveTier(owner) !== 'free');
}

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
        where: { class: { archived: false } },
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
