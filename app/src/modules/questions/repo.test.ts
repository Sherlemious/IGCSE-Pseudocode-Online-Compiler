import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prisma } = vi.hoisted(() => ({
  prisma: {
    question: { findMany: vi.fn(), findFirst: vi.fn() },
  },
}));

vi.mock('@/shared/db', () => ({ prisma }));

import { findAttemptQuestionViews, findOwnedQuestionIds, loadOwnedTestCases } from './repo';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('owned question reads', () => {
  it('looks up only this teacher’s code questions', async () => {
    prisma.question.findMany.mockResolvedValue([{ id: 'mine' }]);
    await findOwnedQuestionIds('teacher', ['mine', 'other']);
    expect(prisma.question.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { ownerId: 'teacher', id: { in: ['mine', 'other'] }, answerFormat: 'CODE' },
    }));
  });

  it('loads owned test cases with a direct read, skipping catalog rows', async () => {
    prisma.question.findFirst.mockResolvedValue({ testCases: [] });
    await loadOwnedTestCases('q1');
    expect(prisma.question.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'q1', ownerId: { not: null } },
    }));
  });

  it('returns an attempt view only for the student, without solution or hidden tests', async () => {
    prisma.question.findMany.mockResolvedValue([{
      id: 'q1',
      title: 'Echo',
      description: 'Print the name.',
      difficulty: 'EASY',
      starterCode: null,
      answerFormat: 'CODE',
      flowchart: null,
      topic: null,
      solution: 'INPUT Name\nOUTPUT Name\n',
      testCases: [
        { id: 'show', inputs: ['Ada'], expectedOutput: 'Ada', description: null, sortOrder: 0, initialFiles: null, isHidden: false },
        { id: 'hide', inputs: ['Bo'], expectedOutput: 'Bo', description: 'secret', sortOrder: 1, initialFiles: null, isHidden: true },
      ],
    }]);
    const views = await findAttemptQuestionViews('student', ['q1']);
    expect(prisma.question.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        id: { in: ['q1'] },
        ownerId: { not: null },
        OR: [
          { ownerId: 'student' },
          { examAnswers: { some: { examAttempt: { userId: 'student' } } } },
        ],
      },
    }));
    expect(views).toHaveLength(1);
    expect(views[0].testCases.map((test) => test.id)).toEqual(['show']);
    const packed = JSON.stringify(views);
    expect(packed).not.toContain('INPUT Name');
    expect(packed).not.toContain('secret');
    expect(packed).not.toContain('Bo');
  });
});
