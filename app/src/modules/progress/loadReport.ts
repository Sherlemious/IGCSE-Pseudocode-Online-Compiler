import type { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';
import { getQuestionCatalog, getQuestionCount } from '@/shared/lib/catalogCache';
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

  const [progressRows, examData, catalog, totalQuestions] = await Promise.all([
    prisma.progress.findMany({
      where: { userId },
      select: {
        status: true,
        bestScore: true,
        totalTests: true,
        attempts: true,
        updatedAt: true,
        questionId: true,
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
    getQuestionCatalog(),
    getQuestionCount(),
  ]);

  const catalogById = new Map(catalog.map((question) => [question.id, question]));
  const progressData = progressRows.flatMap((row) => {
    const question = catalogById.get(row.questionId);
    if (!question) return [];
    return [{
      status: row.status,
      bestScore: row.bestScore,
      totalTests: row.totalTests,
      attempts: row.attempts,
      updatedAt: row.updatedAt,
      question: { difficulty: question.difficulty, topic: question.topic, title: question.title },
    }];
  });

  return buildProgressReport(progressData, examData, totalQuestions, { voice: options?.voice });
}
