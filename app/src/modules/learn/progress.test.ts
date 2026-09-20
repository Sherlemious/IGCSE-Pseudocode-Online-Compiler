import { describe, expect, it } from 'vitest';
import { IGCSE_PAPER_2 } from './curriculum';
import { findLesson, playableLessonIdSet } from './path';
import {
  isLessonUnlocked,
  mergeProgress,
  parseLearnProgressBody,
  progressHasLocalExtras,
  type ProgressMap,
} from './progress';
import { COURSE_ID, type LearnCourse, type LearnLesson, type LearnLevel } from './types';

function lesson(level: string, slug: string) {
  const found = findLesson(IGCSE_PAPER_2, level, slug);
  if (!found) throw new Error(`missing ${level}/${slug}`);
  return found.lesson;
}

function stubLesson(id: string, slug: string): LearnLesson {
  return {
    id,
    slug,
    title: slug,
    type: 'run',
    minutes: 1,
    why: 'fixture',
    body: 'fixture',
    playable: true,
  };
}

function stubLevel(number: number, free: boolean, lessons: LearnLesson[]): LearnLevel {
  return {
    number,
    slug: String(number),
    name: `L${number}`,
    hours: '1',
    leaveWith: '',
    syllabus: '',
    free,
    playable: true,
    lessons,
  };
}

/** Tiny path: free a.1 → a.2 (insert) → a.3, then paid b.1. */
const FIXTURE: LearnCourse = {
  id: COURSE_ID,
  title: 'fixture',
  subtitle: '',
  levels: [
    stubLevel(1, true, [stubLesson('a.1', 'first'), stubLesson('a.2', 'inserted'), stubLesson('a.3', 'later')]),
    stubLevel(2, false, [stubLesson('b.1', 'paid')]),
  ],
};

function fixtureLesson(id: string): LearnLesson {
  const found = FIXTURE.levels.flatMap((level) => level.lessons).find((item) => item.id === id);
  if (!found) throw new Error(`missing fixture ${id}`);
  return found;
}

function done(ids: string[]): ProgressMap {
  const map: ProgressMap = {};
  for (const id of ids) {
    map[id] = { completedAt: '2026-09-16T00:00:00.000Z', attempts: 1 };
  }
  return map;
}

describe('learn sequential unlock', () => {
  it('opens 1.1 with empty progress and locks later playable lessons', () => {
    const empty: ProgressMap = {};
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('1', 'output'), empty)).toBe(true);
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('1', 'comments'), empty)).toBe(false);
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('2', 'declare'), empty)).toBe(false);
  });

  it('unlocks the next playable lesson after the previous completes', () => {
    const afterFirst: ProgressMap = {
      '1.1': { completedAt: '2026-09-16T00:00:00.000Z', attempts: 1 },
    };
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('1', 'comments'), afterFirst)).toBe(true);
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('1', 'assignment'), afterFirst)).toBe(false);
  });

  it('locks paid lessons without premium even after earlier levels complete', () => {
    const afterFree: ProgressMap = {};
    for (const level of IGCSE_PAPER_2.levels) {
      if (!level.free) continue;
      for (const item of level.lessons) {
        afterFree[item.id] = { completedAt: '2026-09-16T00:00:00.000Z', attempts: 1 };
      }
    }
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('4', 'if'), afterFree)).toBe(false);
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('4', 'if'), afterFree, { premium: true })).toBe(true);
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('10', 'scenario'), afterFree, { premium: true })).toBe(false);
  });
});

