import type { LearnCourse, LearnLesson, LearnLevel } from './types';

export function lessonHref(level: LearnLevel, lesson: LearnLesson): string {
  return `/learn/${level.slug}/${lesson.slug}`;
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

export function playableLessonsBefore(
  course: LearnCourse,
  lessonId: string,
): { level: LearnLevel; lesson: LearnLesson }[] {
  const all = flattenLessons(course);
  const index = all.findIndex((item) => item.lesson.id === lessonId);
  if (index <= 0) return [];
  return all.slice(0, index).filter((item) => item.lesson.playable);
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
