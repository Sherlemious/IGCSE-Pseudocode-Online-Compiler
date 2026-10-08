import { Prisma, type Difficulty } from '@prisma/client';
import { HttpError, badRequest, forbidden, notFound } from '@/shared/http/errors';
import { generateShareCode } from '@/shared/lib/shareCode';
import { existingCatalogQuestionIds, getExamQuestionPool } from '@/shared/lib/catalogCache';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import * as repo from './repo';

/**
 * Teacher-authored exam definitions (shared via /e/[code]) and the attempts
 * started from them or from the random simulator.
 */

export const EXAM_TITLE_MAX = 200;
export const EXAM_DESCRIPTION_MAX = 2000;

const isUniqueViolation = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';

/** Retries `create` on the rare share-code collision. */
async function withFreshShareCode<T>(create: (shareCode: string) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await create(generateShareCode());
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
    }
  }
  throw new HttpError(500, 'Could not generate a unique share code. Please try again.');
}

/** Known, exam-eligible questions in the given order; 400 when none are. */
async function validQuestionIds(questionIds: string[]): Promise<string[]> {
  if (questionIds.length === 0) throw badRequest('Add at least one question.');
  const valid = await existingCatalogQuestionIds(questionIds);
  if (valid.length === 0) throw badRequest('None of the selected questions could be found.');
  return valid;
}

async function requireOwnedExam(examId: string, ownerId: string) {
  if (!(await repo.findOwnedExam(examId, ownerId))) throw notFound('Exam not found');
}

export async function createExam(
  ownerId: string,
  input: { title: string; description: string | null; timeLimitMin: number; questionIds: string[] },
) {
  const questionIds = await validQuestionIds(input.questionIds);
  const exam = await withFreshShareCode((shareCode) =>
    repo.createExam({ ...input, ownerId, shareCode, questionIds }),
  );
  return { examId: exam.id, shareCode: exam.shareCode };
}

export async function updateExam(
  examId: string,
  ownerId: string,
  data: { title?: string; description?: string | null; timeLimitMin?: number; isPublished?: boolean },
  questionIds: string[] | null,
) {
  await requireOwnedExam(examId, ownerId);
  await repo.updateExam(examId, data, questionIds ? await validQuestionIds(questionIds) : null);
}

export async function deleteExam(examId: string, ownerId: string) {
  await requireOwnedExam(examId, ownerId);
  await repo.deleteExam(examId);
}

/** Copy an exam you own, with a new share code. */
export async function cloneExam(examId: string, ownerId: string) {
  const source = await repo.findOwnedExamForClone(examId, ownerId);
  if (!source) throw notFound('Exam not found');
  const exam = await withFreshShareCode((shareCode) =>
    repo.createExam({
      ownerId,
      title: `${source.title} (copy)`.slice(0, EXAM_TITLE_MAX),
      description: source.description,
      timeLimitMin: source.timeLimitMin,
      shareCode,
      questionIds: source.questions.map((q) => q.questionId),
    }),
  );
  return { examId: exam.id, shareCode: exam.shareCode };
}

/** Start (or resume) an attempt of a shared exam. */
export async function startSharedExam(examId: string, userId: string) {
  const exam = await repo.findExamForStart(examId);
  if (!exam || !exam.isPublished) throw notFound('This exam is not available.');
  if (exam.questions.length === 0) throw badRequest('This exam has no questions yet.');
  // Same rule as a class assignment: premium questions need premium access.
  if (PREMIUM_GATING_ENABLED && exam.questions.some((q) => q.question.isPremium) && !(await getPremiumAccess(userId))) {
    throw forbidden(
      'This exam includes premium questions. Upgrade, or join a class from a teacher who has a plan.',
      'PREMIUM_REQUIRED',
    );
  }
  // Resume an existing in-progress attempt rather than duplicating it.
  const inProgress = await repo.findInProgressAttempt(userId, exam.id);
  if (inProgress) return { attemptId: inProgress.id };
  const attempt = await repo.createAttempt({
    userId,
    examId: exam.id,
    timeLimitMin: exam.timeLimitMin,
    questionIds: exam.questions.map((q) => q.questionId),
  });
  return { attemptId: attempt.id };
}

/** Start a random timed exam from the question bank (the self-service simulator). */
export async function startRandomExam(
  userId: string,
  opts: { topic: string | null; difficulty: Difficulty | null; questionCount: number; timeLimitMin: number },
) {
  const includePremium = !PREMIUM_GATING_ENABLED || (await getPremiumAccess(userId));
  const pool = await getExamQuestionPool({ topic: opts.topic, difficulty: opts.difficulty, includePremium });
  if (pool.length === 0) throw notFound('No questions match your criteria');

  // Fisher–Yates; sort(() => random) is biased.
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const attempt = await repo.createAttempt({
    userId,
    topic: opts.topic,
    difficulty: opts.difficulty,
    timeLimitMin: opts.timeLimitMin,
    questionIds: shuffled.slice(0, opts.questionCount).map((q) => q.id),
  });
  return { examId: attempt.id };
}
