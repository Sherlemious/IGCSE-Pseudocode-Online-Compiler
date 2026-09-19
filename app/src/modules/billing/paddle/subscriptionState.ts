import type { Plan } from '@prisma/client';

const ENTITLED_STATUSES = new Set(['active', 'trialing']);

type ScheduledChange = {
  action?: string;
  effectiveAt?: string;
  effective_at?: string;
} | null;

type BillingPeriod = {
  endsAt?: string;
  ends_at?: string;
} | null;

/** Paddle subscription payload as delivered by the Node SDK (camelCase) or raw JSON. */
export interface PaddleSubscriptionLike {
  status?: string;
  scheduledChange?: ScheduledChange;
  scheduled_change?: ScheduledChange;
  currentBillingPeriod?: BillingPeriod;
  current_billing_period?: BillingPeriod;
}

/**
 * When a customer cancels in the portal, Paddle keeps status `active` and sets
 * `scheduled_change.action = cancel` until the period ends. That's when we
 * should keep access but stamp planExpiresAt.
 */
export function scheduledCancelEffectiveAt(data: PaddleSubscriptionLike): Date | null {
  const change = data.scheduledChange ?? data.scheduled_change;
  if (!change || change.action !== 'cancel') return null;
  const period = data.currentBillingPeriod ?? data.current_billing_period;
  const raw = change.effectiveAt ?? change.effective_at ?? period?.endsAt ?? period?.ends_at;
  if (!raw) return null;
  const at = new Date(raw);
  return Number.isNaN(at.getTime()) ? null : at;
}

export type SubscriptionPlanOutcome =
  | { outcome: 'revoke'; plan: 'FREE'; planTier: null; planExpiresAt: null }
  | { outcome: 'unmapped'; plan: null; planTier: null; planExpiresAt: null }
  | {
      outcome: 'grant' | 'scheduled_cancel';
      plan: Plan;
      planTier: string;
      planExpiresAt: Date | null;
    };

export function planUpdateFromPaddle(
  data: PaddleSubscriptionLike,
  mapped: { plan: Plan; tier: string } | undefined,
): SubscriptionPlanOutcome {
  if (!data.status || !ENTITLED_STATUSES.has(data.status)) {
    return { outcome: 'revoke', plan: 'FREE', planTier: null, planExpiresAt: null };
  }
  if (!mapped) {
    return { outcome: 'unmapped', plan: null, planTier: null, planExpiresAt: null };
  }
  const cancelAt = scheduledCancelEffectiveAt(data);
  if (cancelAt) {
    return {
      outcome: 'scheduled_cancel',
      plan: mapped.plan,
      planTier: mapped.tier,
      planExpiresAt: cancelAt,
    };
  }
  return { outcome: 'grant', plan: mapped.plan, planTier: mapped.tier, planExpiresAt: null };
}
