import { describe, expect, it } from 'vitest';
import { IGCSE_PAPER_2 } from './curriculum';
import { findLesson, legacyLessonHref } from './path';

describe('legacyLessonHref', () => {
  it('sends links from before 16 Nov 2026 (drills were 11-13) to the same lesson', () => {
    expect(legacyLessonHref(IGCSE_PAPER_2, '11', 'space')).toBe('/learn/d1/space');
    expect(legacyLessonHref(IGCSE_PAPER_2, '12', 'split')).toBe('/learn/d2/split');
    expect(legacyLessonHref(IGCSE_PAPER_2, '13', 'slot')).toBe('/learn/d3/slot');
  });

  it('sends links from the brief 1-13 numbering to the same lesson', () => {
    expect(legacyLessonHref(IGCSE_PAPER_2, '4', 'space')).toBe('/learn/d1/space');
    expect(legacyLessonHref(IGCSE_PAPER_2, '7', 'if')).toBe('/learn/4/if');
    expect(legacyLessonHref(IGCSE_PAPER_2, '11', 'procedure')).toBe('/learn/8/procedure');
    expect(legacyLessonHref(IGCSE_PAPER_2, '13', 'validation')).toBe('/learn/10/validation');
  });

  it('leaves unknown and unchanged links alone', () => {
    expect(legacyLessonHref(IGCSE_PAPER_2, '1', 'output')).toBeNull();
    expect(legacyLessonHref(IGCSE_PAPER_2, '4', 'no-such-lesson')).toBeNull();
  });

  it('keeps the syllabus at 1-10 and the drills at d1-d3', () => {
    expect(IGCSE_PAPER_2.levels.map((level) => level.slug)).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'd1', 'd2', 'd3',
    ]);
    expect(findLesson(IGCSE_PAPER_2, '4', 'if')?.level.name).toBe('Branch');
    expect(findLesson(IGCSE_PAPER_2, 'd1', 'space')?.level.name).toBe('Exact lines');
  });
});
