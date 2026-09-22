import { COURSE_ID } from './types';
import type { LearnCourse, LearnLesson } from './types';
import { findLevelForLesson, flattenLessons, playableLessonsBefore } from './path';

const storageKey = (courseId: string) => `learn_progress:${courseId}`;

export const MAX_LEARN_CODE_CHARS = 20_000;

export type LessonProgress = {
  completedAt: string;
  attempts: number;
  lastOk?: boolean;
  lastReason?: string;
  lastCode?: string;
  updatedAt?: string;
};

export type ProgressMap = Record<string, LessonProgress>;

export type LessonProgressPatch = {
  lastOk?: boolean;
  lastReason?: string;
  lastCode?: string;
};

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

function capCode(code: string | undefined): string | undefined {
  if (code === undefined) return undefined;
  return code.length > MAX_LEARN_CODE_CHARS ? code.slice(0, MAX_LEARN_CODE_CHARS) : code;
}

export function markAttempt(
  lessonId: string,
  extra: LessonProgressPatch = {},
  courseId: string = COURSE_ID,
): ProgressMap {
  const map = loadProgress(courseId);
  const prev = map[lessonId];
  const now = new Date().toISOString();
  map[lessonId] = {
    completedAt: prev?.completedAt ?? '',
    attempts: (prev?.attempts ?? 0) + 1,
    lastOk: extra.lastOk ?? false,
    lastReason: extra.lastReason ?? prev?.lastReason,
    lastCode: capCode(extra.lastCode !== undefined ? extra.lastCode : prev?.lastCode),
    updatedAt: now,
  };
  saveProgress(map, courseId);
  return map;
}

export function markComplete(lessonId: string, attempts?: number, courseId: string = COURSE_ID): ProgressMap {
  const map = loadProgress(courseId);
  const prev = map[lessonId];
  const now = new Date().toISOString();
  map[lessonId] = {
    completedAt: prev?.completedAt || now,
    attempts: attempts ?? prev?.attempts ?? 1,
    lastOk: true,
    lastReason: prev?.lastReason ?? 'passed',
    lastCode: prev?.lastCode,
    updatedAt: now,
  };
  saveProgress(map, courseId);
  return map;
}

export function isComplete(map: ProgressMap, lessonId: string): boolean {
  return Boolean(map[lessonId]?.completedAt);
}

export type LearnAccess = {
  /** True when paid levels (4–10) may be opened. */
  premium?: boolean;
};

export function isSequentiallyOpen(
  course: LearnCourse,
  lesson: LearnLesson,
  map: ProgressMap,
): boolean {
  if (!lesson.playable) return false;
  const prior = playableLessonsBefore(course, lesson.id);
  return prior.every((item) => isComplete(map, item.lesson.id));
}

export function playableLessonIndex(course: LearnCourse, lessonId: string): number {
  return flattenLessons(course)
    .filter((item) => item.lesson.playable)
    .findIndex((item) => item.lesson.id === lessonId);
}

/** Highest playable-lesson index the student has already completed, or -1. */
export function highestReachedPlayableIndex(course: LearnCourse, map: ProgressMap): number {
  const playable = flattenLessons(course).filter((item) => item.lesson.playable);
  let max = -1;
  for (let i = 0; i < playable.length; i++) {
    if (isComplete(map, playable[i]!.lesson.id)) max = i;
  }
  return max;
}

/**
 * Free levels from here on need a (free) account. Progress then syncs across
 * devices, and by the level-4 paywall the student is already signed in, so
 * paying is one step instead of sign-in + checkout.
 */
export const ACCOUNT_REQUIRED_FROM_LEVEL = 3;

export function levelNeedsAccount(level: { number: number }): boolean {
  return level.number >= ACCOUNT_REQUIRED_FROM_LEVEL;
}

