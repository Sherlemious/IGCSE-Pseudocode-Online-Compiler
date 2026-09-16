import { describe, expect, it } from 'vitest';
import { buildProgressReport, remarkFor } from './report';

const q = (over: Partial<{
  status: string;
  bestScore: number;
  totalTests: number;
  attempts: number;
  updatedAt: Date;
  difficulty: string;
  topic: string | null;
  title: string;
}> = {}) => ({
  status: over.status ?? 'SOLVED',
  bestScore: over.bestScore ?? 3,
  totalTests: over.totalTests ?? 3,
  attempts: over.attempts ?? 1,
  updatedAt: over.updatedAt ?? new Date('2026-03-15T12:00:00.000Z'),
  question: {
    difficulty: over.difficulty ?? 'EASY',
    topic: over.topic === undefined ? 'Selection' : over.topic,
    title: over.title ?? 'Q1',
  },
});

describe('buildProgressReport', () => {
  it('returns empty activity for no rows', () => {
    const report = buildProgressReport([], [], 40);
    expect(report.hasActivity).toBe(false);
    expect(report.totalAttempted).toBe(0);
    expect(report.totalSolved).toBe(0);
    expect(report.overallPct).toBe(0);
    expect(report.examsCompleted).toBe(0);
  });

  it('aggregates solved, topics, difficulty, and UTC activity dates', () => {
    const report = buildProgressReport(
      [
        q({ status: 'SOLVED', difficulty: 'EASY', topic: 'Selection', attempts: 2 }),
        q({ status: 'ATTEMPTED', difficulty: 'HARD', topic: null, title: 'Q2', attempts: 4, bestScore: 1, totalTests: 5 }),
      ],
      [{
        id: 'e1',
        topic: 'Arrays',
        difficulty: 'MEDIUM',
        questionCount: 5,
        timeLimitMin: 45,
        status: 'COMPLETED',
        score: 8,
        totalTests: 10,
        startedAt: new Date('2026-03-16T08:00:00.000Z'),
        completedAt: new Date('2026-03-16T08:40:00.000Z'),
      }],
      50,
    );

    expect(report.totalQuestions).toBe(50);
    expect(report.totalAttempted).toBe(2);
    expect(report.totalSolved).toBe(1);
    expect(report.totalAttempts).toBe(6);
    expect(report.examsCompleted).toBe(1);
    expect(report.overallPct).toBe(50);
    expect(report.hasActivity).toBe(true);
    expect(report.difficultyMap.EASY).toEqual({ attempted: 1, solved: 1 });
    expect(report.difficultyMap.HARD).toEqual({ attempted: 1, solved: 0 });
    expect(report.topicMap.Selection).toEqual({ attempted: 1, solved: 1 });
    expect(report.topicMap.Uncategorized).toEqual({ attempted: 1, solved: 0 });
    expect(report.activityByDate['2026-03-15']).toBe(2);
    expect(report.activityByDate['2026-03-16']).toBe(1);
    expect(report.recentActivity).toHaveLength(2);
    expect(report.exams[0]?.id).toBe('e1');
  });

  it('treats in-progress exams as not completed', () => {
    const report = buildProgressReport([], [{
      id: 'e1',
      topic: null,
      difficulty: null,
      questionCount: 3,
      timeLimitMin: 20,
      status: 'IN_PROGRESS',
      score: null,
      totalTests: null,
      startedAt: new Date('2026-03-16T08:00:00.000Z'),
      completedAt: null,
    }], 10);
    expect(report.examsCompleted).toBe(0);
    expect(report.hasActivity).toBe(false);
  });
});

describe('remarkFor', () => {
  it('uses second person for self and third for teacher', () => {
    expect(remarkFor(0.9, 'self')).toContain('your attempts');
    expect(remarkFor(0.9, 'teacher')).toContain('their attempts');
  });
});
