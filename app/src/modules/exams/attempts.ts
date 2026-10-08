import { Prisma, type ExamAttempt } from '@prisma/client';
import { prisma, type Db } from '@/shared/db';
import { HttpError } from '@/shared/http/errors';
import { gradeTestCases } from '@/modules/practice/autograder';
import { getQuestionForGrade } from '@/shared/lib/catalogCache';
import * as repo from './repo';

/** An exam-attempt failure with its HTTP status and machine-readable code. */
export class ExamRequestError extends HttpError {
  declare readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(status, message, code);
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
  work: (tx: Db, exam: ExamAttempt, now: Date) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    if (!(await repo.lockOwnedAttempt(examId, userId, tx))) {
      throw new ExamRequestError(404, 'EXAM_NOT_FOUND', 'Exam not found.');
    }
    const exam = await repo.getAttempt(examId, tx);
    return work(tx, exam, new Date());
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}

async function findAnswer(tx: Db, examId: string, questionId: string) {
  const answer = await repo.findAnswer(examId, questionId, tx);
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
      await repo.updateAnswer(answer.id, {
        code: submission.code, graded: false, passCount: 0, totalTests: 0,
        updatedAt: nextRevision(answer.updatedAt, now),
      }, tx);
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
    await repo.updateAnswer(answer.id, { graded: false, passCount: 0, totalTests: 0, updatedAt: revision }, tx);
    const question = await getQuestionForGrade(submission.questionId);
    if (!question) {
      throw new ExamRequestError(404, 'QUESTION_NOT_IN_EXAM', 'This question is not part of the exam.');
    }
    return { revision, testCases: question.testCases };
  });

  const results = await gradeTestCases(submission.code, prepared.testCases);
  const passCount = results.filter((result) => result.passed).length;

  return withAttempt(examId, userId, async (tx, exam, now) => {
    requireActive(exam, now);
    const answer = await findAnswer(tx, examId, submission.questionId);
    if (answer.updatedAt.getTime() !== prepared.revision.getTime() || answer.code !== submission.code) {
      throw new ExamRequestError(409, 'ANSWER_CHANGED', 'The answer changed while it was being checked. Check it again.');
    }
    await repo.updateAnswer(answer.id, {
      passCount, totalTests: prepared.testCases.length, graded: true, updatedAt: nextRevision(answer.updatedAt, now),
    }, tx);
    return {
      passCount,
      totalTests: prepared.testCases.length,
      results: results.map((result, i) => ({
        passed: result.passed,
        isHidden: prepared.testCases[i].isHidden,
        description: prepared.testCases[i].isHidden ? undefined : prepared.testCases[i].description,
        error: result.error,
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
    const answers = await repo.listAnswerScores(examId, tx);
    const score = answers.filter((answer) => answer.graded && answer.totalTests > 0 && answer.passCount === answer.totalTests).length;
    const timedOut = now.getTime() >= examDeadline(exam);
    await repo.completeAttempt(examId, {
      status: timedOut ? 'TIMED_OUT' : 'COMPLETED', score, totalTests: answers.length, completedAt: now,
    }, tx);
    return { score, totalTests: answers.length, timedOut };
  });
}
