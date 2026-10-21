import { describe, expect, it } from 'vitest';
import { assignmentTimeLimitMin, assignmentTitle, sameQuestionSet } from './assignPlan';

describe('assignmentTimeLimitMin', () => {
  it('allows 30 minutes per question and caps at 120', () => {
    expect(assignmentTimeLimitMin(1)).toBe(30);
    expect(assignmentTimeLimitMin(3)).toBe(90);
    expect(assignmentTimeLimitMin(4)).toBe(120);
    expect(assignmentTimeLimitMin(8)).toBe(120);
  });
});

describe('assignmentTitle', () => {
  it('uses the question title for a single question', () => {
    expect(assignmentTitle({ questionCount: 1, questionTitles: ['  Sum of two numbers  '] })).toBe('Sum of two numbers');
  });

  it('names a set by how many questions it has', () => {
    expect(assignmentTitle({ questionCount: 3, questionTitles: ['A', 'B', 'C'] })).toBe('3 questions');
  });

  it('prefers a requested title and caps it at 200 characters', () => {
    expect(assignmentTitle({ questionCount: 2, questionTitles: ['A', 'B'], requested: '  Homework  ' })).toBe('Homework');
    const long = 'Q'.repeat(250);
    expect(assignmentTitle({ questionCount: 1, questionTitles: ['Short'], requested: long })).toHaveLength(200);
  });

  it('falls back to the count when the single title is blank', () => {
    expect(assignmentTitle({ questionCount: 1, questionTitles: ['  '] })).toBe('1 question');
  });
});

describe('sameQuestionSet', () => {
  it('matches the same ids in a different order', () => {
    expect(sameQuestionSet(['a', 'b'], ['b', 'a'])).toBe(true);
  });

  it('rejects a different set or a repeated id', () => {
    expect(sameQuestionSet(['a', 'b'], ['a', 'c'])).toBe(false);
    expect(sameQuestionSet(['a', 'a'], ['a', 'b'])).toBe(false);
  });
});
