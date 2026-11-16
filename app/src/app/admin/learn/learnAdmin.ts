import { buildLearnProgressView, type LearnLessonView } from '@/modules/learn/progressView';
import type { LearnProgressRecord } from '@/modules/learn/progress';
import type { LearnCourse } from '@/modules/learn/types';
import { reasonLabel, type LearnerRow } from './learnQuery';

export type LearnAdminRow = {
  userId: string;
  courseId: string;
  lessonId: string;
  status: LearnProgressRecord['status'];
  attempts: number;
  lastOk: boolean;
  lastReason: string | null;
  completedAt: Date | string | null;
  updatedAt: Date | string;
  name: string | null;
  email: string | null;
};

export type LevelStat = {
  levelNumber: number;
  levelName: string;
  free: boolean;
  reached: number;
  finished: number;
};

export type StuckLesson = {
  lessonId: string;
  title: string;
  levelNumber: number;
  started: number;
  completed: number;
  avgAttempts: number;
  reason: string | null;
};

export type LearnAdminCourse = {
  courseId: string;
  exam: string;
  paper: string;
  freeLevels: number;
  playableCount: number;
  learners: number;
  active7: number;
  activePrev7: number;
  activeDelta: number | null;
  lessonCompletions: number;
  pathFinished: number;
  medianPct: number;
  days: string[];
  activity: number[];
  levels: LevelStat[];
  stuckKind: 'dropoff' | 'retries' | 'none';
  stuck: StuckLesson[];
  roster: LearnerRow[];
};

const DAY = 24 * 60 * 60 * 1000;

function dayKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] ?? 0;
  return Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2);
}

type LessonAcc = {
  title: string;
  levelNumber: number;
  started: number;
  completed: number;
  attempts: number;
  reasons: Map<string, number>;
};

function topReason(reasons: Map<string, number>): string | null {
  let best: string | null = null;
  let count = 0;
  for (const [reason, n] of reasons) {
    if (n > count) {
      best = reason;
      count = n;
    }
  }
  return reasonLabel(best);
}

/**
 * Turn saved lesson rows into the paths dashboard.
 * `lastCode` is intentionally absent — opening one learner loads that separately.
 */
