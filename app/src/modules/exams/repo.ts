import type { Difficulty, ExamStatus } from '@prisma/client';
import { prisma, type Db } from '@/shared/db';

/**
 * Exam data access: shared exam definitions (Exam/ExamQuestion) and the
 * attempts students take (ExamAttempt/ExamAnswer). Rules live in
 * definitions.ts and attempts.ts.
 */

// ── Definitions ────────────────────────────────────────────────────────────

export function findOwnedExam(examId: string, ownerId: string) {
  return prisma.exam.findFirst({ where: { id: examId, ownerId }, select: { id: true } });
}

export function findOwnedExamForClone(examId: string, ownerId: string) {
  return prisma.exam.findFirst({
    where: { id: examId, ownerId },
    select: {
      title: true,
      description: true,
      timeLimitMin: true,
      questions: { orderBy: { sortOrder: 'asc' }, select: { questionId: true } },
    },
  });
}

export function createExam(data: {
  ownerId: string;
  title: string;
  description: string | null;
  timeLimitMin: number;
  shareCode: string;
  questionIds: string[];
}) {
  return prisma.exam.create({
    data: {
      ownerId: data.ownerId,
      title: data.title,
      description: data.description,
      timeLimitMin: data.timeLimitMin,
      shareCode: data.shareCode,
      questions: { create: data.questionIds.map((questionId, sortOrder) => ({ questionId, sortOrder })) },
    },
    select: { id: true, shareCode: true },
  });
}

/** Updates fields and, when given, replaces the whole question set, atomically. */
export function updateExam(
  examId: string,
  data: { title?: string; description?: string | null; timeLimitMin?: number; isPublished?: boolean },
  questionIds: string[] | null,
) {
  return prisma.$transaction(async (tx) => {
    if (Object.keys(data).length > 0) await tx.exam.update({ where: { id: examId }, data });
    if (questionIds) {
      await tx.examQuestion.deleteMany({ where: { examId } });
      await tx.examQuestion.createMany({
        data: questionIds.map((questionId, sortOrder) => ({ examId, questionId, sortOrder })),
      });
    }
  });
}

/** ExamQuestion links cascade; ExamAttempt.examId is set null so results survive. */
export function deleteExam(examId: string) {
  return prisma.exam.delete({ where: { id: examId } });
}

export function findExamForStart(examId: string) {
  return prisma.exam.findUnique({
    where: { id: examId },
    select: {
      id: true,
      isPublished: true,
      timeLimitMin: true,
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: { questionId: true, question: { select: { isPremium: true } } },
      },
    },
  });
}

// ── Attempts ───────────────────────────────────────────────────────────────

export function findInProgressAttempt(userId: string, examId: string) {
  return prisma.examAttempt.findFirst({
    where: { userId, examId, status: 'IN_PROGRESS' },
    select: { id: true },
  });
}

export function createAttempt(data: {
  userId: string;
  examId?: string;
  topic?: string | null;
  difficulty?: Difficulty | null;
  timeLimitMin: number;
  questionIds: string[];
}) {
  return prisma.examAttempt.create({
    data: {
      userId: data.userId,
      examId: data.examId,
      topic: data.topic ?? null,
      difficulty: data.difficulty ?? null,
      questionCount: data.questionIds.length,
      timeLimitMin: data.timeLimitMin,
      answers: { create: data.questionIds.map((questionId, sortOrder) => ({ questionId, sortOrder })) },
    },
    select: { id: true },
  });
}

/** Locks the attempt row when `userId` owns it; false when it is missing or someone else's. */
export async function lockOwnedAttempt(examId: string, userId: string, db: Db): Promise<boolean> {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "ExamAttempt"
    WHERE "id" = ${examId} AND "userId" = ${userId}
    FOR UPDATE
  `;
  return rows.length > 0;
}

export function getAttempt(examId: string, db: Db) {
  return db.examAttempt.findUniqueOrThrow({ where: { id: examId } });
}

export function findAnswer(examId: string, questionId: string, db: Db) {
  return db.examAnswer.findUnique({
    where: { examAttemptId_questionId: { examAttemptId: examId, questionId } },
  });
}

export function updateAnswer(
  answerId: string,
  data: { code?: string; graded: boolean; passCount: number; totalTests: number; updatedAt: Date },
  db: Db,
) {
  return db.examAnswer.update({ where: { id: answerId }, data });
}

export function listAnswerScores(examId: string, db: Db) {
  return db.examAnswer.findMany({
    where: { examAttemptId: examId },
    select: { graded: true, passCount: true, totalTests: true },
  });
}

export function completeAttempt(
  examId: string,
  data: { status: ExamStatus; score: number; totalTests: number; completedAt: Date },
  db: Db,
) {
  return db.examAttempt.update({ where: { id: examId }, data });
}
