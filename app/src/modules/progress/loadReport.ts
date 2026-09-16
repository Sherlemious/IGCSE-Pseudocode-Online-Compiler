import type { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';
import { buildProgressReport, type ProgressReportData, type ProgressVoice } from './report';

export async function loadProgressReport(
  userId: string,
  options?: {
    examFilter?: Prisma.ExamAttemptWhereInput;
    voice?: ProgressVoice;
  },
): Promise<ProgressReportData> {
  const examWhere: Prisma.ExamAttemptWhereInput = options?.examFilter
    ? { AND: [{ userId }, options.examFilter] }
    : { userId };

  const [progressData, examData, totalQuestions] = await Promise.all([
    prisma.progress.findMany({
      where: { userId },
      select: {
        status: true,
        bestScore: true,
        totalTests: true,
        attempts: true,
        updatedAt: true,
        question: { select: { difficulty: true, topic: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.examAttempt.findMany({
      where: examWhere,
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        topic: true,
        difficulty: true,
        questionCount: true,
        timeLimitMin: true,
        status: true,
        score: true,
        totalTests: true,
        startedAt: true,
        completedAt: true,
      },
    }),
    prisma.question.count(),
  ]);

  return buildProgressReport(progressData, examData, totalQuestions, { voice: options?.voice });
}
