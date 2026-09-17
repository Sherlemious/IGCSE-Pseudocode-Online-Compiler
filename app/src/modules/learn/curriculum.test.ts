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

  it('makes levels 1–3 free and every level playable', () => {
    for (const level of IGCSE_PAPER_2.levels) {
      expect(level.playable).toBe(true);
      expect(level.free).toBe(level.number <= 3);
      expect(level.lessons.every((lesson) => lesson.playable === true)).toBe(true);
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
    expect(playable.length).toBe(56);
    expect(IGCSE_PAPER_2.levels.map((level) => level.lessons.length)).toEqual([
      4, 5, 4, 6, 8, 5, 7, 5, 4, 8,
    ]);

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
    const trace = findLesson(IGCSE_PAPER_2, '10', 'trace')!.lesson;
    expect(trace.type).toBe('quiz');
    expect(trace.starterCode).toContain('A <- 3');
  });

  it('fails the assignment trap until <- is used', async () => {
    const lesson = findLesson(IGCSE_PAPER_2, '1', 'assignment')!.lesson;
    const starter = await checkLessonCode(lesson, lesson.starterCode ?? '');
    expect(starter.ok).toBe(false);
    expect(starter.reason).not.toBe('passed');
    expect(starter.message).toContain('<-');
  });

  it('fails 10.3 starter until the four errors are fixed', async () => {
    const lesson = findLesson(IGCSE_PAPER_2, '10', 'errors')!.lesson;
    const starter = await checkLessonCode(lesson, lesson.starterCode ?? '');
    expect(starter.ok).toBe(false);
    const fixed = await checkLessonCode(lesson, lesson.solutionCode ?? '');
    expect(fixed.ok, fixed.message).toBe(true);
  });
});
