import { describe, expect, it } from 'vitest';
import { IGCSE_PAPER_2 } from './curriculum';
import { findLesson, legacyLessonHref } from './path';

describe('legacyLessonHref', () => {
  it('sends links from before the renumbering to the same lesson', () => {
    expect(legacyLessonHref(IGCSE_PAPER_2, '4', 'if')).toBe('/learn/7/if');
    expect(legacyLessonHref(IGCSE_PAPER_2, '10', 'validation')).toBe('/learn/13/validation');
    expect(legacyLessonHref(IGCSE_PAPER_2, '11', 'space')).toBe('/learn/4/space');
    expect(legacyLessonHref(IGCSE_PAPER_2, '13', 'slot')).toBe('/learn/6/slot');
  });

  it('leaves unknown and unchanged links alone', () => {
    expect(legacyLessonHref(IGCSE_PAPER_2, '1', 'output')).toBeNull();
    expect(legacyLessonHref(IGCSE_PAPER_2, '4', 'no-such-lesson')).toBeNull();
  });

  it('numbers the path 1-13 in the order students walk it', () => {
    expect(IGCSE_PAPER_2.levels.map((level) => level.slug)).toEqual(
      Array.from({ length: 13 }, (_, i) => String(i + 1)),
    );
    expect(findLesson(IGCSE_PAPER_2, '4', 'space')?.level.name).toBe('Exact lines');
  });
});
