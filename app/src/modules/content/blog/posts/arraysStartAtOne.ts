import type { BlogPost } from '../types';

export const arraysStartAtOne: BlogPost = {
  slug: 'arrays-start-at-one',
  title: 'Cambridge arrays start at 1',
  description:
    'Cambridge arrays start at 1. Reading Scores[0], or looping one past the last index, is the off-by-one that costs the mark.',
  eyebrow: 'Paper 2 · Arrays',
  audience: 'student',
  published: '2026-11-27',
  readingMinutes: 5,
  keywords: [
    'IGCSE array index',
    'pseudocode array starts at 1',
    'ARRAY[1:n]',
    '0478 arrays',
    'off by one pseudocode',
  ],
  summary:
    'The first element is index 1, the declaration states both bounds, and the loop has to stop on the last one. Index 0 is the usual lost mark.',
  blocks: [
    {
      kind: 'p',
      text: 'In Cambridge pseudocode the first slot of an array is index **1**, unless the question prints different bounds. `Scores[0]` is not the first score. It is outside the array, and the program stops.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      failsAtRuntime: true,
      caption: 'The array was declared from 1. Index 0 is not in it.',
      code: 'DECLARE Scores : ARRAY[1:3] OF INTEGER\nScores[1] <- 4\nScores[2] <- 7\nScores[3] <- 9\nOUTPUT Scores[0]',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Scores : ARRAY[1:3] OF INTEGER\nDECLARE i : INTEGER\nScores[1] <- 4\nScores[2] <- 7\nScores[3] <- 9\nFOR i <- 1 TO 3\n    OUTPUT Scores[i]\nNEXT i',
      output: '4\n7\n9',
    },
    {
      kind: 'h2',
      id: 'declare',
      text: 'Say both bounds in the DECLARE',
    },
    {
      kind: 'p',
      text: 'The declaration is `ARRAY[lower:upper] OF type`. For three scores that is `ARRAY[1:3] OF INTEGER`. The lower bound is usually 1 in IGCSE questions. If a question says the array runs from 0, then 0 is correct for that question and nowhere else.',
    },
    {
      kind: 'p',
      text: 'A 2D array needs two pairs of bounds: `ARRAY[1:4, 1:3] OF INTEGER` is four rows and three columns. The first cell is `Grid[1, 1]`, not `Grid[0, 0]`. See [1D arrays](/docs#arrays-1d) and [2D arrays](/docs#arrays-2d).',
    },
    {
      kind: 'h2',
      id: 'loop',
      text: 'The loop stops on the last index',
    },
    {
      kind: 'p',
      text: 'If the upper bound is 3, the loop is `FOR i <- 1 TO 3`. `TO 4` reads one past the end and the program fails on the last pass, often after it has already printed the real values. That is the other off-by-one: the start is fine, the finish is one too far.',
    },
    {
      kind: 'list',
      items: [
        'Lower bound in the DECLARE, lower bound in the FOR. They match.',
        'Upper bound in the DECLARE, upper bound in the FOR. They match.',
        'Use the index when you print: `OUTPUT Scores[i]`, not `OUTPUT Scores`.',
      ],
    },
    {
      kind: 'p',
      text: 'The [declare an array lesson](/learn/7/declare) starts from an empty declaration. The [scan lesson](/learn/7/scan) is the loop that walks every element once.',
    },
  ],
};
