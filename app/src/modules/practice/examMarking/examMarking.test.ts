import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/modules/billing/featureFlags', () => ({ EXAM_MARKING_FLAG: 'exam-marking', PREMIUM_GATING_ENABLED: true }));
vi.mock('@/modules/telemetry/serverFlags', () => ({ isFlagEnabledFor: vi.fn(async () => true) }));
vi.mock('@/shared/lib/catalogCache', () => ({ getQuestionForMarking: vi.fn() }));
vi.mock('@/modules/billing/entitlements', () => ({ getPremiumAccess: vi.fn() }));
vi.mock('@/modules/telemetry/serverCapture', () => ({ captureServerEvent: vi.fn() }));
vi.mock('@/modules/practice/autograder', () => ({
  MAX_GRADE_CODE_CHARS: 20_000,
  gradeTestCases: vi.fn(async () => [{ passed: true }, { passed: false }]),
}));
vi.mock('./repo', () => ({
  findMarkingByHash: vi.fn(),
  countUserMarkings: vi.fn(),
  countAllMarkingsSince: vi.fn(),
  sumNeuronsSince: vi.fn(),
  createMarking: vi.fn(),
}));
vi.mock('./providers', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./providers')>()),
  pickProvider: vi.fn(),
  workersAiBinding: vi.fn(() => ({ run: vi.fn() })),
  runWorkersAi: vi.fn(),
  runClaude: vi.fn(),
}));

import { getQuestionForMarking } from '@/shared/lib/catalogCache';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { isFlagEnabledFor } from '@/modules/telemetry/serverFlags';
import * as repo from './repo';
import { FreeAllowanceUsedUp, pickProvider, runClaude, runWorkersAi } from './providers';
import { MARK_SCHEMES, markSchemeFor } from './markSchemes';
import { buildMarkingPrompt, toMarkingResult } from './prompt';
import { codeHash, FREE_MARKINGS, markAnswer, NEURON_BUDGET } from './service';

const scheme = MARK_SCHEMES['Class Survey Vote Tally'];
const question = {
  id: 'q1',
  title: 'Class Survey Vote Tally',
  description: 'Run a class vote.',
  marks: 15,
  answerFormat: 'CODE',
  isPremium: false,
  testCases: [],
};
const allPoints = (awarded: (id: number) => boolean) => ({
  points: scheme.map((_, i) => ({ id: i + 1, awarded: awarded(i + 1), note: 'ok' })),
  fixes: ['a', 'b', 'c', 'd'],
  summary: 'Good work.',
});

describe('mark schemes', () => {
  it('has exactly 15 points for every scheme', () => {
    for (const [title, points] of Object.entries(MARK_SCHEMES)) {
      expect(points, title).toHaveLength(15);
      expect(markSchemeFor(title)).not.toBeNull();
    }
  });

  it('covers every 15-mark seeded question, by its exact title', () => {
    const seeds = ['prisma/igcseRecentPaperQuestions.ts', 'prisma/seed.ts'].map((f) => readFileSync(f, 'utf8')).join('\n');
    // The title nearest before each '15 Marks' tag is that question's.
    const titles = [...seeds.matchAll(/'15 Marks'/g)].map((m) => {
      const before = seeds.slice(0, m.index);
      return [...before.matchAll(/title: '([^']+)'/g)].at(-1)![1];
    });
    expect(titles.length).toBeGreaterThanOrEqual(13);
    for (const title of titles) expect(markSchemeFor(title), title).not.toBeNull();
    for (const title of Object.keys(MARK_SCHEMES)) expect(seeds).toContain(`title: '${title}'`);
  });
});

describe('prompt and result', () => {
  it('numbers the scheme and fences the answer', () => {
    const prompt = buildMarkingPrompt({ question: 'Q', scheme, code: 'OUTPUT 1', passCount: 2, totalCount: 3 });
    expect(prompt).toContain('1. Suitable arrays');
    expect(prompt).toContain('15. The least popular');
    expect(prompt).toContain('Passed 2/3 tests.');
    expect(prompt).toContain('<answer>\nOUTPUT 1\n</answer>');
  });

  it('recomputes the total and treats missing points as not awarded', () => {
    const out = allPoints((id) => id <= 10);
    out.points = out.points.filter((p) => p.id !== 3).concat({ id: 99, awarded: true, note: 'junk' });
    const result = toMarkingResult(out, scheme);
    expect(result.total).toBe(9);
    expect(result.points).toHaveLength(15);
    expect(result.points[2]).toMatchObject({ id: 3, awarded: false });
    expect(result.fixes).toHaveLength(3);
  });
});

const run = (provider: 'workers-ai' | 'claude', neurons = 80) => ({
  output: allPoints((id) => id !== 10),
  provider,
  model: provider === 'claude' ? 'claude-haiku-5-5' : '@cf/openai/gpt-oss-20b',
  inputTokens: 1100,
  outputTokens: 1500,
  neurons,
});

