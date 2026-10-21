import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';
import { ownedQuestionWriteData } from './access';
import type { QuestionDraft } from './parseInput';

const AUTHOR_SELECT = {
  role: true,
  plan: true,
  planTier: true,
  trialEndsAt: true,
  planExpiresAt: true,
  legacyCapacity: true,
} as const;

export function findAuthor(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: AUTHOR_SELECT });
}

export async function listOwned(userId: string) {
  return prisma.question.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      difficulty: true,
      topic: true,
      updatedAt: true,
      _count: { select: { testCases: true } },
    },
  });
}

export function findOwned(userId: string, id: string) {
  return prisma.question.findFirst({
    where: { id, ownerId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      topic: true,
      starterCode: true,
      solution: true,
      testCases: {
        orderBy: { sortOrder: 'asc' },
        select: { inputs: true, expectedOutput: true, isHidden: true },
      },
    },
  });
}

export function createOwnedQuestion(userId: string, draft: QuestionDraft) {
  return prisma.question.create({
    data: { ownerId: userId, ...ownedQuestionWriteData(draft), flowchart: Prisma.DbNull },
    select: { id: true },
  });
}

export async function updateOwnedQuestion(userId: string, id: string, draft: QuestionDraft): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const owned = await tx.question.findFirst({ where: { id, ownerId: userId }, select: { id: true } });
    if (!owned) return false;
    await tx.testCase.deleteMany({ where: { questionId: id } });
    await tx.question.update({ where: { id }, data: { ...ownedQuestionWriteData(draft), flowchart: Prisma.DbNull } });
    return true;
  });
}

export function deleteOwnedQuestion(id: string) {
  return prisma.question.delete({ where: { id } });
}

/** This teacher's CODE questions among `ids`, for adding to an exam. */
export async function findOwnedCodeQuestionIds(ownerId: string, ids: string[]): Promise<string[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.question.findMany({
    where: { ownerId, id: { in: ids }, answerFormat: 'CODE' },
    select: { id: true },
  });
  return rows.map((row) => row.id);
}

/**
 * Hidden tests included. Direct read, not the catalog cache.
 * Caller must already know this question is on the viewer's exam attempt.
 */
export function findOwnedGradeQuestion(id: string) {
  return prisma.question.findFirst({
    where: { id, ownerId: { not: null }, answerFormat: 'CODE' },
    select: {
      id: true,
      testCases: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          inputs: true,
          expectedOutput: true,
          isHidden: true,
          description: true,
          initialFiles: true,
        },
      },
    },
  });
}

/** Owned questions for an attempt the caller already authorised. Solution is not selected. */
export function findOwnedAttemptQuestions(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return prisma.question.findMany({
    where: { id: { in: ids }, ownerId: { not: null } },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      starterCode: true,
      testCases: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          inputs: true,
          expectedOutput: true,
          isHidden: true,
          description: true,
        },
      },
    },
  });
}

export function findOwnedLabels(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return prisma.question.findMany({
    where: { id: { in: ids }, ownerId: { not: null } },
    select: { id: true, title: true, difficulty: true, topic: true },
  });
}
