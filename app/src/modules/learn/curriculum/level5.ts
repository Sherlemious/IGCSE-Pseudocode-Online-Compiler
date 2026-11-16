import type { LearnLevel } from '../types';

export const level5: LearnLevel = {
  number: 5,
  slug: '5',
  name: 'Repeat',
  hours: '4.5',
  leaveWith: 'Totaller, counter, flag; pick FOR / WHILE / REPEAT',
  syllabus: '8.1.4c–d, 8.1.5',
  free: false,
  playable: true,
  lessons: [
    {
      id: '5.1',
      slug: 'for',
      title: 'FOR … TO … NEXT',
      type: 'run',
      minutes: 6,
      why: 'NEXT must match the counter identifier. FOR is the loop when you know how many times.',
      docsAnchor: 'for',
      body: `**FOR** counter **<-** start **TO** end, body, **NEXT** counter.

Output the integers 1 to 5, each on its own line.`,
      trap: '`for i in range(5):` is Python. IGCSE is `FOR i <- 1 TO 5` … `NEXT i`.',
      starterCode: `DECLARE i : INTEGER

FOR i <- 1 TO 5
    OUTPUT i
NEXT i`,
      solutionCode: `DECLARE i : INTEGER

FOR i <- 1 TO 5
    OUTPUT i
NEXT i`,
      expectedOutput: '1\n2\n3\n4\n5',
      mustContain: ['FOR', 'NEXT'],
      playable: true,
    },
    {
      id: '5.9',
      slug: 'for-step',
      title: 'FOR … STEP',
      type: 'run',
      minutes: 5,
      why: 'STEP changes the counter by more than 1. Default STEP is +1 when you omit it.',
      docsAnchor: 'for',
      body: `**FOR** counter **<-** start **TO** end **STEP** size.

Output the even numbers **2, 4, 6, 8, 10**, each on its own line.`,
      trap: 'STEP sits on the FOR line, not on NEXT. `FOR i <- 2 TO 10 STEP 2`.',
      starterCode: `DECLARE i : INTEGER

FOR i <- 2 TO 10 STEP 2
    OUTPUT i
NEXT i`,
      solutionCode: `DECLARE i : INTEGER

FOR i <- 2 TO 10 STEP 2
    OUTPUT i
NEXT i`,
      expectedOutput: '2\n4\n6\n8\n10',
      mustContain: ['STEP'],
      playable: true,
    },
    {
      id: '5.2',
      slug: 'totaller',
      title: 'The totaller pattern',
      type: 'run',
      minutes: 6,
      why: 'Total <- 0 before the loop. Always. Forgetting the init is a classic trace-table zero.',
      docsAnchor: 'for',
      body: `A **totaller** adds into one variable each pass.

1. \`Total <- 0\` **before** the loop
2. \`Total <- Total + value\` **inside** the loop

Sum 1 to 10 and output the total (55).`,
      trap: 'Do not start Total at 1 unless the question says so. Zero, then add.',
      starterCode: `DECLARE Total : INTEGER
DECLARE i : INTEGER

Total <- 0
FOR i <- 1 TO 10
    Total <- Total + i
NEXT i
OUTPUT Total`,
      solutionCode: `DECLARE Total : INTEGER
DECLARE i : INTEGER

Total <- 0
FOR i <- 1 TO 10
    Total <- Total + i
NEXT i
OUTPUT Total`,
      expectedOutput: '55',
      mustContain: ['Total <- 0'],
      playable: true,
    },
    {
      id: '5.3',
      slug: 'counter',
      title: 'The counter pattern',
      type: 'grade',
      minutes: 6,
      why: 'Count <- Count + 1 only inside the IF. Counting every pass is totalling the wrong thing.',
      docsAnchor: 'for',
      body: `Read an integer **N**, then **N** more integers. Count how many are **greater than 0**. Output that count.

Example: input \`4\` then \`1\`, \`-2\`, \`0\`, \`5\` → \`2\`.`,
      trap: 'Zero is not positive. Increment only when the condition is true.',
      starterCode: `DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE Count : INTEGER
DECLARE i : INTEGER

INPUT N
Count <- 0

// loop N times, count positives, OUTPUT Count`,
      solutionCode: `DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE Count : INTEGER
DECLARE i : INTEGER

INPUT N
Count <- 0
FOR i <- 1 TO N
    INPUT Value
    IF Value > 0 THEN
        Count <- Count + 1
    ENDIF
NEXT i
OUTPUT Count`,
      tests: [
        { inputs: ['4', '1', '-2', '0', '5'], expectedOutput: '2' },
        { inputs: ['3', '-1', '-2', '-3'], expectedOutput: '0' },
        { inputs: ['1', '8'], expectedOutput: '1' },
        { inputs: ['5', '0', '0', '1', '0', '2'], expectedOutput: '2' },
        { inputs: ['2', '10', '20'], expectedOutput: '2' },
      ],
      mustContain: ['Count <- Count + 1'],
      playable: true,
    },
    {
      id: '5.4',
      slug: 'while',
      title: 'WHILE can run zero times',
      type: 'run',
      minutes: 6,
      why: 'Pre-condition loop: the test runs before the body. If it is already false, the body never runs.',
      docsAnchor: 'while',
      body: `**WHILE** condition **DO** … **ENDWHILE**.

Here **N** starts at 0, so the loop body must not run. The program should still print **Done**.`,
      trap: 'A WHILE that should run at least once is usually a REPEAT UNTIL. Pick the loop from the question, not from habit.',
      starterCode: `DECLARE N : INTEGER
N <- 0

WHILE N > 0 DO
    OUTPUT N
    N <- N - 1
ENDWHILE
OUTPUT "Done"`,
      solutionCode: `DECLARE N : INTEGER
N <- 0

WHILE N > 0 DO
    OUTPUT N
    N <- N - 1
ENDWHILE
OUTPUT "Done"`,
      expectedOutput: 'Done',
      mustContain: ['WHILE', 'ENDWHILE'],
      playable: true,
    },
    {
      id: '5.10',
      slug: 'sentinel',
      title: 'Sentinel WHILE',
      type: 'grade',
      minutes: 8,
      why: 'Read until a stopper value. Prime INPUT before the WHILE, and do not process the sentinel.',
      docsAnchor: 'while',
      body: `Read names until the user types **END**. Output each name except END.

Prime: INPUT once **before** the loop. WHILE the name is not END, OUTPUT it, then INPUT the next.

Example: input \`Ada\`, \`Bob\`, \`END\` →

\`Ada\`
\`Bob\``,
      trap: 'Do not OUTPUT the sentinel. If END is first, the body must not run.',
      starterCode: `DECLARE Name : STRING

INPUT Name
// WHILE Name <> "END" DO
//     OUTPUT Name
//     INPUT Name
// ENDWHILE`,
      solutionCode: `DECLARE Name : STRING

INPUT Name
WHILE Name <> "END" DO
    OUTPUT Name
    INPUT Name
ENDWHILE`,
      tests: [
        { inputs: ['Ada', 'Bob', 'END'], expectedOutput: 'Ada\nBob' },
        { inputs: ['Sam', 'END'], expectedOutput: 'Sam' },
        { inputs: ['Ann', 'Bea', 'Cal', 'END'], expectedOutput: 'Ann\nBea\nCal' },
        { inputs: ['Zed', 'END'], expectedOutput: 'Zed' },
      ],
      mustContain: ['WHILE', '"END"'],
      playable: true,
    },
    {
      id: '5.5',
      slug: 'repeat',
      title: 'REPEAT UNTIL validation',
      type: 'grade',
      minutes: 6,
      why: 'Post-condition — the body always runs once, so you get at least one prompt. That is why validation uses REPEAT.',
      docsAnchor: 'repeat',
      body: `Keep reading an integer until it is between **1 and 10** inclusive. Then output that valid value.

Example: input \`0\`, then \`11\`, then \`5\` → \`5\`.`,
      trap: 'UNTIL is the exit condition (stop when TRUE). WHILE is the continue condition. Mixing them is a common trace error.',
      starterCode: `DECLARE N : INTEGER

// REPEAT … UNTIL N is 1 to 10, then OUTPUT N`,
      solutionCode: `DECLARE N : INTEGER

REPEAT
    INPUT N
UNTIL N >= 1 AND N <= 10
OUTPUT N`,
      tests: [
        { inputs: ['5'], expectedOutput: '5' },
        { inputs: ['0', '11', '5'], expectedOutput: '5' },
        { inputs: ['-3', '10'], expectedOutput: '10' },
        { inputs: ['1'], expectedOutput: '1' },
        { inputs: ['99', '0', '7'], expectedOutput: '7' },
      ],
      mustContain: ['REPEAT', 'UNTIL'],
      playable: true,
    },
    {
      id: '5.6',
      slug: 'which-loop',
      title: 'Which loop?',
      type: 'quiz',
      minutes: 5,
      why: 'The question usually tells you: a known count is FOR; test-before is WHILE; test-after / validation is REPEAT.',
      docsAnchor: 'iteration',
      body: `Pick the loop the syllabus expects — not the one you like typing.`,
      quiz: [
        {
          prompt: 'You must print the integers 1 to 20. Which loop?',
          options: [
            { id: 'for', label: 'FOR … TO … NEXT' },
            { id: 'while', label: 'WHILE … ENDWHILE' },
            { id: 'repeat', label: 'REPEAT … UNTIL' },
          ],
          correctId: 'for',
          explanation: 'The number of repeats is known before the loop starts, so FOR.',
        },
        {
          prompt: 'Read numbers until the user types 0. Zero must not be processed, and they might type 0 first. Which loop?',
          options: [
            { id: 'for', label: 'FOR … TO … NEXT' },
            { id: 'while', label: 'WHILE … ENDWHILE' },
            { id: 'repeat', label: 'REPEAT … UNTIL' },
          ],
          correctId: 'while',
          explanation: 'The body must be skippable (zero times). That is a pre-condition WHILE.',
        },
        {
          prompt: 'Keep asking for a password until it is at least 8 characters. Which loop?',
          options: [
            { id: 'for', label: 'FOR … TO … NEXT' },
            { id: 'while', label: 'WHILE … ENDWHILE' },
            { id: 'repeat', label: 'REPEAT … UNTIL' },
          ],
          correctId: 'repeat',
          explanation: 'You always prompt at least once, then re-prompt until valid — REPEAT UNTIL.',
        },
      ],
      playable: true,
    },
    {
      id: '5.7',
      slug: 'nested',
      title: 'Nested statements, max 3',
      type: 'grade',
      minutes: 10,
      why: 'Indentation is how the marker sees the nest. The syllabus asks for at most three levels of nesting.',
      docsAnchor: 'for',
      body: `Output a 2-by-2 multiplication grid using **two FOR loops**. Each product on its own line, row-major:

\`1\`
\`2\`
\`2\`
\`4\`

(That is 1×1, 1×2, 2×1, 2×2.)`,
      trap: 'NEXT must close the inner loop before the outer NEXT. Indent the inner FOR.',
      starterCode: `DECLARE Row : INTEGER
DECLARE Col : INTEGER

// nested FOR loops — OUTPUT Row * Col`,
      solutionCode: `DECLARE Row : INTEGER
DECLARE Col : INTEGER

FOR Row <- 1 TO 2
    FOR Col <- 1 TO 2
        OUTPUT Row * Col
    NEXT Col
NEXT Row`,
      expectedOutput: '1\n2\n2\n4',
      mustContain: ['FOR Row', 'FOR Col'],
      playable: true,
    },
    {
      id: '5.8',
      slug: 'boss',
      title: 'Boss: totaller + counter + trace',
      type: 'grade',
      minutes: 12,
      why: 'One FOR, two patterns, first blank-trace skill: Total and Count change on different passes.',
      docsAnchor: 'for',
      body: `Read **N**, then **N** integers. Output two lines:

1. The **sum** of the values
2. How many values were **greater than 10**

Example: input \`4\` then \`3\`, \`12\`, \`10\`, \`20\` →

\`45\`
\`2\``,
      trap: '10 is not greater than 10. Initialise both Total and Count to 0 before the loop.',
      starterCode: `DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER
DECLARE i : INTEGER

INPUT N

// totaller + counter, then OUTPUT Total and Count`,
      solutionCode: `DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER
DECLARE i : INTEGER

INPUT N
Total <- 0
Count <- 0
FOR i <- 1 TO N
    INPUT Value
    Total <- Total + Value
    IF Value > 10 THEN
        Count <- Count + 1
    ENDIF
NEXT i
OUTPUT Total
OUTPUT Count`,
      tests: [
        { inputs: ['4', '3', '12', '10', '20'], expectedOutput: '45\n2' },
        { inputs: ['1', '11'], expectedOutput: '11\n1' },
        { inputs: ['3', '0', '0', '0'], expectedOutput: '0\n0' },
        { inputs: ['2', '-5', '15'], expectedOutput: '10\n1' },
        { inputs: ['5', '10', '10', '10', '10', '10'], expectedOutput: '50\n0' },
      ],
      playable: true,
    },
  ],
};
