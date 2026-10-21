import { Prisma } from '@prisma/client';
import { tierForUser } from '@/modules/billing/entitlements';
import { conflict, forbidden, notFound } from '@/shared/http/errors';
import { canAuthorQuestions } from './access';
import { assertSolutionPasses, checkSolution } from './gradeSolution';
import type { QuestionDraft } from './parseInput';
import * as repo from './repo';

const PLAN_MESSAGE = 'A paid teacher plan is required to write questions.';

async function requireAuthor(userId: string) {
  const user = await repo.findAuthor(userId);
  if (!user || !canAuthorQuestions({ role: user.role, tier: tierForUser(user) })) {
    throw forbidden(PLAN_MESSAGE, 'PLAN_REQUIRED');
  }
}

export async function viewerCanAuthor(userId: string): Promise<boolean> {
  const user = await repo.findAuthor(userId);
  if (!user) return false;
  return canAuthorQuestions({ role: user.role, tier: tierForUser(user) });
}

export async function listOwnedQuestions(userId: string) {
  const rows = await repo.listOwned(userId);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    difficulty: row.difficulty,
    topic: row.topic,
    testCount: row._count.testCases,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getOwnedQuestion(userId: string, id: string) {
  const row = await repo.findOwned(userId, id);
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    topic: row.topic ?? '',
    starterCode: row.starterCode ?? '',
    solution: row.solution ?? '',
    testCases: row.testCases.map((test) => ({
      inputs: test.inputs,
      expectedOutput: test.expectedOutput,
      isHidden: test.isHidden,
    })),
  };
}

export async function createOwnedQuestion(userId: string, draft: QuestionDraft) {
  await requireAuthor(userId);
  await assertSolutionPasses(draft.solution, draft.testCases);
  return repo.createOwnedQuestion(userId, draft);
}

export async function updateOwnedQuestion(userId: string, id: string, draft: QuestionDraft) {
  await requireAuthor(userId);
  await assertSolutionPasses(draft.solution, draft.testCases);
  const updated = await repo.updateOwnedQuestion(userId, id, draft);
  if (!updated) throw notFound('Question not found');
  return { ok: true as const };
}

export async function deleteOwnedQuestion(userId: string, id: string) {
  const existing = await repo.findOwned(userId, id);
  if (!existing) throw notFound('Question not found');
  try {
    await repo.deleteOwnedQuestion(id);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw conflict('This question is part of an exam attempt, so it can’t be deleted.');
    }
    throw err;
  }
  return { ok: true as const };
}

/** Preview the solution against the tests. Nothing is saved. */
export async function previewOwnedQuestion(userId: string, draft: QuestionDraft) {
  await requireAuthor(userId);
  const results = await checkSolution(draft.solution, draft.testCases);
  const passCount = results.filter((result) => result.passed).length;
  return { results, passCount, totalCount: results.length };
}
