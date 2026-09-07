import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import type { GradeResult } from '@/modules/practice/autograder';

const { findUnique, upsert, updateMany, auth, grade } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
  updateMany: vi.fn(),
  auth: vi.fn(),
  grade: vi.fn(),
}));
vi.mock('@/shared/db', () => ({
  prisma: { question: { findUnique }, progress: { upsert, updateMany } },
}));
vi.mock('@/modules/auth/auth', () => ({ auth }));
vi.mock('@/modules/practice/autograder', () => ({ gradeSubmission: grade }));

import { POST } from './route';
import { __resetRateLimit } from '@/shared/lib/rateLimit';

const passed: GradeResult = { passed: true, actualOutput: 'Ada', executionMs: 1 };

function questionWith(difficulty: 'EASY' | 'MEDIUM' | 'HARD') {
  return {
    id: 'q1',
    difficulty,
    isPremium: false,
    testCases: [
      { id: 'tc1', inputs: [], expectedOutput: 'Ada', description: null, isHidden: false, sortOrder: 0, initialFiles: null },
    ],
  };
}

function gradeRequest(code = 'OUTPUT "Ada"\n') {
  const request = new NextRequest('http://localhost/api/questions/q1/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return POST(request, { params: Promise.resolve({ id: 'q1' }) });
}

describe('grade route access control', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    __resetRateLimit();
    grade.mockResolvedValue(passed);
    upsert.mockResolvedValue({});
    updateMany.mockResolvedValue({});
  });

  it('grades an EASY question for an anonymous user (200)', async () => {
    auth.mockResolvedValue(null);
    findUnique.mockResolvedValue(questionWith('EASY'));

    const response = await gradeRequest();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.passCount).toBe(1);
    expect(body.totalCount).toBe(1);
    expect(body.results).toHaveLength(1);
    // Anonymous grade never touches progress.
    expect(upsert).not.toHaveBeenCalled();
  });

  it('blocks a MEDIUM question for an anonymous user (401 + AUTH_REQUIRED)', async () => {
    auth.mockResolvedValue(null);
    findUnique.mockResolvedValue(questionWith('MEDIUM'));

    const response = await gradeRequest();
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.code).toBe('AUTH_REQUIRED');
    // Never runs the interpreter for a blocked request.
    expect(grade).not.toHaveBeenCalled();
  });

  it('grades a MEDIUM question for a signed-in user (200)', async () => {
    auth.mockResolvedValue({ user: { id: 'student1' } });
    findUnique.mockResolvedValue(questionWith('MEDIUM'));

    const response = await gradeRequest();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.passCount).toBe(1);
    // Signed-in grade records progress.
    expect(upsert).toHaveBeenCalledOnce();
  });
});
