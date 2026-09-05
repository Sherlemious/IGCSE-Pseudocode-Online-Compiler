import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExamAnswer, ExamAttempt, TestCase } from '@prisma/client';
import type { GradeResult } from '@/modules/practice/autograder';

const { db, grade, auth } = vi.hoisted(() => ({
  db: {
    $transaction: vi.fn(), $queryRaw: vi.fn(),
    examAttempt: { findUniqueOrThrow: vi.fn(), update: vi.fn() },
    examAnswer: { findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    testCase: { findMany: vi.fn() },
  },
  grade: vi.fn(), auth: vi.fn(),
}));
vi.mock('@/shared/db', () => ({ prisma: db }));
vi.mock('@/modules/practice/autograder', () => ({ gradeSubmission: grade }));
vi.mock('@/modules/auth/auth', () => ({ auth }));

import { gradeExamAnswer, saveExamAnswer, submitExamAttempt } from './attempts';
import { POST as saveRoute } from '@/app/api/exam/[examId]/save/route';
import { POST as gradeRoute } from '@/app/api/exam/[examId]/grade/route';
import { POST as submitRoute } from '@/app/api/exam/[examId]/submit/route';

const now = new Date('2026-09-05T10:00:00Z');
const submission = { questionId: 'q1', code: 'OUTPUT "Ada"\n' };
const passed: GradeResult = { passed: true, actualOutput: 'Ada', executionMs: 1 };
let exam: ExamAttempt;
let answer: ExamAnswer;
let testCases: TestCase[];

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

function delayGrade() {
  const started = deferred<void>();
  const finished = deferred<GradeResult>();
  grade.mockImplementationOnce(() => { started.resolve(); return finished.promise; });
  return { started: started.promise, finish: finished.resolve };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(now);
  exam = {
    id: 'exam1', userId: 'student1', examId: null, assignmentId: null, topic: null, difficulty: null,
    questionCount: 1, timeLimitMin: 1, status: 'IN_PROGRESS', score: null, totalTests: null,
    startedAt: now, completedAt: null, createdAt: now, updatedAt: now,
  };
  answer = {
    id: 'answer1', examAttemptId: exam.id, questionId: 'q1', code: submission.code,
    graded: true, passCount: 1, totalTests: 1, sortOrder: 0, createdAt: now, updatedAt: now,
  };
  testCases = [{ id: 'test1', questionId: 'q1', inputs: [], expectedOutput: 'Ada', isHidden: false, description: null, sortOrder: 0, initialFiles: null }];
  auth.mockResolvedValue({ user: { id: 'student1' } });
  grade.mockResolvedValue(passed);

  // Model transaction serialization and rollback without using application data.
  let tail = Promise.resolve();
  db.$transaction.mockImplementation(async (work: (tx: typeof db) => Promise<unknown>) => {
    const previous = tail;
    const release = deferred<void>();
    tail = release.promise;
    await previous;
    const original = structuredClone({ exam, answer });
    try { return await work(db); }
    catch (error) { exam = original.exam; answer = original.answer; throw error; }
    finally { release.resolve(); }
  });
  db.$queryRaw.mockImplementation(async (_query: TemplateStringsArray, id: string, userId: string) =>
    exam.id === id && exam.userId === userId ? [{ id }] : []);
  db.examAttempt.findUniqueOrThrow.mockImplementation(async () => structuredClone(exam));
  db.examAttempt.update.mockImplementation(async ({ data }: { data: Partial<ExamAttempt> }) => {
    exam = { ...exam, ...data }; return structuredClone(exam);
  });
  db.examAnswer.findUnique.mockImplementation(async ({ where }) =>
    where.examAttemptId_questionId.examAttemptId === answer.examAttemptId &&
    where.examAttemptId_questionId.questionId === answer.questionId ? structuredClone(answer) : null);
  db.examAnswer.findMany.mockImplementation(async () => [structuredClone(answer)]);
  db.examAnswer.update.mockImplementation(async ({ data }: { data: Partial<ExamAnswer> }) => {
    answer = { ...answer, ...data }; return structuredClone(answer);
  });
  db.testCase.findMany.mockImplementation(async () => structuredClone(testCases));
});

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('exam answer integrity', () => {
  it('invalidates a changed answer, including an empty answer', async () => {
    await saveExamAnswer(exam.id, exam.userId, { ...submission, code: '' });
    expect(answer).toMatchObject({ code: '', graded: false, passCount: 0, totalTests: 0 });
    expect(answer.updatedAt.getTime()).toBeGreaterThan(now.getTime());
  });

  it('preserves a grade when autosaving identical code', async () => {
    await saveExamAnswer(exam.id, exam.userId, submission);
    expect(answer).toMatchObject({ graded: true, passCount: 1, totalTests: 1, updatedAt: now });
    expect(db.examAnswer.update).not.toHaveBeenCalled();
  });

  it.each([saveExamAnswer, gradeExamAnswer])('rejects writes at the exact deadline', async (write) => {
    vi.setSystemTime(now.getTime() + 60_000);
    await expect(write(exam.id, exam.userId, submission)).rejects.toMatchObject({ status: 409, code: 'EXAM_EXPIRED' });
    expect(db.examAnswer.update).not.toHaveBeenCalled();
    expect(grade).not.toHaveBeenCalled();
  });

  it.each([saveExamAnswer, gradeExamAnswer])('rejects another student and nonmember questions', async (write) => {
    await expect(write(exam.id, 'other-user', submission)).rejects.toMatchObject({ status: 404 });
    await expect(write(exam.id, exam.userId, { ...submission, questionId: 'not-in-exam' })).rejects.toMatchObject({ code: 'QUESTION_NOT_IN_EXAM' });
    expect(db.testCase.findMany).not.toHaveBeenCalled();
    expect(db.examAnswer.update).not.toHaveBeenCalled();
  });

  it('does not replace a newer saved answer when an old check arrives', async () => {
    await saveExamAnswer(exam.id, exam.userId, { ...submission, code: 'new code' });
    await expect(gradeExamAnswer(exam.id, exam.userId, submission)).rejects.toMatchObject({ code: 'ANSWER_CHANGED' });
    expect(answer.code).toBe('new code');
    expect(grade).not.toHaveBeenCalled();
  });

  it('grades the saved answer and preserves hidden-test response filtering', async () => {
    testCases[0].isHidden = true;
    testCases[0].description = 'private description';
    const result = await gradeExamAnswer(exam.id, exam.userId, submission);
    expect(result).toMatchObject({ passCount: 1, totalTests: 1, results: [{ passed: true, isHidden: true, description: undefined }] });
    expect(answer).toMatchObject({ code: submission.code, graded: true, passCount: 1 });
    expect(db.$queryRaw.mock.calls[0][0].join('?')).toContain('FOR UPDATE');
    expect(db.$queryRaw.mock.calls[0].slice(1)).toEqual([exam.id, exam.userId]);
  });

  it.each([false, true])('rejects stale results after edits, including changing back: %s', async (changeBack) => {
    const delayed = delayGrade();
    const checking = gradeExamAnswer(exam.id, exam.userId, submission);
    await delayed.started;
    await saveExamAnswer(exam.id, exam.userId, { ...submission, code: 'new code' });
    if (changeBack) await saveExamAnswer(exam.id, exam.userId, submission);
    delayed.finish(passed);
    await expect(checking).rejects.toMatchObject({ code: 'ANSWER_CHANGED' });
    expect(answer).toMatchObject({ code: changeBack ? submission.code : 'new code', graded: false, passCount: 0 });
  });

  it('keeps a newer check when an older check finishes last, even within one millisecond', async () => {
    const delayed = delayGrade();
    const older = gradeExamAnswer(exam.id, exam.userId, submission);
    await delayed.started;
    grade.mockResolvedValue({ ...passed, passed: false });
    await gradeExamAnswer(exam.id, exam.userId, submission);
    delayed.finish(passed);
    await expect(older).rejects.toMatchObject({ code: 'ANSWER_CHANGED' });
    expect(answer).toMatchObject({ graded: true, passCount: 0 });
  });

  it('rechecks the deadline after grading finishes', async () => {
    const delayed = delayGrade();
    const checking = gradeExamAnswer(exam.id, exam.userId, submission);
    await delayed.started;
    vi.setSystemTime(now.getTime() + 60_000);
    delayed.finish(passed);
    await expect(checking).rejects.toMatchObject({ code: 'EXAM_EXPIRED' });
    expect(answer.graded).toBe(false);
  });

  it('freezes submission results against an in-flight check and later saves', async () => {
    const delayed = delayGrade();
    const checking = gradeExamAnswer(exam.id, exam.userId, submission);
    await delayed.started;
    const result = await submitExamAttempt(exam.id, exam.userId);
    expect(result).toEqual({ score: 0, totalTests: 1, timedOut: false });
    delayed.finish(passed);
    await expect(checking).rejects.toMatchObject({ code: 'EXAM_COMPLETED' });
    await expect(saveExamAnswer(exam.id, exam.userId, { ...submission, code: 'late' })).rejects.toMatchObject({ code: 'EXAM_COMPLETED' });
    expect(await submitExamAttempt(exam.id, exam.userId)).toEqual(result);
    expect(db.examAttempt.update).toHaveBeenCalledTimes(1);
    expect(exam.score).toBe(0);
  });

  it('does not count invalidated grades at submission', async () => {
    answer.graded = false; // Old counters alone must never earn a score.
    expect(await submitExamAttempt(exam.id, exam.userId)).toMatchObject({ score: 0 });
  });
});

