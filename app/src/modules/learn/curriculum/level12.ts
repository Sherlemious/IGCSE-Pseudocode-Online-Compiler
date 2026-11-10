import type { LearnLevel } from '../types';

/** Free drill. The Celsius boss is the hardest Check on the path (17% pass), almost all of it wrong output. */
export const level12: LearnLevel = {
  number: 12,
  slug: '12',
  name: 'Formulas',
  hours: '1',
  leaveWith: 'DIV and MOD, then output the number and nothing else',
  syllabus: '8.1.4',
  free: true,
  playable: true,
  drill: true,
  lessons: [
    {
      id: '12.1',
      slug: 'split',
      title: 'Split a total with DIV and MOD',
      type: 'mutate',
      minutes: 5,
      why: 'Paper 2 asks how many whole groups, then what is left. DIV is the groups. MOD is the remainder.',
      docsAnchor: 'arithmetic',
      body: `\`Total\` is already 200 minutes. Output two lines, numbers only:

1. whole hours (\`Total DIV 60\`)
2. minutes left over (\`Total MOD 60\`)

200 minutes is \`3\` then \`20\`.`,
      trap: '`/` is real division. 200 / 60 is not 3. Use DIV and MOD.',
      starterCode: `DECLARE Total : INTEGER
DECLARE Hours : INTEGER
DECLARE Left : INTEGER
Total <- 200

// Hours <- Total DIV 60
// Left <- Total MOD 60
// OUTPUT Hours
// OUTPUT Left`,
      solutionCode: `DECLARE Total : INTEGER
DECLARE Hours : INTEGER
DECLARE Left : INTEGER
Total <- 200

Hours <- Total DIV 60
Left <- Total MOD 60
OUTPUT Hours
OUTPUT Left`,
      expectedOutput: '3\n20',
      mustContain: ['DIV', 'MOD'],
      playable: true,
    },
    {
      id: '12.2',
      slug: 'minutes',
      title: 'Minutes in, hours and leftover out',
      type: 'grade',
      minutes: 6,
      why: 'Same split as the last lesson, but the total is read in. Still print the two numbers and no words.',
      docsAnchor: 'arithmetic',
      body: `Read a total number of minutes. Output two lines:

1. whole hours
2. minutes left over

Example: input \`130\` →

\`2\`
\`10\``,
      trap: 'Do not print "hours" or "minutes". The check compares the numbers.',
      starterCode: `DECLARE Total : INTEGER
DECLARE Hours : INTEGER
DECLARE Left : INTEGER

INPUT Total

// OUTPUT the hours, then the leftover minutes`,
      solutionCode: `DECLARE Total : INTEGER
DECLARE Hours : INTEGER
DECLARE Left : INTEGER

INPUT Total

Hours <- Total DIV 60
Left <- Total MOD 60
OUTPUT Hours
OUTPUT Left`,
      tests: [
        { inputs: ['130'], expectedOutput: '2\n10' },
        { inputs: ['59'], expectedOutput: '0\n59' },
        { inputs: ['60'], expectedOutput: '1\n0' },
        { inputs: ['0'], expectedOutput: '0\n0' },
      ],
      mustContain: ['DIV', 'MOD'],
      playable: true,
    },
    {
      id: '12.3',
      slug: 'average',
      title: 'Integer average with DIV',
      type: 'grade',
      minutes: 5,
      why: 'An average of integers on Paper 2 is often a whole number. DIV throws away the fraction.',
      docsAnchor: 'arithmetic',
      body: `Read three integers. Output their integer average:

**(A + B + C) DIV 3**

Example: input \`4\`, \`5\`, \`6\` → \`5\`. Output the number only.`,
      starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER

INPUT A
INPUT B
INPUT C

// OUTPUT the integer average`,
      solutionCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER

INPUT A
INPUT B
INPUT C

OUTPUT (A + B + C) DIV 3`,
      tests: [
        { inputs: ['4', '5', '6'], expectedOutput: '5' },
        { inputs: ['1', '1', '1'], expectedOutput: '1' },
        { inputs: ['2', '2', '3'], expectedOutput: '2' },
        { inputs: ['0', '0', '2'], expectedOutput: '0' },
      ],
      mustContain: ['DIV'],
      playable: true,
    },
    {
      id: '12.4',
      slug: 'boss',
      title: 'Boss: Celsius, number only',
      type: 'grade',
      minutes: 8,
      why: 'This is the Check students fail most often. The formula is right and the line is still only the number.',
      docsAnchor: 'arithmetic',
      body: `Read a Celsius temperature. Convert with:

**F = C × 9 DIV 5 + 32**

Output the Fahrenheit value alone.

Example: input \`100\` → \`212\`. Input \`0\` → \`32\`.`,
      trap: 'Parentheses: \`(Celsius * 9) DIV 5 + 32\`. Do not write "degrees" or use /. ',
      starterCode: `DECLARE Celsius : INTEGER
DECLARE Fahrenheit : INTEGER

INPUT Celsius

// Fahrenheit <- (Celsius * 9) DIV 5 + 32
// OUTPUT Fahrenheit`,
      solutionCode: `DECLARE Celsius : INTEGER
DECLARE Fahrenheit : INTEGER

INPUT Celsius

Fahrenheit <- (Celsius * 9) DIV 5 + 32
OUTPUT Fahrenheit`,
      tests: [
        { inputs: ['0'], expectedOutput: '32' },
        { inputs: ['100'], expectedOutput: '212' },
        { inputs: ['20'], expectedOutput: '68' },
        { inputs: ['-10'], expectedOutput: '14' },
        { inputs: ['37'], expectedOutput: '98' },
      ],
      mustContain: ['DIV'],
      playable: true,
    },
  ],
};
