import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/modules/billing/featureFlags', () => ({ EXAM_MARKING_ENABLED: true, PREMIUM_GATING_ENABLED: true }));
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
  createMarking: vi.fn(),
}));
const parse = vi.fn();
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { parse };
  },
}));

import { getQuestionForMarking } from '@/shared/lib/catalogCache';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import * as repo from './repo';
import { MARK_SCHEMES, markSchemeFor } from './markSchemes';
import { buildMarkingPrompt, toMarkingResult } from './prompt';
import { codeHash, FREE_MARKINGS, markAnswer } from './service';

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

describe('markAnswer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getQuestionForMarking).mockResolvedValue(question as never);
    vi.mocked(getPremiumAccess).mockResolvedValue(false);
    vi.mocked(repo.findMarkingByHash).mockResolvedValue(null);
    vi.mocked(repo.countUserMarkings).mockResolvedValue(0);
    vi.mocked(repo.countAllMarkingsSince).mockResolvedValue(0);
    parse.mockResolvedValue({ stop_reason: 'end_turn', parsed_output: allPoints((id) => id !== 10), usage: { input_tokens: 900, output_tokens: 700 } });
  });

  it('marks, stores the result and counts down the free allowance', async () => {
    const res = await markAnswer('u1', 'q1', 'OUTPUT 1');
    expect(res.result.total).toBe(14);
    expect(res.remaining).toBe(FREE_MARKINGS - 1);
    expect(parse).toHaveBeenCalledWith(expect.objectContaining({ model: 'claude-haiku-5-5' }));
    expect(repo.createMarking).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', total: 14, codeHash: codeHash('OUTPUT 1') }));
  });

  it('reuses an identical answer without calling the model or spending an allowance', async () => {
    vi.mocked(repo.findMarkingByHash).mockResolvedValue({ id: 'm1', userId: 'u2', total: 12, result: { total: 12 }, createdAt: new Date() } as never);
    vi.mocked(repo.countUserMarkings).mockResolvedValue(FREE_MARKINGS);
    const res = await markAnswer('u1', 'q1', '  OUTPUT 1\n');
    expect(res.cached).toBe(true);
    expect(parse).not.toHaveBeenCalled();
    expect(repo.createMarking).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u1', cached: true }));
  });

  it('stops a free account after its free markings', async () => {
    vi.mocked(repo.countUserMarkings).mockResolvedValue(FREE_MARKINGS);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 403, code: 'FREE_LIMIT_REACHED' });
    expect(parse).not.toHaveBeenCalled();
  });

  it('stops everyone at the global daily cap', async () => {
    vi.mocked(repo.countAllMarkingsSince).mockResolvedValue(10_000);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 429 });
    expect(parse).not.toHaveBeenCalled();
  });

  it('fails cleanly on a refusal and stores nothing', async () => {
    parse.mockResolvedValue({ stop_reason: 'refusal', parsed_output: null, usage: { input_tokens: 1, output_tokens: 1 } });
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 502 });
    expect(repo.createMarking).not.toHaveBeenCalled();
  });

  it('refuses a question without a scheme', async () => {
    vi.mocked(getQuestionForMarking).mockResolvedValue({ ...question, title: 'Something else' } as never);
    await expect(markAnswer('u1', 'q1', 'OUTPUT 1')).rejects.toMatchObject({ status: 404 });
  });
});
