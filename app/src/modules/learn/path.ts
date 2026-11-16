import type { LearnCourse, LearnLesson, LearnLevel } from './types';

export function lessonHref(level: LearnLevel, lesson: LearnLesson, basePath = '/learn'): string {
  return `${basePath}/${level.slug}/${lesson.slug}`;
}

/** Where a level opens: its first playable lesson (always unlocked for anyone with access). */
export function levelStartHref(level: LearnLevel, basePath = '/learn'): string | null {
  const first = level.lessons.find((lesson) => lesson.playable);
  return first ? lessonHref(level, first, basePath) : null;
}

export function flattenLessons(course: LearnCourse): { level: LearnLevel; lesson: LearnLesson }[] {
  return course.levels.flatMap((level) => level.lessons.map((lesson) => ({ level, lesson })));
}

export function playableLessonIdSet(course: LearnCourse): Set<string> {
  return new Set(
    flattenLessons(course)
      .filter((item) => item.lesson.playable)
      .map((item) => item.lesson.id),
  );
}

export function findLesson(
  course: LearnCourse,
  levelSlug: string,
  lessonSlug: string,
): { level: LearnLevel; lesson: LearnLesson } | null {
  const level = course.levels.find((item) => item.slug === levelSlug);
  if (!level) return null;
  const lesson = level.lessons.find((item) => item.slug === lessonSlug);
  if (!lesson) return null;
  return { level, lesson };
}

/**
 * Level slugs from earlier numberings, oldest first: until 16 Nov 2026 the
 * drills were levels 11-13; for a few hours that day they were 4-6 and the
 * syllabus 7-13. A URL that matches no current lesson tries each candidate.
 * Lesson ids (progress keys) never changed.
 */
export const LEGACY_LEVEL_SLUGS: Readonly<Record<string, readonly string[]>> = {
  '4': ['d1'], '5': ['d2'], '6': ['d3'],
  '7': ['4'], '8': ['5'], '9': ['6'], '10': ['7'],
  '11': ['d1', '8'], '12': ['d2', '9'], '13': ['d3', '10'],
};

/**
 * Where an old `/learn/<level>/<lesson>` link points now, or null. Only used
 * when the URL does not match a current lesson, so a `boss` URL (every level
 * has one) resolves to the current level of that number.
 */
export function legacyLessonHref(course: LearnCourse, levelSlug: string, lessonSlug: string, basePath = '/learn'): string | null {
  for (const moved of LEGACY_LEVEL_SLUGS[levelSlug] ?? []) {
    const found = findLesson(course, moved, lessonSlug);
    if (found) return `${basePath}/${found.level.slug}/${found.lesson.slug}`;
  }
  return null;
}

export function previousLesson(
  course: LearnCourse,
  lessonId: string,
): { level: LearnLevel; lesson: LearnLesson } | null {
  const all = flattenLessons(course);
  const index = all.findIndex((item) => item.lesson.id === lessonId);
  if (index <= 0) return null;
  return all[index - 1] ?? null;
}

export function nextLesson(
  course: LearnCourse,
  lessonId: string,
): { level: LearnLevel; lesson: LearnLesson } | null {
  const all = flattenLessons(course);
  const index = all.findIndex((item) => item.lesson.id === lessonId);
  if (index < 0 || index >= all.length - 1) return null;
  return all[index + 1] ?? null;
}

export function firstPlayableLesson(course: LearnCourse): { level: LearnLevel; lesson: LearnLesson } | null {
  return flattenLessons(course).find((item) => item.lesson.playable) ?? null;
}

export function findLevelForLesson(course: LearnCourse, lessonId: string): LearnLevel | null {
  return course.levels.find((level) => level.lessons.some((item) => item.id === lessonId)) ?? null;
}

export function paidPlayableLessonIds(course: LearnCourse): Set<string> {
  return new Set(
    flattenLessons(course)
      .filter(({ level, lesson }) => lesson.playable && !level.free)
      .map(({ lesson }) => lesson.id),
  );
}
