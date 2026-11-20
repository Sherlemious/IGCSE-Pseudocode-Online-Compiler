import { describe, it, expect, vi } from 'vitest';

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock('@/shared/db', () => ({ prisma: { pricingTier: { findFirst } } }));

import {
  BAND_SLUGS,
  LEGACY_STARTER_PRICE_IDS,
  LEGACY_STUDENT_PRICE_IDS,
  TIER_TO_PLAN,
  tierSlugForPriceId,
} from './plan';

describe('legacy student $1 price IDs', () => {
  it('keeps both sandbox and live month/year IDs so existing subs still map', () => {
    expect(LEGACY_STUDENT_PRICE_IDS).toEqual(
      new Set([
        'pri_01m1j4kxapd6a1dgfaw5tdjpgt',
        'pri_01m1j4kxfevc4yw6m7664cck4h',
        'pri_01m1mbfxkdvv0esey8wcaktkxr',
        'pri_01m1mbfxqpt6018eessnr3mnhw',
      ]),
    );
  });
});

describe('legacy Starter $5/$50 price IDs', () => {
  it('still resolve to starter after the tier row moved to the $7.50/$75 prices', async () => {
    findFirst.mockResolvedValue(null);
    for (const id of LEGACY_STARTER_PRICE_IDS) {
      expect(await tierSlugForPriceId(id, 'production')).toBe('starter');
    }
    expect(LEGACY_STARTER_PRICE_IDS.size).toBe(4);
  });

  it('prefers the database row when one matches', async () => {
    findFirst.mockResolvedValue({ slug: 'small' });
    expect(await tierSlugForPriceId('pri_x', 'production')).toBe('small');
  });
});

describe('small tier', () => {
  it('grants Plan.STARTER with planTier small, and clears grandfathered limits', () => {
    expect(TIER_TO_PLAN.small).toEqual({ plan: 'STARTER', tier: 'small' });
    expect(BAND_SLUGS.has('small')).toBe(true);
    expect(BAND_SLUGS.has('starter')).toBe(false);
  });
});
