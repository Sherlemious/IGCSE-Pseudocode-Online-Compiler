import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { JSON_SHAPE, MARKING_JSON_SCHEMA, MARKING_SYSTEM, MarkingOutput, parseMarkingJson } from './prompt';

/**
 * Who does the marking. Free accounts always use Cloudflare Workers AI (10,000
 * free neurons a day for the whole account, no API key: the Worker's `AI`
 * binding). A paid account uses Claude once ANTHROPIC_API_KEY is set; until
 * then everyone is on Workers AI. Checked in Oct 2026 on five real answers:
 * gpt-oss-20b was within one mark of Claude Haiku on every one, at about
 * 55-115 neurons a marking, and repeated runs agreed.
 */

export type ProviderName = 'workers-ai' | 'claude';

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

export const WORKERS_MODEL = process.env.EXAM_MARKING_FREE_MODEL || '@cf/openai/gpt-oss-20b';
export const CLAUDE_MODEL = process.env.EXAM_MARKING_MODEL || 'claude-haiku-5-5';

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

const claudeConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

/** Free accounts: Workers AI only. Paid: Claude when a key is set, otherwise Workers AI. Null = nothing can mark. */
export function pickProvider(paid: boolean): ProviderName | null {
  if (paid && claudeConfigured()) return 'claude';
  return workersAiBinding() ? 'workers-ai' : null;
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

export async function runWorkersAi(ai: AiBinding, prompt: string): Promise<ModelRun> {
  let reply: WorkersAiReply;
  try {
    reply = (await ai.run(WORKERS_MODEL, {
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
    model: WORKERS_MODEL,
    inputTokens: reply.usage?.prompt_tokens ?? 0,
    outputTokens: reply.usage?.completion_tokens ?? 0,
    neurons: reply.usage?.neurons ?? 0,
  };
}

export async function runClaude(prompt: string): Promise<ModelRun> {
  const client = new Anthropic({ timeout: 60_000, maxRetries: 1 });
  const response = await client.messages.parse({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    system: MARKING_SYSTEM,
    messages: [{ role: 'user', content: prompt }],
    output_config: { effort: 'medium', format: zodOutputFormat(MarkingOutput) },
  });
  if (response.stop_reason === 'refusal' || !response.parsed_output) {
    throw new UnusableMarking(`Claude gave no usable marking (${response.stop_reason})`);
  }
  return {
    output: response.parsed_output,
    provider: 'claude',
    model: CLAUDE_MODEL,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    neurons: 0,
  };
}
