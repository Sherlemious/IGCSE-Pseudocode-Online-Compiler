import { HttpError } from '@/shared/http/errors';
import { gradeTestCases, type GradeResult } from '@/modules/practice/autograder';

export interface TestCheckResult {
  index: number;
  passed: boolean;
  hint: string | null;
  actualOutput: string;
}

function hintFor(result: GradeResult): string | null {
  if (result.passed) return null;
  return result.error?.hint ?? result.error?.message ?? 'Output did not match this test.';
}

/** Run the solution against every test. Does not persist anything. */
export async function checkSolution(
  solution: string,
  testCases: { inputs: string[]; expectedOutput: string }[],
): Promise<TestCheckResult[]> {
  const graded = await gradeTestCases(
    solution,
    testCases.map((test) => ({ inputs: test.inputs, expectedOutput: test.expectedOutput, initialFiles: null })),
  );
  return graded.map((result, index) => ({
    index,
    passed: result.passed,
    hint: hintFor(result),
    actualOutput: result.actualOutput.slice(0, 2_000),
  }));
}

/** 400 when any test fails. The body lists failures and never includes the solution. */
export async function assertSolutionPasses(
  solution: string,
  testCases: { inputs: string[]; expectedOutput: string }[],
): Promise<void> {
  const results = await checkSolution(solution, testCases);
  const failures = results.filter((result) => !result.passed);
  if (failures.length === 0) return;
  throw new HttpError(400, 'The solution does not pass every test.', 'SOLUTION_FAILED', {
    body: { failedCount: failures.length, failures },
  });
}
