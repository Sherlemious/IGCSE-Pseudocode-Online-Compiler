import type { LearnLevel } from '../types';

export const level4: LearnLevel = {
  number: 4,
  slug: '4',
  name: 'Branch',
  hours: '2.5',
  leaveWith: 'IF / CASE with both branches closed',
  syllabus: '8.1.4b, 8.1.5',
  free: false,
  playable: true,
  lessons: [
    {
      id: '4.1',
      slug: 'if',
      title: 'IF … THEN … ENDIF',
      type: 'run',
      minutes: 5,
      why: 'THEN sits on the IF line (or the next). ENDIF closes the block — a missing ENDIF is a top Paper 2 slip.',
      docsAnchor: 'if',
      body: `Write **IF** condition **THEN**, indent the body, close with **ENDIF**.

Cambridge wants THEN visible. This compiler lets you omit it; the paper does not.

Run, then Check.`,
      trap: 'Do not write `if …:` with a colon. That is Python. IGCSE is `IF Score >= 50 THEN`.',
      starterCode: `DECLARE Score : INTEGER
Score <- 50

IF Score >= 50 THEN
    OUTPUT "Pass"
ENDIF`,
      solutionCode: `DECLARE Score : INTEGER
Score <- 50

IF Score >= 50 THEN
    OUTPUT "Pass"
ENDIF`,
      expectedOutput: 'Pass',
      mustContain: ['THEN', 'ENDIF'],
      playable: true,
    },
    {
      id: '4.2',
      slug: 'else',
      title: 'ELSE and ELSEIF',
      type: 'run',
      minutes: 5,
      why: 'Both branches must be visible to the marker. ELSEIF (or ELSE IF) is how you stack conditions.',
      docsAnchor: 'if',
      body: `**ELSE** is the other path. **ELSEIF** (also written **ELSE IF**) tests the next condition.

This program stores 75. It should print **B**.

- 90 or more → A
- 70 or more → B
- otherwise → C`,
      trap: '`else:` is Python. IGCSE uses ELSE and ELSEIF with no colon, then ENDIF at the end.',
      starterCode: `DECLARE Score : INTEGER
Score <- 75

IF Score >= 90 THEN
    OUTPUT "A"
ELSEIF Score >= 70 THEN
    OUTPUT "B"
ELSE
    OUTPUT "C"
ENDIF`,
      solutionCode: `DECLARE Score : INTEGER
Score <- 75

IF Score >= 90 THEN
    OUTPUT "A"
ELSEIF Score >= 70 THEN
    OUTPUT "B"
ELSE
    OUTPUT "C"
ENDIF`,
      expectedOutput: 'B',
      mustContain: ['ELSE'],
      playable: true,
    },
    {
      id: '4.3',
      slug: 'relational',
      title: 'Relational operators',
      type: 'grade',
      minutes: 8,
      why: '= <> > < >= <= — not !=, not ==. Using the wrong one is a silent mark loss.',
      docsAnchor: 'comparison',
      body: `Read an integer. Output **Even** if it is divisible by 2, otherwise **Odd**.

Use **MOD**. Comparison for “equal” is **=**, not **==**. “Not equal” (when you need it) is **<>**, not **!=**.

Example: input \`4\` → \`Even\`.`,
      trap: '`!=` and `==` are Java / Python. IGCSE is `<>` and `=`.',
      starterCode: `DECLARE N : INTEGER

INPUT N

// OUTPUT "Even" or "Odd"`,
      solutionCode: `DECLARE N : INTEGER

INPUT N

IF N MOD 2 = 0 THEN
    OUTPUT "Even"
ELSE
    OUTPUT "Odd"
ENDIF`,
      tests: [
        { inputs: ['4'], expectedOutput: 'Even' },
        { inputs: ['7'], expectedOutput: 'Odd' },
        { inputs: ['0'], expectedOutput: 'Even' },
        { inputs: ['1'], expectedOutput: 'Odd' },
        { inputs: ['100'], expectedOutput: 'Even' },
      ],
      mustContain: ['MOD', 'THEN'],
      playable: true,
    },
    {
      id: '4.4',
      slug: 'logic',
      title: 'AND OR NOT',
      type: 'run',
      minutes: 5,
      why: 'BOOLEAN operators sit on full conditions, not on a dangling comparison: Age >= 12 AND Age <= 65.',
      docsAnchor: 'logical',
      body: `Each side of **AND** / **OR** must be a complete condition.

Wrong: \`Age >= 12 AND <= 65\`
Right: \`Age >= 12 AND Age <= 65\`

This program should print **Standard** for age 30.`,
      trap: 'Do not write `&&` or `||`. Use AND and OR.',
      starterCode: `DECLARE Age : INTEGER
Age <- 30

IF Age >= 12 AND Age <= 65 THEN
    OUTPUT "Standard"
ELSE
    OUTPUT "Special"
ENDIF`,
      solutionCode: `DECLARE Age : INTEGER
Age <- 30

IF Age >= 12 AND Age <= 65 THEN
    OUTPUT "Standard"
ELSE
    OUTPUT "Special"
ENDIF`,
      expectedOutput: 'Standard',
      mustContain: ['AND'],
      playable: true,
    },
    {
      id: '4.5',
      slug: 'case',
      title: 'CASE OF … OTHERWISE',
      type: 'run',
      minutes: 6,
      why: 'When one identifier is matched against several discrete values, CASE is cleaner than a stack of ELSEIF.',
      docsAnchor: 'case',
      body: `**CASE OF** identifier, then each label ends with a colon, then **OTHERWISE**, then **ENDCASE**.

CHAR literals use single quotes: \`'B'\`.

This grade is B — output **Good**.`,
      trap: 'CASE needs ENDCASE, not ENDIF. Labels are values (or ranges), not conditions like `Grade = \'A\'`.',
      starterCode: `DECLARE Grade : CHAR
Grade <- 'B'

CASE OF Grade
    'A' :
        OUTPUT "Excellent"
    'B' :
        OUTPUT "Good"
    'C' :
        OUTPUT "OK"
    OTHERWISE :
        OUTPUT "Ungraded"
ENDCASE`,
      solutionCode: `DECLARE Grade : CHAR
Grade <- 'B'

CASE OF Grade
    'A' :
        OUTPUT "Excellent"
    'B' :
        OUTPUT "Good"
    'C' :
        OUTPUT "OK"
    OTHERWISE :
        OUTPUT "Ungraded"
ENDCASE`,
      expectedOutput: 'Good',
      mustContain: ['CASE', 'OTHERWISE', 'ENDCASE'],
      playable: true,
    },
    {
      id: '4.6',
      slug: 'boss',
      title: 'Boss: Easy then Medium Selection',
      type: 'grade',
      minutes: 12,
      why: 'A typical Paper 2 pair: a two-way IF, then a three-way comparison.',
      docsAnchor: 'if',
      body: `Read three integers (separate lines). Output two lines:

1. The **largest** of the three
2. **Pass** if that largest value is at least 50, otherwise **Fail**

Example: input \`3\`, \`72\`, \`40\` →

\`72\`
\`Pass\``,
      trap: 'Initialise Max from the first value, not from 0 — 0 loses when all three are negative.',
      starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
DECLARE Max : INTEGER

INPUT A
INPUT B
INPUT C

// find Max, then OUTPUT Max and Pass/Fail`,
      solutionCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
DECLARE Max : INTEGER

INPUT A
INPUT B
INPUT C

Max <- A
IF B > Max THEN
    Max <- B
ENDIF
IF C > Max THEN
    Max <- C
ENDIF

OUTPUT Max
IF Max >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`,
      tests: [
        { inputs: ['3', '72', '40'], expectedOutput: '72\nPass' },
        { inputs: ['10', '10', '10'], expectedOutput: '10\nFail' },
        { inputs: ['-1', '-5', '-3'], expectedOutput: '-1\nFail' },
        { inputs: ['50', '20', '30'], expectedOutput: '50\nPass' },
        { inputs: ['1', '2', '3'], expectedOutput: '3\nFail' },
      ],
      playable: true,
    },
  ],
};
