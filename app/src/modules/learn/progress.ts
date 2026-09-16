import { COURSE_ID } from './types';
import type { LearnCourse, LearnLesson } from './types';
import { playableLessonsBefore } from './path';

const storageKey = (courseId: string) => `learn_progress:${courseId}`;

export type LessonProgress = {
  completedAt: string;
  attempts: number;
};

export type ProgressMap = Record<string, LessonProgress>;

export function loadProgress(courseId: string = COURSE_ID): ProgressMap {
  try {
    const raw = localStorage.getItem(storageKey(courseId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap, courseId: string = COURSE_ID): void {
  try {
    localStorage.setItem(storageKey(courseId), JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('learn-progress-changed', { detail: { courseId } }));
  } catch {
    /* private mode / quota */
  }
}

export function markAttempt(lessonId: string, courseId: string = COURSE_ID): ProgressMap {
  const map = loadProgress(courseId);
  const prev = map[lessonId];
  map[lessonId] = {
    completedAt: prev?.completedAt ?? '',
    attempts: (prev?.attempts ?? 0) + 1,
  };
  saveProgress(map, courseId);
  return map;
}

export function markComplete(lessonId: string, attempts?: number, courseId: string = COURSE_ID): ProgressMap {
  const map = loadProgress(courseId);
  const prev = map[lessonId];
  map[lessonId] = {
    completedAt: prev?.completedAt || new Date().toISOString(),
    attempts: attempts ?? prev?.attempts ?? 1,
  };
  saveProgress(map, courseId);
  return map;
}

export function isComplete(map: ProgressMap, lessonId: string): boolean {
  return Boolean(map[lessonId]?.completedAt);
}

export function isLessonUnlocked(
  course: LearnCourse,
  lesson: LearnLesson,
  map: ProgressMap,
): boolean {
  if (!lesson.playable) return false;
  const prior = playableLessonsBefore(course, lesson.id);
  return prior.every((item) => isComplete(map, item.lesson.id));
}

export function nextIncomplete(
  course: LearnCourse,
  map: ProgressMap,
): { levelSlug: string; lessonSlug: string } | null {
  for (const level of course.levels) {
    for (const lesson of level.lessons) {
      if (!lesson.playable) continue;
      if (!isComplete(map, lesson.id)) {
        return { levelSlug: level.slug, lessonSlug: lesson.slug };
      }
    }
  }
  return null;
}

export function levelCompletedCount(level: { lessons: LearnLesson[] }, map: ProgressMap): number {
  return level.lessons.filter((lesson) => lesson.playable && isComplete(map, lesson.id)).length;
}

export function playableCount(level: { lessons: LearnLesson[] }): number {
  return level.lessons.filter((lesson) => lesson.playable).length;
}
