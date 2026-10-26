import { createHash } from 'node:crypto';
import { badRequest, forbidden, HttpError, notFound, payloadTooLarge, tooManyRequests } from '@/shared/http/errors';
import { getQuestionForMarking } from '@/shared/lib/catalogCache';
import { logger } from '@/shared/lib/logger';
import { EXAM_MARKING_FLAG, PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';
import { isFlagEnabledFor } from '@/modules/telemetry/serverFlags';
import { gradeTestCases, MAX_GRADE_CODE_CHARS } from '@/modules/practice/autograder';
import { isMarkable, markSchemeFor } from './markSchemes';
import { buildMarkingPrompt, toMarkingResult, type MarkingResult } from './prompt';
import { FreeAllowanceUsedUp, pickProvider, runClaude, runWorkersAi, workersAiBinding, type ModelRun } from './providers';
import * as repo from './repo';

/**
 * "Mark it like an examiner" on 15-mark practice questions. The tests run on
 * our interpreter for free; one model call then marks the answer against the
 * question's 15-point scheme (providers.ts: Workers AI for free accounts, Claude
 * for paid ones once a key exists). Cost control, in order: identical answers
 * reuse the saved result (no call), free accounts get FREE_MARKINGS in total,
 * paid ones PAID_DAILY a day, a global daily cap, and for Workers AI a daily
 * neuron budget kept under Cloudflare's 10,000 free neurons so it never bills.
 */

export const FREE_MARKINGS = 3;
export const PAID_DAILY = 20;
const DAILY_CAP = Number(process.env.EXAM_MARKING_DAILY_CAP) || 500;
/** Stay under the 10,000 free neurons a day; two requests in flight can overshoot by a marking or so. */
export const NEURON_BUDGET = Number(process.env.EXAM_MARKING_NEURON_BUDGET) || 8000;
/** About the most one marking has taken (a long answer, long reasoning). */
const NEURONS_PER_MARKING_MAX = 250;

export class MarkingError extends HttpError {}

export function codeHash(code: string): string {
  return createHash('sha256').update(code.trim()).digest('hex');
}

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfUtcDay = (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

/** The free allowance is gone until 00:00 UTC. The page shows this as "done for today". */
function doneForToday(now: Date): MarkingError {
  const resetsAt = new Date(startOfUtcDay(now).getTime() + DAY_MS);
  return new MarkingError(
    429,
    'Examiner marking is done for today: the free allowance is used up. It comes back at 00:00 UTC.',
    'AI_DONE_FOR_TODAY',
    {
      body: { resetsAt: resetsAt.toISOString() },
      headers: { 'Retry-After': String(Math.ceil((resetsAt.getTime() - now.getTime()) / 1000)) },
    },
  );
}

export interface MarkingResponse {
  result: MarkingResult;
  cached: boolean;
  /** Markings left: in total on the free plan, today on a paid one. */
  remaining: number;
  plan: 'free' | 'paid';
}

export async function markAnswer(userId: string, questionId: string, rawCode: unknown): Promise<MarkingResponse> {
  if (!(await isFlagEnabledFor(userId, EXAM_MARKING_FLAG))) throw notFound();
  if (typeof rawCode !== 'string' || !rawCode.trim()) throw badRequest('Write an answer first.');
  if (rawCode.length > MAX_GRADE_CODE_CHARS) throw payloadTooLarge('This answer is too long to mark.');
  const code = rawCode;

  const question = await getQuestionForMarking(questionId);
  if (!question || !isMarkable(question)) throw notFound('This question has no examiner marking.');
  const scheme = markSchemeFor(question.title)!;

  const paid = await getPremiumAccess(userId);
  if (PREMIUM_GATING_ENABLED && question.isPremium && !paid) {
    throw forbidden('This question needs a paid plan.', 'PLAN_REQUIRED');
  }
  const now = new Date();
  const used = paid ? await repo.countUserMarkings(userId, startOfUtcDay(now)) : await repo.countUserMarkings(userId);
  const allowance = paid ? PAID_DAILY : FREE_MARKINGS;
  const remainingAfter = (spent: number) => Math.max(0, allowance - spent);
  const plan = paid ? 'paid' : 'free';

  // The same answer was marked before (by anyone): show that, for free, even when today's allowance is gone.
  const hash = codeHash(code);
  const previous = await repo.findMarkingByHash(questionId, hash);
  if (previous) {
    if (previous.userId !== userId) {
      await repo.createMarking({ userId, questionId, codeHash: hash, total: previous.total, result: previous.result as object, model: 'cache', cached: true });
    }
    await captureServerEvent(userId, 'exam_marking_completed', { question_id: questionId, total: previous.total, cached: true, plan });
    return { result: previous.result as unknown as MarkingResult, cached: true, remaining: remainingAfter(used), plan };
  }

  if (used >= allowance) {
    throw new MarkingError(
      403,
      paid
        ? `That's ${PAID_DAILY} markings today. More tomorrow.`
        : `You've used your ${FREE_MARKINGS} free markings. The pass unlocks examiner marking on every 15-mark question.`,
      paid ? 'DAILY_LIMIT' : 'FREE_LIMIT_REACHED',
    );
  }
  if ((await repo.countAllMarkingsSince(startOfUtcDay(now))) >= DAILY_CAP) {
    logger.warn('Exam marking: global daily cap reached', { cap: DAILY_CAP });
    throw tooManyRequests(3600, 'Examiner marking is busy today. Try again later.');
  }

  const provider = pickProvider(paid);
  if (!provider) {
    logger.warn('Exam marking: no model available', { question_id: questionId });
    throw notFound('Examiner marking is not available right now.');
  }
  if (provider === 'workers-ai' && (await repo.sumNeuronsSince(startOfUtcDay(now))) + NEURONS_PER_MARKING_MAX > NEURON_BUDGET) {
    await captureServerEvent(userId, 'exam_marking_done_for_today', { question_id: questionId, plan, source: 'budget' });
    throw doneForToday(now);
  }

  const graded = await gradeTestCases(code, question.testCases);
  const passCount = graded.filter((r) => r.passed).length;
  const prompt = buildMarkingPrompt({ question: question.description, scheme, code, passCount, totalCount: graded.length });

  let run: ModelRun;
  try {
    run = provider === 'claude' ? await runClaude(prompt) : await runWorkersAi(workersAiBinding()!, prompt);
  } catch (err) {
    if (err instanceof FreeAllowanceUsedUp) {
      await captureServerEvent(userId, 'exam_marking_done_for_today', { question_id: questionId, plan, source: 'cloudflare' });
      throw doneForToday(now);
    }
    logger.error('Exam marking: model call failed', { question_id: questionId, provider, error: String(err) });
    throw new MarkingError(502, "Couldn't mark this right now. Try again in a minute.");
  }

  const result = toMarkingResult(run.output, scheme);
  await repo.createMarking({
    userId,
    questionId,
    codeHash: hash,
    total: result.total,
    result: result as unknown as object,
    model: run.model,
    inputTokens: run.inputTokens,
    outputTokens: run.outputTokens,
    neurons: run.neurons,
  });
  await captureServerEvent(userId, 'exam_marking_completed', {
    question_id: questionId,
    total: result.total,
    pass_count: passCount,
    test_count: graded.length,
    cached: false,
    plan,
    provider: run.provider,
    model: run.model,
    input_tokens: run.inputTokens,
    output_tokens: run.outputTokens,
    neurons: run.neurons,
  });
  return { result, cached: false, remaining: remainingAfter(used + 1), plan };
}
