import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, auth, getPremiumAccess } = vi.hoisted(() => ({
  findMany: vi.fn(),
  auth: vi.fn(),
  getPremiumAccess: vi.fn(),
}));

vi.mock('@/shared/db', () => ({
  prisma: { progress: { findMany } },
}));
vi.mock('@/modules/auth/auth', () => ({ auth }));
vi.mock('@/modules/billing/featureFlags', () => ({ PREMIUM_GATING_ENABLED: true }));
vi.mock('@/modules/billing/entitlements', () => ({ getPremiumAccess }));

import { GET } from './route';

describe('practice progress API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    findMany.mockResolvedValue([]);
    getPremiumAccess.mockResolvedValue(false);
  });

  it('returns 401 when signed out', async () => {
    auth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('returns progress without lastCode', async () => {
    auth.mockResolvedValue({ user: { id: 'u1' } });
    findMany.mockResolvedValue([
      {
        questionId: 'q1',
        status: 'ATTEMPTED',
        bestScore: 1,
        totalTests: 3,
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    ]);
    getPremiumAccess.mockResolvedValue(true);

    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      premiumAccess: true,
      progress: [
        {
          questionId: 'q1',
          status: 'ATTEMPTED',
          bestScore: 1,
          totalTests: 3,
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ],
    });
  });
});
