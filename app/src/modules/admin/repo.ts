import { prisma } from '@/shared/db';

/** Read-only admin queries. */

/** Everything the admin user drawer shows about one student's learning. */
export async function loadUserLearningRows(userId: string) {
  const [learnRows, recentPractice, solvedCount, attemptedCount, exams] = await Promise.all([
    prisma.learnProgress.findMany({
      where: { userId },
      select: {
        courseId: true,
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
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 8,
      select: { questionId: true, status: true, bestScore: true, totalTests: true, attempts: true, updatedAt: true },
    }),
    prisma.progress.count({ where: { userId, status: 'SOLVED' } }),
    prisma.progress.count({ where: { userId } }),
    prisma.examAttempt.findMany({
      where: { userId },
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
  ]);
  return { learnRows, recentPractice, solvedCount, attemptedCount, exams };
}
