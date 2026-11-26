import type { BlogPost } from '../types';

export const stringsStartAtOne: BlogPost = {
  slug: 'strings-start-at-one',
  title: 'The first character of a string is position 1',
  description:
    'SUBSTRING starts at character 1, not 0. LENGTH, SUBSTRING and & in Cambridge pseudocode, and the Python habit that loses the mark.',
  eyebrow: 'Paper 2 · Strings',
  audience: 'student',
  published: '2026-11-27',
  readingMinutes: 5,
  keywords: [
    'IGCSE SUBSTRING',
    'pseudocode LENGTH',
    'string position 1',
    'Cambridge string functions',
    'pseudocode concatenation',
  ],
  summary:
    'LENGTH counts characters, SUBSTRING starts at position 1, and two strings are joined with &. Brackets and a zero index are Python, not the exam.',
  blocks: [
    {
      kind: 'p',
      text: 'String questions on Paper 2 are small and precise: take the first letter, take three characters, join a surname onto an initial. The functions are `LENGTH` and `SUBSTRING`, the join is `&`, and the first character is at position **1**.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      failsAtRuntime: true,
      caption: 'This is accepted as an assignment, then fails: there is no print, and a string has no [0].',
      code: 'name = "Cambridge"\nprint(name[0])',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Word : STRING\nWord <- "Cambridge"\nOUTPUT SUBSTRING(Word, 1, 1)',
      output: 'C',
    },
    {
      kind: 'h2',
      id: 'substring',
      text: 'SUBSTRING(string, start, length)',
    },
    {
      kind: 'p',
      text: 'The third value is how many characters to take, not the position to stop at. `SUBSTRING(Word, 1, 3)` is characters 1, 2 and 3. It is not “from 1 to 3” in the Python sense, where the end index is left out.',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Word : STRING\nWord <- "Cambridge"\nOUTPUT SUBSTRING(Word, 1, 3)',
      output: 'Cam',
    },
    {
      kind: 'list',
      items: [
        '`LENGTH(Word)` is the number of characters. For `"Cambridge"` that is 10.',
        'The last character is `SUBSTRING(Word, LENGTH(Word), 1)`.',
        'A loop over every character is `FOR i <- 1 TO LENGTH(Word)`, then `SUBSTRING(Word, i, 1)`.',
        'Join with `&`: `Initial & ". " & Surname`. The `+` sign is for numbers.',
      ],
    },
    {
      kind: 'h2',
      id: 'initials',
      text: 'Initials are two one-character slices',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE First : STRING\nDECLARE Surname : STRING\nFirst <- "Ada"\nSurname <- "Lovelace"\nOUTPUT SUBSTRING(First, 1, 1) & SUBSTRING(Surname, 1, 1)',
      output: 'AL',
    },
    {
      kind: 'p',
      text: 'That is the whole of a lot of 2-mark and 3-mark string items. The [LENGTH lesson](/learn/6/length), the [SUBSTRING lesson](/learn/6/substring) and the [initials lesson](/learn/6/initials) do each piece, and the reference is [string functions](/docs#string-functions).',
    },
  ],
};
