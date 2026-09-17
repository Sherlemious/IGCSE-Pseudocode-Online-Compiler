import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { rateLimit } from '@/shared/lib/rateLimit';
import { resolveLearnPremiumAccess } from '@/modules/learn/access';
import { IGCSE_PAPER_2 } from '@/modules/learn/curriculum';
import { paidPlayableLessonIds, playableLessonIdSet } from '@/modules/learn/path';
import {
  COURSE_ID,
} from '@/modules/learn/types';
import {
  mergeProgress,
  parseLearnProgressBody,
  progressMapToApiLessons,
  recordsToProgressMap,
  type LearnProgressRecord,
} from '@/modules/learn/progress';

const PUT_RATE_LIMIT = 40;
const PUT_RATE_WINDOW_MS = 60_000;
const ALLOWED_LESSON_IDS = playableLessonIdSet(IGCSE_PAPER_2);
const PAID_LESSON_IDS = paidPlayableLessonIds(IGCSE_PAPER_2);

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

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [rows, premiumAccess] = await Promise.all([
    prisma.learnProgress.findMany({
      where: { userId: session.user.id, courseId: COURSE_ID },
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

  const parsed = parseLearnProgressBody(body, ALLOWED_LESSON_IDS);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const paidIds = Object.keys(parsed.lessons).filter((id) => PAID_LESSON_IDS.has(id));
  if (paidIds.length > 0 && !(await resolveLearnPremiumAccess(session.user))) {
    return NextResponse.json(
      {
        error: 'Levels 4–10 need a Student or teacher plan.',
        code: 'PREMIUM_REQUIRED',
      },
      { status: 403 },
    );
  }

  const userId = session.user.id;
  const lessonIds = Object.keys(parsed.lessons);
  const existing = await prisma.learnProgress.findMany({
    where: { userId, courseId: COURSE_ID, lessonId: { in: lessonIds } },
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
        where: { userId_courseId_lessonId: { userId, courseId: COURSE_ID, lessonId } },
        create: {
          userId,
          courseId: COURSE_ID,
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
