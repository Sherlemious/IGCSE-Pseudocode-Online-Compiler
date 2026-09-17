import { describe, it, expect } from 'vitest';
import { LEGACY_STUDENT_PRICE_IDS } from './plan';

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