export function buildLearnAdminCourse(
  rows: LearnAdminRow[],
  course: LearnCourse,
  meta: { exam: string; paper: string; freeLevels: number },
  now: Date,
): LearnAdminCourse {
  const mine = rows.filter((row) => row.courseId === course.id);
  const byUser = new Map<string, { name: string | null; email: string | null; records: LearnProgressRecord[] }>();
  for (const row of mine) {
    let bucket = byUser.get(row.userId);
    if (!bucket) {
      bucket = { name: row.name, email: row.email, records: [] };
      byUser.set(row.userId, bucket);
    }
    bucket.records.push({
      lessonId: row.lessonId,
      status: row.status,
      attempts: row.attempts,
      lastOk: row.lastOk,
      lastReason: row.lastReason,
      lastCode: null,
      completedAt: row.completedAt,
      updatedAt: row.updatedAt,
    });
  }

  const people = [...byUser.entries()].map(([userId, info]) => ({
    userId,
    name: info.name,
    email: info.email,
    view: buildLearnProgressView(info.records, course),
  }));

  const d7 = now.getTime() - 7 * DAY;
  const d14 = now.getTime() - 14 * DAY;
  let active7 = 0;
  let activePrev7 = 0;
  let lessonCompletions = 0;
  let pathFinished = 0;
  const pcts: number[] = [];
  const lessonAcc = new Map<string, LessonAcc>();
  const roster: LearnerRow[] = [];

  for (const person of people) {
    const { view } = person;
    lessonCompletions += view.completedCount;
    pcts.push(view.playableCount === 0 ? 0 : Math.round((view.completedCount / view.playableCount) * 100));
    if (view.playableCount > 0 && view.completedCount === view.playableCount) pathFinished += 1;
    const last = view.lastActivityAt ? new Date(view.lastActivityAt).getTime() : 0;
    if (last >= d7) active7 += 1;
    else if (last >= d14 && last < d7) activePrev7 += 1;

    const furthest = [...view.lessons].reverse().find((lesson) => lesson.state !== 'not_started');
    let stuck: LearnLessonView | null = null;
    for (const lesson of view.lessons) {
      if (lesson.state === 'not_started') continue;
      const acc = lessonAcc.get(lesson.lessonId) ?? {
        title: lesson.title,
        levelNumber: lesson.levelNumber,
        started: 0,
        completed: 0,
        attempts: 0,
        reasons: new Map<string, number>(),
      };
      acc.started += 1;
      acc.attempts += lesson.attempts;
      if (lesson.state === 'completed') acc.completed += 1;
      else {
        const label = lesson.lastReason;
        if (label && label !== 'passed') acc.reasons.set(label, (acc.reasons.get(label) ?? 0) + 1);
        if (!stuck || (lesson.updatedAt ?? '') > (stuck.updatedAt ?? '')) stuck = lesson;
      }
      lessonAcc.set(lesson.lessonId, acc);
    }

    roster.push({
      userId: person.userId,
      name: person.name,
      email: person.email,
      completed: view.completedCount,
      attempted: view.attemptedCount,
      playable: view.playableCount,
      lastActivityAt: view.lastActivityAt,
      furthest: furthest ? `${furthest.lessonId} ${furthest.title}` : null,
      stuckReason: reasonLabel(stuck?.lastReason),
    });
  }

  roster.sort((a, b) => (b.lastActivityAt ?? '').localeCompare(a.lastActivityAt ?? ''));

  const days: string[] = [];
  for (let i = 29; i >= 0; i--) days.push(dayKey(new Date(now.getTime() - i * DAY)));
  const dayUsers = new Map(days.map((day) => [day, new Set<string>()]));
  for (const row of mine) {
    dayUsers.get(dayKey(new Date(row.updatedAt)))?.add(row.userId);
  }

  const levels: LevelStat[] = course.levels
    .filter((level) => level.lessons.some((lesson) => lesson.playable))
    .map((level) => {
      let reached = 0;
      let finished = 0;
      for (const person of people) {
        const inLevel = person.view.lessons.filter((lesson) => lesson.levelNumber === level.number);
        if (inLevel.length === 0) continue;
        if (inLevel.some((lesson) => lesson.state !== 'not_started')) reached += 1;
        if (inLevel.every((lesson) => lesson.state === 'completed')) finished += 1;
      }
      return {
        levelNumber: level.number,
        levelName: level.name,
        free: level.free,
        reached,
        finished,
      };
    });

  const minStarted = people.length >= 8 ? 3 : 1;
  const ranked = [...lessonAcc.entries()]
    .filter(([, acc]) => acc.started >= minStarted)
    .map(([lessonId, acc]) => ({
      lessonId,
      title: acc.title,
      levelNumber: acc.levelNumber,
      started: acc.started,
      completed: acc.completed,
      avgAttempts: acc.started === 0 ? 0 : Math.round((acc.attempts / acc.started) * 10) / 10,
      reason: topReason(acc.reasons),
    }));

  const dropoff = ranked
    .filter((lesson) => lesson.completed < lesson.started)
    .sort((a, b) => {
      const rateA = a.completed / a.started;
      const rateB = b.completed / b.started;
      if (rateA !== rateB) return rateA - rateB;
      return b.avgAttempts - a.avgAttempts;
    });

  const stuckKind = dropoff.length > 0 ? 'dropoff' : ranked.length > 0 ? 'retries' : 'none';
  const stuck = (dropoff.length > 0 ? dropoff : [...ranked].sort((a, b) => b.avgAttempts - a.avgAttempts)).slice(0, 6);

  const playableCount = people[0]?.view.playableCount
    ?? course.levels.reduce((sum, level) => sum + level.lessons.filter((lesson) => lesson.playable).length, 0);

  return {
    courseId: course.id,
    exam: meta.exam,
    paper: meta.paper,
    freeLevels: meta.freeLevels,
    playableCount,
    learners: people.length,
    active7,
    activePrev7,
    activeDelta: activePrev7 === 0 ? null : Math.round(((active7 - activePrev7) / activePrev7) * 100),
    lessonCompletions,
    pathFinished,
    medianPct: median(pcts),
    days,
    activity: days.map((day) => dayUsers.get(day)?.size ?? 0),
    levels,
    stuckKind,
    stuck,
    roster,
  };
}
