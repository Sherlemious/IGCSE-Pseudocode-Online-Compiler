import { describe, expect, it } from 'vitest';
import {
  firstSolveShareText,
  formatSolveCount,
  toPublicSocialStat,
} from './socialStats';

describe('formatSolveCount', () => {
  it('keeps small counts as integers', () => {
    expect(formatSolveCount(5)).toBe('5');
    expect(formatSolveCount(847)).toBe('847');
  });

  it('abbreviates thousands', () => {
    expect(formatSolveCount(1000)).toBe('1k');
    expect(formatSolveCount(1200)).toBe('1.2k');
    expect(formatSolveCount(12_400)).toBe('12k');
  });
});

describe('toPublicSocialStat', () => {
  it('hides questions below the solve floor', () => {
    expect(toPublicSocialStat({ questionId: 'q', attempted: 8, solved: 4, firstTry: 2 })).toBeNull();
  });

  it('omits first-try % until the sample is large enough', () => {
    expect(toPublicSocialStat({ questionId: 'q', attempted: 9, solved: 8, firstTry: 6 })).toEqual({
      solved: 8,
      attempted: 9,
      firstTryRate: null,
    });
  });

  it('rounds first-try % once there are enough solves', () => {
    expect(toPublicSocialStat({ questionId: 'q', attempted: 20, solved: 10, firstTry: 6 })).toEqual({
      solved: 10,
      attempted: 20,
      firstTryRate: 60,
    });
  });
});

describe('firstSolveShareText', () => {
  it('prefers the paper ref and includes the crowd size', () => {
    expect(
      firstSolveShareText({
        paperRef: '2024 May/June Q3',
        title: 'Linear search',
        solved: 847,
        url: 'https://example.com/practice/q',
      }),
    ).toBe(
      'I just solved 2024 May/June Q3 on the IGCSE Pseudocode Compiler — 847 students have done it. Can you?\nhttps://example.com/practice/q',
    );
  });

  it('falls back to the title when there is no paper ref or crowd', () => {
    expect(
      firstSolveShareText({
        paperRef: null,
        title: 'Linear search',
        solved: null,
        url: 'https://example.com/practice/q',
      }),
    ).toBe(
      'I just solved Linear search on the IGCSE Pseudocode Compiler. Can you?\nhttps://example.com/practice/q',
    );
  });
});