export function isLessonUnlocked(
  course: LearnCourse,
  lesson: LearnLesson,
  map: ProgressMap,
  access: LearnAccess = {},
): boolean {
  if (!lesson.playable) return false;
  const level = findLevelForLesson(course, lesson.id);
  if (level && !level.free && !access.premium) return false;
  if (isSequentiallyOpen(course, lesson, map)) return true;
  const index = playableLessonIndex(course, lesson.id);
  return index >= 0 && index <= highestReachedPlayableIndex(course, map);
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

function earlierIso(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  return a <= b ? a : b;
}

export function mergeLesson(a: LessonProgress, b: LessonProgress): LessonProgress {
  const completedAt = earlierIso(a.completedAt, b.completedAt);
  const attempts = Math.max(a.attempts ?? 0, b.attempts ?? 0);
  const aTs = a.updatedAt || a.completedAt || '';
  const bTs = b.updatedAt || b.completedAt || '';
  const newer = bTs > aTs ? b : a;
  const updatedAt = bTs > aTs ? b.updatedAt || bTs : a.updatedAt || aTs;
  return {
    completedAt,
    attempts,
    lastOk: newer.lastOk ?? Boolean(completedAt),
    lastReason: newer.lastReason,
    lastCode: capCode(newer.lastCode),
    updatedAt: updatedAt || undefined,
  };
}

export function mergeProgress(a: ProgressMap, b: ProgressMap): ProgressMap {
  const ids = new Set([...Object.keys(a), ...Object.keys(b)]);
  const out: ProgressMap = {};
  for (const id of ids) {
    const left = a[id];
    const right = b[id];
    if (!left && right) out[id] = { ...right };
    else if (right && left) out[id] = mergeLesson(left, right);
    else if (left) out[id] = { ...left };
  }
  return out;
}

/** True when local is ahead of remote and should be pushed after hydrate. */
export function progressHasLocalExtras(local: ProgressMap, remote: ProgressMap): boolean {
  for (const id of Object.keys(local)) {
    const left = local[id];
    const right = remote[id];
    if (!left) continue;
    if (!right) return true;
    if (Boolean(left.completedAt) && !right.completedAt) return true;
    if ((left.attempts ?? 0) > (right.attempts ?? 0)) return true;
  }
  return false;
}

export type LearnProgressRecord = {
  lessonId: string;
  status: 'ATTEMPTED' | 'COMPLETED';
  attempts: number;
  lastOk: boolean;
  lastReason: string | null;
  lastCode: string | null;
  completedAt: Date | string | null;
  updatedAt: Date | string;
};

export function recordsToProgressMap(rows: LearnProgressRecord[]): ProgressMap {
  const map: ProgressMap = {};
  for (const row of rows) {
    map[row.lessonId] = {
      completedAt: row.completedAt ? new Date(row.completedAt).toISOString() : '',
      attempts: row.attempts,
      lastOk: row.lastOk,
      lastReason: row.lastReason ?? undefined,
      lastCode: row.lastCode ?? undefined,
      updatedAt: new Date(row.updatedAt).toISOString(),
    };
  }
  return map;
}

export function parseLearnProgressBody(
  body: unknown,
  allowedIds: Set<string>,
): { ok: true; lessons: ProgressMap } | { ok: false; error: string; status: 400 | 422 } {
  if (!body || typeof body !== 'object' || !('lessons' in body)) {
    return { ok: false, error: 'Expected { lessons: { ... } }', status: 400 };
  }
  const rawLessons = (body as { lessons: unknown }).lessons;
  if (!rawLessons || typeof rawLessons !== 'object' || Array.isArray(rawLessons)) {
    return { ok: false, error: 'lessons must be an object', status: 400 };
  }
  const entries = Object.entries(rawLessons as Record<string, unknown>);
  if (entries.length === 0) {
    return { ok: false, error: 'lessons must not be empty', status: 422 };
  }
  const unknown = entries.map(([id]) => id).filter((id) => !allowedIds.has(id));
  if (unknown.length > 0) {
    return { ok: false, error: `Unknown lesson ids: ${unknown.join(', ')}`, status: 422 };
  }
  const map: ProgressMap = {};
  for (const [id, raw] of entries) {
    const parsed = parseLessonProgressValue(raw);
    if (!parsed) {
      return { ok: false, error: `Invalid progress for lesson ${id}`, status: 422 };
    }
    map[id] = parsed;
  }
  return { ok: true, lessons: map };
}

function parseLessonProgressValue(raw: unknown): LessonProgress | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.attempts !== 'number' || !Number.isFinite(o.attempts) || o.attempts < 0) return null;
  const completedAt = typeof o.completedAt === 'string' ? o.completedAt : '';
  return {
    completedAt,
    attempts: Math.floor(o.attempts),
    lastOk: typeof o.lastOk === 'boolean' ? o.lastOk : undefined,
    lastReason: typeof o.lastReason === 'string' ? o.lastReason.slice(0, 80) : undefined,
    lastCode: typeof o.lastCode === 'string' ? capCode(o.lastCode) : undefined,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
  };
}

export function progressMapToApiLessons(map: ProgressMap): Record<string, LessonProgress & { status: 'ATTEMPTED' | 'COMPLETED' }> {
  const out: Record<string, LessonProgress & { status: 'ATTEMPTED' | 'COMPLETED' }> = {};
  for (const [id, lesson] of Object.entries(map)) {
    out[id] = {
      ...lesson,
      status: isComplete(map, id) ? 'COMPLETED' : 'ATTEMPTED',
    };
  }
  return out;
}
