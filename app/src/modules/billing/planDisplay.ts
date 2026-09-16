/**
 * Human-facing label for a user's current plan.
 *
 * `planTier` is preferred because it's precise. Grandfathered Pro stays "Pro";
 * new buyers of the same $15 price see "Classroom".
 */

const TIER_LABELS: Record<string, string> = {
  student: 'Student',
  'student-month': '1-month pass',
  'student-may-june': 'May/June pass',
  'student-oct-nov': 'Oct/Nov pass',
  starter: 'Starter',
  pro: 'Classroom',
  classroom: 'Classroom',
  department: 'Department',
  school: 'School',
  advanced: 'Campus',
  campus: 'Campus',
};

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Free',
  STUDENT: 'Student',
  STARTER: 'Starter',
  PRO: 'Pro',
  SCHOOL: 'School',
};

export interface PlanBadge {
  label: string;
  /** True for any paying/entitled plan — drives the highlighted (crown) styling. */
  paid: boolean;
}

export function isPaidPlan(plan?: string | null): boolean {
  return !!plan && plan !== 'FREE';
}

export function planBadge(input: {
  plan?: string | null;
  planTier?: string | null;
  legacyCapacity?: boolean | null;
  planExpiresAt?: Date | null;
}): PlanBadge {
  if (input.planExpiresAt && input.planExpiresAt.getTime() <= Date.now()) {
    return { label: 'Free', paid: false };
  }
  if (input.legacyCapacity && input.planTier === 'pro') {
    return { label: 'Pro', paid: true };
  }
  const tier = input.planTier ? TIER_LABELS[input.planTier] : undefined;
  if (tier) return { label: tier, paid: true };

  const plan = String(input.plan ?? 'FREE');
  return { label: PLAN_LABELS[plan] ?? 'Free', paid: plan !== 'FREE' };
}
