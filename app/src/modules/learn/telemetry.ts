import { captureEvent } from '@/modules/interpreter/analytics';
import { ALEVEL_9618, IGCSE_PAPER_2 } from './curriculum';
import { flattenLessons } from './path';
import { isComplete, playableCount, type ProgressMap } from './progress';
import { type LearnCourse, type LearnLesson, type LearnLevel } from './types';

const lessonCourse = new Map<string, LearnCourse>();
for (const course of [IGCSE_PAPER_2, ALEVEL_9618]) {
  for (const { lesson } of flattenLessons(course)) {
    lessonCourse.set(lesson.id, course);
  }
}

export function courseForLesson(lessonId: string): LearnCourse {
  return lessonCourse.get(lessonId) ?? IGCSE_PAPER_2;
}

export function learnCourseProps(
  progress?: ProgressMap,
  course: LearnCourse = IGCSE_PAPER_2,
): Record<string, unknown> {
  const all = flattenLessons(course);
  const playable = all.filter((item) => item.lesson.playable);
  const completed =
    progress === undefined
      ? undefined
      : playable.filter((item) => isComplete(progress, item.lesson.id)).length;
  return {
    course: course.id,
    level_count: course.levels.length,
    lesson_count: all.length,
    playable_count: playable.length,
    ...(completed !== undefined ? { completed_count: completed } : {}),
  };
}

export function learnLevelProps(
  level: LearnLevel,
  extra: Record<string, unknown> = {},
  course: LearnCourse = IGCSE_PAPER_2,
): Record<string, unknown> {
  return {
    course: course.id,
    level: level.number,
    level_slug: level.slug,
    level_name: level.name,
    playable: level.playable,
    free: level.free,
    lesson_count: level.lessons.length,
    playable_lesson_count: playableCount(level),
    ...extra,
  };
}

export function learnLessonProps(
  level: LearnLevel,
  lesson: LearnLesson,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...learnLevelProps(level, {}, courseForLesson(lesson.id)),
    lesson: lesson.id,
    lesson_slug: lesson.slug,
    lesson_title: lesson.title,
    lesson_type: lesson.type,
    lesson_minutes: lesson.minutes,
    playable: lesson.playable,
    ...extra,
  };
}

export function captureLearn(event: string, props: Record<string, unknown> = {}): void {
  captureEvent(event, props);
}
