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

/**
 * Original $1/mo student prices. `/pricing` now checkouts the $2 SKUs; these
 * must still resolve so existing subscriptions renew and cancel correctly.
 */
export const LEGACY_STUDENT_PRICE_IDS: ReadonlySet<string> = new Set([
  'pri_01m1j4kxapd6a1dgfaw5tdjpgt', // sandbox month $1
  'pri_01m1j4kxfevc4yw6m7664cck4h', // sandbox year $10
  'pri_01m1mbfxkdvv0esey8wcaktkxr', // live month $1
  'pri_01m1mbfxqpt6018eessnr3mnhw', // live year $10
]);

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
  if (row?.slug) return row.slug;
  if (LEGACY_STUDENT_PRICE_IDS.has(priceId)) return 'student';
  return null;
}