describe('reached-index unlock', () => {
  it('opens only the first lesson with empty progress', () => {
    const empty: ProgressMap = {};
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.1'), empty)).toBe(true);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.2'), empty)).toBe(false);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.3'), empty)).toBe(false);
  });

  it('does not skip ahead after completing the first lesson', () => {
    const afterFirst = done(['a.1']);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.2'), afterFirst)).toBe(true);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.3'), afterFirst)).toBe(false);
  });

  it('keeps a later lesson and a new earlier insert open once that later lesson is complete', () => {
    const reachedLater = done(['a.3']);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.3'), reachedLater)).toBe(true);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.2'), reachedLater)).toBe(true);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.1'), reachedLater)).toBe(true);
  });

  it('keeps a lesson after the frontier locked until sequential or a later complete', () => {
    const reachedLater = done(['a.3']);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('b.1'), reachedLater, { premium: true })).toBe(false);
  });

  it('still requires premium for paid lessons even when the frontier is past them', () => {
    const reachedPaid = done(['a.1', 'a.2', 'a.3', 'b.1']);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('b.1'), reachedPaid)).toBe(false);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('b.1'), reachedPaid, { premium: true })).toBe(true);
    expect(isLessonUnlocked(FIXTURE, fixtureLesson('a.2'), reachedPaid)).toBe(true);
  });
});

describe('mergeProgress', () => {
  it('keeps the earlier completedAt and never un-completes', () => {
    const local: ProgressMap = {
      '1.1': { completedAt: '2026-09-16T10:00:00.000Z', attempts: 2 },
    };
    const remote: ProgressMap = {
      '1.1': {
        completedAt: '',
        attempts: 4,
        lastOk: false,
        lastReason: 'wrong_output',
        updatedAt: '2026-09-17T12:00:00.000Z',
      },
    };
    const merged = mergeProgress(local, remote);
    expect(merged['1.1']?.completedAt).toBe('2026-09-16T10:00:00.000Z');
    expect(merged['1.1']?.attempts).toBe(4);
  });

  it('takes lastCode from the newer updatedAt', () => {
    const older: ProgressMap = {
      '1.1': {
        completedAt: '2026-09-16T10:00:00.000Z',
        attempts: 1,
        lastCode: 'OUTPUT "old"',
        updatedAt: '2026-09-16T10:00:00.000Z',
      },
    };
    const newer: ProgressMap = {
      '1.1': {
        completedAt: '2026-09-16T10:00:00.000Z',
        attempts: 2,
        lastCode: 'OUTPUT "new"',
        updatedAt: '2026-09-17T08:00:00.000Z',
      },
    };
    expect(mergeProgress(older, newer)['1.1']?.lastCode).toBe('OUTPUT "new"');
    expect(mergeProgress(newer, older)['1.1']?.lastCode).toBe('OUTPUT "new"');
  });

  it('unions lessons from both maps', () => {
    const merged = mergeProgress(
      { '1.1': { completedAt: '2026-09-16T00:00:00.000Z', attempts: 1 } },
      { '1.2': { completedAt: '', attempts: 3, lastOk: false } },
    );
    expect(merged['1.1']?.completedAt).toBeTruthy();
    expect(merged['1.2']?.attempts).toBe(3);
  });
});

describe('progressHasLocalExtras', () => {
  it('is true when local completed a lesson remote has not', () => {
    expect(
      progressHasLocalExtras(
        { '1.1': { completedAt: '2026-09-16T00:00:00.000Z', attempts: 1 } },
        {},
      ),
    ).toBe(true);
  });

  it('is false when remote is equal or ahead', () => {
    const remote: ProgressMap = { '1.1': { completedAt: '2026-09-16T00:00:00.000Z', attempts: 3 } };
    expect(progressHasLocalExtras({ '1.1': { completedAt: '2026-09-16T00:00:00.000Z', attempts: 1 } }, remote)).toBe(
      false,
    );
  });
});

describe('parseLearnProgressBody', () => {
  const allowed = playableLessonIdSet(IGCSE_PAPER_2);

  it('rejects unknown lesson ids', () => {
    const result = parseLearnProgressBody(
      { lessons: { '9.9': { completedAt: '', attempts: 1 } } },
      allowed,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(422);
  });

  it('accepts a playable lesson', () => {
    const result = parseLearnProgressBody(
      { lessons: { '1.1': { completedAt: '2026-09-16T00:00:00.000Z', attempts: 2, lastOk: true } } },
      allowed,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lessons['1.1']?.attempts).toBe(2);
  });
});

