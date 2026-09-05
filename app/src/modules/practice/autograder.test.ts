import { describe, expect, it } from 'vitest';
import { gradeSubmission } from './autograder';

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
