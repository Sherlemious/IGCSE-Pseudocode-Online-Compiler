import type { BlogPost } from '../types';

export const proceduresAndFunctions: BlogPost = {
  slug: 'procedures-and-functions',
  title: 'PROCEDURE or FUNCTION: which one the question wants',
  description:
    'A PROCEDURE is an action you CALL. A FUNCTION returns a value you use in an expression. Paper 2 marks the difference.',
  eyebrow: 'Paper 2 · Routines',
  audience: 'student',
  published: '2026-11-27',
  readingMinutes: 6,
  keywords: [
    'IGCSE procedure',
    'IGCSE function',
    'CALL procedure pseudocode',
    'FUNCTION RETURNS',
    '0478 procedures and functions',
  ],
  summary:
    'A procedure does something and you CALL it. A function returns a value you use in OUTPUT or an assignment. Mixing the two up is a lost mark.',
  blocks: [
    {
      kind: 'p',
      text: 'Paper 2 uses the word in the question, and the two shapes are not interchangeable. A **PROCEDURE** performs an action. A **FUNCTION** calculates a value and gives it back. If you CALL a function, or try to OUTPUT a procedure, the structure mark goes.',
    },
    {
      kind: 'h2',
      id: 'procedure',
      text: 'A procedure is an action',
    },
    {
      kind: 'p',
      text: 'It has a name, optional parameters with types, a body, and `ENDPROCEDURE`. The main program runs it with `CALL`. It does not sit inside an expression.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      caption: 'The closer is one word. END PROCEDURE is two.',
      code: 'PROCEDURE Greet()\n    OUTPUT "Ready"\nEND PROCEDURE\n\nCALL Greet()',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'PROCEDURE Greet()\n    OUTPUT "Ready"\nENDPROCEDURE\n\nCALL Greet()',
      output: 'Ready',
    },
    {
      kind: 'p',
      text: 'A parameter is declared in the brackets, with a type. The caller passes the value. The procedure does not `INPUT` it again.',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'PROCEDURE Square(N : INTEGER)\n    OUTPUT N * N\nENDPROCEDURE\n\nCALL Square(6)',
      output: '36',
    },
    {
      kind: 'h2',
      id: 'function',
      text: 'A function returns a value',
    },
    {
      kind: 'p',
      text: 'The header says what it returns: `FUNCTION Double(N : INTEGER) RETURNS INTEGER`. The body `RETURN`s one value. You use the name in an expression. There is no `CALL`.',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'FUNCTION Double(N : INTEGER) RETURNS INTEGER\n    RETURN N * 2\nENDFUNCTION\n\nOUTPUT Double(5)',
      output: '10',
    },
    {
      kind: 'table',
      head: ['The question says', 'You write'],
      rows: [
        ['Write a procedure …', '`PROCEDURE` … `ENDPROCEDURE`, then `CALL Name(...)`'],
        ['Write a function …', '`FUNCTION` … `RETURNS` type … `RETURN` … `ENDFUNCTION`'],
        ['Use the result in an OUTPUT or an assignment', 'A function: `OUTPUT Double(5)`'],
        ['It only needs to print or store, and nothing comes back', 'A procedure'],
      ],
    },
    {
      kind: 'callout',
      title: 'Parameters stay in the routine',
      text: 'A parameter is a new variable that belongs to that routine. The caller’s variable is a different name. Pass the value in the brackets: `CALL Square(X)` or `OUTPUT Double(X)`.',
    },
    {
      kind: 'p',
      text: 'The [PROCEDURE lesson](/learn/8/procedure) and the [FUNCTION lesson](/learn/8/function) are the short versions. The reference pages are [procedures](/docs#procedures) and [functions](/docs#functions).',
    },
  ],
};
