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

const celsius: LearnLesson = {
  id: 't.celsius',
  slug: 'celsius',
  title: 'Celsius',
  type: 'grade',
  minutes: 1,
  why: 'test',
  body: 'test',
  playable: true,
  tests: [
    { inputs: ['0'], expectedOutput: '32' },
    { inputs: ['100'], expectedOutput: '212' },
  ],
};

describe('checkLessonCode feedback', () => {
  it('says the program printed nothing, with the test input', async () => {
    const result = await checkLessonCode(celsius, 'DECLARE C : INTEGER\nINPUT C');
    expect(result.message).toContain('Test 1 (input `0`) failed');
    expect(result.message).toContain('printed nothing');
  });

  it('spots an answer fixed in the code instead of worked out from INPUT', async () => {
    const result = await checkLessonCode(celsius, 'DECLARE C : INTEGER\nINPUT C\nOUTPUT 32');
    expect(result.message).toContain('Test 2 (input `100`) failed');
    expect(result.message).toContain('same answer as an earlier test');
  });

  it('shows the friendly parse hint, not raw ANTLR text', async () => {
    const result = await checkLessonCode(celsius, 'INPUT C\nIF C > 0\n  OUTPUT C\nEND IF');
    expect(result.reason).toBe('runtime');
    expect(result.message).not.toMatch(/expecting \{|extraneous input|mismatched input/);
  });

  it('explains <- when the student assigned with =', async () => {
    const lesson: LearnLesson = { ...celsius, tests: undefined, expectedOutput: '42', mustContain: ['<-'] };
    const result = await checkLessonCode(lesson, 'DECLARE Score : INTEGER\nScore = 42\nOUTPUT Score');
    expect(result.message).toContain('Assign with `<-`, not `=`');
  });

  it('points at capitals when a keyword is written in lowercase', async () => {
    const lesson: LearnLesson = { ...celsius, tests: undefined, expectedOutput: '1', mustContain: ['FOR'] };
    const result = await checkLessonCode(lesson, 'for i <- 1 to 1\n  output i\nnext i');
    expect(result.message).toContain('you wrote `for`');
  });
});
