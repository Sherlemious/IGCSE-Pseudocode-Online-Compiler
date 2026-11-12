import { JSON_SHAPE, MARKING_JSON_SCHEMA, MARKING_SYSTEM, type MarkingOutput, parseMarkingJson } from './prompt';

/**
 * Who does the marking: Cloudflare Workers AI only, on the account's free
 * allowance (10,000 neurons a day, no API key: the Worker's `AI` binding).
 * Nothing here can bill. Free accounts get gpt-oss-20b (checked in Oct 2026
 * on five real answers: within one mark of Claude Haiku, about 55-115 neurons
 * a marking); paying accounts get the larger gpt-oss-120b. When the allowance
 * is gone, marking stops for everyone until 00:00 UTC.
 */

export type ProviderName = 'workers-ai';

export interface ModelRun {
  output: MarkingOutput;
  provider: ProviderName;
  model: string;
  inputTokens: number;
  outputTokens: number;
  /** Workers AI only: what this call took from the daily free allowance. */
  neurons: number;
}

/** The model is unavailable for today (Cloudflare refused: the free allowance is used up). */
export class FreeAllowanceUsedUp extends Error {}
/** The model answered, but not with a usable marking. */
export class UnusableMarking extends Error {}

export const FREE_MODEL = process.env.EXAM_MARKING_FREE_MODEL || '@cf/openai/gpt-oss-20b';
export const PREMIUM_MODEL = process.env.EXAM_MARKING_PREMIUM_MODEL || '@cf/openai/gpt-oss-120b';

interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

/** The Worker's `AI` binding, set per request by the OpenNext worker; absent on `next dev` and in builds. */
export function workersAiBinding(): AiBinding | null {
  const context = (globalThis as Record<symbol, { env?: { AI?: AiBinding } } | undefined>)[
    Symbol.for('__cloudflare-context__')
  ];
  return context?.env?.AI ?? null;
}

/** The model for this account, or null when nothing can mark (no AI binding: `next dev`, builds). */
export function pickModel(paid: boolean): string | null {
  if (!workersAiBinding()) return null;
  return paid ? PREMIUM_MODEL : FREE_MODEL;
}

/** Cloudflare's refusal once the daily free allocation is spent (error 4006). */
function isAllowanceError(err: unknown): boolean {
  return /4006|daily free allocation|used up/i.test(err instanceof Error ? err.message : String(err));
}

type WorkersAiReply = {
  response?: unknown;
  choices?: Array<{ message?: { content?: unknown } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; neurons?: number };
};

function replyText(reply: WorkersAiReply): string {
  if (typeof reply.response === 'string') return reply.response;
  if (reply.response && typeof reply.response === 'object') return JSON.stringify(reply.response);
  const content = reply.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content : '';
}

export async function runWorkersAi(ai: AiBinding, model: string, prompt: string): Promise<ModelRun> {
  let reply: WorkersAiReply;
  try {
    reply = (await ai.run(model, {
      messages: [
        { role: 'system', content: MARKING_SYSTEM + JSON_SHAPE },
        { role: 'user', content: prompt },
      ],
      // The model's reasoning counts as output, and was 1,500-3,500 tokens on real answers.
      max_tokens: 6000,
      temperature: 0,
      response_format: { type: 'json_schema', json_schema: MARKING_JSON_SCHEMA },
    })) as WorkersAiReply;
  } catch (err) {
    if (isAllowanceError(err)) throw new FreeAllowanceUsedUp();
    throw err;
  }
  const output = parseMarkingJson(replyText(reply));
  if (!output) throw new UnusableMarking('Workers AI returned no usable marking');
  return {
    output,
    provider: 'workers-ai',
    model,
    inputTokens: reply.usage?.prompt_tokens ?? 0,
    outputTokens: reply.usage?.completion_tokens ?? 0,
    neurons: reply.usage?.neurons ?? 0,
  };
}
