import { describe, expect, it } from 'vitest';
import type { LearnCourse, LearnLesson, LearnLevel } from '@/modules/learn/types';
import { IGCSE_COURSE_ID } from '@/modules/learn/types';
import { buildLearnAdminCourse, type LearnAdminRow } from './learnAdmin';
import { filterLearners, parseLearnQuery } from './learnQuery';

const NOW = new Date('2026-10-05T12:00:00.000Z');

function lesson(id: string, title: string): LearnLesson {
  return {
    id,
    slug: id,
    title,
    type: 'run',
    minutes: 4,
    why: 'why',
    body: 'body',
    playable: true,
  };
}

function level(number: number, name: string, lessons: LearnLesson[], free = true): LearnLevel {
  return {
    number,
    slug: String(number),
    name,
    hours: '1',
    leaveWith: 'leave',
    syllabus: '1',
    free,
    playable: true,
    lessons,
  };
}

const course: LearnCourse = {
  id: IGCSE_COURSE_ID,
  basePath: '/learn',
  kicker: 'kicker',
  title: 'Path',
  subtitle: 'subtitle',
  completeNote: 'done',
  otherPath: { href: '/learn/9618', label: 'other' },
  levels: [
    level(1, 'Run', [lesson('1.1', 'Output'), lesson('1.2', 'Input')]),
    level(2, 'Decide', [lesson('2.1', 'IF')], false),
  ],
};

function row(partial: Partial<LearnAdminRow> & Pick<LearnAdminRow, 'userId' | 'lessonId'>): LearnAdminRow {
  return {
    courseId: IGCSE_COURSE_ID,
    status: 'COMPLETED',
    attempts: 1,
    lastOk: true,
    lastReason: 'passed',
    completedAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
    name: 'Ada',
    email: 'ada@example.com',
    ...partial,
  };
}

describe('buildLearnAdminCourse', () => {
  const snapshot = buildLearnAdminCourse([
    row({ userId: 'a', lessonId: '1.1' }),
    row({ userId: 'a', lessonId: '1.2' }),
    row({ userId: 'a', lessonId: '2.1' }),
    row({
      userId: 'b',
      lessonId: '1.1',
      name: 'Bea',
      email: 'bea@example.com',
      status: 'ATTEMPTED',
      attempts: 4,
      lastOk: false,
      lastReason: 'wrong_output',
      completedAt: null,
      updatedAt: '2026-09-25T12:00:00.000Z',
    }),
  ], course, { exam: 'O Level', paper: 'Paper 2', freeLevels: 1 }, NOW);

  it('counts learners, finishers, and the week-over-week change', () => {
    expect(snapshot.learners).toBe(2);
    expect(snapshot.pathFinished).toBe(1);
    expect(snapshot.lessonCompletions).toBe(3);
    expect(snapshot.medianPct).toBe(50);
    expect(snapshot.active7).toBe(1);
    expect(snapshot.activePrev7).toBe(1);
    expect(snapshot.activeDelta).toBe(0);
    expect(snapshot.activity.at(-1)).toBe(1);
  });

  it('shows who cleared each level and which lesson they fail', () => {
    expect(snapshot.levels.map((level) => [level.levelNumber, level.reached, level.finished])).toEqual([
      [1, 2, 1],
      [2, 1, 1],
    ]);
    expect(snapshot.stuckKind).toBe('dropoff');
    expect(snapshot.stuck[0]).toMatchObject({
      lessonId: '1.1',
      started: 2,
      completed: 1,
      reason: 'wrong output',
    });
    expect(snapshot.roster.find((learner) => learner.userId === 'b')).toMatchObject({
      furthest: '1.1 Output',
      stuckReason: 'wrong output',
      completed: 0,
      attempted: 1,
    });
  });
});

describe('filterLearners', () => {
  const snapshot = buildLearnAdminCourse([
    row({ userId: 'a', lessonId: '1.1' }),
    row({
      userId: 'b',
      lessonId: '1.1',
      name: 'Bea',
      email: 'bea@example.com',
      status: 'ATTEMPTED',
      lastOk: false,
      lastReason: 'wrong_output',
      completedAt: null,
    }),
  ], course, { exam: 'O Level', paper: 'Paper 2', freeLevels: 1 }, NOW);

  it('keeps the stuck learner when that filter is on', () => {
    const query = parseLearnQuery({ filter: 'stuck', q: 'bea' }, [IGCSE_COURSE_ID]);
    expect(filterLearners(snapshot.roster, query, NOW).map((learner) => learner.userId)).toEqual(['b']);
  });
});
