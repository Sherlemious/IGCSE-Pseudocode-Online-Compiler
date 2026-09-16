import { describe, expect, it } from 'vitest';
import { checkLessonCode } from './check';
import { IGCSE_PAPER_2 } from './curriculum';
import { findLesson, flattenLessons, lessonHref, nextLesson, previousLesson } from './path';

describe('IGCSE Paper 2 curriculum', () => {
  it('has ten named levels with unique ids and slugs', () => {
    expect(IGCSE_PAPER_2.levels).toHaveLength(10);
    const ids = IGCSE_PAPER_2.levels.flatMap((level) => level.lessons.map((lesson) => lesson.id));
    const slugs = flattenLessons(IGCSE_PAPER_2).map(
      ({ level, lesson }) => `${level.slug}/${lesson.slug}`,
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('makes only levels 1–3 free and playable', () => {
    for (const level of IGCSE_PAPER_2.levels) {
      const shouldPlay = level.number <= 3;
      expect(level.free).toBe(shouldPlay);
      expect(level.playable).toBe(shouldPlay);
      expect(level.lessons.every((lesson) => lesson.playable === shouldPlay)).toBe(true);
    }
  });

  it('resolves hrefs and neighbours', () => {
    const found = findLesson(IGCSE_PAPER_2, '2', 'div-mod');
    expect(found?.lesson.id).toBe('2.4');
    expect(lessonHref(found!.level, found!.lesson)).toBe('/learn/2/div-mod');
    expect(previousLesson(IGCSE_PAPER_2, '1.1')).toBeNull();
    expect(nextLesson(IGCSE_PAPER_2, '1.1')?.lesson.id).toBe('1.2');
    expect(nextLesson(IGCSE_PAPER_2, '3.4')?.lesson.id).toBe('4.1');
  });

  it('accepts solutionCode for every playable non-quiz lesson', async () => {
    const playable = flattenLessons(IGCSE_PAPER_2).filter(({ lesson }) => lesson.playable);
    expect(playable.length).toBeGreaterThan(8);

    for (const { lesson } of playable) {
      if (lesson.type === 'quiz') {
        expect(lesson.quiz?.length).toBeGreaterThan(0);
        for (const item of lesson.quiz ?? []) {
          expect(item.options.some((option) => option.id === item.correctId)).toBe(true);
        }
        continue;
      }
      expect(lesson.solutionCode, `${lesson.id} needs solutionCode`).toBeTruthy();
      const result = await checkLessonCode(lesson, lesson.solutionCode ?? '');
      expect(result.ok, `${lesson.id}: ${result.message}`).toBe(true);
    }
  });

  it('fails the assignment trap until <- is used', async () => {
    const lesson = findLesson(IGCSE_PAPER_2, '1', 'assignment')!.lesson;
    const starter = await checkLessonCode(lesson, lesson.starterCode ?? '');
    expect(starter.ok).toBe(false);
    expect(starter.reason).not.toBe('passed');
    expect(starter.message).toContain('<-');
  });
});
