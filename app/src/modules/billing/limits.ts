/**
 * Capacity numbers for teacher plans. Kept free of Prisma / Next so the
 * pricing page (a client component) can pick a band from a student-count slider.
 * `entitlements.ts` re-exports these and is still the place enforcement lives.
 */
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

/** Slider starts just above Starter so the left card stays the 1–30 option. */
export const TEACHER_SLIDER_MIN = LIMITS.starter.maxStudentsTotal + 1;
/** One step past School seats → Campus (contact). */
export const TEACHER_SLIDER_MAX = LIMITS.school.maxStudentsTotal + 1;

export interface TeacherBand {
  tier: Exclude<Tier, 'free' | 'pro'>;
  /** PricingTier slugs that sell this band (`pro` is the live Classroom price). */
  slugs: readonly string[];
}

/**
 * Which paid band covers a total student count. Starter is 1–30; the slider
 * on /pricing starts at 31 so it never recommends Starter.
 */
export function teacherBandForStudents(students: number): TeacherBand {
  if (students <= LIMITS.starter.maxStudentsTotal) {
    return { tier: 'starter', slugs: ['starter'] };
  }
  if (students <= LIMITS.classroom.maxStudentsTotal) {
    return { tier: 'classroom', slugs: ['classroom', 'pro'] };
  }
  if (students <= LIMITS.department.maxStudentsTotal) {
    return { tier: 'department', slugs: ['department'] };
  }
  if (students <= LIMITS.school.maxStudentsTotal) {
    return { tier: 'school', slugs: ['school'] };
  }
  return { tier: 'campus', slugs: ['campus', 'advanced'] };
}

export function formatCap(n: number): string {
  return Number.isFinite(n) ? String(n) : 'Unlimited';
}

export function findTierView<T extends { slug: string }>(
  tiers: readonly T[],
  slugs: readonly string[],
): T | undefined {
  for (const slug of slugs) {
    const hit = tiers.find((t) => t.slug === slug);
    if (hit) return hit;
  }
  return undefined;
}
