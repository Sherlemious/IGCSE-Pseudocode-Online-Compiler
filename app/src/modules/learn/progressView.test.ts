import { describe, expect, it } from 'vitest';
import { ALEVEL_9618, IGCSE_PAPER_2 } from './curriculum';
import { flattenLessons } from './path';
import type { LearnProgressRecord } from './progress';
import { ALEVEL_COURSE_ID } from './types';
import { buildLearnProgressView, groupLessonsByLevel } from './progressView';

describe('buildLearnProgressView', () => {
  const playable = flattenLessons(IGCSE_PAPER_2).filter((item) => item.lesson.playable);

  it('marks missing rows as not started', () => {
    const view = buildLearnProgressView([]);
    expect(view.playableCount).toBe(playable.length);
    expect(view.notStartedCount).toBe(playable.length);
    expect(view.completedCount).toBe(0);
    expect(view.attemptedCount).toBe(0);
    expect(view.lessons.every((item) => item.state === 'not_started')).toBe(true);
  });

  it('splits completed, attempted, and not started', () => {
    const rows: LearnProgressRecord[] = [
      {
        lessonId: '1.1',
        status: 'COMPLETED',
        attempts: 2,
        lastOk: true,
        lastReason: 'passed',
        lastCode: 'OUTPUT "Hi"',
        completedAt: '2026-09-17T08:00:00.000Z',
        updatedAt: '2026-09-17T08:00:00.000Z',
      },
      {
        lessonId: '1.2',
        status: 'ATTEMPTED',
        attempts: 4,
        lastOk: false,
        lastReason: 'wrong_output',
        lastCode: 'OUTPUT 1',
        completedAt: null,
        updatedAt: '2026-09-17T09:00:00.000Z',
      },
    ];
    const view = buildLearnProgressView(rows);
    expect(view.completedCount).toBe(1);
    expect(view.attemptedCount).toBe(1);
    expect(view.notStartedCount).toBe(playable.length - 2);
    expect(view.lessons.find((item) => item.lessonId === '1.1')?.state).toBe('completed');
    expect(view.lessons.find((item) => item.lessonId === '1.2')?.state).toBe('attempted');
    expect(view.lastActivityAt).toBe('2026-09-17T09:00:00.000Z');
  });

  it('groups playable lessons by level in path order', () => {
    const view = buildLearnProgressView([]);
    const groups = groupLessonsByLevel(view.lessons);
    expect(groups[0]?.levelNumber).toBe(1);
    expect(groups.some((group) => group.levelNumber === 4)).toBe(true);
  });

  it('scores A Level rows against the 9618 course', () => {
    const playable = flattenLessons(ALEVEL_9618).filter((item) => item.lesson.playable);
    const rows: LearnProgressRecord[] = [
      {
        lessonId: 'as1.1',
        status: 'COMPLETED',
        attempts: 1,
        lastOk: true,
        lastReason: 'passed',
        lastCode: null,
        completedAt: '2026-09-30T11:00:00.000Z',
        updatedAt: '2026-09-30T11:00:00.000Z',
      },
    ];
    const view = buildLearnProgressView(rows, ALEVEL_9618);
    expect(view.courseId).toBe(ALEVEL_COURSE_ID);
    expect(view.playableCount).toBe(playable.length);
    expect(view.completedCount).toBe(1);
    expect(view.lessons.find((item) => item.lessonId === 'as1.1')?.state).toBe('completed');
    expect(buildLearnProgressView(rows).completedCount).toBe(0);
  });
});
