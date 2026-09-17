import type { LearnLevel } from '../types';

export const level7: LearnLevel = {
  number: 7,
  slug: '7',
  name: 'Arrays',
  hours: '4',
  leaveWith: 'ARRAY[1:n], fill loop, linear search, 2D [row, col]',
  syllabus: '8.2, 7.4',
  free: false,
  playable: true,
  lessons: [
    {
      id: '7.1',
      slug: 'declare',
      title: 'DECLARE ARRAY[1:n]',
      type: 'run',
      minutes: 5,
      why: 'Bounds come from the question. Lower bound is usually 1 — the same 1-based habit as STRING.',
      docsAnchor: 'arrays-1d',
      body: `**DECLARE Name : ARRAY[1:n] OF TYPE**. Index with square brackets: \`Scores[1]\`.

Store 10 in slot 1 and output it.`,
      trap: '`Scores[0]` is not the first slot. Cambridge arrays almost always start at 1.',
      starterCode: `DECLARE Scores : ARRAY[1:5] OF INTEGER
Scores[1] <- 10
OUTPUT Scores[1]`,
      solutionCode: `DECLARE Scores : ARRAY[1:5] OF INTEGER
Scores[1] <- 10
OUTPUT Scores[1]`,
      expectedOutput: '10',
      mustContain: ['ARRAY[1:5]'],
      playable: true,
    },
    {
      id: '7.2',
      slug: 'fill',
      title: 'Fill every slot with FOR',
      type: 'grade',
      minutes: 8,
      why: 'The fill loop is the array’s first friend. You cannot OUTPUT an array as a whole — walk it.',
      docsAnchor: 'arrays-1d',
      body: `Read **3** integers into \`Num[1]\` … \`Num[3]\`, then output them in order, one per line.

Example: input \`8\`, \`2\`, \`5\` →

\`8\`
\`2\`
\`5\``,
      starterCode: `DECLARE Num : ARRAY[1:3] OF INTEGER
DECLARE i : INTEGER

// fill with INPUT, then OUTPUT each slot`,
      solutionCode: `DECLARE Num : ARRAY[1:3] OF INTEGER
DECLARE i : INTEGER

FOR i <- 1 TO 3
    INPUT Num[i]
NEXT i
FOR i <- 1 TO 3
    OUTPUT Num[i]
NEXT i`,
      tests: [
        { inputs: ['8', '2', '5'], expectedOutput: '8\n2\n5' },
        { inputs: ['0', '0', '0'], expectedOutput: '0\n0\n0' },
        { inputs: ['-1', '2', '-3'], expectedOutput: '-1\n2\n-3' },
        { inputs: ['9', '8', '7'], expectedOutput: '9\n8\n7' },
      ],
      playable: true,
    },
    {
      id: '7.3',
      slug: 'scan',
      title: 'Totaller/counter over the array',
      type: 'grade',
      minutes: 8,
      why: 'One pass, two patterns: add every slot, count the ones that match a condition.',
      docsAnchor: 'arrays-1d',
      body: `The array already has 4 values after you read them. Output two lines:

1. The **sum** of all four
2. How many values are **greater than 0**

Example: input \`3\`, \`-1\`, \`0\`, \`4\` →

\`6\`
\`2\``,
      starterCode: `DECLARE Num : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER

FOR i <- 1 TO 4
    INPUT Num[i]
NEXT i

// totaller + counter, then OUTPUT Total and Count`,
      solutionCode: `DECLARE Num : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER

FOR i <- 1 TO 4
    INPUT Num[i]
NEXT i

Total <- 0
Count <- 0
FOR i <- 1 TO 4
    Total <- Total + Num[i]
    IF Num[i] > 0 THEN
        Count <- Count + 1
    ENDIF
NEXT i
OUTPUT Total
OUTPUT Count`,
      tests: [
        { inputs: ['3', '-1', '0', '4'], expectedOutput: '6\n2' },
        { inputs: ['1', '1', '1', '1'], expectedOutput: '4\n4' },
        { inputs: ['-2', '-3', '0', '0'], expectedOutput: '-5\n0' },
        { inputs: ['10', '20', '-5', '0'], expectedOutput: '25\n2' },
      ],
      playable: true,
    },
    {
      id: '7.4',
      slug: 'search',
      title: 'Linear search + Found flag',
      type: 'grade',
      minutes: 10,
      why: 'Memorise the template, then vary it. Found is BOOLEAN, not a STRING "TRUE".',
      docsAnchor: 'arrays-1d',
      body: `The array is already filled with 10, 20, 30, 40, 50. Read a **Target**. Output **TRUE** if Target is in the array, otherwise **FALSE**.

Use a **Found** flag. Do not stop early if you prefer a full pass — either is accepted here.`,
      trap: 'Found starts FALSE. Set it TRUE when you hit the target. Do not store `"TRUE"` as a STRING.',
      starterCode: `DECLARE Num : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN

Num[1] <- 10
Num[2] <- 20
Num[3] <- 30
Num[4] <- 40
Num[5] <- 50

INPUT Target
Found <- FALSE

// linear search, then OUTPUT Found`,
      solutionCode: `DECLARE Num : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN

Num[1] <- 10
Num[2] <- 20
Num[3] <- 30
Num[4] <- 40
Num[5] <- 50

INPUT Target
Found <- FALSE
FOR i <- 1 TO 5
    IF Num[i] = Target THEN
        Found <- TRUE
    ENDIF
NEXT i
OUTPUT Found`,
      tests: [
        { inputs: ['30'], expectedOutput: 'TRUE' },
        { inputs: ['10'], expectedOutput: 'TRUE' },
        { inputs: ['50'], expectedOutput: 'TRUE' },
        { inputs: ['15'], expectedOutput: 'FALSE' },
        { inputs: ['0'], expectedOutput: 'FALSE' },
      ],
      mustContain: ['Found'],
      playable: true,
    },
    {
      id: '7.5',
      slug: 'extreme',
      title: 'Max / min / average',
      type: 'grade',
      minutes: 8,
      why: 'Initialise max from the first element, not from 0. Zero fails when every value is negative.',
      docsAnchor: 'arrays-1d',
      body: `Read 4 integers into an array. Output three lines: **maximum**, **minimum**, then the **integer average** (sum DIV 4).

Example: input \`4\`, \`9\`, \`1\`, \`6\` →

\`9\`
\`1\`
\`5\``,
      trap: '`Max <- 0` looks safe and is wrong for negatives. `Max <- Num[1]` is the Cambridge habit.',
      starterCode: `DECLARE Num : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER
DECLARE Max : INTEGER
DECLARE Min : INTEGER
DECLARE Total : INTEGER

FOR i <- 1 TO 4
    INPUT Num[i]
NEXT i

// OUTPUT max, min, then Total DIV 4`,
      solutionCode: `DECLARE Num : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER
DECLARE Max : INTEGER
DECLARE Min : INTEGER
DECLARE Total : INTEGER

FOR i <- 1 TO 4
    INPUT Num[i]
NEXT i

Max <- Num[1]
Min <- Num[1]
Total <- Num[1]
FOR i <- 2 TO 4
    IF Num[i] > Max THEN
        Max <- Num[i]
    ENDIF
    IF Num[i] < Min THEN
        Min <- Num[i]
    ENDIF
    Total <- Total + Num[i]
NEXT i
OUTPUT Max
OUTPUT Min
OUTPUT Total DIV 4`,
      tests: [
        { inputs: ['4', '9', '1', '6'], expectedOutput: '9\n1\n5' },
        { inputs: ['-2', '-8', '-3', '-1'], expectedOutput: '-1\n-8\n-3' },
        { inputs: ['5', '5', '5', '5'], expectedOutput: '5\n5\n5' },
        { inputs: ['10', '0', '0', '6'], expectedOutput: '10\n0\n4' },
      ],
      playable: true,
    },
    {
      id: '7.6',
      slug: 'grid',
      title: '2D arrays [row, col]',
      type: 'grade',
      minutes: 12,
      why: 'Nested FOR. Row first in Cambridge wording: ARRAY[1:rows, 1:cols] and Grid[Row, Col].',
      docsAnchor: 'arrays-2d',
      body: `Read four integers into a 2×2 grid (row by row). Output the **sum** of all four cells.

Example: input \`1\`, \`2\`, \`3\`, \`4\` → \`10\`.`,
      trap: '`Grid[Row, Col]` with a comma. Two pairs of brackets is a different language.',
      starterCode: `DECLARE Grid : ARRAY[1:2, 1:2] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE Total : INTEGER

// fill the grid, then OUTPUT the sum`,
      solutionCode: `DECLARE Grid : ARRAY[1:2, 1:2] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE Total : INTEGER

FOR Row <- 1 TO 2
    FOR Col <- 1 TO 2
        INPUT Grid[Row, Col]
    NEXT Col
NEXT Row
Total <- 0
FOR Row <- 1 TO 2
    FOR Col <- 1 TO 2
        Total <- Total + Grid[Row, Col]
    NEXT Col
NEXT Row
OUTPUT Total`,
      tests: [
        { inputs: ['1', '2', '3', '4'], expectedOutput: '10' },
        { inputs: ['0', '0', '0', '0'], expectedOutput: '0' },
        { inputs: ['-1', '1', '-1', '1'], expectedOutput: '0' },
        { inputs: ['10', '20', '30', '40'], expectedOutput: '100' },
      ],
      mustContain: ['ARRAY[1:2, 1:2]'],
      playable: true,
    },
    {
      id: '7.7',
      slug: 'boss',
      title: 'Boss: Medium 1D then Easy 2D',
      type: 'grade',
      minutes: 15,
      why: 'Level gate: search a list, then total a tiny grid — the two array skills Paper 2 actually asks.',
      docsAnchor: 'arrays-1d',
      body: `First, the 1D array is \`5, 8, 3, 8, 1\`. Read a **Target**. Output **TRUE** if it appears, else **FALSE**.

Then read four integers into a 2×2 grid and output the **sum**.

Example: input \`8\`, then \`1\`, \`2\`, \`3\`, \`4\` →

\`TRUE\`
\`10\``,
      starterCode: `DECLARE Num : ARRAY[1:5] OF INTEGER
DECLARE Grid : ARRAY[1:2, 1:2] OF INTEGER
DECLARE i : INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
DECLARE Total : INTEGER

Num[1] <- 5
Num[2] <- 8
Num[3] <- 3
Num[4] <- 8
Num[5] <- 1

INPUT Target
Found <- FALSE
// search, OUTPUT Found
// then fill Grid, OUTPUT its sum`,
      solutionCode: `DECLARE Num : ARRAY[1:5] OF INTEGER
DECLARE Grid : ARRAY[1:2, 1:2] OF INTEGER
DECLARE i : INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
DECLARE Total : INTEGER

Num[1] <- 5
Num[2] <- 8
Num[3] <- 3
Num[4] <- 8
Num[5] <- 1

INPUT Target
Found <- FALSE
FOR i <- 1 TO 5
    IF Num[i] = Target THEN
        Found <- TRUE
    ENDIF
NEXT i
OUTPUT Found

Total <- 0
FOR Row <- 1 TO 2
    FOR Col <- 1 TO 2
        INPUT Grid[Row, Col]
        Total <- Total + Grid[Row, Col]
    NEXT Col
NEXT Row
OUTPUT Total`,
      tests: [
        { inputs: ['8', '1', '2', '3', '4'], expectedOutput: 'TRUE\n10' },
        { inputs: ['3', '0', '0', '0', '0'], expectedOutput: 'TRUE\n0' },
        { inputs: ['9', '5', '5', '5', '5'], expectedOutput: 'FALSE\n20' },
        { inputs: ['1', '10', '20', '30', '40'], expectedOutput: 'TRUE\n100' },
      ],
      playable: true,
    },
  ],
};
