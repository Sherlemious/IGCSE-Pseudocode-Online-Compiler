import { Prisma } from '@prisma/client';
import { getEntitlements } from '@/modules/billing/entitlements';
import { gradeTestCases } from '@/modules/practice/autograder';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';
import { conflict, forbidden, HttpError, notFound } from '@/shared/http/errors';
import type { JsonObject } from '@/shared/http/input';
import { mayWriteQuestions } from './access';
import * as repo from './repo';
import { parseQuestionDraft, type QuestionDraft } from './validate';

const PLAN_MESSAGE = 'Writing your own autograded questions needs a teacher plan.';

async function requireWriter(userId: string) {
  const { tier } = await getEntitlements(userId);
  if (!mayWriteQuestions(tier)) throw forbidden(PLAN_MESSAGE, 'PLAN_REQUIRED');
}

function counts(draft: QuestionDraft) {
  return {
    test_count: draft.testCases.length,
    hidden_count: draft.testCases.filter((test) => test.isHidden).length,
    difficulty: draft.difficulty,
  };
}

/**
 * Runs the saved solution through the same autograder as practice.
 * A failure is a 400 with one entry per failing test — never the source text
 * in the analytics event.
 */
async function ensureSolutionPasses(userId: string, draft: QuestionDraft) {
  const results = await gradeTestCases(draft.solution, draft.testCases);
  const failures = results.flatMap((result, index) => {
    if (result.passed) return [];
    return [{
      index,
      hint: result.error?.hint ?? 'Output did not match.',
      actualOutput: result.actualOutput.slice(0, 500),
    }];
  });
  if (failures.length === 0) return;
  await captureServerEvent(userId, 'custom_question_solution_failed', { failed_count: failures.length });
  throw new HttpError(400, 'The solution does not pass every test. Fix it, then save.', 'SOLUTION_FAILED', {
    body: { failures, failed_count: failures.length },
  });
}

export async function listMyQuestions(userId: string) {
  const rows = await repo.listOwnedQuestions(userId);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    difficulty: row.difficulty,
    topic: row.topic,
    testCount: row._count.testCases,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getMyQuestion(userId: string, id: string) {
  const row = await repo.findOwnedQuestion(userId, id);
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
      inputs: test.inputs.join('\n'),
      expectedOutput: test.expectedOutput,
      isHidden: test.isHidden,
    })),
  };
}

export async function checkSolution(userId: string, body: JsonObject) {
  await requireWriter(userId);
  const draft = parseQuestionDraft(body);
  await ensureSolutionPasses(userId, draft);
  return { ok: true as const, test_count: draft.testCases.length };
}

export async function createOwnedQuestion(userId: string, body: JsonObject) {
  await requireWriter(userId);
  const draft = parseQuestionDraft(body);
  await ensureSolutionPasses(userId, draft);
  const created = await repo.createOwnedQuestion(userId, draft);
  await captureServerEvent(userId, 'custom_question_created', counts(draft));
  return { id: created.id };
}

export async function updateOwnedQuestion(userId: string, id: string, body: JsonObject) {
  await requireWriter(userId);
  const existing = await repo.findOwnedQuestion(userId, id);
  if (!existing) throw notFound('Question not found');
  const draft = parseQuestionDraft(body);
  await ensureSolutionPasses(userId, draft);
  await repo.replaceOwnedQuestion(id, draft);
  await captureServerEvent(userId, 'custom_question_updated', counts(draft));
  return { id };
}

export async function deleteOwnedQuestion(userId: string, id: string) {
  const existing = await repo.findOwnedQuestion(userId, id);
  if (!existing) throw notFound('Question not found');
  const [onExams, answered] = await repo.countQuestionUse(id);
  if (onExams > 0 || answered > 0) {
    throw conflict('Remove this question from your exams before deleting it. Students mid-attempt still need it.');
  }
  try {
    await repo.deleteOwnedQuestion(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw conflict('Remove this question from your exams before deleting it. Students mid-attempt still need it.');
    }
    throw error;
  }
  return { ok: true as const };
}
