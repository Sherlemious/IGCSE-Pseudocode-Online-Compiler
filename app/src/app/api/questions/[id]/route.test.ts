import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { getPublicQuestion } = vi.hoisted(() => ({ getPublicQuestion: vi.fn() }));
vi.mock('@/shared/lib/catalogCache', () => ({
  getPublicQuestion,
  CATALOG_CACHE_CONTROL: 'public, s-maxage=3600, stale-while-revalidate=86400',
}));
import { GET } from './route';

describe('public question response', () => {
  beforeEach(() => { vi.resetAllMocks(); });

  it('returns public metadata and examples without solutions or hidden tests', async () => {
    getPublicQuestion.mockResolvedValue({
      id: 'q1',
      title: 'Read a file',
      description: 'Print each line',
      starterCode: 'DECLARE line : STRING',
      difficulty: 'EASY',
      year: 2024,
      session: null,
      variant: null,
      paper: null,
      questionNumber: null,
      part: null,
      marks: null,
      topic: 'Files',
      tags: [],
      isPremium: false,
      hints: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      testCases: [
        { id: 'public', inputs: ['Ada'], expectedOutput: 'Ada', description: 'Example', sortOrder: 0, initialFiles: null },
      ],
    });

    const response = await GET(new NextRequest('http://localhost/api/questions/q1'), { params: Promise.resolve({ id: 'q1' }) });
    expect(response.status).toBe(200);
    const { question } = await response.json();
    expect(question).toMatchObject({ id: 'q1', title: 'Read a file', starterCode: 'DECLARE line : STRING' });
    expect(question.testCases).toEqual([
      { id: 'public', inputs: ['Ada'], expectedOutput: 'Ada', description: 'Example', sortOrder: 0, initialFiles: null },
    ]);
    expect(question).not.toHaveProperty('solution');
    expect(question).not.toHaveProperty('solutionExplanation');
    expect(question).not.toHaveProperty('futurePrivateField');
  });

  it('returns 404 for a missing question', async () => {
    getPublicQuestion.mockResolvedValue(null);
    const response = await GET(new NextRequest('http://localhost/api/questions/missing'), { params: Promise.resolve({ id: 'missing' }) });
    expect(response.status).toBe(404);
  });
});
