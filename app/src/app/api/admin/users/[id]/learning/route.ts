import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { isAdmin } from '@/modules/admin/isAdmin';
import { COURSE_ID } from '@/modules/learn/types';
import { buildLearnProgressView } from '@/modules/learn/progressView';
import type { LearnProgressRecord } from '@/modules/learn/progress';
import { getQuestionCatalog } from '@/shared/lib/catalogCache';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(session.user.email, session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  const [learnRows, practiceRows, solvedCount, attemptedCount, examRows, catalog] = await Promise.all([
    prisma.learnProgress.findMany({
      where: { userId: id, courseId: COURSE_ID },
      select: {
        lessonId: true,
        status: true,
        attempts: true,
        lastOk: true,
        lastReason: true,
        completedAt: true,
        updatedAt: true,
      },
    }),
    prisma.progress.findMany({
      where: { userId: id },
      orderBy: { updatedAt: 'desc' },
      take: 8,
      select: {
        questionId: true,
        status: true,
        bestScore: true,
        totalTests: true,
        attempts: true,
        updatedAt: true,
      },
    }),
    prisma.progress.count({ where: { userId: id, status: 'SOLVED' } }),
    prisma.progress.count({ where: { userId: id } }),
    prisma.examAttempt.findMany({
      where: { userId: id },
      orderBy: { startedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        status: true,
        score: true,
        totalTests: true,
        topic: true,
        questionCount: true,
        startedAt: true,
        completedAt: true,
      },
    }),
    getQuestionCatalog(),
  ]);

  const records: LearnProgressRecord[] = learnRows.map((row) => ({
    lessonId: row.lessonId,
    status: row.status,
    attempts: row.attempts,
    lastOk: row.lastOk,
    lastReason: row.lastReason,
    lastCode: null,
    completedAt: row.completedAt,
    updatedAt: row.updatedAt,
  }));

  const titles = new Map(catalog.map((q) => [q.id, q.title]));
  const learn = buildLearnProgressView(records);

  return NextResponse.json({
    learn: {
      playableCount: learn.playableCount,
      completedCount: learn.completedCount,
      attemptedCount: learn.attemptedCount,
      notStartedCount: learn.notStartedCount,
      lastActivityAt: learn.lastActivityAt,
      lessons: learn.lessons.map((lesson) => ({
        lessonId: lesson.lessonId,
        title: lesson.title,
        levelNumber: lesson.levelNumber,
        levelName: lesson.levelName,
        levelSlug: lesson.levelSlug,
        state: lesson.state,
        attempts: lesson.attempts,
      })),
    },
    practice: {
      solved: solvedCount,
      attempted: attemptedCount,
      recent: practiceRows.map((row) => ({
        questionId: row.questionId,
        title: titles.get(row.questionId) ?? row.questionId,
        status: row.status,
        bestScore: row.bestScore,
        totalTests: row.totalTests,
        attempts: row.attempts,
        updatedAt: row.updatedAt,
      })),
    },
    exams: examRows.map((exam) => ({
      id: exam.id,
      status: exam.status,
      score: exam.score,
      totalTests: exam.totalTests,
      topic: exam.topic,
      questionCount: exam.questionCount,
      startedAt: exam.startedAt,
      completedAt: exam.completedAt,
    })),
  });
}
