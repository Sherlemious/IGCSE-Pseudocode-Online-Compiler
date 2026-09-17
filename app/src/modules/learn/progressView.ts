import { IGCSE_PAPER_2 } from './curriculum';
import { flattenLessons } from './path';
import type { LearnCourse } from './types';
import type { LearnProgressRecord } from './progress';

export type LessonViewState = 'not_started' | 'attempted' | 'completed';

export type LearnLessonView = {
  lessonId: string;
  slug: string;
  title: string;
  levelNumber: number;
  levelName: string;
  levelSlug: string;
  state: LessonViewState;
  attempts: number;
  lastOk: boolean;
  lastReason: string | null;
  lastCode: string | null;
  completedAt: string | null;
  updatedAt: string | null;
};

export type LearnProgressView = {
  courseId: string;
  playableCount: number;
  completedCount: number;
  attemptedCount: number;
  notStartedCount: number;
  lastActivityAt: string | null;
  lessons: LearnLessonView[];
};

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function buildLearnProgressView(
  rows: LearnProgressRecord[],
  course: LearnCourse = IGCSE_PAPER_2,
): LearnProgressView {
  const byId = new Map(rows.map((row) => [row.lessonId, row]));
  const playable = flattenLessons(course).filter((item) => item.lesson.playable);
  const lessons: LearnLessonView[] = playable.map(({ level, lesson }) => {
    const row = byId.get(lesson.id);
    const completedAt = iso(row?.completedAt ?? null);
    const state: LessonViewState = completedAt ? 'completed' : row ? 'attempted' : 'not_started';
    return {
      lessonId: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      levelNumber: level.number,
      levelName: level.name,
      levelSlug: level.slug,
      state,
      attempts: row?.attempts ?? 0,
      lastOk: row?.lastOk ?? false,
      lastReason: row?.lastReason ?? null,
      lastCode: row?.lastCode ?? null,
      completedAt,
      updatedAt: iso(row?.updatedAt),
    };
  });

  const completedCount = lessons.filter((item) => item.state === 'completed').length;
  const attemptedCount = lessons.filter((item) => item.state === 'attempted').length;
  let lastActivityAt: string | null = null;
  for (const item of lessons) {
    if (item.updatedAt && (!lastActivityAt || item.updatedAt > lastActivityAt)) {
      lastActivityAt = item.updatedAt;
    }
  }

  return {
    courseId: course.id,
    playableCount: lessons.length,
    completedCount,
    attemptedCount,
    notStartedCount: lessons.length - completedCount - attemptedCount,
    lastActivityAt,
    lessons,
  };
}

export function groupLessonsByLevel(lessons: LearnLessonView[]): {
  levelNumber: number;
  levelName: string;
  levelSlug: string;
  lessons: LearnLessonView[];
}[] {
  const groups: {
    levelNumber: number;
    levelName: string;
    levelSlug: string;
    lessons: LearnLessonView[];
  }[] = [];
  for (const lesson of lessons) {
    const last = groups[groups.length - 1];
    if (!last || last.levelNumber !== lesson.levelNumber) {
      groups.push({
        levelNumber: lesson.levelNumber,
        levelName: lesson.levelName,
        levelSlug: lesson.levelSlug,
        lessons: [lesson],
      });
    } else {
      last.lessons.push(lesson);
    }
  }
  return groups;
}
