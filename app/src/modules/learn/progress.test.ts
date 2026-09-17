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

function lesson(level: string, slug: string) {
  const found = findLesson(IGCSE_PAPER_2, level, slug);
  if (!found) throw new Error(`missing ${level}/${slug}`);
  return found.lesson;
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

  it('never unlocks coming-next shells', () => {
    const allPlayable: ProgressMap = {};
    for (const level of IGCSE_PAPER_2.levels) {
      for (const item of level.lessons) {
        if (item.playable) {
          allPlayable[item.id] = { completedAt: '2026-09-16T00:00:00.000Z', attempts: 1 };
        }
      }
    }
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('4', 'if'), allPlayable)).toBe(false);
    expect(isLessonUnlocked(IGCSE_PAPER_2, lesson('10', 'scenario'), allPlayable)).toBe(false);
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

