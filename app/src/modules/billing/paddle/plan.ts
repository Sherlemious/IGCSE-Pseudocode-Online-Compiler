import type { Plan } from '@prisma/client';
import { prisma } from '@/shared/db';

/**
 * Marketing tier slug → the entitlement `Plan` enum it grants + the display slug.
 * Single source of truth for what a purchased tier unlocks. Keep in sync with the
 * PricingTier rows (seedPricing.ts) and modules/billing/entitlements.ts.
 *
 * Each tier now maps to a distinct Plan value, so the entitlement system can tell
 * Starter (3 classes / 30 students) from Pro (unlimited). `planTier` still carries
 * the exact label for display, but `plan` alone is now unambiguous.
 */
export const TIER_TO_PLAN: Record<string, { plan: Plan; tier: string }> = {
  student: { plan: 'STUDENT', tier: 'student' },
  starter: { plan: 'STARTER', tier: 'starter' },
  pro: { plan: 'PRO', tier: 'pro' },
  advanced: { plan: 'SCHOOL', tier: 'advanced' },
};

/** Resolve a Paddle price ID to a tier slug via the PricingTier catalog for this env. */
export async function tierSlugForPriceId(
  priceId: string,
  paddleEnv: string,
): Promise<string | null> {
  if (!priceId) return null;
  const row = await prisma.pricingTier.findFirst({
    where: {
      paddleEnv,
      OR: [{ monthPriceId: priceId }, { yearPriceId: priceId }],
    },
    select: { slug: true },
  });
  return row?.slug ?? null;
}