describe('exam HTTP boundary', () => {
  const context = { params: Promise.resolve({ examId: 'exam1' }) };
  const request = (body: unknown) => new Request('http://localhost/api/exam/exam1', { method: 'POST', body: JSON.stringify(body) });

  it.each([saveRoute, gradeRoute, submitRoute])('requires authentication', async (route) => {
    auth.mockResolvedValue(null);
    expect((await route(request(submission), context)).status).toBe(401);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it.each([null, [], {}, { questionId: 'q1', code: 42 }, { questionId: '', code: '' }])('rejects invalid answer payloads: %j', async (body) => {
    expect((await saveRoute(request(body), context)).status).toBe(400);
    expect((await gradeRoute(request(body), context)).status).toBe(400);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it('reports an expired save as a structured conflict', async () => {
    vi.setSystemTime(now.getTime() + 60_000);
    const response = await saveRoute(request(submission), context);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: 'EXAM_EXPIRED' });
  });

  it.each([false, true])('uses the server deadline instead of a forged timedOut flag: expired=%s', async (expired) => {
    vi.setSystemTime(now.getTime() + (expired ? 60_000 : 59_999));
    const response = await submitRoute(request({ timedOut: !expired }), context);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ score: 1, timedOut: expired });
    expect(exam.status).toBe(expired ? 'TIMED_OUT' : 'COMPLETED');
  });
});
