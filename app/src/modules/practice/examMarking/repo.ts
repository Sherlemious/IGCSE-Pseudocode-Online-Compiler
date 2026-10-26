import type { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';

/** ExamMarking rows (practice/examMarking/service.ts owns the rules). */

const RESULT_SELECT = { id: true, userId: true, total: true, result: true, createdAt: true } as const;

/** The latest marking of exactly this answer, by anyone. */
export function findMarkingByHash(questionId: string, codeHash: string) {
  return prisma.examMarking.findFirst({
    where: { questionId, codeHash },
    orderBy: { createdAt: 'desc' },
    select: RESULT_SELECT,
  });
}

/** Markings this user paid for (cached reuses excluded), optionally since a time. */
export function countUserMarkings(userId: string, since?: Date) {
  return prisma.examMarking.count({
    where: { userId, cached: false, ...(since ? { createdAt: { gte: since } } : {}) },
  });
}

export function countAllMarkingsSince(since: Date) {
  return prisma.examMarking.count({ where: { cached: false, createdAt: { gte: since } } });
}

/** Workers AI neurons spent since `since`: the free allowance is per UTC day for the whole account. */
export async function sumNeuronsSince(since: Date): Promise<number> {
  const total = await prisma.examMarking.aggregate({
    _sum: { neurons: true },
    where: { cached: false, createdAt: { gte: since } },
  });
  return total._sum.neurons ?? 0;
}

export function createMarking(data: {
  userId: string;
  questionId: string;
  codeHash: string;
  total: number;
  result: Prisma.InputJsonValue;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  neurons?: number;
  cached?: boolean;
}) {
  return prisma.examMarking.create({ data, select: RESULT_SELECT });
}
