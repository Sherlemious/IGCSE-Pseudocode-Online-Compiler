import { describe, expect, it } from 'vitest';
import { assertSolutionPasses, checkSolution } from './gradeSolution';

describe('solution must pass every test', () => {
  it('accepts a solution the autograder passes, including INPUT', async () => {
    await expect(assertSolutionPasses('OUTPUT "yes"\n', [{ inputs: [], expectedOutput: 'yes' }])).resolves.toBeUndefined();
    const checked = await checkSolution('INPUT Name\nOUTPUT Name\n', [{ inputs: ['Ada'], expectedOutput: 'Ada' }]);
    expect(checked).toEqual([{ index: 0, passed: true, hint: null, actualOutput: 'Ada' }]);
  });

  it('rejects a solution that fails any test and does not echo the source', async () => {
    const solution = 'OUTPUT "no"\n// token-secret-solution';
    await expect(assertSolutionPasses(solution, [
      { inputs: [], expectedOutput: 'yes' },
      { inputs: [], expectedOutput: 'also-yes' },
    ])).rejects.toMatchObject({
      status: 400,
      code: 'SOLUTION_FAILED',
      extra: { body: { failedCount: 2 } },
    });
    try {
      await assertSolutionPasses(solution, [{ inputs: [], expectedOutput: 'yes' }]);
    } catch (err) {
      expect(JSON.stringify(err)).not.toContain('token-secret-solution');
      return;
    }
    throw new Error('expected SOLUTION_FAILED');
  });
});
