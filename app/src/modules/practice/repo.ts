import type { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';

/** Practice progress (one row per user per question). */

export function listProgress(userId: string) {
  return prisma.progress.findMany({
    where: { userId },
    select: { questionId: true, status: true, bestScore: true, totalTests: true, updatedAt: true },
  });
}

export function findProgress(userId: string, questionId: string) {
  return prisma.progress.findUnique({
    where: { userId_questionId: { userId, questionId } },
    select: { lastCode: true, lastFlowchart: true, status: true, attempts: true },
  });
}

/**
 * Records one graded attempt: status only ever upgrades to SOLVED, attempts
 * count up, the latest code is kept, and bestScore only rises.
 */
export async function recordGradedAttempt(
  userId: string,
  questionId: string,
  result: { passCount: number; totalCount: number; code: string; flowchart: Prisma.InputJsonValue | null },
) {
  const allPassed = result.passCount === result.totalCount;
  const flowchart = result.flowchart ? { lastFlowchart: result.flowchart } : {};
  await prisma.progress.upsert({
    where: { userId_questionId: { userId, questionId } },
    create: {
      userId,
      questionId,
      status: allPassed ? 'SOLVED' : 'ATTEMPTED',
      bestScore: result.passCount,
      totalTests: result.totalCount,
      attempts: 1,
      lastCode: result.code,
      ...flowchart,
    },
    update: {
      status: allPassed ? 'SOLVED' : undefined, // only upgrade, never downgrade
      totalTests: result.totalCount,
      attempts: { increment: 1 },
      lastCode: result.code,
      ...flowchart,
    },
  });
  await prisma.progress.updateMany({
    where: { userId, questionId, bestScore: { lt: result.passCount } },
    data: { bestScore: result.passCount },
  });
}
