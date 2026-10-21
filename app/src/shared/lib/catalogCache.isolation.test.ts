import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany, findFirst } = vi.hoisted(() => ({
  findMany: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

vi.mock('@/shared/db', () => ({
  prisma: { question: { findMany, findFirst }, example: { findMany: vi.fn() } },
}));

import { getPublicQuestion, getQuestionCatalog, getQuestionSolution, getQuestionsApiPayload } from './catalogCache';

const catalogItem = {
  id: 'q1',
  title: 'Sum two numbers',
  difficulty: 'EASY' as const,
  year: null,
  session: null,
  variant: null,
  paper: null,
  questionNumber: null,
  part: null,
  marks: null,
  topic: 'Arithmetic',
  tags: [] as string[],
  isPremium: false,
  answerFormat: 'CODE' as const,
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('catalog reads', () => {
  beforeEach(() => {
    findMany.mockReset();
    findFirst.mockReset();
    findMany.mockImplementation(async (args: { select?: Record<string, unknown> }) => {
      if (args.select && 'description' in args.select) return [];
      return [catalogItem];
    });
    findFirst.mockResolvedValue(null);
  });

  it('filters every public question read to ownerId null', async () => {
    await getQuestionCatalog();
    await getQuestionsApiPayload({});
    await getPublicQuestion('q1');
    await getQuestionSolution('q1');

    expect(findMany).toHaveBeenCalled();
    for (const [args] of findMany.mock.calls) {
      expect(args.where).toEqual({ ownerId: null });
    }
    expect(findFirst).toHaveBeenCalled();
    for (const [args] of findFirst.mock.calls) {
      expect(args.where).toEqual({ id: 'q1', ownerId: null });
    }
  });
});
