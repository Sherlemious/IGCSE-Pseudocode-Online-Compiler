import type { LearnLevel } from '../types';

/** Free drill. Playground runs hit "index 0" and off-by-one often; almost nobody reaches the Arrays level. */
export const level13: LearnLevel = {
  number: 13,
  slug: '13',
  name: 'Slot 1',
  hours: '1.5',
  leaveWith: 'The first slot is [1], and a counter starts at 0',
  syllabus: '8.2',
  free: true,
  playable: true,
  drill: true,
  lessons: [
    {
      id: '13.1',
      slug: 'slot',
      title: 'The first slot is 1',
      type: 'mutate',
      minutes: 5,
      why: 'Cambridge arrays start at 1. Scores[0] is the single most common array crash in the playground.',
      docsAnchor: 'arrays-1d',
      body: `This program uses slot 0. Cambridge arrays declared \`ARRAY[1:5]\` have no slot 0.

Store 10 in the **first** slot and output it. The program should print \`10\`.`,
      trap: 'Change both the assignment and the OUTPUT. \`Scores[1]\` is the first slot.',
      starterCode: `DECLARE Scores : ARRAY[1:5] OF INTEGER
Scores[0] <- 10
OUTPUT Scores[0]`,
      solutionCode: `DECLARE Scores : ARRAY[1:5] OF INTEGER
Scores[1] <- 10
OUTPUT Scores[1]`,
      expectedOutput: '10',
      mustContain: ['Scores[1]'],
      playable: true,
    },
    {
      id: '13.2',
      slug: 'ends',
      title: 'First slot and last slot',
      type: 'grade',
      minutes: 6,
      why: 'A loop that starts at 0 walks off the front of the array. The first value you read is index 1. The last is the upper bound.',
      docsAnchor: 'arrays-1d',
      body: `Read **4** integers into \`Values[1]\` … \`Values[4]\`. Output the first, then the last.

Example: input \`8\`, \`2\`, \`5\`, \`9\` →

\`8\`
\`9\``,
      starterCode: `DECLARE Values : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER

// read four values, then OUTPUT Values[1] and Values[4]`,
      solutionCode: `DECLARE Values : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER

FOR i <- 1 TO 4
    INPUT Values[i]
NEXT i

OUTPUT Values[1]
OUTPUT Values[4]`,
      tests: [
        { inputs: ['8', '2', '5', '9'], expectedOutput: '8\n9' },
        { inputs: ['1', '1', '1', '1'], expectedOutput: '1\n1' },
        { inputs: ['4', '0', '0', '7'], expectedOutput: '4\n7' },
        { inputs: ['-1', '3', '3', '0'], expectedOutput: '-1\n0' },
      ],
      mustContain: ['[1]', '[4]'],
      playable: true,
    },
    {
      id: '13.3',
      slug: 'count',
      title: 'Count the passes',
      type: 'grade',
      minutes: 7,
      why: 'The counter pattern is where the Repeat level stalls. Start at 0, add 1 for each hit, output the number alone.',
      docsAnchor: 'arrays-1d',
      body: `Read **5** integer marks into an array. Output how many are **50 or more**.

Example: input \`40\`, \`50\`, \`49\`, \`80\`, \`100\` → \`3\`.`,
      trap: 'A mark of 50 counts. Start \`Count <- 0\` before the loop, or the first add has nothing to add to.',
      starterCode: `DECLARE Marks : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Count : INTEGER

// read five marks
// Count how many are >= 50
// OUTPUT Count`,
      solutionCode: `DECLARE Marks : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Count : INTEGER

FOR i <- 1 TO 5
    INPUT Marks[i]
NEXT i

Count <- 0
FOR i <- 1 TO 5
    IF Marks[i] >= 50 THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
      tests: [
        { inputs: ['40', '50', '49', '80', '100'], expectedOutput: '3' },
        { inputs: ['0', '0', '0', '0', '0'], expectedOutput: '0' },
        { inputs: ['50', '50', '50', '50', '50'], expectedOutput: '5' },
        { inputs: ['49', '49', '49', '49', '100'], expectedOutput: '1' },
      ],
      mustContain: ['Count <- Count + 1'],
      playable: true,
    },
    {
      id: '13.4',
      slug: 'boss',
      title: 'Boss: one mark, or Not found',
      type: 'grade',
      minutes: 8,
      why: 'Searching a list is a Paper 2 staple. "Not found" is printed once, after the loop, never inside it.',
      docsAnchor: 'arrays-1d',
      body: `The names and marks are already stored. Read a name. Output that student's mark, or \`Not found\` if the name is not there.

Example: input \`Ada\` → \`80\`. Input \`Zed\` → \`Not found\`.

Set \`Found <- FALSE\` before the loop. After \`NEXT\`, output \`Not found\` only when Found is still FALSE.`,
      trap: 'An ELSE inside the loop prints "Not found" for every other student.',
      starterCode: `DECLARE Names : ARRAY[1:3] OF STRING
DECLARE Marks : ARRAY[1:3] OF INTEGER
Names[1] <- "Ada"
Marks[1] <- 80
Names[2] <- "Bob"
Marks[2] <- 54
Names[3] <- "Cy"
Marks[3] <- 91

DECLARE Target : STRING
DECLARE Found : BOOLEAN
DECLARE i : INTEGER
Found <- FALSE
INPUT Target

// FOR i <- 1 TO 3
//     IF Names[i] = Target THEN OUTPUT Marks[i] and set Found <- TRUE
// After the loop: IF Found = FALSE THEN OUTPUT "Not found"`,
      solutionCode: `DECLARE Names : ARRAY[1:3] OF STRING
DECLARE Marks : ARRAY[1:3] OF INTEGER
Names[1] <- "Ada"
Marks[1] <- 80
Names[2] <- "Bob"
Marks[2] <- 54
Names[3] <- "Cy"
Marks[3] <- 91

DECLARE Target : STRING
DECLARE Found : BOOLEAN
DECLARE i : INTEGER
Found <- FALSE
INPUT Target

FOR i <- 1 TO 3
    IF Names[i] = Target THEN
        OUTPUT Marks[i]
        Found <- TRUE
    ENDIF
NEXT i

IF Found = FALSE THEN
    OUTPUT "Not found"
ENDIF`,
      tests: [
        { inputs: ['Ada'], expectedOutput: '80' },
        { inputs: ['Bob'], expectedOutput: '54' },
        { inputs: ['Cy'], expectedOutput: '91' },
        { inputs: ['Zed'], expectedOutput: 'Not found' },
      ],
      mustContain: ['Not found'],
      playable: true,
    },
  ],
};
