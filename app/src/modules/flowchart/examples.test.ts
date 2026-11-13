import { describe, expect, it } from 'vitest';
import { gradeTestCases } from '@/modules/practice/autograder';
import { flowchartToPseudocode } from '@/modules/interpreter/converters/flowchartToPseudocode';
import { FLOWCHART_CATEGORIES, FLOWCHART_EXAMPLES } from './examples';
import { flowchartFromCode } from './importCode';

describe('flowchart examples', () => {
  it('have unique ids and known categories', () => {
    const ids = FLOWCHART_EXAMPLES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of FLOWCHART_EXAMPLES) expect(FLOWCHART_CATEGORIES).toContain(e.category);
  });

  it.each(FLOWCHART_EXAMPLES.map((e) => [e.title, e] as const))('%s draws, converts back and runs', async (_t, ex) => {
    const { doc, error } = flowchartFromCode(ex.code);
    expect(error).toBeNull();
    const program = flowchartToPseudocode(doc!);
    expect(program.errors, program.code).toEqual([]);
    const [result] = await gradeTestCases(program.code, [{ inputs: ex.inputs, expectedOutput: ex.output, initialFiles: null }]);
    expect({ passed: result.passed, output: result.actualOutput, error: result.error?.message }, program.code).toMatchObject({
      passed: true,
    });
  });
});
