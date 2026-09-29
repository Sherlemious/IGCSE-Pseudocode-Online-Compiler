import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { rateLimit } from '@/shared/lib/rateLimit';
import { resolveLearnPremiumAccess } from '@/modules/learn/access';
import { courseById } from '@/modules/learn/curriculum';
import { paidPlayableLessonIds, playableLessonIdSet } from '@/modules/learn/path';
import { COURSE_ID, type LearnCourse } from '@/modules/learn/types';
import {
  mergeProgress,
  parseLearnProgressBody,
  progressMapToApiLessons,
  recordsToProgressMap,
  type LearnProgressRecord,
} from '@/modules/learn/progress';

const PUT_RATE_LIMIT = 40;
const PUT_RATE_WINDOW_MS = 60_000;

function allowedIds(course: LearnCourse): Set<string> {
  return playableLessonIdSet(course);
}

function paidIds(course: LearnCourse): Set<string> {
  return paidPlayableLessonIds(course);
}

function courseFromRequest(req: Request | undefined): LearnCourse | null {
  const requested = req ? new URL(req.url).searchParams.get('course') : null;
  return courseById(requested ?? COURSE_ID);
}

function courseIdFromBody(body: unknown): string | null {
  if (!body || typeof body !== 'object' || !('courseId' in body)) return COURSE_ID;
  const id = (body as { courseId: unknown }).courseId;
  return typeof id === 'string' ? id : null;
}

const ROW_SELECT = {
  lessonId: true,
  status: true,
  attempts: true,
  lastOk: true,
  lastReason: true,
  lastCode: true,
  completedAt: true,
  updatedAt: true,
} as const;

function completedAtDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function GET(req?: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const course = courseFromRequest(req);
  if (!course) {
    return NextResponse.json({ error: 'Unknown course' }, { status: 400 });
  }

  const [rows, premiumAccess] = await Promise.all([
    prisma.learnProgress.findMany({
      where: { userId: session.user.id, courseId: course.id },
      select: ROW_SELECT,
    }),
    resolveLearnPremiumAccess(session.user),
  ]);

  return NextResponse.json({
    lessons: progressMapToApiLessons(recordsToProgressMap(rows as LearnProgressRecord[])),
    premiumAccess,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const limit = rateLimit(`learn-progress:${session.user.id}`, {
    limit: PUT_RATE_LIMIT,
    windowMs: PUT_RATE_WINDOW_MS,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Saving too fast. Please wait ${limit.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const requestedId = courseIdFromBody(body);
  const course = requestedId ? courseById(requestedId) : null;
  if (!course) {
    return NextResponse.json({ error: 'Unknown course' }, { status: 400 });
  }

  const parsed = parseLearnProgressBody(body, allowedIds(course));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const blocked = Object.keys(parsed.lessons).filter((id) => paidIds(course).has(id));
  if (blocked.length > 0 && !(await resolveLearnPremiumAccess(session.user))) {
    return NextResponse.json(
      {
        error: 'Paid levels need a Student or teacher plan.',
        code: 'PREMIUM_REQUIRED',
      },
      { status: 403 },
    );
  }

  const userId = session.user.id;
  const lessonIds = Object.keys(parsed.lessons);
  const existing = await prisma.learnProgress.findMany({
    where: { userId, courseId: course.id, lessonId: { in: lessonIds } },
    select: ROW_SELECT,
  });
  const merged = mergeProgress(recordsToProgressMap(existing as LearnProgressRecord[]), parsed.lessons);

  await prisma.$transaction(
    Object.entries(merged).map(([lessonId, lesson]) => {
      const completed = Boolean(lesson.completedAt);
      const completedAt = completedAtDate(lesson.completedAt);
      const status = completed ? 'COMPLETED' : 'ATTEMPTED';
      const lastOk = lesson.lastOk ?? completed;
      return prisma.learnProgress.upsert({
        where: { userId_courseId_lessonId: { userId, courseId: course.id, lessonId } },
        create: {
          userId,
          courseId: course.id,
          lessonId,
          status,
          attempts: lesson.attempts,
          lastOk,
          lastReason: lesson.lastReason ?? null,
          lastCode: lesson.lastCode ?? null,
          completedAt,
        },
        update: {
          status,
          attempts: lesson.attempts,
          lastOk,
          lastReason: lesson.lastReason ?? null,
          lastCode: lesson.lastCode ?? null,
          completedAt,
        },
      });
    }),
  );

  return NextResponse.json({
    ok: true,
    lessons: progressMapToApiLessons(merged),
  });
}
