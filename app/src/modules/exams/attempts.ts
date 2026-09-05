import { Prisma, type ExamAttempt } from '@prisma/client';
import { prisma } from '@/shared/db';
import { gradeSubmission } from '@/modules/practice/autograder';

export class ExamRequestError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
  }
}

export interface AnswerSubmission {
  questionId: string;
  code: string;
}

export function examDeadline(exam: Pick<ExamAttempt, 'startedAt' | 'timeLimitMin'>): number {
  return exam.startedAt.getTime() + exam.timeLimitMin * 60_000;
}

function requireActive(exam: ExamAttempt, now: Date): void {
  if (exam.status !== 'IN_PROGRESS') {
    throw new ExamRequestError(409, 'EXAM_COMPLETED', 'This exam has already been submitted.');
  }
  if (now.getTime() >= examDeadline(exam)) {
    throw new ExamRequestError(409, 'EXAM_EXPIRED', 'Time is up. Submit the exam to view your results.');
  }
}

/**
 * Save, grade commits, and submit all lock the same parent row. Read Committed
 * ensures a request waiting for that lock sees the preceding request's changes.
 * Only database work happens under the lock; interpretation runs outside it.
 */
function withAttempt<T>(
  examId: string,
  userId: string,
  work: (tx: Prisma.TransactionClient, exam: ExamAttempt, now: Date) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    const owned = await tx.$queryRaw<{ id: string }[]>`
      SELECT "id" FROM "ExamAttempt"
      WHERE "id" = ${examId} AND "userId" = ${userId}
      FOR UPDATE
    `;
    if (owned.length === 0) {
      throw new ExamRequestError(404, 'EXAM_NOT_FOUND', 'Exam not found.');
    }
    const exam = await tx.examAttempt.findUniqueOrThrow({ where: { id: examId } });
    return work(tx, exam, new Date());
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}

async function findAnswer(tx: Prisma.TransactionClient, examId: string, questionId: string) {
  const answer = await tx.examAnswer.findUnique({
    where: { examAttemptId_questionId: { examAttemptId: examId, questionId } },
  });
  if (!answer) {
    throw new ExamRequestError(404, 'QUESTION_NOT_IN_EXAM', 'This question is not part of the exam.');
  }
  return answer;
}

// Use the existing timestamp as a monotonically increasing answer revision,
// including two changes in the same millisecond. No schema migration is needed.
function nextRevision(previous: Date, now: Date): Date {
  return new Date(Math.max(now.getTime(), previous.getTime() + 1));
}

export function saveExamAnswer(examId: string, userId: string, submission: AnswerSubmission) {
  return withAttempt(examId, userId, async (tx, exam, now) => {
    requireActive(exam, now);
    const answer = await findAnswer(tx, examId, submission.questionId);
    if (answer.code !== submission.code) {
      await tx.examAnswer.update({
        where: { id: answer.id },
        data: {
          code: submission.code, graded: false, passCount: 0, totalTests: 0,
          updatedAt: nextRevision(answer.updatedAt, now),
        },
      });
    }
    return { ok: true };
  });
}

export async function gradeExamAnswer(examId: string, userId: string, submission: AnswerSubmission) {
  const prepared = await withAttempt(examId, userId, async (tx, exam, now) => {
    requireActive(exam, now);
    const answer = await findAnswer(tx, examId, submission.questionId);
    if (answer.code !== submission.code) {
      throw new ExamRequestError(409, 'ANSWER_CHANGED', 'Save the current answer before checking it.');
    }
    const revision = nextRevision(answer.updatedAt, now);
    // Claim this grading attempt before execution. A newer save/check supersedes it.
    await tx.examAnswer.update({
      where: { id: answer.id },
      data: { graded: false, passCount: 0, totalTests: 0, updatedAt: revision },
    });
    const testCases = await tx.testCase.findMany({
      where: { questionId: submission.questionId }, orderBy: { sortOrder: 'asc' },
    });
    return { revision, testCases };
  });

  const results = await Promise.allSettled(prepared.testCases.map((test) =>
    gradeSubmission(submission.code, test.inputs, test.expectedOutput, test.initialFiles),
  ));
  const passCount = results.filter((result) => result.status === 'fulfilled' && result.value.passed).length;

  return withAttempt(examId, userId, async (tx, exam, now) => {
    requireActive(exam, now);
    const answer = await findAnswer(tx, examId, submission.questionId);
    if (answer.updatedAt.getTime() !== prepared.revision.getTime() || answer.code !== submission.code) {
      throw new ExamRequestError(409, 'ANSWER_CHANGED', 'The answer changed while it was being checked. Check it again.');
    }
    await tx.examAnswer.update({
      where: { id: answer.id },
      data: { passCount, totalTests: prepared.testCases.length, graded: true, updatedAt: nextRevision(answer.updatedAt, now) },
    });
    return {
      passCount,
      totalTests: prepared.testCases.length,
      results: results.map((result, i) => ({
        passed: result.status === 'fulfilled' && result.value.passed,
        isHidden: prepared.testCases[i].isHidden,
        description: prepared.testCases[i].isHidden ? undefined : prepared.testCases[i].description,
        error: result.status === 'fulfilled' ? result.value.error : undefined,
      })),
    };
  });
}

export function submitExamAttempt(examId: string, userId: string) {
  return withAttempt(examId, userId, async (tx, exam, now) => {
    // Repeated submit requests return the stored result without recomputing it.
    if (exam.status !== 'IN_PROGRESS') {
      return { score: exam.score, totalTests: exam.totalTests, timedOut: exam.status === 'TIMED_OUT' };
    }
    const answers = await tx.examAnswer.findMany({
      where: { examAttemptId: examId }, select: { graded: true, passCount: true, totalTests: true },
    });
    const score = answers.filter((answer) => answer.graded && answer.totalTests > 0 && answer.passCount === answer.totalTests).length;
    const timedOut = now.getTime() >= examDeadline(exam);
    await tx.examAttempt.update({
      where: { id: examId },
      data: { status: timedOut ? 'TIMED_OUT' : 'COMPLETED', score, totalTests: answers.length, completedAt: now },
    });
    return { score, totalTests: answers.length, timedOut };
  });
}
