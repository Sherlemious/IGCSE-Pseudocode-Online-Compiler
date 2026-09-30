import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ALEVEL_COURSE_ID, IGCSE_COURSE_ID } from '@/modules/learn/types';

const {
  findManyLearn,
  findManyProgress,
  countProgress,
  findManyExams,
  auth,
  isAdmin,
  getQuestionCatalog,
} = vi.hoisted(() => ({
  findManyLearn: vi.fn(),
  findManyProgress: vi.fn(),
  countProgress: vi.fn(),
  findManyExams: vi.fn(),
  auth: vi.fn(),
  isAdmin: vi.fn(),
  getQuestionCatalog: vi.fn(),
}));

vi.mock('@/shared/db', () => ({
  prisma: {
    learnProgress: { findMany: findManyLearn },
    progress: { findMany: findManyProgress, count: countProgress },
    examAttempt: { findMany: findManyExams },
  },
}));
vi.mock('@/modules/auth/auth', () => ({ auth }));
vi.mock('@/modules/admin/isAdmin', () => ({ isAdmin }));
vi.mock('@/shared/lib/catalogCache', () => ({ getQuestionCatalog }));

import { GET } from './route';

function adminSession() {
  return { user: { id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' } };
}

function call(userId: string) {
  return GET(new Request(`http://localhost/api/admin/users/${userId}/learning`), {
    params: Promise.resolve({ id: userId }),
  });
}

describe('admin user learning API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue(adminSession());
    isAdmin.mockReturnValue(true);
    findManyProgress.mockResolvedValue([]);
    countProgress.mockResolvedValue(0);
    findManyExams.mockResolvedValue([]);
    getQuestionCatalog.mockResolvedValue([]);
    findManyLearn.mockResolvedValue([]);
  });

  it('returns both O Level and A Level paths scored on their own course', async () => {
    findManyLearn.mockResolvedValue([
      {
        courseId: IGCSE_COURSE_ID,
        lessonId: '1.1',
        status: 'COMPLETED',
        attempts: 1,
        lastOk: true,
        lastReason: 'passed',
        completedAt: new Date('2026-09-17T08:00:00.000Z'),
        updatedAt: new Date('2026-09-17T08:00:00.000Z'),
      },
      {
        courseId: ALEVEL_COURSE_ID,
        lessonId: 'as1.1',
        status: 'ATTEMPTED',
        attempts: 3,
        lastOk: false,
        lastReason: 'wrong_output',
        completedAt: null,
        updatedAt: new Date('2026-09-30T11:00:00.000Z'),
      },
    ]);

    const res = await call('user-1');
    expect(res.status).toBe(200);
    const body = await res.json() as {
      paths: Array<{
        exam: string;
        paper: string;
        completedCount: number;
        attemptedCount: number;
        lessons: Array<{ lessonId: string; state: string }>;
      }>;
      learn?: unknown;
    };
    expect(body.learn).toBeUndefined();
    expect(body.paths).toHaveLength(2);
    expect(body.paths[0]).toMatchObject({ exam: 'O Level', paper: 'Paper 2', completedCount: 1, attemptedCount: 0 });
    expect(body.paths[1]).toMatchObject({ exam: 'A Level', paper: '9618', completedCount: 0, attemptedCount: 1 });
    expect(body.paths[0].lessons.find((lesson) => lesson.lessonId === '1.1')?.state).toBe('completed');
    expect(body.paths[1].lessons.find((lesson) => lesson.lessonId === 'as1.1')?.state).toBe('attempted');
    expect(findManyLearn).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'user-1' },
    }));
  });

  it('still returns both path headings when the student has no progress', async () => {
    const res = await call('user-2');
    expect(res.status).toBe(200);
    const body = await res.json() as {
      paths: Array<{ exam: string; completedCount: number; attemptedCount: number }>;
    };
    expect(body.paths.map((path) => path.exam)).toEqual(['O Level', 'A Level']);
    expect(body.paths.every((path) => path.completedCount === 0 && path.attemptedCount === 0)).toBe(true);
  });
});
