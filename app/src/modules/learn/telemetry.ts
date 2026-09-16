import { captureEvent } from '@/modules/interpreter/analytics';
import { IGCSE_PAPER_2 } from './curriculum';
import { flattenLessons } from './path';
import { isComplete, playableCount, type ProgressMap } from './progress';
import { COURSE_ID, type LearnLesson, type LearnLevel } from './types';

export function learnCourseProps(progress?: ProgressMap): Record<string, unknown> {
  const all = flattenLessons(IGCSE_PAPER_2);
  const playable = all.filter((item) => item.lesson.playable);
  const completed =
    progress === undefined
      ? undefined
      : playable.filter((item) => isComplete(progress, item.lesson.id)).length;
  return {
    course: COURSE_ID,
    level_count: IGCSE_PAPER_2.levels.length,
    lesson_count: all.length,
    playable_count: playable.length,
    ...(completed !== undefined ? { completed_count: completed } : {}),
  };
}

export function learnLevelProps(
  level: LearnLevel,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    course: COURSE_ID,
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
    ...learnLevelProps(level),
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