describe('markAnswer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getQuestionForMarking).mockResolvedValue(question as never);
    vi.mocked(getPremiumAccess).mockResolvedValue(false);
    vi.mocked(repo.findMarkingByHash).mockResolvedValue(null);
    vi.mocked(repo.countUserMarkings).mockResolvedValue(0);
    vi.mocked(repo.countAllMarkingsSince).mockResolvedValue(0);
    vi.mocked(repo.sumNeuronsSince).mockResolvedValue(0);
    vi.mocked(pickProvider).mockReturnValue('workers-ai');
    vi.mocked(runWorkersAi).mockResolvedValue(run('workers-ai'));
    vi.mocked(runClaude).mockResolvedValue(run('claude', 0));
  });

  it('marks on Workers AI, stores the result with its neurons and counts down the free allowance', async () => {
    const res = await markAnswer('u1', 'q1', 'OUTPUT 1');
    expect(res.result.total).toBe(14);
    expect(res.remaining).toBe(FREE_MARKINGS - 1);
    expect(runWorkersAi).toHaveBeenCalledTimes(1);
    expect(runClaude).not.toHaveBeenCalled();
    expect(repo.createMarking).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1', total: 14, codeHash: codeHash('OUTPUT 1'), neurons: 80, model: '@cf/openai/gpt-oss-20b' }),
    );
  });

  it('uses Claude only where the provider choice says so (a paid account with a key)', async () => {
    vi.mocked(getPremiumAccess).mockResolvedValue(true);
    vi.mocked(pickProvider).mockReturnValue('claude');
    await markAnswer('u1', 'q1', 'OUTPUT 1');
    expect(pickProvider).toHaveBeenCalledWith(true);
    expect(runClaude).toHaveBeenCalledTimes(1);
    expect(runWorkersAi).not.toHaveBeenCalled();
    expect(repo.createMarking).toHaveBeenCalledWith(expect.objectContaining({ neurons: 0, model: 'claude-haiku-5-5' }));
  });

  it('reuses an identical answer without calling a model or spending an allowance', async () => {
    vi.mocked(repo.findMarkingByHash).mockResolvedValue({ id: 'm1', userId: 'u2', total: 12, result: { total: 12 }, createdAt: new Date() } as never);
    vi.mocked(repo.countUserMarkings).mockResolvedValue(FREE_MARKINGS);
    const res = await markAnswer('u1', 'q1', '  OUTPUT 1\n');
    expect(res.cached).toBe(true);
    expect(runWorkersAi).not.toHaveBeenCalled();
    expect(repo.createMarking).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', cached: true }));
  });

  it('still shows an already-marked answer when the free neuron budget is gone', async () => {
    vi.mocked(repo.findMarkingByHash).mockResolvedValue({ id: 'm1', userId: 'u1', total: 12, result: { total: 12 }, createdAt: new Date() } as never);
    vi.mocked(repo.sumNeuronsSince).mockResolvedValue(NEURON_BUDGET);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).resolves.toMatchObject({ cached: true });
  });

  it('stops a free account after its free markings', async () => {
    vi.mocked(repo.countUserMarkings).mockResolvedValue(FREE_MARKINGS);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 403, code: 'FREE_LIMIT_REACHED' });
    expect(runWorkersAi).not.toHaveBeenCalled();
  });

  it('stops everyone at the global daily cap', async () => {
    vi.mocked(repo.countAllMarkingsSince).mockResolvedValue(10_000);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 429 });
    expect(runWorkersAi).not.toHaveBeenCalled();
  });

  it('is done for today, without calling the model, once the neuron budget is spent', async () => {
    vi.mocked(repo.sumNeuronsSince).mockResolvedValue(NEURON_BUDGET - 100);
    const err = await markAnswer('u1', 'q1', 'OUTPUT 1').catch((e) => e);
    expect(err).toMatchObject({ status: 429, code: 'AI_DONE_FOR_TODAY' });
    expect(err.extra.body.resetsAt).toMatch(/T00:00:00\.000Z$/);
    expect(Number(err.extra.headers['Retry-After'])).toBeGreaterThan(0);
    expect(runWorkersAi).not.toHaveBeenCalled();
    expect(repo.createMarking).not.toHaveBeenCalled();
  });

  it('is done for today when Cloudflare itself says the free allocation is used up', async () => {
    vi.mocked(runWorkersAi).mockRejectedValue(new FreeAllowanceUsedUp());
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 429, code: 'AI_DONE_FOR_TODAY' });
    expect(repo.createMarking).not.toHaveBeenCalled();
  });

  it('does not offer marking when no model is available', async () => {
    vi.mocked(pickProvider).mockReturnValue(null);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 404 });
  });

  it('fails cleanly on an unusable reply and stores nothing', async () => {
    vi.mocked(runWorkersAi).mockRejectedValue(new Error('no usable marking'));
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 502 });
    expect(repo.createMarking).not.toHaveBeenCalled();
  });

  it('is not found for a user the PostHog flag is off for, before any cost', async () => {
    vi.mocked(isFlagEnabledFor).mockResolvedValueOnce(false);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 404 });
    expect(getQuestionForMarking).not.toHaveBeenCalled();
    expect(runWorkersAi).not.toHaveBeenCalled();
  });

  it('refuses a question without a scheme', async () => {
    vi.mocked(getQuestionForMarking).mockResolvedValue({ ...question, title: 'Something else' } as never);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 404 });
  });
});
