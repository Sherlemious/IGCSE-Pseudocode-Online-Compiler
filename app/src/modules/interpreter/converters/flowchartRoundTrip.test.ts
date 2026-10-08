import { describe, expect, it } from 'vitest';
import { questions } from '../../../../prisma/seed';
import { examples } from '@/modules/content/examples';
import { gradeTestCases } from '@/modules/practice/autograder';
import { convertToFlowchart } from './flowchartConverter';
import { docFromConversion } from './flowchartDoc';
import { flowchartToPseudocode } from './flowchartToPseudocode';

// code → flowchart → code must give a program that still parses and behaves the
// same, for every seeded solution and built-in example. This is what lets the
// builder import any program and lets flowchart questions be seeded from their
// model solutions.

type SeedTestCase = { inputs: string[]; expectedOutput: string; initialFiles?: unknown };
type SeedQuestion = { title: string; solution?: string | null; testCases: SeedTestCase[] };

function roundTrip(code: string) {
  const conv = convertToFlowchart(code, { fullLabels: true });
  expect(conv.errors).toEqual([]);
  return flowchartToPseudocode(docFromConversion(conv));
}

const withSolutions = (questions as SeedQuestion[]).filter((q) => q.solution);

describe('flowchart round trip — seeded solutions', () => {
  it.each(withSolutions.map((q) => [q.title, q] as const))('%s', async (_title, question) => {
    const program = roundTrip(question.solution!);
    expect(program.errors).toEqual([]);
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
    const results = await gradeTestCases(program.code, tests);
    const failures = results
      .map((r, i) => ({ test: i, passed: r.passed, error: r.error?.message, output: r.actualOutput }))
      .filter((r) => !r.passed);
    expect(failures, program.code).toEqual([]);
  });
});

describe('flowchart round trip — examples', () => {
  it.each(examples.map((e) => [e.title, e] as const))('%s parses', (_title, example) => {
    const program = roundTrip(example.code);
    expect(program.errors, program.code).toEqual([]);
  });
});
