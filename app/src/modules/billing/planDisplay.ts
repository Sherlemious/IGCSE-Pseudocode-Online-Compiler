/**
 * Human-facing label for a user's current plan.
 *
 * `planTier` (the marketing slug the billing webhook records) is preferred because
 * it's precise — Student / Starter / Pro / Advanced. When there's no subscription
 * tier recorded we fall back to the coarse `Plan` enum, which for everyone without
 * an active subscription is just "Free".
 */

const TIER_LABELS: Record<string, string> = {
  student: 'Student',
  starter: 'Starter',
  pro: 'Pro',
  advanced: 'Advanced',
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

/**
 * True for any paid plan (anything other than Free). Use this for premium-feature
 * gating instead of comparing against a single plan value, so every paid tier
 * (Student/Starter/Pro/School) unlocks correctly.
 */
export function isPaidPlan(plan?: string | null): boolean {
  return !!plan && plan !== 'FREE';
}

export function planBadge(input: {
  plan?: string | null;
  planTier?: string | null;
}): PlanBadge {
  const tier = input.planTier ? TIER_LABELS[input.planTier] : undefined;
  if (tier) return { label: tier, paid: true };

  const plan = String(input.plan ?? 'FREE');
  return { label: PLAN_LABELS[plan] ?? 'Free', paid: plan !== 'FREE' };
}
