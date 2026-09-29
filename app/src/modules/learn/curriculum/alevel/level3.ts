import type { LearnLevel } from '../../types';

export const alevel3: LearnLevel = {
  number: 3,
  slug: '3',
  name: 'Parameters',
  hours: '2',
  leaveWith: 'BYVAL copies, BYREF changes the caller, and BYREF sticks',
  syllabus: '9618 pseudocode §8.3',
  free: true,
  playable: true,
  lessons: [
    {
      id: 'as3.1',
      slug: 'byval',
      title: 'BYVAL leaves the caller alone',
      type: 'mutate',
      minutes: 5,
      why: 'By default a parameter is a copy. BYREF is the exception, and using it by accident changes the caller’s variable.',
      docsAnchor: 'alevel-byref',
      body: `\`Zero\` sets its parameter to 0. The caller should still hold 5.

The parameter is passed **BYREF**, so the caller changes. Pass it by value instead. Output must be \`5\`.`,
      trap: 'Leaving the keyword off is by value. BYVAL is how you say it on purpose, including after a BYREF earlier in the same list.',
      starterCode: `PROCEDURE Zero(BYREF X : INTEGER)
    X <- 0
ENDPROCEDURE

DECLARE N : INTEGER
N <- 5
CALL Zero(N)
OUTPUT N`,
      solutionCode: `PROCEDURE Zero(BYVAL X : INTEGER)
    X <- 0
ENDPROCEDURE

DECLARE N : INTEGER
N <- 5
CALL Zero(N)
OUTPUT N`,
      expectedOutput: '5',
      mustContain: ['BYVAL'],
      mustNotContain: ['BYREF'],
      playable: true,
    },
    {
      id: 'as3.2',
      slug: 'swap',
      title: 'SWAP needs BYREF',
      type: 'grade',
      minutes: 7,
      why: 'The guide’s SWAP only works because both parameters are references. A copy would swap two locals and the caller would not change.',
      docsAnchor: 'alevel-byref',
      body: `Write \`SWAP\`. It receives two integers **by reference** and exchanges them.

BYREF applies to the parameters after it as well, until BYVAL. So \`BYREF X : INTEGER, Y : INTEGER\` covers both.

Read two integers and output them after the swap, one per line.

Example: \`1\` then \`2\` →

\`2\`
\`1\``,
      starterCode: `// PROCEDURE SWAP ...

DECLARE A : INTEGER
DECLARE B : INTEGER
INPUT A
INPUT B
CALL SWAP(A, B)
OUTPUT A
OUTPUT B`,
      solutionCode: `PROCEDURE SWAP(BYREF X : INTEGER, Y : INTEGER)
    DECLARE Temp : INTEGER
    Temp <- X
    X <- Y
    Y <- Temp
ENDPROCEDURE

DECLARE A : INTEGER
DECLARE B : INTEGER
INPUT A
INPUT B
CALL SWAP(A, B)
OUTPUT A
OUTPUT B`,
      tests: [
        { inputs: ['1', '2'], expectedOutput: '2\n1' },
        { inputs: ['9', '9'], expectedOutput: '9\n9' },
        { inputs: ['-1', '4'], expectedOutput: '4\n-1' },
        { inputs: ['0', '8'], expectedOutput: '8\n0' },
      ],
      mustContain: ['BYREF'],
      playable: true,
    },
    {
      id: 'as3.3',
      slug: 'sticky',
      title: 'BYREF sticks until BYVAL',
      type: 'mutate',
      minutes: 6,
      why: 'The keyword is not per parameter. It stays in force for the rest of the list, which is the mistake in a two-parameter procedure.',
      docsAnchor: 'alevel-byref',
      body: `\`Update\` should change the first argument to 100 and leave the second alone.

Both parameters are currently references, so B becomes 100 as well. Switch the second parameter back to by value.

Output must be:

\`100\`
\`2\``,
      starterCode: `PROCEDURE Update(BYREF X : INTEGER, Y : INTEGER)
    X <- 100
    Y <- 100
ENDPROCEDURE

DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 1
B <- 2
CALL Update(A, B)
OUTPUT A
OUTPUT B`,
      solutionCode: `PROCEDURE Update(BYREF X : INTEGER, BYVAL Y : INTEGER)
    X <- 100
    Y <- 100
ENDPROCEDURE

DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 1
B <- 2
CALL Update(A, B)
OUTPUT A
OUTPUT B`,
      expectedOutput: '100\n2',
      mustContain: ['BYVAL'],
      playable: true,
    },
    {
      id: 'as3.4',
      slug: 'max',
      title: 'A function returns a copy',
      type: 'grade',
      minutes: 6,
      why: 'RETURN hands back a value. The caller’s variables are unchanged unless you also used BYREF — functions are how Paper 2 avoids that.',
      docsAnchor: 'alevel-byref',
      body: `Write \`Max(A, B)\` so it returns the larger integer (either one if they are equal).

Read two integers and output \`Max\` of them.

Example: \`3\` then \`5\` → \`5\`.`,
      starterCode: `// FUNCTION Max(A : INTEGER, B : INTEGER) RETURNS INTEGER

DECLARE A : INTEGER
DECLARE B : INTEGER
INPUT A
INPUT B
OUTPUT Max(A, B)`,
      solutionCode: `FUNCTION Max(A : INTEGER, B : INTEGER) RETURNS INTEGER
    IF A > B THEN
        RETURN A
    ELSE
        RETURN B
    ENDIF
ENDFUNCTION

DECLARE A : INTEGER
DECLARE B : INTEGER
INPUT A
INPUT B
OUTPUT Max(A, B)`,
      tests: [
        { inputs: ['5', '3'], expectedOutput: '5' },
        { inputs: ['3', '5'], expectedOutput: '5' },
        { inputs: ['4', '4'], expectedOutput: '4' },
        { inputs: ['-1', '-8'], expectedOutput: '-1' },
      ],
      mustContain: ['RETURN', 'FUNCTION'],
      playable: true,
    },
    {
      id: 'as3.5',
      slug: 'params-quiz',
      title: 'Reference or copy?',
      type: 'quiz',
      minutes: 4,
      why: 'The paper asks which parameters change the caller. The sticky rule is the line most students miss.',
      docsAnchor: 'alevel-byref',
      body: `No keyword means by value. BYREF starts a run of references. BYVAL ends it.`,
      quiz: [
        {
          prompt: 'PROCEDURE P(BYREF X : INTEGER, Y : INTEGER). Which arguments can P change in the caller?',
          options: [
            { id: 'both', label: 'Both X and Y' },
            { id: 'x', label: 'Only X — Y has no keyword, so it is by value' },
            { id: 'neither', label: 'Neither — BYREF only applies to arrays' },
          ],
          correctId: 'both',
          explanation: 'BYREF sticks. Y is by reference too, until a BYVAL appears.',
        },
        {
          prompt: 'You pass 1 + 2 to a BYREF parameter. What happens?',
          options: [
            { id: 'err', label: 'It is rejected — BYREF needs a variable' },
            { id: 'ok', label: 'The expression is copied in, and the sum can be updated' },
            { id: 'zero', label: 'The parameter arrives as 0' },
          ],
          correctId: 'err',
          explanation: 'A reference has to name a variable (or an array element, or a field). An expression has nothing to write back to.',
        },
        {
          prompt: 'A function’s RETURN value is:',
          options: [
            { id: 'copy', label: 'A value handed back to the caller' },
            { id: 'ref', label: 'Always a reference, like BYREF' },
            { id: 'out', label: 'Written with OUTPUT inside the function instead' },
          ],
          correctId: 'copy',
          explanation: 'RETURN sends a value back. OUTPUT inside a function still prints, which is usually not what the question asked for.',
        },
      ],
      playable: true,
    },
    {
      id: 'as3.6',
      slug: 'discount',
      title: 'Boss: update the price in place',
      type: 'grade',
      minutes: 8,
      why: 'The procedure has to change the caller’s price. The rate is only an input. That is BYREF for one parameter and by value for the other.',
      docsAnchor: 'alevel-byref',
      body: `Write \`ApplyDiscount(BYREF Price, Rate)\`. It sets

**Price ← Price × (100 − Rate) DIV 100**

Read a price and a rate, call the procedure, and output the new price.

Example: \`200\` then \`10\` → \`180\`. Use DIV, not /, so the result is an integer.`,
      trap: 'If Price is not BYREF, the OUTPUT after the call still shows the original price.',
      starterCode: `// PROCEDURE ApplyDiscount(BYREF Price : INTEGER, Rate : INTEGER)

DECLARE Price : INTEGER
DECLARE Rate : INTEGER
INPUT Price
INPUT Rate
CALL ApplyDiscount(Price, Rate)
OUTPUT Price`,
      solutionCode: `PROCEDURE ApplyDiscount(BYREF Price : INTEGER, Rate : INTEGER)
    Price <- Price * (100 - Rate) DIV 100
ENDPROCEDURE

DECLARE Price : INTEGER
DECLARE Rate : INTEGER
INPUT Price
INPUT Rate
CALL ApplyDiscount(Price, Rate)
OUTPUT Price`,
      tests: [
        { inputs: ['200', '10'], expectedOutput: '180' },
        { inputs: ['100', '0'], expectedOutput: '100' },
        { inputs: ['50', '50'], expectedOutput: '25' },
        { inputs: ['80', '25'], expectedOutput: '60' },
      ],
      mustContain: ['BYREF', 'DIV'],
      playable: true,
    },
  ],
};
