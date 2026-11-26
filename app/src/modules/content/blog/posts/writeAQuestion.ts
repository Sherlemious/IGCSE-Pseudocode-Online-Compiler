import type { BlogPost } from '../types';

export const writeAQuestion: BlogPost = {
  slug: 'write-a-question-students-can-be-marked-on',
  title: 'Write a question the autograder can mark',
  description:
    'Write a question students can be marked on: visible tests, hidden tests, and a solution that has to pass before it can be saved.',
  eyebrow: 'For teachers · Questions',
  audience: 'teacher',
  published: '2026-11-27',
  readingMinutes: 6,
  keywords: [
    'autograded pseudocode question',
    'IGCSE test cases',
    'hidden tests pseudocode',
    'teacher question bank',
  ],
  summary:
    'A question is a description, a starter, a solution, and tests. Students see the visible tests. The solution has to pass every test before the question can be saved.',
  blocks: [
    {
      kind: 'p',
      text: 'The practice bank covers the syllabus. When you want a question in your own wording, with your own data, you write it and the tests mark it. Students never receive your solution, and they never see a test you marked hidden.',
    },
    {
      kind: 'h2',
      id: 'what-they-see',
      text: 'What a student sees',
    },
    {
      kind: 'p',
      text: 'On [New question](/questions/new) you write the description, a starter program, the solution, and the tests. Students see the description, the starter and the visible tests. The solution and the hidden tests stay on the server. A saved question is yours: it does not appear in the public practice list.',
    },
    {
      kind: 'p',
      text: 'Saving and editing need a paid teacher plan. If a plan lapses you cannot create or edit, but questions you already saved still run on assignments that include them.',
    },
    {
      kind: 'h2',
      id: 'tests',
      text: 'A test is an input and the exact output',
    },
    {
      kind: 'list',
      items: [
        'Each test has its inputs, one value per line, and the output the program must print.',
        'Tick **Hidden** for a test the student should not read in advance. Use those for the cases that would give the algorithm away.',
        'Leave at least one test visible, so a student can see the shape of a correct run.',
        'You can add up to 30 tests.',
      ],
    },
    {
      kind: 'p',
      text: 'The solution has to pass every test, visible and hidden, before the question can be saved. **Run solution against tests** does that check without saving. If a test fails, the message is the same hint a student would see, plus what the program actually printed.',
    },
    {
      kind: 'code',
      variant: 'right',
      caption: 'A solution for “double the input”. The test input here is 60, so the output is 120.',
      code: 'FUNCTION Double(N : INTEGER) RETURNS INTEGER\n    RETURN N * 2\nENDFUNCTION\n\nDECLARE X : INTEGER\nINPUT X\nOUTPUT Double(X)',
      output: '120',
    },
    {
      kind: 'p',
      text: 'For that solution, one visible test is input `5` with output `10`. A hidden test might be `0` → `0`, and another `-2` → `-6`, so a program that always prints 10 fails even though it passes the sample the student can see.',
    },
    {
      kind: 'callout',
      title: 'Output has to match',
      text: 'The comparison is the printed lines, not the idea. An extra heading, a trailing space, or `OUTPUT "120"` when the test expects `120` is a failed test. Print only what the question asks for.',
    },
    {
      kind: 'h2',
      id: 'assign',
      text: 'Then assign it',
    },
    {
      kind: 'p',
      text: 'A saved question can be put on a class assignment the same way as a practice question. Homework still defaults to no timer. The steps for the class and the join link are in [set homework that marks itself](/blog/set-homework-that-marks-itself).',
    },
  ],
};
