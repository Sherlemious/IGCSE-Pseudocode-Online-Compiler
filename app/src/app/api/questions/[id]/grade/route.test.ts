import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import type { GradeResult } from '@/modules/practice/autograder';

const { getQuestionForGrade, upsert, updateMany, auth, grade } = vi.hoisted(() => ({
  getQuestionForGrade: vi.fn(),
  upsert: vi.fn(),
  updateMany: vi.fn(),
  auth: vi.fn(),
  grade: vi.fn(),
}));
vi.mock('@/shared/db', () => ({
  prisma: { progress: { upsert, updateMany } },
}));
vi.mock('@/shared/lib/catalogCache', () => ({ getQuestionForGrade }));
vi.mock('@/modules/auth/auth', () => ({ auth }));
vi.mock('@/modules/practice/autograder', () => ({
  MAX_GRADE_CODE_CHARS: 20_000,
  gradeTestCases: (code: string, tests: { inputs: string[]; expectedOutput: string }[]) =>
    Promise.all(tests.map((tc) => grade(code, tc.inputs, tc.expectedOutput))),
}));

import { POST } from './route';
import { __resetRateLimit } from '@/shared/lib/rateLimit';

const passed: GradeResult = { passed: true, actualOutput: 'Ada', executionMs: 1 };

function questionWith(difficulty: 'EASY' | 'MEDIUM' | 'HARD', extra: Record<string, unknown> = {}) {
  return {
    id: 'q1',
    difficulty,
    isPremium: false,
    answerFormat: 'CODE',
    flowchart: null,
    ...extra,
    testCases: [
      { id: 'tc1', inputs: [], expectedOutput: 'Ada', description: null, isHidden: false, sortOrder: 0, initialFiles: null },
    ],
  };
}

function gradeRequest(code = 'OUTPUT "Ada"\n') {
  return post({ code });
}

function post(body: unknown) {
  const request = new NextRequest('http://localhost/api/questions/q1/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(request, { params: Promise.resolve({ id: 'q1' }) });
}

/** START → OUTPUT <label> → STOP */
function drawing(outputLabel: string, blank = false) {
  return {
    version: 1,
    nodes: [
      { id: 's', shape: 'terminator', label: 'START', locked: blank || undefined },
      { id: 'o', shape: 'io', label: outputLabel, ...(blank ? { blank: true } : {}) },
      { id: 'x', shape: 'terminator', label: 'STOP', locked: blank || undefined },
    ],
    edges: [
      { id: 'e1', source: 's', target: 'o' },
      { id: 'e2', source: 'o', target: 'x' },
    ],
  };
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
    getQuestionForGrade.mockResolvedValue(questionWith('EASY'));

    const response = await gradeRequest();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.passCount).toBe(1);
    expect(body.totalCount).toBe(1);
    expect(body.results).toHaveLength(1);
    // Anonymous grade never touches progress.
    expect(upsert).not.toHaveBeenCalled();
  });

  it.each(['MEDIUM', 'HARD'] as const)(
    'blocks a %s question for an anonymous user (401 + AUTH_REQUIRED)',
    async (difficulty) => {
      auth.mockResolvedValue(null);
      getQuestionForGrade.mockResolvedValue(questionWith(difficulty));

      const response = await gradeRequest();
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.code).toBe('AUTH_REQUIRED');
      // Never runs the interpreter for a blocked request.
      expect(grade).not.toHaveBeenCalled();
    },
  );

  it('grades a MEDIUM question for a signed-in user (200)', async () => {
    auth.mockResolvedValue({ user: { id: 'student1' } });
    getQuestionForGrade.mockResolvedValue(questionWith('MEDIUM'));

    const response = await gradeRequest();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.passCount).toBe(1);
    // Signed-in grade records progress.
    expect(upsert).toHaveBeenCalledOnce();
  });

  it('rejects oversized code before grading (413)', async () => {
    auth.mockResolvedValue(null);
    getQuestionForGrade.mockResolvedValue(questionWith('EASY'));

    const response = await gradeRequest('OUTPUT 1\n'.repeat(3000));
    expect(response.status).toBe(413);
    expect(grade).not.toHaveBeenCalled();
  });
});

describe('grade route — flowchart answers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    __resetRateLimit();
    grade.mockResolvedValue(passed);
    upsert.mockResolvedValue({});
    updateMany.mockResolvedValue({});
    auth.mockResolvedValue({ user: { id: 'student1' } });
  });

  it('grades a drawn flowchart by running the pseudocode it becomes', async () => {
    getQuestionForGrade.mockResolvedValue(questionWith('EASY', { answerFormat: 'FLOWCHART' }));
    const response = await post({ flowchart: drawing('OUTPUT "Ada"') });
    expect(response.status).toBe(200);
    expect(grade).toHaveBeenCalledWith('OUTPUT "Ada"\n', [], 'Ada');
    const body = await response.json();
    expect(body.flowchartErrors).toEqual([]);
    expect(upsert.mock.calls[0][0].create.lastFlowchart).toMatchObject({ version: 1 });
  });

  it('fills only the blanks of a complete-the-flowchart template', async () => {
    getQuestionForGrade.mockResolvedValue(
      questionWith('EASY', { answerFormat: 'FLOWCHART', flowchart: drawing('', true) }),
    );
    // A locked box can't be rewritten: only `o` (the blank) is taken from the answers.
    const response = await post({ answers: { o: 'OUTPUT "Ada"', s: 'garbage' } });
    expect(response.status).toBe(200);
    expect(grade).toHaveBeenCalledWith('OUTPUT "Ada"\n', [], 'Ada');
  });

  it('fails every test with the drawing problem, without running anything', async () => {
    getQuestionForGrade.mockResolvedValue(questionWith('EASY', { answerFormat: 'FLOWCHART' }));
    const response = await post({ flowchart: drawing('"Ada"') });
    expect(response.status).toBe(200);
    expect(grade).not.toHaveBeenCalled();
    const body = await response.json();
    expect(body.passCount).toBe(0);
    expect(body.flowchartErrors[0]).toMatchObject({ nodeId: 'o', category: 'flowchart_io_keyword' });
    expect(body.results[0].error.category).toBe('flowchart_io_keyword');
  });

  it('rejects a flowchart question with no flowchart (400)', async () => {
    getQuestionForGrade.mockResolvedValue(questionWith('EASY', { answerFormat: 'FLOWCHART' }));
    const response = await post({ flowchart: { nodes: 'nope' } });
    expect(response.status).toBe(400);
    expect(grade).not.toHaveBeenCalled();
  });
});
