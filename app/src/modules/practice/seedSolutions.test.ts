import { describe, expect, it } from 'vitest';
import { questions } from '../../../prisma/seed';
import { gradeTestCases } from './autograder';

// Every seeded question's model solution must pass all of its own test cases;
// otherwise no student answer written like the model one can pass either.
type SeedTestCase = { inputs: string[]; expectedOutput: string; initialFiles?: unknown };
type SeedQuestion = { title: string; solution?: string | null; testCases: SeedTestCase[] };

const withSolutions = (questions as SeedQuestion[]).filter((q) => q.solution);

describe('seeded practice questions', () => {
  it('has solutions to check', () => {
    expect(withSolutions.length).toBeGreaterThan(100);
  });

  it.each(withSolutions.map((q) => [q.title, q] as const))(
    '%s: the solution passes every test case',
    async (_title, question) => {
      const tests = question.testCases.map((tc) => ({
        inputs: tc.inputs,
        expectedOutput: tc.expectedOutput,
        initialFiles:
          tc.initialFiles == null
            ? null
            : typeof tc.initialFiles === 'string'
              ? tc.initialFiles
              : JSON.stringify(tc.initialFiles),
      }));
      const results = await gradeTestCases(question.solution!, tests);
      const failures = results
        .map((r, i) => ({ test: i, passed: r.passed, error: r.error?.message, output: r.actualOutput }))
        .filter((r) => !r.passed);
      expect(failures).toEqual([]);
    },
  );
});
