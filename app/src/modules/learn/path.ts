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
 * Level slugs before the Nov 2026 renumbering, when the drills were 11-13
 * but sat after level 3 on the path. Old slug -> current slug, for the IGCSE
 * Paper 2 course only. Lesson ids (progress keys) did not change.
 */
export const LEGACY_LEVEL_SLUGS: Readonly<Record<string, string>> = {
  '4': '7', '5': '8', '6': '9', '7': '10', '8': '11', '9': '12', '10': '13',
  '11': '4', '12': '5', '13': '6',
};

/**
 * Where an old `/learn/<level>/<lesson>` link points now, or null. Only used
 * when the URL does not match a current lesson, so a `boss` URL (every level
 * has one) resolves to the current level of that number, not the old one.
 */
export function legacyLessonHref(course: LearnCourse, levelSlug: string, lessonSlug: string, basePath = '/learn'): string | null {
  const moved = LEGACY_LEVEL_SLUGS[levelSlug];
  if (!moved) return null;
  const found = findLesson(course, moved, lessonSlug);
  return found ? `${basePath}/${found.level.slug}/${found.lesson.slug}` : null;
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
