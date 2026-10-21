import { beforeEach, describe, expect, it, vi } from 'vitest';

const repo = vi.hoisted(() => ({
  findAuthor: vi.fn(),
  listOwned: vi.fn(),
  findOwned: vi.fn(),
  createOwnedQuestion: vi.fn(),
  updateOwnedQuestion: vi.fn(),
  deleteOwnedQuestion: vi.fn(),
}));

vi.mock('./repo', () => repo);

import { createOwnedQuestion, updateOwnedQuestion } from './service';

const paidTeacher = {
  role: 'TEACHER',
  plan: 'STARTER',
  planTier: 'starter',
  trialEndsAt: null,
  planExpiresAt: null,
  legacyCapacity: false,
};

const draft = {
  title: 'Sum',
  description: 'Add',
  difficulty: 'EASY' as const,
  topic: null,
  starterCode: null,
  solution: 'OUTPUT "yes"\n',
  testCases: [{ inputs: [] as string[], expectedOutput: 'yes', isHidden: false }],
};

beforeEach(() => {
  vi.clearAllMocks();
  repo.findAuthor.mockResolvedValue(paidTeacher);
  repo.createOwnedQuestion.mockResolvedValue({ id: 'q-new' });
  repo.updateOwnedQuestion.mockResolvedValue(true);
});

describe('owned question service', () => {
  it('saves only after the real autograder passes the solution', async () => {
    await expect(createOwnedQuestion('teacher', draft)).resolves.toEqual({ id: 'q-new' });
    expect(repo.createOwnedQuestion).toHaveBeenCalledWith('teacher', draft);
  });

  it('does not save when the solution fails a test', async () => {
    await expect(createOwnedQuestion('teacher', { ...draft, solution: 'OUTPUT "no"\n' })).rejects.toMatchObject({
      status: 400,
      code: 'SOLUTION_FAILED',
    });
    expect(repo.createOwnedQuestion).not.toHaveBeenCalled();
  });

  it('blocks a free teacher before writing', async () => {
    repo.findAuthor.mockResolvedValue({ ...paidTeacher, plan: 'FREE', planTier: null });
    await expect(createOwnedQuestion('teacher', draft)).rejects.toMatchObject({ status: 403, code: 'PLAN_REQUIRED' });
    expect(repo.createOwnedQuestion).not.toHaveBeenCalled();
  });

  it('blocks edits after the plan lapses, and blocks students', async () => {
    repo.findAuthor.mockResolvedValue({
      ...paidTeacher,
      planExpiresAt: new Date('2020-01-01'),
    });
    await expect(updateOwnedQuestion('teacher', 'q1', draft)).rejects.toMatchObject({ code: 'PLAN_REQUIRED' });
    repo.findAuthor.mockResolvedValue({ ...paidTeacher, role: 'STUDENT' });
    await expect(createOwnedQuestion('student', draft)).rejects.toMatchObject({ code: 'PLAN_REQUIRED' });
    expect(repo.updateOwnedQuestion).not.toHaveBeenCalled();
    expect(repo.createOwnedQuestion).not.toHaveBeenCalled();
  });

  it('lets a teacher on an active trial save', async () => {
    repo.findAuthor.mockResolvedValue({
      ...paidTeacher,
      plan: 'FREE',
      planTier: null,
      trialEndsAt: new Date(Date.now() + 86_400_000),
    });
    await expect(createOwnedQuestion('teacher', draft)).resolves.toEqual({ id: 'q-new' });
  });
});
