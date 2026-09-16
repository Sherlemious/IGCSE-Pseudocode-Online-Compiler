import { describe, expect, it } from 'vitest';
import { IGCSE_PAPER_2 } from './curriculum';
import { findLesson } from './path';
import { isLessonUnlocked, type ProgressMap } from './progress';

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
