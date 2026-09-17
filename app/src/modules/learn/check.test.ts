import { describe, expect, it } from 'vitest';
import { checkLessonCode } from './check';
import type { LearnLesson } from './types';

const fileLesson: LearnLesson = {
  id: 't.files',
  slug: 'files',
  title: 'Read a seeded file',
  type: 'grade',
  minutes: 1,
  why: 'test',
  body: 'test',
  playable: true,
  solutionCode: '',
  tests: [
    {
      inputs: [],
      expectedOutput: 'Ada',
      initialFiles: { 'n.txt': 'Ada' },
    },
  ],
};

describe('checkLessonCode initialFiles', () => {
  it('seeds the autograder VFS so READFILE can see the file', async () => {
    const code = `DECLARE Line : STRING
OPENFILE "n.txt" FOR READ
READFILE "n.txt", Line
OUTPUT Line
CLOSEFILE "n.txt"`;
    const result = await checkLessonCode(fileLesson, code);
    expect(result.ok, result.message).toBe(true);
  });

  it('fails when expected output does not match', async () => {
    const result = await checkLessonCode(fileLesson, 'OUTPUT "Bob"');
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('wrong_output');
  });
});
