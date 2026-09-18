import { describe, expect, it } from 'vitest';
import {
  existingQuestionIds,
  filterExamPool,
  listQuestionTopics,
  listQuestionsApiPayload,
  toGradeQuestion,
  toPublicQuestion,
  type BankQuestion,
} from './catalogCache';

function question(overrides: Partial<BankQuestion> = {}): BankQuestion {
  return {
    id: 'q1',
    title: 'Arrays',
    description: 'Count items',
    difficulty: 'EASY',
    year: 2024,
    session: 'May/June',
    variant: 1,
    paper: null,
    questionNumber: 3,
    part: 'a',
    marks: 4,
    topic: 'Arrays',
    tags: ['IGCSE'],
    isPremium: false,
    starterCode: 'DECLARE n : INTEGER',
    hints: ['Use a loop'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    testCases: [
      {
        id: 't1',
        inputs: ['1'],
        expectedOutput: '1',
        isHidden: false,
        description: 'sample',
        sortOrder: 0,
        initialFiles: null,
      },
      {
        id: 't2',
        inputs: ['2'],
        expectedOutput: '2',
        isHidden: true,
        description: 'secret',
        sortOrder: 1,
        initialFiles: null,
      },
    ],
    ...overrides,
  };
}

describe('catalogCache mappers', () => {
  it('strips hidden tests from the public question payload', () => {
    const publicQuestion = toPublicQuestion(question());
    expect(publicQuestion.testCases).toEqual([
      {
        id: 't1',
        inputs: ['1'],
        expectedOutput: '1',
        description: 'sample',
        sortOrder: 0,
        initialFiles: null,
      },
    ]);
  });

  it('keeps hidden tests for grading', () => {
    const grade = toGradeQuestion(question());
    expect(grade.testCases.map((test) => test.isHidden)).toEqual([false, true]);
    expect(grade).toMatchObject({ id: 'q1', difficulty: 'EASY', isPremium: false });
  });

  it('filters the exam pool by premium, topic and difficulty', () => {
    const catalog = [
      question({ id: 'free', topic: 'Arrays', difficulty: 'EASY', isPremium: false }),
      question({ id: 'paid', topic: 'Arrays', difficulty: 'HARD', isPremium: true }),
      question({ id: 'other', topic: 'Files', difficulty: 'EASY', isPremium: false }),
    ].map((row) => ({
      id: row.id,
      title: row.title,
      difficulty: row.difficulty,
      year: row.year,
      session: row.session,
      variant: row.variant,
      paper: row.paper,
      questionNumber: row.questionNumber,
      part: row.part,
      marks: row.marks,
      topic: row.topic,
      tags: row.tags,
      isPremium: row.isPremium,
      updatedAt: row.updatedAt,
    }));

    expect(filterExamPool(catalog, { includePremium: false }).map((row) => row.id)).toEqual([
      'free',
      'other',
    ]);
    expect(
      filterExamPool(catalog, { includePremium: true, topic: 'Arrays', difficulty: 'HARD' }).map(
        (row) => row.id,
      ),
    ).toEqual(['paid']);
  });

  it('lists distinct topics and preserves requested id order', () => {
    const catalog = [
      question({ id: 'a', topic: 'Files' }),
      question({ id: 'b', topic: 'Arrays', isPremium: true }),
    ].map((row) => ({
      id: row.id,
      title: row.title,
      difficulty: row.difficulty,
      year: row.year,
      session: row.session,
      variant: row.variant,
      paper: row.paper,
      questionNumber: row.questionNumber,
      part: row.part,
      marks: row.marks,
      topic: row.topic,
      tags: row.tags,
      isPremium: row.isPremium,
      updatedAt: row.updatedAt,
    }));

    expect(listQuestionTopics(catalog, false)).toEqual(['Files']);
    expect(listQuestionTopics(catalog, true)).toEqual(['Arrays', 'Files']);
    expect(existingQuestionIds(catalog, ['missing', 'b', 'a', 'b'])).toEqual(['b', 'a', 'b']);
  });

  it('builds the public questions API payload with visible-test counts', () => {
    const payload = listQuestionsApiPayload(
      [
        question({ id: 'hard', title: 'Zed', difficulty: 'HARD' }),
        question({ id: 'easy', title: 'Ada', difficulty: 'EASY' }),
      ],
      {},
    );
    expect(payload.map((row) => row.id)).toEqual(['easy', 'hard']);
    expect(payload[0]._count.testCases).toBe(1);
  });
});
