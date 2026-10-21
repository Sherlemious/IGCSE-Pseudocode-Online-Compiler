import { describe, expect, it } from 'vitest';
import {
  allowedQuestionIds,
  canAuthorQuestions,
  canEditOwnedQuestion,
  canViewOwnedQuestion,
  ownedQuestionWriteData,
  toAttemptQuestion,
} from './access';
import type { QuestionDraft } from './parseInput';

const draft: QuestionDraft = {
  title: 'Sum',
  description: 'Add the inputs',
  difficulty: 'EASY',
  topic: 'Arithmetic',
  starterCode: 'INPUT A\n',
  solution: 'OUTPUT A\n',
  testCases: [
    { inputs: ['1'], expectedOutput: '1', isHidden: false },
    { inputs: ['2'], expectedOutput: '2', isHidden: true },
  ],
};

describe('question access', () => {
  it('lets a paid teacher or admin author questions, including during a trial tier', () => {
    expect(canAuthorQuestions({ role: 'TEACHER', tier: 'starter' })).toBe(true);
    expect(canAuthorQuestions({ role: 'TEACHER', tier: 'classroom' })).toBe(true);
    expect(canAuthorQuestions({ role: 'ADMIN', tier: 'school' })).toBe(true);
    expect(canAuthorQuestions({ role: 'TEACHER', tier: 'free' })).toBe(false);
    expect(canAuthorQuestions({ role: 'STUDENT', tier: 'starter' })).toBe(false);
    expect(canAuthorQuestions({ role: 'STUDENT', tier: 'free' })).toBe(false);
  });

  it('lets the owner edit only while they can still author', () => {
    expect(canEditOwnedQuestion({ viewerId: 't', ownerId: 't', role: 'TEACHER', tier: 'starter' })).toBe(true);
    expect(canEditOwnedQuestion({ viewerId: 't', ownerId: 't', role: 'TEACHER', tier: 'free' })).toBe(false);
    expect(canEditOwnedQuestion({ viewerId: 'other', ownerId: 't', role: 'TEACHER', tier: 'pro' })).toBe(false);
    expect(canEditOwnedQuestion({ viewerId: 't', ownerId: null, role: 'TEACHER', tier: 'starter' })).toBe(false);
  });

  it('shows an owned question to its owner, or to a student only via their attempt', () => {
    expect(canViewOwnedQuestion({ viewerId: 't', ownerId: 't', onViewerAttempt: false })).toBe(true);
    expect(canViewOwnedQuestion({ viewerId: 's', ownerId: 't', onViewerAttempt: true })).toBe(true);
    expect(canViewOwnedQuestion({ viewerId: 's', ownerId: 't', onViewerAttempt: false })).toBe(false);
    expect(canViewOwnedQuestion({ viewerId: 's', ownerId: null, onViewerAttempt: true })).toBe(false);
  });

  it('keeps catalog and owned ids in the requested order and drops the rest', () => {
    expect(allowedQuestionIds(['missing', 'own', 'cat', 'own'], ['cat'], ['own'])).toEqual(['own', 'cat', 'own']);
    expect(allowedQuestionIds(['drawn'], [], [])).toEqual([]);
  });

  it('strips hidden tests and never includes a solution in the attempt view', () => {
    const view = toAttemptQuestion({
      id: 'q',
      title: 'Sum',
      description: 'Add',
      difficulty: 'EASY',
      starterCode: null,
      testCases: [
        { id: 'a', inputs: ['1'], expectedOutput: 'visible', isHidden: false, description: 'sample' },
        { id: 'b', inputs: ['9'], expectedOutput: 'SECRET-OUTPUT', isHidden: true, description: 'secret case' },
      ],
    });
    expect(view.testCases).toEqual([
      { id: 'a', inputs: ['1'], expectedOutput: 'visible', description: 'sample' },
    ]);
    expect(view.starterCode).toBe('');
    expect(JSON.stringify(view)).not.toContain('SECRET');
    expect(view).not.toHaveProperty('solution');
  });

  it('writes a code-only, non-premium question owned outside the catalog fields', () => {
    const data = ownedQuestionWriteData(draft);
    expect(data.answerFormat).toBe('CODE');
    expect(data.isPremium).toBe(false);
    expect(data).not.toHaveProperty('flowchart');
    expect(data).not.toHaveProperty('ownerId');
    expect(data.testCases.create.map((test) => test.isHidden)).toEqual([false, true]);
    expect(data.testCases.create.map((test) => test.sortOrder)).toEqual([0, 1]);
  });
});
