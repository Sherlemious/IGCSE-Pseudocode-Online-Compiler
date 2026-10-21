import { describe, expect, it } from 'vitest';
import type { Plan } from '@prisma/client';
import { tierForUser } from '@/modules/billing/entitlements';
import { TIER_COPY } from '@/modules/billing/tierCopy';
import {
  acceptedExamQuestionIds,
  canGradeOwnedQuestion,
  canViewOwnedQuestion,
  forStudentView,
  mayWriteQuestions,
  ownedQuestionAccess,
  type OwnedQuestionRecord,
} from './access';

const owned: OwnedQuestionRecord = {
  id: 'q1',
  title: 'Double',
  description: 'Double the input.',
  difficulty: 'EASY',
  starterCode: 'INPUT n\n',
  answerFormat: 'CODE',
  flowchart: null,
  topic: 'Arithmetic',
  solution: 'INPUT n\nOUTPUT n * 2\n',
  solutionExplanation: 'Multiply by two.',
  hints: ['Use *'],
  testCases: [
    {
      id: 'visible',
      inputs: ['2'],
      expectedOutput: '4',
      description: 'sample',
      sortOrder: 0,
      initialFiles: null,
      isHidden: false,
    },
    {
      id: 'secret',
      inputs: ['9'],
      expectedOutput: '18',
      description: 'hidden case',
      sortOrder: 1,
      initialFiles: null,
      isHidden: true,
    },
  ],
};

describe('owned question access', () => {
  it('lets the owner view and grade', () => {
    const access = ownedQuestionAccess({ userId: 'teacher', ownerId: 'teacher', attemptContains: false });
    expect(access).toBe('owner');
    expect(canViewOwnedQuestion(access)).toBe(true);
    expect(canGradeOwnedQuestion(access)).toBe(true);
  });

  it('lets a student through only when an attempt contains the question', () => {
    const blocked = ownedQuestionAccess({ userId: 'student', ownerId: 'teacher', attemptContains: false });
    const allowed = ownedQuestionAccess({ userId: 'student', ownerId: 'teacher', attemptContains: true });
    expect(blocked).toBe('none');
    expect(canViewOwnedQuestion(blocked)).toBe(false);
    expect(canGradeOwnedQuestion(blocked)).toBe(false);
    expect(allowed).toBe('attempt');
    expect(canGradeOwnedQuestion(allowed)).toBe(true);
  });

  it('hides the question from other teachers and signed-out visitors', () => {
    expect(ownedQuestionAccess({ userId: 'other', ownerId: 'teacher', attemptContains: false })).toBe('none');
    expect(ownedQuestionAccess({ userId: null, ownerId: 'teacher', attemptContains: true })).toBe('none');
  });

  it('never sends the solution or hidden tests to a student', () => {
    const view = forStudentView(owned);
    expect(view.testCases.map((test) => test.id)).toEqual(['visible']);
    expect(view.testCases[0]).not.toHaveProperty('isHidden');
    const packed = JSON.stringify(view);
    expect(packed).toContain('INPUT n\\n');
    expect(packed).not.toContain('OUTPUT n * 2');
    expect(packed).not.toContain('hidden case');
    expect(packed).not.toContain('Multiply');
    expect(packed).not.toContain('18');
  });
});

describe('writing paywall', () => {
  const holder = {
    plan: 'STARTER' as Plan,
    planTier: 'starter',
    trialEndsAt: null,
    planExpiresAt: null,
    legacyCapacity: false,
  };

  it('allows an active teacher tier and blocks free', () => {
    expect(mayWriteQuestions('starter')).toBe(true);
    expect(mayWriteQuestions('classroom')).toBe(true);
    expect(mayWriteQuestions('free')).toBe(false);
    expect(mayWriteQuestions(tierForUser({ ...holder, plan: 'FREE' }))).toBe(false);
  });

  it('blocks a lapsed plan but the owner can still use the question', () => {
    const tier = tierForUser({ ...holder, planExpiresAt: new Date('2020-01-01') });
    expect(tier).toBe('free');
    expect(mayWriteQuestions(tier)).toBe(false);
    expect(ownedQuestionAccess({ userId: 'teacher', ownerId: 'teacher', attemptContains: false })).toBe('owner');
  });
});

describe('exam question ids', () => {
  it('keeps catalog ids and the owner’s ids, in request order', () => {
    expect(acceptedExamQuestionIds(
      ['owned', 'missing', 'catalog', 'owned'],
      ['catalog'],
      ['owned'],
    )).toEqual(['owned', 'catalog', 'owned']);
  });
});

describe('starter plan copy', () => {
  it('lists writing autograded questions', () => {
    expect(TIER_COPY.starter.features).toContain('Write your own autograded questions');
  });
});
