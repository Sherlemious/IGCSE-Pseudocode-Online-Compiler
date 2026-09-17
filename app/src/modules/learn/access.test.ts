import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getPremiumAccess, isAdmin, gating } = vi.hoisted(() => ({
  getPremiumAccess: vi.fn(),
  isAdmin: vi.fn(),
  gating: { enabled: false },
}));

vi.mock('@/modules/billing/entitlements', () => ({ getPremiumAccess }));
vi.mock('@/modules/admin/isAdmin', () => ({ isAdmin }));
vi.mock('@/modules/billing/featureFlags', () => ({
  get PREMIUM_GATING_ENABLED() {
    return gating.enabled;
  },
}));

import { resolveLearnPremiumAccess } from './access';

describe('resolveLearnPremiumAccess', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    gating.enabled = false;
    getPremiumAccess.mockResolvedValue(false);
    isAdmin.mockReturnValue(false);
  });

  it('entitles everyone when gating is off', async () => {
    expect(await resolveLearnPremiumAccess(null)).toBe(true);
    expect(getPremiumAccess).not.toHaveBeenCalled();
  });

  it('denies signed-out visitors when gating is on', async () => {
    gating.enabled = true;
    expect(await resolveLearnPremiumAccess(null)).toBe(false);
    expect(await resolveLearnPremiumAccess({ email: 'a@b.c' })).toBe(false);
  });

  it('lets admins through without a plan', async () => {
    gating.enabled = true;
    isAdmin.mockReturnValue(true);
    expect(await resolveLearnPremiumAccess({ id: 'u1', email: 'admin@x.com', role: 'ADMIN' })).toBe(true);
    expect(getPremiumAccess).not.toHaveBeenCalled();
  });

  it('delegates to getPremiumAccess for signed-in students', async () => {
    gating.enabled = true;
    getPremiumAccess.mockResolvedValue(true);
    expect(await resolveLearnPremiumAccess({ id: 'u1', email: 's@x.com' })).toBe(true);
    expect(getPremiumAccess).toHaveBeenCalledWith('u1');
  });
});
