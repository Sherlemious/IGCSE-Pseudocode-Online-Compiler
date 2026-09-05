import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock('@/shared/db', () => ({ prisma: { question: { findUnique } } }));
import { GET } from './route';

describe('public question response', () => {
  beforeEach(() => { vi.resetAllMocks(); });

  it('returns public metadata and examples without solutions or hidden tests', async () => {
    const record = {
      id: 'q1', title: 'Read a file', description: 'Print each line', starterCode: 'DECLARE line : STRING',
      solution: 'MODEL ANSWER', solutionExplanation: 'PRIVATE EXPLANATION', futurePrivateField: 'SECRET',
      testCases: [
        { id: 'public', isHidden: false, inputs: ['Ada'], expectedOutput: 'Ada', description: 'Example', sortOrder: 0 },
        { id: 'hidden', isHidden: true, inputs: ['secret input'], expectedOutput: 'secret answer' },
      ],
    };
    // Honor the query's projection and filtering, as the database does.
    findUnique.mockImplementation(({ select, include }) => {
      const result: Record<string, unknown> = select
        ? Object.fromEntries(Object.keys(select).filter((key) => key in record).map((key) => [key, record[key as keyof typeof record]]))
        : { ...record };
      const relation = (select ?? include).testCases;
      result.testCases = record.testCases
        .filter((test) => test.isHidden === relation.where.isHidden)
        .map((test) => Object.fromEntries(Object.keys(relation.select).map((key) => [key, test[key as keyof typeof test]])));
      return result;
    });

    const response = await GET(new NextRequest('http://localhost/api/questions/q1'), { params: Promise.resolve({ id: 'q1' }) });
    expect(response.status).toBe(200);
    const { question } = await response.json();
    expect(question).toMatchObject({ id: 'q1', title: 'Read a file', starterCode: record.starterCode });
    expect(question.testCases).toEqual([{ id: 'public', inputs: ['Ada'], expectedOutput: 'Ada', description: 'Example', sortOrder: 0 }]);
    expect(question).not.toHaveProperty('solution');
    expect(question).not.toHaveProperty('solutionExplanation');
    expect(question).not.toHaveProperty('futurePrivateField');
  });

  it('returns 404 for a missing question', async () => {
    findUnique.mockResolvedValue(null);
    const response = await GET(new NextRequest('http://localhost/api/questions/missing'), { params: Promise.resolve({ id: 'missing' }) });
    expect(response.status).toBe(404);
  });
});
