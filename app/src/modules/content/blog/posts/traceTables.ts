import type { BlogPost } from '../types';

/** Worked example written for the post. The exam-style layout matches the compiler's trace table. */
export const traceTables: BlogPost = {
  slug: 'trace-tables-the-examiner-way',
  title: 'How to fill a trace table the way the mark scheme does',
  description:
    'How a Cambridge Paper 2 trace table is filled: one column per variable, a new value only when it changes, and output in its own column.',
  eyebrow: 'Paper 2 · Trace tables',
  audience: 'student',
  published: '2026-11-27',
  readingMinutes: 6,
  keywords: [
    'IGCSE trace table',
    'pseudocode dry run',
    '0478 Paper 2 trace table',
    'O Level 2210 trace table',
    'Cambridge mark scheme trace',
  ],
  summary:
    'A trace table is a dry run on paper. One column per variable, write a value only when it changes, and put OUTPUT in its own column.',
  blocks: [
    {
      kind: 'p',
      text: 'A trace table is the program run by hand. Paper 2 pays for that dry run, and the mark scheme is picky about the grid: a column for each variable, a new number only when that variable is assigned, and a blank when it is left alone. Output has its own column.',
    },
    {
      kind: 'p',
      text: 'Take this total. `Total` starts at 0. Each pass of the loop adds the counter, then the program prints the result.',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Total : INTEGER\nDECLARE i : INTEGER\nTotal <- 0\nFOR i <- 1 TO 3\n    Total <- Total + i\nNEXT i\nOUTPUT Total',
      output: '6',
    },
    {
      kind: 'p',
      text: 'Filled the examiner way, the grid looks like this. A cell stays blank when that variable did not change on that step.',
    },
    {
      kind: 'table',
      head: ['i', 'Total', 'OUTPUT'],
      rows: [
        ['1', '0', ''],
        ['', '1', ''],
        ['2', '3', ''],
        ['3', '6', ''],
        ['', '', '6'],
      ],
    },
    {
      kind: 'p',
      text: 'The first row is the assignments before the loop body does any adding: `i` becomes 1 and `Total` is still 0. The next row is `Total <- Total + i`, so only `Total` changes. When `i` moves to 2, `Total` is updated on the following row, not on the same one. The printed 6 appears once, in the OUTPUT column, on the line that runs `OUTPUT`.',
    },
    {
      kind: 'h2',
      id: 'what-earns-the-mark',
      text: 'What usually earns the mark',
    },
    {
      kind: 'list',
      items: [
        'One column per variable the question names, plus OUTPUT if the program prints.',
        'Write a value only in the row where it is assigned. Copying the old value into every cell is the mistake the scheme crosses out.',
        'Step in order. A FOR loop assigns the counter, then runs the body, then assigns the next counter.',
        'Show the output in the OUTPUT column, not squeezed into a variable column.',
      ],
    },
    {
      kind: 'h2',
      id: 'check-it',
      text: 'Check a dry run against a real one',
    },
    {
      kind: 'p',
      text: 'Run the program in the [compiler](/) and switch the trace table to **Exam style**. That layout follows the same rule: a value only when it is assigned, blank when it is unchanged. If your paper grid and that table disagree, the paper grid is the one to fix. The [blank trace table lesson](/learn/10/trace) is the same drill with the cells empty first.',
    },
    {
      kind: 'callout',
      title: 'On the paper',
      text: 'Cross out a wrong cell and write the new value beside it. An overwritten number you can still read scores; a scribble the examiner cannot read does not.',
    },
  ],
};
