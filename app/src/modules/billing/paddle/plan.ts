import type { Plan } from '@prisma/client';
import { prisma } from '@/shared/db';

/**
 * Marketing tier slug → the entitlement `Plan` enum it grants + the display slug.
 * Keep in sync with PricingTier rows, entitlements.ts, and paddle/passes.ts.
 *
 * The live $15 price keeps slug `pro` so existing subscriptions keep resolving.
 * New buyers of that price get Classroom limits (`legacyCapacity = false`);
 * teachers flagged at cutover keep unlimited Pro.
 */
export const TIER_TO_PLAN: Record<string, { plan: Plan; tier: string }> = {
  student: { plan: 'STUDENT', tier: 'student' },
  starter: { plan: 'STARTER', tier: 'starter' },
  pro: { plan: 'PRO', tier: 'pro' },
  classroom: { plan: 'PRO', tier: 'classroom' },
  department: { plan: 'PRO', tier: 'department' },
  school: { plan: 'SCHOOL', tier: 'school' },
  advanced: { plan: 'SCHOOL', tier: 'campus' },
  campus: { plan: 'SCHOOL', tier: 'campus' },
};

/** Slugs that are the new capacity bands — buying one clears grandfathered limits. */
export const BAND_SLUGS = new Set(['classroom', 'department', 'school', 'campus']);

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
