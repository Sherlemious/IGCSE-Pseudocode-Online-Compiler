import type { LearnLevel } from '../types';

export const level10: LearnLevel = {
  number: 10,
  slug: '10',
  name: 'Paper',
  hours: '5.5',
  leaveWith: 'Validation, traces, bubble sort, SQL, gates, 15-mark skeleton',
  syllabus: '7.4–7.9, 9, 10',
  free: false,
  playable: true,
  lessons: [
    {
      id: '10.1',
      slug: 'validation',
      title: 'Validation checks',
      type: 'grade',
      minutes: 8,
      why: 'Range, length, type, presence, format, check digit — REPEAT UNTIL is the usual wrapper.',
      docsAnchor: 'repeat',
      body: `Keep reading an integer **Age** until it is between **0 and 120** inclusive (a **range check**). Then output it.

The syllabus also names length, type, presence, format and check digit — those are the labels to learn even when the program only needs a range.

Example: input \`-1\`, then \`200\`, then \`16\` → \`16\`.`,
      trap: 'Validation is not verification. Validation asks “is this data reasonable?” Verification asks “did we copy it correctly?”',
      starterCode: `DECLARE Age : INTEGER

// REPEAT INPUT Age UNTIL 0 to 120, then OUTPUT Age`,
      solutionCode: `DECLARE Age : INTEGER

REPEAT
    INPUT Age
UNTIL Age >= 0 AND Age <= 120
OUTPUT Age`,
      tests: [
        { inputs: ['16'], expectedOutput: '16' },
        { inputs: ['-1', '200', '16'], expectedOutput: '16' },
        { inputs: ['0'], expectedOutput: '0' },
        { inputs: ['120'], expectedOutput: '120' },
        { inputs: ['121', '0'], expectedOutput: '0' },
      ],
      mustContain: ['REPEAT', 'UNTIL'],
      playable: true,
    },
    {
      id: '10.9',
      slug: 'presence',
      title: 'Presence check',
      type: 'grade',
      minutes: 8,
      why: 'Presence means “not empty”. REPEAT UNTIL LENGTH(Name) > 0 is the usual wrapper.',
      docsAnchor: 'repeat',
      body: `Keep reading a **STRING** Name until it is not empty (a **presence check**). Then output the name.

An empty INPUT is a zero-length string. Reject it and read again.

Example: input (empty), then \`Ada\` → \`Ada\`.`,
      trap: 'Empty is LENGTH 0, not the letters "empty". Do not compare Name to a space unless the question says so.',
      starterCode: `DECLARE Name : STRING

// REPEAT INPUT Name UNTIL it is not empty, then OUTPUT Name`,
      solutionCode: `DECLARE Name : STRING

REPEAT
    INPUT Name
UNTIL LENGTH(Name) > 0
OUTPUT Name`,
      tests: [
        { inputs: ['Ada'], expectedOutput: 'Ada' },
        { inputs: ['', 'Ada'], expectedOutput: 'Ada' },
        { inputs: ['', '', 'Bob'], expectedOutput: 'Bob' },
        { inputs: ['X'], expectedOutput: 'X' },
        { inputs: ['', 'Paper'], expectedOutput: 'Paper' },
      ],
      mustContain: ['REPEAT', 'UNTIL', 'LENGTH'],
      playable: true,
    },
    {
      id: '10.2',
      slug: 'test-data',
      title: 'Test data and verification',
      type: 'quiz',
      minutes: 8,
      why: 'Normal, abnormal, extreme, boundary — the four labels Paper 2 uses when it asks you to suggest test data.',
      body: `A field **Age** is valid when it is an integer from 0 to 120 inclusive.`,
      quiz: [
        {
          prompt: 'Which is extreme (boundary) test data for Age 0–120?',
          options: [
            { id: 'fifty', label: '50' },
            { id: 'zero', label: '0 and 120' },
            { id: 'hello', label: '"hello"' },
          ],
          correctId: 'zero',
          explanation: 'Extreme / boundary values sit on the edge of the valid range: 0 and 120.',
        },
        {
          prompt: 'Which is abnormal test data for that Age field?',
          options: [
            { id: 'ten', label: '10' },
            { id: 'neg', label: '-5 or 200 or "abc"' },
            { id: 'hundred', label: '100' },
          ],
          correctId: 'neg',
          explanation: 'Abnormal data is outside the rules: too small, too big, or the wrong type.',
        },
        {
          prompt: 'Verification is best described as:',
          options: [
            { id: 'range', label: 'Checking a value is in range' },
            { id: 'copy', label: 'Checking data was copied / entered accurately (e.g. double entry)' },
            { id: 'eof', label: 'Checking a file is not at EOF' },
          ],
          correctId: 'copy',
          explanation: 'Validation = reasonable. Verification = matches the original (double entry, on-screen check).',
        },
      ],
      playable: true,
    },
    {
      id: '10.3',
      slug: 'errors',
      title: 'Find four errors',
      type: 'mutate',
      minutes: 10,
      why: 'Specimen-style error hunt: the program is close. Four slips stop it matching the mark scheme.',
      body: `This program should add **1 to 5** and output **15**. It has four errors:

1. Assignment uses **=** instead of **<-**
2. The loop goes **TO 4**, not 5
3. **OUTPUT total** uses the wrong case
4. The IF is missing **ENDIF**

Fix all four. Output must be \`15\`.`,
      trap: 'Variable names are case-sensitive here. `total` is not `Total`.',
      starterCode: `DECLARE Total : INTEGER
DECLARE i : INTEGER
Total = 0
FOR i <- 1 TO 4
    Total <- Total + i
NEXT i
IF Total > 0 THEN
OUTPUT total`,
      solutionCode: `DECLARE Total : INTEGER
DECLARE i : INTEGER
Total <- 0
FOR i <- 1 TO 5
    Total <- Total + i
NEXT i
IF Total > 0 THEN
    OUTPUT Total
ENDIF`,
      expectedOutput: '15',
      mustContain: ['Total <- 0', 'TO 5', 'OUTPUT Total', 'ENDIF'],
      playable: true,
    },
    {
      id: '10.10',
      slug: 'more-errors',
      title: 'Find more errors',
      type: 'mutate',
      minutes: 10,
      why: 'A second error hunt: comparison, assignment, case of identifiers, missing ENDIF.',
      body: `This program should output the **larger** of 7 and 12, which is **12**. It has four errors:

1. Assignment uses **=** instead of **<-**
2. The IF is missing **THEN**
3. **OUTPUT a** uses the wrong identifier
4. The IF is missing **ENDIF**

Fix all four. Output must be \`12\`.`,
      trap: 'Identifiers are case-sensitive here. `a` is not `A`.',
      starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 7
B = 12
IF A > B
    OUTPUT A
ELSE
    OUTPUT a`,
      solutionCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 7
B <- 12
IF A > B THEN
    OUTPUT A
ELSE
    OUTPUT B
ENDIF`,
      expectedOutput: '12',
      mustContain: ['B <- 12', 'THEN', 'OUTPUT B', 'ENDIF'],
      playable: true,
    },
    {
      id: '10.4',
      slug: 'trace',
      title: 'Blank trace table',
      type: 'quiz',
      minutes: 12,
      why: 'Fill cells, then reveal the live trace. Paper 2 pays for the dry-run skill, not for typing fast.',
      body: `Dry-run this snippet. Fill the blank cells, then **Run** it on the right — the live trace should match.

\`\`\`
A <- 3
B <- 5
A <- A + B
B <- A - B
OUTPUT A
OUTPUT B
\`\`\`

| Statement | A | B |
| --- | --- | --- |
| A <- 3 |  |  |
| B <- 5 |  |  |
| A <- A + B |  |  |
| B <- A - B |  |  |

Work left to right, top to bottom. A change overwrites the cell.`,
      starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 3
B <- 5
A <- A + B
B <- A - B
OUTPUT A
OUTPUT B`,
      quiz: [
        {
          prompt: 'After `A <- A + B`, what is A?',
          options: [
            { id: 'three', label: '3' },
            { id: 'eight', label: '8' },
            { id: 'five', label: '5' },
          ],
          correctId: 'eight',
          explanation: 'A was 3, B was 5, so A becomes 8. B is still 5 at that moment.',
        },
        {
          prompt: 'After `B <- A - B`, what is B?',
          options: [
            { id: 'two', label: '2' },
            { id: 'three', label: '3' },
            { id: 'eight', label: '8' },
          ],
          correctId: 'three',
          explanation: 'A is already 8, B is still 5, so B becomes 8 - 5 = 3. (This pair swapped 3 and 5 into 8 and 3.)',
        },
        {
          prompt: 'What two lines does OUTPUT print, in order?',
          options: [
            { id: 'orig', label: '3 then 5' },
            { id: 'swap', label: '8 then 3' },
            { id: 'same', label: '5 then 3' },
          ],
          correctId: 'swap',
          explanation: 'Final A is 8, final B is 3.',
        },
      ],
      playable: true,
    },
    {
      id: '10.5',
      slug: 'flowchart',
      title: 'Flowchart → pseudocode',
      type: 'quiz',
      minutes: 8,
      why: 'Diamond is a condition: IF or a loop test. Rectangles are processes. Parallelograms are INPUT/OUTPUT.',
      body: `A fragment of a flowchart:

\`\`\`
        [Start]
           |
     / Age < 18? \\
    |             |
   yes           no
    |             |
 OUTPUT         OUTPUT
 "Child"        "Adult"
    |             |
     \\           /
        [End]
\`\`\`

A diamond with two arrows is selection. A diamond that loops back is iteration.`,
      quiz: [
        {
          prompt: 'The diamond “Age < 18?” becomes which pseudocode?',
          options: [
            { id: 'if', label: 'IF Age < 18 THEN … ELSE … ENDIF' },
            { id: 'for', label: 'FOR Age <- 1 TO 18' },
            { id: 'case', label: 'CASE OF Age' },
          ],
          correctId: 'if',
          explanation: 'Two outgoing arrows from a yes/no diamond is an IF … ELSE.',
        },
        {
          prompt: 'A parallelogram labelled “INPUT Age” is:',
          options: [
            { id: 'proc', label: 'A process rectangle you ignore' },
            { id: 'io', label: 'An INPUT (or OUTPUT) statement' },
            { id: 'term', label: 'The start/end terminator' },
          ],
          correctId: 'io',
          explanation: 'Parallelograms are I/O. Terminals (rounded) are Start/End. Rectangles are processes.',
        },
        {
          prompt: 'A diamond whose “no” arrow goes back above the diamond is usually:',
          options: [
            { id: 'if', label: 'IF without ELSE' },
            { id: 'loop', label: 'A loop condition (WHILE or REPEAT)' },
            { id: 'case', label: 'CASE OF' },
          ],
          correctId: 'loop',
          explanation: 'A back-edge from the decision is iteration. WHERE the test sits (before vs after the body) chooses WHILE vs REPEAT.',
        },
      ],
      playable: true,
    },
    {
      id: '10.6',
      slug: 'sort',
      title: 'Bubble sort with Temp',
      type: 'grade',
      minutes: 10,
      why: 'Do not write “swap” as English. Three assignments through Temp is the mark.',
      docsAnchor: 'arrays-1d',
      body: `The array is \`4, 1, 3, 2\`. Bubble-sort it **ascending** and output the four values, one per line.

Use a **Temp** variable for the swap.`,
      trap: '`CALL Swap(...)` is not on the syllabus. Temp <- A, A <- B, B <- Temp.',
      starterCode: `DECLARE Num : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Temp : INTEGER

Num[1] <- 4
Num[2] <- 1
Num[3] <- 3
Num[4] <- 2

// bubble sort, then OUTPUT each slot`,
      solutionCode: `DECLARE Num : ARRAY[1:4] OF INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Temp : INTEGER

Num[1] <- 4
Num[2] <- 1
Num[3] <- 3
Num[4] <- 2

FOR i <- 1 TO 3
    FOR j <- 1 TO 4 - i
        IF Num[j] > Num[j + 1] THEN
            Temp <- Num[j]
            Num[j] <- Num[j + 1]
            Num[j + 1] <- Temp
        ENDIF
    NEXT j
NEXT i
FOR i <- 1 TO 4
    OUTPUT Num[i]
NEXT i`,
      expectedOutput: '1\n2\n3\n4',
      mustContain: ['Temp'],
      mustNotContain: ['CALL Swap', 'swap('],
      playable: true,
    },
    {
      id: '10.7',
      slug: 'closed',
      title: 'SQL and truth tables',
      type: 'quiz',
      minutes: 10,
      why: 'Small closed topics — sit them first in the hall. They are quick marks if you have the tables memorised.',
      body: `**SQL** (from a table Student with fields Name, Age, House):

\`SELECT Name FROM Student WHERE Age > 16\`

**AND** is only TRUE when both sides are TRUE. **OR** is TRUE if either side is TRUE. **NOT** flips.`,
      quiz: [
        {
          prompt: 'SELECT Name FROM Student WHERE House = \'Red\' AND Age >= 15  returns:',
          options: [
            { id: 'all', label: 'Every student in Red, of any age' },
            { id: 'both', label: 'Red-house students who are 15 or older' },
            { id: 'or', label: 'Anyone in Red, plus anyone 15 or older' },
          ],
          correctId: 'both',
          explanation: 'AND requires both conditions. OR would union the two groups.',
        },
        {
          prompt: 'If A is TRUE and B is FALSE, A AND B is:',
          options: [
            { id: 't', label: 'TRUE' },
            { id: 'f', label: 'FALSE' },
            { id: 'x', label: 'Undefined' },
          ],
          correctId: 'f',
          explanation: 'AND is TRUE only when both inputs are TRUE.',
        },
        {
          prompt: 'If A is TRUE and B is FALSE, A OR NOT B is:',
          options: [
            { id: 't', label: 'TRUE' },
            { id: 'f', label: 'FALSE' },
            { id: 'x', label: 'FALSE then TRUE' },
          ],
          correctId: 't',
          explanation: 'NOT B is TRUE, and TRUE OR TRUE is TRUE. Even without that, A is already TRUE.',
        },
      ],
      playable: true,
    },
    {
      id: '10.8',
      slug: 'scenario',
      title: 'Boss: timed 15-mark',
      type: 'grade',
      minutes: 30,
      why: 'DECLARE → init → INPUT + validation → loop → OUTPUT. In the hall this is about 15 minutes — no compiler.',
      docsAnchor: 'input',
      body: `A club stores race times.

1. **REPEAT** until Count is between **1 and 10**
2. Read **Count** integers (the times)
3. Output their **total**

In the exam you would write this on paper. Here, Check is the mark scheme.

Example: input \`0\`, then \`3\`, then \`10\`, \`20\`, \`5\` → \`35\`.`,
      trap: 'Validate Count first. Then loop Count times. Total <- 0 before that loop.',
      starterCode: `DECLARE Count : INTEGER
DECLARE Time : INTEGER
DECLARE Total : INTEGER
DECLARE i : INTEGER

// validate Count 1–10, totaller, OUTPUT Total`,
      solutionCode: `DECLARE Count : INTEGER
DECLARE Time : INTEGER
DECLARE Total : INTEGER
DECLARE i : INTEGER

REPEAT
    INPUT Count
UNTIL Count >= 1 AND Count <= 10

Total <- 0
FOR i <- 1 TO Count
    INPUT Time
    Total <- Total + Time
NEXT i
OUTPUT Total`,
      tests: [
        { inputs: ['3', '10', '20', '5'], expectedOutput: '35' },
        { inputs: ['0', '3', '10', '20', '5'], expectedOutput: '35' },
        { inputs: ['1', '9'], expectedOutput: '9' },
        { inputs: ['11', '2', '4', '6'], expectedOutput: '10' },
        { inputs: ['10', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'], expectedOutput: '10' },
      ],
      playable: true,
    },
  ],
};
