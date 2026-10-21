import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prisma, getEntitlements, captureServerEvent } = vi.hoisted(() => ({
  prisma: {
    question: { create: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), update: vi.fn(), delete: vi.fn() },
    testCase: { deleteMany: vi.fn() },
    examQuestion: { count: vi.fn() },
    examAnswer: { count: vi.fn() },
    $transaction: vi.fn(),
  },
  getEntitlements: vi.fn(),
  captureServerEvent: vi.fn(),
}));

vi.mock('@/shared/db', () => ({ prisma }));
vi.mock('@/modules/billing/entitlements', () => ({ getEntitlements }));
vi.mock('@/modules/telemetry/serverCapture', () => ({ captureServerEvent }));

import { checkSolution, createOwnedQuestion, deleteOwnedQuestion, updateOwnedQuestion } from './service';

const paid = { tier: 'starter' as const, limits: {} };
const draft = {
  title: 'Echo',
  description: 'Read a name and print it back.',
  difficulty: 'EASY',
  topic: 'Input',
  starterCode: '',
  solution: 'INPUT Name\nOUTPUT Name\n',
  testCases: [
    { inputs: ['Ada'], expectedOutput: 'Ada', isHidden: false },
    { inputs: ['Bo'], expectedOutput: 'Bo', isHidden: true },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  getEntitlements.mockResolvedValue(paid);
  captureServerEvent.mockResolvedValue(undefined);
  prisma.question.create.mockResolvedValue({ id: 'q-new' });
  prisma.question.findFirst.mockResolvedValue({ id: 'q-new' });
  prisma.$transaction.mockImplementation(async (work: (tx: typeof prisma) => Promise<unknown>) => work(prisma));
  prisma.testCase.deleteMany.mockResolvedValue({ count: 0 });
  prisma.question.update.mockResolvedValue({ id: 'q-new' });
  prisma.examQuestion.count.mockResolvedValue(0);
  prisma.examAnswer.count.mockResolvedValue(0);
  prisma.question.delete.mockResolvedValue({ id: 'q-new' });
});

describe('solution must pass the autograder', () => {
  it('saves when the solution passes, including a hidden test', async () => {
    const created = await createOwnedQuestion('teacher', draft);
    expect(created).toEqual({ id: 'q-new' });
    expect(prisma.question.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        ownerId: 'teacher',
        answerFormat: 'CODE',
        isPremium: false,
        title: 'Echo',
      }),
    }));
    expect(captureServerEvent).toHaveBeenCalledWith('teacher', 'custom_question_created', {
      test_count: 2,
      hidden_count: 1,
      difficulty: 'EASY',
    });
    const eventText = JSON.stringify(captureServerEvent.mock.calls);
    expect(eventText).not.toContain('INPUT');
    expect(eventText).not.toContain('Echo');
    expect(eventText).not.toContain('Ada');
  });

  it('returns each failing test and does not save', async () => {
    await expect(createOwnedQuestion('teacher', { ...draft, solution: 'OUTPUT "no"\n' })).rejects.toMatchObject({
      status: 400,
      code: 'SOLUTION_FAILED',
    });
    expect(prisma.question.create).not.toHaveBeenCalled();
    expect(captureServerEvent).toHaveBeenCalledWith('teacher', 'custom_question_solution_failed', { failed_count: 2 });
    const eventText = JSON.stringify(captureServerEvent.mock.calls);
    expect(eventText).not.toContain('OUTPUT');
    expect(eventText).not.toContain('Echo');
  });

  it('checks a solution without writing a row', async () => {
    await expect(checkSolution('teacher', draft)).resolves.toEqual({ ok: true, test_count: 2 });
    expect(prisma.question.create).not.toHaveBeenCalled();
    expect(captureServerEvent).not.toHaveBeenCalled();
  });

  it('refuses a free or lapsed teacher before running the solution', async () => {
    getEntitlements.mockResolvedValue({ tier: 'free', limits: {} });
    await expect(createOwnedQuestion('teacher', { ...draft, solution: 'OUTPUT "no"\n' })).rejects.toMatchObject({
      status: 403,
      code: 'PLAN_REQUIRED',
    });
    expect(prisma.question.create).not.toHaveBeenCalled();
    expect(captureServerEvent).not.toHaveBeenCalled();
  });

  it('updates an owned question when the new solution passes', async () => {
    await expect(updateOwnedQuestion('teacher', 'q-new', draft)).resolves.toEqual({ id: 'q-new' });
    expect(prisma.testCase.deleteMany).toHaveBeenCalledWith({ where: { questionId: 'q-new' } });
    expect(captureServerEvent).toHaveBeenCalledWith('teacher', 'custom_question_updated', {
      test_count: 2,
      hidden_count: 1,
      difficulty: 'EASY',
    });
  });

  it('does not delete a question that is already on an exam', async () => {
    prisma.examAnswer.count.mockResolvedValue(1);
    await expect(deleteOwnedQuestion('teacher', 'q-new')).rejects.toMatchObject({ status: 409 });
    expect(prisma.question.delete).not.toHaveBeenCalled();
  });
});
