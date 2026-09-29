import { describe, expect, it } from 'vitest';
import { checkLessonCode } from './check';
import { COURSE_CHOICES } from './courseChoice';
import { ALEVEL_9618, IGCSE_PAPER_2 } from './curriculum';
import { findLesson, flattenLessons, lessonHref, nextLesson, previousLesson } from './path';

describe('learn course choice', () => {
  it('lists O Level first, then A Level, matching each path', () => {
    expect(COURSE_CHOICES.map((choice) => choice.id)).toEqual([IGCSE_PAPER_2.id, ALEVEL_9618.id]);
    expect(COURSE_CHOICES.map((choice) => choice.href)).toEqual(['/learn', '/learn/9618']);
    for (const course of [IGCSE_PAPER_2, ALEVEL_9618]) {
      const choice = COURSE_CHOICES.find((item) => item.id === course.id);
      expect(choice?.href).toBe(course.basePath);
      expect(choice?.levels).toBe(course.levels.length);
      expect(choice?.freeLevels).toBe(course.levels.filter((level) => level.free).length);
    }
  });
});

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
    expect(playable.length).toBe(78);
    expect(IGCSE_PAPER_2.levels.map((level) => level.lessons.length)).toEqual([
      6, 8, 6, 8, 10, 7, 9, 7, 7, 10,
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

  it('fails 10.10 starter until the four errors are fixed', async () => {
    const lesson = findLesson(IGCSE_PAPER_2, '10', 'more-errors')!.lesson;
    const starter = await checkLessonCode(lesson, lesson.starterCode ?? '');
    expect(starter.ok).toBe(false);
    const fixed = await checkLessonCode(lesson, lesson.solutionCode ?? '');
    expect(fixed.ok, fixed.message).toBe(true);
  });
});

describe('AS & A Level 9618 curriculum', () => {
  it('does not reuse an IGCSE lesson id', () => {
    const igcse = new Set(flattenLessons(IGCSE_PAPER_2).map(({ lesson }) => lesson.id));
    for (const { lesson } of flattenLessons(ALEVEL_9618)) {
      expect(igcse.has(lesson.id), lesson.id).toBe(false);
    }
  });

  it('has eight playable levels, with 1–3 free', () => {
    expect(ALEVEL_9618.levels).toHaveLength(8);
    expect(ALEVEL_9618.basePath).toBe('/learn/9618');
    for (const level of ALEVEL_9618.levels) {
      expect(level.playable).toBe(true);
      expect(level.free).toBe(level.number <= 3);
      expect(level.lessons.every((lesson) => lesson.playable)).toBe(true);
    }
    const ids = ALEVEL_9618.levels.flatMap((level) => level.lessons.map((lesson) => lesson.id));
    const slugs = flattenLessons(ALEVEL_9618).map(({ level, lesson }) => `${level.slug}/${lesson.slug}`);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('links the first record lesson under /learn/9618', () => {
    const found = findLesson(ALEVEL_9618, '1', 'record');
    expect(found?.lesson.id).toBe('as1.1');
    expect(lessonHref(found!.level, found!.lesson, ALEVEL_9618.basePath)).toBe('/learn/9618/1/record');
    expect(nextLesson(ALEVEL_9618, 'as1.1')?.lesson.id).toBe('as1.2');
    expect(previousLesson(ALEVEL_9618, 'as1.1')).toBeNull();
  });

  it('accepts solutionCode for every non-quiz lesson', async () => {
    const playable = flattenLessons(ALEVEL_9618);
    expect(playable.length).toBe(47);

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

  it('rejects mutate starters until the student edits them', async () => {
    const mutates = flattenLessons(ALEVEL_9618).filter(({ lesson }) => lesson.type === 'mutate');
    expect(mutates.length).toBeGreaterThan(0);
    for (const { lesson } of mutates) {
      const starter = await checkLessonCode(lesson, lesson.starterCode ?? '');
      expect(starter.ok, `${lesson.id} starter already passes`).toBe(false);
    }
  });
});
