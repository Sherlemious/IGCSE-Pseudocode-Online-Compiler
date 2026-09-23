import { describe, expect, it } from 'vitest';
import { computeStreak, dayKey } from './practiceStreak';
import { recommendNextQuestion } from './practiceNext';
import type { PracticeListQuestion } from './filterUtils';

const d = (s: string) => {
  const [y, m, day] = s.split('-').map(Number);
  return new Date(y, m - 1, day, 12);
};

describe('computeStreak', () => {
  it('counts consecutive days ending today', () => {
    expect(computeStreak(['2026-09-21', '2026-09-22', '2026-09-23'], d('2026-09-23'))).toEqual({
      streak: 3,
      solvedToday: true,
    });
  });

  it('keeps a streak alive through the day after the last solve', () => {
    expect(computeStreak(['2026-09-21', '2026-09-22'], d('2026-09-23'))).toEqual({
      streak: 2,
      solvedToday: false,
    });
  });

  it('breaks after a missed day', () => {
    expect(computeStreak(['2026-09-20', '2026-09-21'], d('2026-09-23')).streak).toBe(0);
  });

  it('crosses month boundaries', () => {
    expect(computeStreak(['2026-08-31', '2026-09-01'], d('2026-09-01')).streak).toBe(2);
  });

  it('formats local day keys', () => {
    expect(dayKey(d('2026-01-05'))).toBe('2026-01-05');
  });
});

const q = (over: Partial<PracticeListQuestion>): PracticeListQuestion => ({
  id: 'x',
  title: 'X',
  difficulty: 'EASY',
  year: null,
  session: null,
  variant: null,
  paper: null,
  questionNumber: null,
  part: null,
  marks: null,
  topic: null,
  tags: [],
  isPremium: false,
  ...over,
});

describe('recommendNextQuestion', () => {
  const questions = [
    q({ id: 'hard', difficulty: 'HARD' }),
    q({ id: 'easy-rare', difficulty: 'EASY' }),
    q({ id: 'easy-popular', difficulty: 'EASY' }),
    q({ id: 'medium', difficulty: 'MEDIUM' }),
  ];
  const stats = new Map([['easy-popular', { solved: 40, attempted: 50, firstTryRate: 60 }]]);

  it('picks the easiest, most-solved unsolved question', () => {
    const pick = recommendNextQuestion({
      questions,
      progress: new Map(),
      stats,
      hasFullAccess: true,
      signedIn: true,
    });
    expect(pick?.id).toBe('easy-popular');
  });

  it('skips solved questions and moves up in difficulty', () => {
    const solved = { status: 'SOLVED', bestScore: 1, totalTests: 1, updatedAt: '2026-09-23' };
    const pick = recommendNextQuestion({
      questions,
      progress: new Map([
        ['easy-popular', solved],
        ['easy-rare', solved],
      ]),
      stats,
      hasFullAccess: true,
      signedIn: true,
    });
    expect(pick?.id).toBe('medium');
  });

  it('only offers EASY to signed-out students and skips locked questions', () => {
    const pick = recommendNextQuestion({
      questions: [q({ id: 'locked', isPremium: true }), q({ id: 'm', difficulty: 'MEDIUM' })],
      progress: new Map(),
      stats: new Map(),
      hasFullAccess: false,
      signedIn: false,
    });
    expect(pick).toBeNull();
  });
});
