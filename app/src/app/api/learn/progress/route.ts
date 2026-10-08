import { badRequest, forbidden, HttpError } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { resolveLearnPremiumAccess } from '@/modules/learn/access';
import { courseById } from '@/modules/learn/curriculum';
import { paidPlayableLessonIds, playableLessonIdSet } from '@/modules/learn/path';
import { COURSE_ID } from '@/modules/learn/types';
import {
  mergeProgress,
  parseLearnProgressBody,
  progressMapToApiLessons,
  recordsToProgressMap,
} from '@/modules/learn/progress';
import { listLessonProgress, saveLessonProgress } from '@/modules/learn/repo';

function completedAtDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export const GET = route(async (req) => {
  const user = await requireUser();
  const course = courseById(new URL(req.url).searchParams.get('course') ?? COURSE_ID);
  if (!course) throw badRequest('Unknown course');

  const [rows, premiumAccess] = await Promise.all([
    listLessonProgress(user.id, course.id),
    resolveLearnPremiumAccess(user),
  ]);
  return { lessons: progressMapToApiLessons(recordsToProgressMap(rows)), premiumAccess };
});

export const PUT = route(async (req) => {
  const user = await requireUser();
  enforceRateLimit(`learn-progress:${user.id}`, { limit: 40, windowMs: 60_000 },
    (s) => `Saving too fast. Please wait ${s}s.`);
  const body = await readJson(req, 'Invalid JSON');

  const courseId = body.courseId === undefined ? COURSE_ID : body.courseId;
  const course = typeof courseId === 'string' ? courseById(courseId) : null;
  if (!course) throw badRequest('Unknown course');

  const parsed = parseLearnProgressBody(body, playableLessonIdSet(course));
  if (!parsed.ok) throw new HttpError(parsed.status, parsed.error);

  const paid = paidPlayableLessonIds(course);
  if (Object.keys(parsed.lessons).some((id) => paid.has(id)) && !(await resolveLearnPremiumAccess(user))) {
    throw forbidden('Paid levels need a Student or teacher plan.', 'PREMIUM_REQUIRED');
  }

  const existing = await listLessonProgress(user.id, course.id, Object.keys(parsed.lessons));
  const merged = mergeProgress(recordsToProgressMap(existing), parsed.lessons);

  await saveLessonProgress(user.id, course.id, Object.entries(merged).map(([lessonId, lesson]) => {
    const completed = Boolean(lesson.completedAt);
    return {
      lessonId,
      status: completed ? 'COMPLETED' : 'ATTEMPTED',
      attempts: lesson.attempts,
      lastOk: lesson.lastOk ?? completed,
      lastReason: lesson.lastReason ?? null,
      lastCode: lesson.lastCode ?? null,
      completedAt: completedAtDate(lesson.completedAt),
    };
  }));

  return { ok: true, lessons: progressMapToApiLessons(merged) };
});
