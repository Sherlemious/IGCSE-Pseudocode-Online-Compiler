import type { BlogPost } from '../types';

export const validationChecks: BlogPost = {
  slug: 'validation-checks-paper-2',
  title: 'The validation checks Paper 2 actually asks for',
  description:
    'Range, length, type, presence, format and check digit: the validation checks Paper 2 names, and a range check you can run.',
  eyebrow: 'Paper 2 · Validation',
  audience: 'student',
  published: '2026-11-27',
  readingMinutes: 6,
  keywords: [
    'IGCSE validation',
    'range check pseudocode',
    'presence check LENGTH',
    'validation vs verification',
    '0478 Paper 2 validation',
  ],
  summary:
    'Validation asks whether the data is reasonable. Six named checks come up on Paper 2. A range check is a REPEAT loop with a complete condition.',
  blocks: [
    {
      kind: 'p',
      text: 'Validation asks “is this data reasonable?”. Verification asks “was it copied correctly?”. They are different marks. A range check does not prove two people typed the same number, and a double entry does not prove the number is allowed.',
    },
    {
      kind: 'h2',
      id: 'six',
      text: 'The six names to learn',
    },
    {
      kind: 'table',
      head: ['Check', 'The question it answers', 'In pseudocode'],
      rows: [
        ['Range', 'Is the number inside the allowed limits?', '`Mark >= 0 AND Mark <= 100`'],
        ['Length', 'Is the text the right number of characters?', '`LENGTH(Code) = 6`'],
        ['Type', 'Is it a whole number, a decimal, or text?', 'The DECLARE type, and what INPUT will accept'],
        ['Presence', 'Did they type anything at all?', '`LENGTH(Name) > 0`'],
        ['Format', 'Does it match a pattern, such as two letters then four digits?', 'Check each character in turn'],
        ['Check digit', 'Does a calculated digit match the last character?', 'A total, a remainder, then a comparison'],
      ],
    },
    {
      kind: 'p',
      text: 'You will not write all six in one question. You do need to know which name belongs to which test, because the question says “a range check” and expects the condition, not a paragraph.',
    },
    {
      kind: 'h2',
      id: 'range',
      text: 'A range check keeps asking',
    },
    {
      kind: 'p',
      text: 'The usual wrapper is `REPEAT` … `UNTIL` the value is acceptable. The condition on `UNTIL` is the success, so it is the opposite of the error you are rejecting.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      caption: 'INTEGER is a type, not a value you can compare with.',
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark = INTEGER THEN\n    OUTPUT "Whole number"\nENDIF',
    },
    {
      kind: 'code',
      variant: 'right',
      caption: 'Try it and type a mark. 60 is inside 0 to 100.',
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark >= 0 AND Mark <= 100 THEN\n    OUTPUT "Valid"\nELSE\n    OUTPUT "Invalid"\nENDIF',
      output: 'Valid',
    },
    {
      kind: 'p',
      text: 'To keep reading until the mark is valid, the same test moves onto the UNTIL line:',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Mark : INTEGER\nREPEAT\n    OUTPUT "Enter a mark from 0 to 100"\n    INPUT Mark\nUNTIL Mark >= 0 AND Mark <= 100\nOUTPUT Mark',
      output: 'Enter a mark from 0 to 100\n60',
    },
    {
      kind: 'callout',
      title: 'Both sides of AND',
      text: 'Each side of `AND` and `OR` is a full comparison. `Mark >= 0 AND <= 100` is missing the variable on the second half. Write `Mark >= 0 AND Mark <= 100`.',
    },
    {
      kind: 'p',
      text: 'Presence is the same shape with a string: repeat until `LENGTH(Name) > 0`. The walk-through is the [validation lesson](/learn/10/validation) and the [presence check](/learn/10/presence). `LENGTH` itself is in [string functions](/docs#string-functions).',
    },
  ],
};
