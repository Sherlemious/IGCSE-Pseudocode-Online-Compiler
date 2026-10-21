import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';

const { db, repo, exams, catalog } = vi.hoisted(() => ({
  db: { $transaction: vi.fn() },
  repo: {
    findClassOwnership: vi.fn(),
    lockClass: vi.fn(),
    listAssignmentQuestionIds: vi.fn(),
    createAssignment: vi.fn(),
  },
  exams: { createExam: vi.fn(), findOwnedExam: vi.fn() },
  catalog: { existingCatalogQuestionIds: vi.fn(), getQuestionCatalog: vi.fn() },
}));

vi.mock('@/shared/db', () => ({ prisma: db }));
vi.mock('./repo', () => repo);
vi.mock('@/modules/exams/repo', () => exams);
vi.mock('@/shared/lib/catalogCache', () => catalog);
vi.mock('@/modules/billing/entitlements', () => ({
  getEntitlements: vi.fn(),
  getPremiumAccess: vi.fn(),
  isAtStudentCap: vi.fn(),
  limitsForUser: vi.fn(),
  revalidatePremiumAccess: vi.fn(),
}));
vi.mock('@/modules/billing/featureFlags', () => ({ PREMIUM_GATING_ENABLED: false }));
vi.mock('@/modules/auth/userRepo', () => ({ promoteToTeacher: vi.fn() }));

import { assignQuestions } from './service';

const owned = { ownerId: 'teacher', archived: false, joinCode: 'ABC234', _count: { memberships: 0 } };

beforeEach(() => {
  vi.clearAllMocks();
  db.$transaction.mockImplementation(async (fn: (tx: object) => Promise<unknown>) => fn({}));
  repo.findClassOwnership.mockResolvedValue(owned);
  repo.listAssignmentQuestionIds.mockResolvedValue([]);
  repo.createAssignment.mockResolvedValue({ id: 'asg-1' });
  exams.createExam.mockResolvedValue({ id: 'exam-1', shareCode: 'EXAM01' });
  catalog.getQuestionCatalog.mockResolvedValue([
    { id: 'q1', title: 'Add two numbers' },
    { id: 'q2', title: 'Count to ten' },
  ]);
  catalog.existingCatalogQuestionIds.mockImplementation(async (ids: string[]) =>
    ids.filter((id) => id === 'q1' || id === 'q2'),
  );
});

describe('assignQuestions', () => {
  it('rejects a class the caller does not own', async () => {
    repo.findClassOwnership.mockResolvedValue({ ...owned, ownerId: 'someone-else' });
    await expect(assignQuestions('class-1', 'teacher', ['q1'], null)).rejects.toMatchObject({ status: 404 });
    expect(exams.createExam).not.toHaveBeenCalled();
  });

  it('rejects a missing class the same way', async () => {
    repo.findClassOwnership.mockResolvedValue(null);
    await expect(assignQuestions('missing', 'teacher', ['q1'], null)).rejects.toMatchObject({ status: 404 });
  });

  it('rejects an empty question list', async () => {
    await expect(assignQuestions('class-1', 'teacher', [], null)).rejects.toMatchObject({
      status: 400,
      message: 'Add at least one question.',
    });
    expect(catalog.existingCatalogQuestionIds).not.toHaveBeenCalled();
  });

  it('rejects more questions than one assignment holds', async () => {
    const ids = Array.from({ length: 21 }, (_, i) => `q${i}`);
    await expect(assignQuestions('class-1', 'teacher', ids, null)).rejects.toMatchObject({
      status: 400,
      message: 'Assign at most 20 questions at a time.',
    });
    expect(catalog.existingCatalogQuestionIds).not.toHaveBeenCalled();
  });

  it('locks the class before checking for a duplicate assignment', async () => {
    await assignQuestions('class-1', 'teacher', ['q1'], null);
    expect(repo.lockClass).toHaveBeenCalledWith('class-1', {});
    expect(repo.lockClass.mock.invocationCallOrder[0]).toBeLessThan(
      repo.listAssignmentQuestionIds.mock.invocationCallOrder[0],
    );
  });

  it('rejects ids the catalog does not accept', async () => {
    catalog.existingCatalogQuestionIds.mockResolvedValue([]);
    await expect(assignQuestions('class-1', 'teacher', ['missing'], null)).rejects.toMatchObject({
      status: 400,
      message: 'None of the selected questions could be found.',
    });
    expect(exams.createExam).not.toHaveBeenCalled();
  });

  it('drops unknown ids and creates a published exam for the rest', async () => {
    const due = new Date('2026-11-01T00:00:00Z');
    const result = await assignQuestions('class-1', 'teacher', ['nope', 'q1', 'q1'], due, '  Week 1  ');
    expect(catalog.existingCatalogQuestionIds).toHaveBeenCalledWith(['nope', 'q1']);
    expect(exams.createExam).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: 'teacher',
        title: 'Week 1',
        questionIds: ['q1'],
        timeLimitMin: 30,
        isPublished: true,
        description: null,
      }),
      expect.anything(),
    );
    expect(repo.createAssignment).toHaveBeenCalledWith(
      { classId: 'class-1', examId: 'exam-1', dueDate: due },
      expect.anything(),
    );
    expect(result).toMatchObject({
      assignmentId: 'asg-1',
      examId: 'exam-1',
      classId: 'class-1',
      joinCode: 'ABC234',
      title: 'Week 1',
      questionCount: 1,
    });
  });

  it('titles a single question from the bank and a set by its size', async () => {
    await assignQuestions('class-1', 'teacher', ['q1'], null);
    expect(exams.createExam).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Add two numbers', timeLimitMin: 30 }),
      expect.anything(),
    );

    await assignQuestions('class-1', 'teacher', ['q1', 'q2'], null);
    expect(exams.createExam).toHaveBeenLastCalledWith(
      expect.objectContaining({ title: '2 questions', questionIds: ['q1', 'q2'], timeLimitMin: 60 }),
      expect.anything(),
    );
  });

  it('refuses questions already assigned to the class, in any order', async () => {
    repo.listAssignmentQuestionIds.mockResolvedValue([
      { exam: { questions: [{ questionId: 'q2' }, { questionId: 'q1' }] } },
    ]);
    await expect(assignQuestions('class-1', 'teacher', ['q1', 'q2'], null)).rejects.toMatchObject({
      status: 409,
      code: 'ALREADY_ASSIGNED',
    });
    expect(exams.createExam).not.toHaveBeenCalled();
  });

  it('retries when the generated share code is taken', async () => {
    const collision = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: 'test',
      meta: { target: ['shareCode'] },
    });
    exams.createExam.mockRejectedValueOnce(collision).mockResolvedValueOnce({ id: 'exam-2', shareCode: 'EXAM02' });
    const result = await assignQuestions('class-1', 'teacher', ['q1'], null);
    expect(exams.createExam).toHaveBeenCalledTimes(2);
    expect(result.examId).toBe('exam-2');
  });
});
