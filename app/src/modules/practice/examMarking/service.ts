import { createHash } from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { badRequest, forbidden, HttpError, notFound, payloadTooLarge, tooManyRequests } from '@/shared/http/errors';
import { getQuestionForMarking } from '@/shared/lib/catalogCache';
import { logger } from '@/shared/lib/logger';
import { EXAM_MARKING_ENABLED, PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';
import { gradeTestCases, MAX_GRADE_CODE_CHARS } from '@/modules/practice/autograder';
import { isMarkable, markSchemeFor } from './markSchemes';
import { buildMarkingPrompt, MARKING_SYSTEM, MarkingOutput, toMarkingResult, type MarkingResult } from './prompt';
import * as repo from './repo';

/**
 * "Mark it like an examiner" on 15-mark practice questions. The tests run on
 * our interpreter for free; one Claude call then marks the answer against the
 * question's 15-point scheme. Cost control, in order: identical answers reuse
 * the saved result (no call), free accounts get FREE_MARKINGS in total, paid
 * ones PAID_DAILY a day, and a global daily cap stops a runaway bill.
 */

export const FREE_MARKINGS = 3;
export const PAID_DAILY = 20;
const DAILY_CAP = Number(process.env.EXAM_MARKING_DAILY_CAP) || 500;
const MODEL = process.env.EXAM_MARKING_MODEL || 'claude-haiku-5-5';

export class MarkingError extends HttpError {}

export function codeHash(code: string): string {
  return createHash('sha256').update(code.trim()).digest('hex');
}

const startOfUtcDay = (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

export interface MarkingResponse {
  result: MarkingResult;
  cached: boolean;
  /** Markings left: in total on the free plan, today on a paid one. */
  remaining: number;
  plan: 'free' | 'paid';
}

export async function markAnswer(userId: string, questionId: string, rawCode: unknown): Promise<MarkingResponse> {
  if (!EXAM_MARKING_ENABLED) throw notFound();
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

  // The same answer was marked before (by anyone): show that, for free.
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

  const graded = await gradeTestCases(code, question.testCases);
  const passCount = graded.filter((r) => r.passed).length;

  const client = new Anthropic({ timeout: 60_000, maxRetries: 1 });
  let response;
  try {
    response = await client.messages.parse({
      model: MODEL,
      max_tokens: 8000,
      system: MARKING_SYSTEM,
      messages: [
        {
          role: 'user',
          content: buildMarkingPrompt({ question: question.description, scheme, code, passCount, totalCount: graded.length }),
        },
      ],
      output_config: { effort: 'medium', format: zodOutputFormat(MarkingOutput) },
    });
  } catch (err) {
    logger.error('Exam marking: model call failed', { question_id: questionId, error: String(err) });
    throw new MarkingError(502, "Couldn't mark this right now. Try again in a minute.");
  }
  if (response.stop_reason === 'refusal' || !response.parsed_output) {
    logger.warn('Exam marking: no usable output', { question_id: questionId, stop_reason: response.stop_reason });
    throw new MarkingError(502, "Couldn't mark this right now. Try again in a minute.");
  }

  const result = toMarkingResult(response.parsed_output, scheme);
  await repo.createMarking({
    userId,
    questionId,
    codeHash: hash,
    total: result.total,
    result: result as unknown as object,
    model: MODEL,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  });
  await captureServerEvent(userId, 'exam_marking_completed', {
    question_id: questionId,
    total: result.total,
    pass_count: passCount,
    test_count: graded.length,
    cached: false,
    plan,
    model: MODEL,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
  });
  return { result, cached: false, remaining: remainingAfter(used + 1), plan };
}
