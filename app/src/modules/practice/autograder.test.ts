import { describe, expect, it } from 'vitest';
import { gradeSubmission, gradeTestCases, MAX_OUTPUT_LINES } from './autograder';

const readFile = (name: string) => `DECLARE line : STRING
OPENFILE "${name}" FOR READ
WHILE NOT EOF("${name}") DO
READFILE "${name}", line
OUTPUT line
ENDWHILE
CLOSEFILE "${name}"
`;

describe('concurrent file grading', () => {
  it.each(['same filename', 'different filenames'])('isolates EOF across runs with %s', async (scenario) => {
    const secondName = scenario === 'same filename' ? 'names.txt' : 'other.txt';
    const results = await Promise.all([
      gradeSubmission(readFile('names.txt'), [], 'Ada', JSON.stringify({ 'names.txt': 'Ada' })),
      gradeSubmission(readFile(secondName), [], 'Grace\nLin', JSON.stringify({ [secondName]: 'Grace\nLin' })),
      gradeSubmission(readFile('empty.txt'), [], '', JSON.stringify({ 'empty.txt': '' })),
    ]);
    expect(results.map((result) => result.error)).toEqual([undefined, undefined, undefined]);
    expect(results.map((result) => result.passed)).toEqual([true, true, true]);
    expect(results.map((result) => result.actualOutput)).toEqual(['Ada', 'Grace\nLin', '']);
  });
});

const endlessLoop = `WHILE TRUE DO
  x <- 1
ENDWHILE
`;

describe('stopped runs', () => {
  it('fails a run that times out even if its output so far matches', async () => {
    const result = await gradeSubmission(`OUTPUT "Done"\n${endlessLoop}`, [], 'Done', null, 200);
    expect(result.passed).toBe(false);
    expect(result.error?.kind).toBe('timeout');
    expect(result.error?.hint).toMatch(/loop that never ends/);
    expect(result.actualOutput).toBe('Done');
  });

  it('stops as soon as the test inputs run out', async () => {
    const code = `DECLARE Name : STRING
WHILE TRUE DO
  INPUT Name
ENDWHILE
`;
    const result = await gradeSubmission(code, ['Ada'], '', null, 5_000);
    expect(result.passed).toBe(false);
    expect(result.error?.category).toBe('input_overflow');
    expect(result.executionMs).toBeLessThan(1_000);
  });

  it('stops a print loop at the output limit', async () => {
    const code = `WHILE TRUE DO
  OUTPUT "a"
ENDWHILE
`;
    const result = await gradeSubmission(code, [], '', null, 10_000);
    expect(result.passed).toBe(false);
    expect(result.error?.category).toBe('output_limit');
    expect(result.actualOutput.split('\n').length).toBeLessThanOrEqual(MAX_OUTPUT_LINES + 1);
  });
});

describe('gradeTestCases', () => {
  it('grades each test in order', async () => {
    const code = `DECLARE N : INTEGER
INPUT N
OUTPUT N * 2
`;
    const results = await gradeTestCases(code, [
      { inputs: ['2'], expectedOutput: '4' },
      { inputs: ['5'], expectedOutput: '11' },
    ]);
    expect(results.map((r) => r.passed)).toEqual([true, false]);
  });

  it('skips the remaining tests after a timeout', async () => {
    const results = await gradeTestCases(
      endlessLoop,
      [{ inputs: [], expectedOutput: '' }, { inputs: [], expectedOutput: '' }],
      { testTimeoutMs: 200 },
    );
    expect(results.map((r) => r.error?.kind)).toEqual(['timeout', 'timeout']);
    expect(results[1].error?.message).toMatch(/earlier test timed out/);
    expect(results[1].executionMs).toBe(0);
  });
});
