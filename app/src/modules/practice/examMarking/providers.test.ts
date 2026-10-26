import { afterEach, describe, expect, it, vi } from 'vitest';
import { FreeAllowanceUsedUp, pickProvider, runWorkersAi, UnusableMarking, WORKERS_MODEL } from './providers';
import { MARK_SCHEMES } from './markSchemes';
import { parseMarkingJson } from './prompt';

const CTX = Symbol.for('__cloudflare-context__');
const globals = globalThis as Record<symbol, unknown>;
const marking = {
  points: MARK_SCHEMES['Class Survey Vote Tally'].map((_, i) => ({ id: i + 1, awarded: true, note: 'ok' })),
  fixes: [],
  summary: 'Great.',
};
const usage = { prompt_tokens: 1100, completion_tokens: 1500, neurons: 78.5 };

afterEach(() => {
  delete globals[CTX];
  vi.unstubAllEnvs();
});

describe('pickProvider', () => {
  it('uses Workers AI for everyone while there is no Claude key', () => {
    globals[CTX] = { env: { AI: { run: vi.fn() } } };
    expect(pickProvider(false)).toBe('workers-ai');
    expect(pickProvider(true)).toBe('workers-ai');
  });

  it('moves paid accounts, and only them, to Claude once a key exists', () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test');
    globals[CTX] = { env: { AI: { run: vi.fn() } } };
    expect(pickProvider(true)).toBe('claude');
    expect(pickProvider(false)).toBe('workers-ai');
  });

  it('never gives a free account Claude, even without the AI binding', () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-test');
    expect(pickProvider(false)).toBeNull();
  });

  it('has no provider off Cloudflare without a key', () => {
    expect(pickProvider(true)).toBeNull();
  });
});

describe('runWorkersAi', () => {
  const ai = (reply: unknown) => ({ run: vi.fn(async () => reply) });

  it('reads an OpenAI-style reply and the real neurons used', async () => {
    const binding = ai({ choices: [{ message: { content: JSON.stringify(marking) } }], usage });
    const run = await runWorkersAi(binding, 'prompt');
    expect(run).toMatchObject({ provider: 'workers-ai', model: WORKERS_MODEL, inputTokens: 1100, outputTokens: 1500, neurons: 78.5 });
    expect(run.output.points).toHaveLength(15);
    expect(binding.run).toHaveBeenCalledWith(
      WORKERS_MODEL,
      expect.objectContaining({ temperature: 0, response_format: expect.objectContaining({ type: 'json_schema' }) }),
    );
  });

  it('reads JSON mode replies that arrive as an object, and JSON inside prose or a fence', async () => {
    expect((await runWorkersAi(ai({ response: marking, usage }), 'p')).output.summary).toBe('Great.');
    const fenced = 'Here you go:\n```json\n' + JSON.stringify(marking) + '\n```';
    expect((await runWorkersAi(ai({ choices: [{ message: { content: fenced } }], usage }), 'p')).output.points).toHaveLength(15);
  });

  it('reports the used-up daily allowance as its own error', async () => {
    const binding = { run: vi.fn().mockRejectedValue(new Error('4006: you have used up your daily free allocation of 10,000 neurons')) };
    await expect(runWorkersAi(binding, 'p')).rejects.toBeInstanceOf(FreeAllowanceUsedUp);
  });

  it('lets other failures through, and rejects a reply that is not a marking', async () => {
    await expect(runWorkersAi({ run: vi.fn().mockRejectedValue(new Error('network')) }, 'p')).rejects.toThrow('network');
    await expect(runWorkersAi(ai({ choices: [{ message: { content: '| # | table |' } }], usage }), 'p')).rejects.toBeInstanceOf(UnusableMarking);
  });
});

describe('parseMarkingJson', () => {
  it('rejects the wrong shape', () => {
    expect(parseMarkingJson('{"points":"nope"}')).toBeNull();
    expect(parseMarkingJson('no json here')).toBeNull();
  });
});
