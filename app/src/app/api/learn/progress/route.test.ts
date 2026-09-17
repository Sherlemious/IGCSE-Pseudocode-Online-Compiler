import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, upsert, transaction, auth, resolveLearnPremiumAccess } = vi.hoisted(() => ({
  findMany: vi.fn(),
  upsert: vi.fn(),
  transaction: vi.fn(async (ops: unknown[]) => Promise.all(ops)),
  auth: vi.fn(),
  resolveLearnPremiumAccess: vi.fn(),
}));

vi.mock('@/shared/db', () => ({
  prisma: {
    learnProgress: { findMany, upsert },
    $transaction: transaction,
  },
}));
vi.mock('@/modules/auth/auth', () => ({ auth }));
vi.mock('@/modules/learn/access', () => ({ resolveLearnPremiumAccess }));

import { GET, PUT } from './route';
import { __resetRateLimit } from '@/shared/lib/rateLimit';

function session() {
  return { user: { id: 'user-1' } };
}

function putRequest(body: unknown) {
  return new Request('http://localhost/api/learn/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('learn progress API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    __resetRateLimit();
    transaction.mockImplementation(async (ops: unknown[]) => Promise.all(ops as Promise<unknown>[]));
    upsert.mockResolvedValue({});
    findMany.mockResolvedValue([]);
    resolveLearnPremiumAccess.mockResolvedValue(true);
  });

  it('GET returns 401 when signed out', async () => {
    auth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('GET includes premiumAccess', async () => {
    auth.mockResolvedValue(session());
    const res = await GET();
    expect(res.status).toBe(200);
    const body = (await res.json()) as { premiumAccess: boolean; lessons: object };
    expect(body.premiumAccess).toBe(true);
    expect(body.lessons).toEqual({});
  });

  it('PUT returns 401 when signed out', async () => {
    auth.mockResolvedValue(null);
    const res = await PUT(putRequest({ lessons: { '1.1': { completedAt: '', attempts: 1 } } }));
    expect(res.status).toBe(401);
    expect(upsert).not.toHaveBeenCalled();
  });

  it('PUT rejects unknown lesson ids', async () => {
    auth.mockResolvedValue(session());
    const res = await PUT(putRequest({ lessons: { '9.9': { completedAt: '', attempts: 1 } } }));
    expect(res.status).toBe(422);
    expect(upsert).not.toHaveBeenCalled();
  });

  it('PUT upserts a playable lesson', async () => {
    auth.mockResolvedValue(session());
    const res = await PUT(
      putRequest({
        lessons: { '1.1': { completedAt: '2026-09-17T08:00:00.000Z', attempts: 2, lastOk: true } },
      }),
    );
    expect(res.status).toBe(200);
    expect(upsert).toHaveBeenCalledTimes(1);
    const arg = upsert.mock.calls[0]?.[0] as {
      create: { status: string; attempts: number; lessonId: string };
      update: { status: string };
    };
    expect(arg.create.lessonId).toBe('1.1');
    expect(arg.create.status).toBe('COMPLETED');
    expect(arg.create.attempts).toBe(2);
    expect(arg.update.status).toBe('COMPLETED');
  });

  it('PUT rejects paid lesson ids without premium access', async () => {
    auth.mockResolvedValue(session());
    resolveLearnPremiumAccess.mockResolvedValue(false);
    const res = await PUT(
      putRequest({
        lessons: { '4.1': { completedAt: '2026-09-17T08:00:00.000Z', attempts: 1, lastOk: true } },
      }),
    );
    expect(res.status).toBe(403);
    expect(upsert).not.toHaveBeenCalled();
  });

  it('PUT does not downgrade COMPLETED', async () => {
    auth.mockResolvedValue(session());
    findMany.mockResolvedValue([
      {
        lessonId: '1.1',
        status: 'COMPLETED',
        attempts: 3,
        lastOk: true,
        lastReason: 'passed',
        lastCode: 'OUTPUT "Hi"',
        completedAt: new Date('2026-09-16T00:00:00.000Z'),
        updatedAt: new Date('2026-09-16T00:00:00.000Z'),
      },
    ]);
    const res = await PUT(
      putRequest({
        lessons: { '1.1': { completedAt: '', attempts: 1, lastOk: false, lastReason: 'wrong_output' } },
      }),
    );
    expect(res.status).toBe(200);
    const arg = upsert.mock.calls[0]?.[0] as {
      update: { status: string; attempts: number; completedAt: Date | null };
    };
    expect(arg.update.status).toBe('COMPLETED');
    expect(arg.update.attempts).toBe(3);
    expect(arg.update.completedAt).toBeInstanceOf(Date);
  });
});
