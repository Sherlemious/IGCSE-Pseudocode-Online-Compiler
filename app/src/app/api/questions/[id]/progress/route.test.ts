import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique, auth, getPremiumAccess } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  auth: vi.fn(),
  getPremiumAccess: vi.fn(),
}));

vi.mock('@/shared/db', () => ({
  prisma: { progress: { findUnique } },
}));
vi.mock('@/modules/auth/auth', () => ({ auth }));
vi.mock('@/modules/billing/featureFlags', () => ({ PREMIUM_GATING_ENABLED: true }));
vi.mock('@/modules/billing/entitlements', () => ({ getPremiumAccess }));

import { GET } from './route';

describe('question progress API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    findUnique.mockResolvedValue(null);
    getPremiumAccess.mockResolvedValue(false);
  });

  it('returns 401 when signed out', async () => {
    auth.mockResolvedValue(null);
    const res = await GET(new Request('http://localhost/api/questions/q1/progress'), {
      params: Promise.resolve({ id: 'q1' }),
    });
    expect(res.status).toBe(401);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('returns lastCode and premiumAccess', async () => {
    auth.mockResolvedValue({ user: { id: 'u1' } });
    findUnique.mockResolvedValue({ lastCode: 'OUTPUT 1', status: 'SOLVED', attempts: 2 });
    getPremiumAccess.mockResolvedValue(true);

    const res = await GET(new Request('http://localhost/api/questions/q1/progress'), {
      params: Promise.resolve({ id: 'q1' }),
    });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      lastCode: 'OUTPUT 1',
      status: 'SOLVED',
      attempts: 2,
      premiumAccess: true,
    });
  });
});
