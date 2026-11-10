import type { LearnLevel } from '../types';

/** Free drill. Last 90 days: wrong output is the main Check failure, and a missing OUTPUT comma is a top playground hint. */
export const level11: LearnLevel = {
  number: 11,
  slug: '11',
  name: 'Exact lines',
  hours: '1',
  leaveWith: 'The space lives in the string, and the line has nothing extra',
  syllabus: '8.1.3',
  free: true,
  playable: true,
  drill: true,
  lessons: [
    {
      id: '11.1',
      slug: 'space',
      title: 'The space is inside the quotes',
      type: 'mutate',
      minutes: 4,
      why: 'A comma between OUTPUT items does not insert a space. "Score:42" and "Score: 42" are different answers.',
      docsAnchor: 'first-program',
      body: `This prints \`Score:42\`. Change the string so it prints:

\`Score: 42\`

Do not add another OUTPUT.`,
      trap: 'Write the space inside the quotes: \`"Score: "\`. The comma only separates items.',
      starterCode: `DECLARE Score : INTEGER
Score <- 42
OUTPUT "Score:", Score`,
      solutionCode: `DECLARE Score : INTEGER
Score <- 42
OUTPUT "Score: ", Score`,
      expectedOutput: 'Score: 42',
      playable: true,
    },
    {
      id: '11.2',
      slug: 'receipt',
      title: 'Name, colon, price',
      type: 'grade',
      minutes: 6,
      why: 'Paper 2 marks the characters on the line. A missing space after the colon is a wrong answer.',
      docsAnchor: 'io',
      body: `Read an item name, then an integer price. Output one line:

\`Name: price\`

Example: input \`Pencil\` then \`3\` → \`Pencil: 3\`.`,
      trap: 'The colon and the space are one string: \`": "\`.',
      starterCode: `DECLARE Item : STRING
DECLARE Price : INTEGER

INPUT Item
INPUT Price

// OUTPUT Item: Price`,
      solutionCode: `DECLARE Item : STRING
DECLARE Price : INTEGER

INPUT Item
INPUT Price

OUTPUT Item, ": ", Price`,
      tests: [
        { inputs: ['Pencil', '3'], expectedOutput: 'Pencil: 3' },
        { inputs: ['Pen', '10'], expectedOutput: 'Pen: 10' },
        { inputs: ['Book', '0'], expectedOutput: 'Book: 0' },
        { inputs: ['Ruler', '2'], expectedOutput: 'Ruler: 2' },
      ],
      playable: true,
    },
    {
      id: '11.3',
      slug: 'sum-line',
      title: 'Build one sentence from two numbers',
      type: 'grade',
      minutes: 6,
      why: 'Students who pass the arithmetic still lose the mark by printing the sum on its own, or by leaving the spaces out.',
      docsAnchor: 'first-program',
      body: `Read two integers. Output one line in this shape:

\`A + B = sum\`

Example: input \`2\` then \`3\` → \`2 + 3 = 5\`.`,
      trap: 'Each space is inside a string. \`" + "\` and \`" = "\` are the gaps.',
      starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER

INPUT A
INPUT B

// OUTPUT A + B = the sum`,
      solutionCode: `DECLARE A : INTEGER
DECLARE B : INTEGER

INPUT A
INPUT B

OUTPUT A, " + ", B, " = ", A + B`,
      tests: [
        { inputs: ['2', '3'], expectedOutput: '2 + 3 = 5' },
        { inputs: ['0', '0'], expectedOutput: '0 + 0 = 0' },
        { inputs: ['10', '1'], expectedOutput: '10 + 1 = 11' },
        { inputs: ['-2', '5'], expectedOutput: '-2 + 5 = 3' },
      ],
      playable: true,
    },
    {
      id: '11.4',
      slug: 'boss',
      title: 'Boss: word, then how many',
      type: 'grade',
      minutes: 6,
      why: 'The mark is the whole line. Extra words, or a missing space around x, fail the check.',
      docsAnchor: 'io',
      body: `Read a word, then an integer. Output one line:

\`word x count\`

Example: input \`apple\` then \`4\` → \`apple x 4\`.`,
      starterCode: `DECLARE Word : STRING
DECLARE Count : INTEGER

INPUT Word
INPUT Count

// OUTPUT Word x Count`,
      solutionCode: `DECLARE Word : STRING
DECLARE Count : INTEGER

INPUT Word
INPUT Count

OUTPUT Word, " x ", Count`,
      tests: [
        { inputs: ['apple', '4'], expectedOutput: 'apple x 4' },
        { inputs: ['bus', '1'], expectedOutput: 'bus x 1' },
        { inputs: ['ticket', '0'], expectedOutput: 'ticket x 0' },
        { inputs: ['seat', '12'], expectedOutput: 'seat x 12' },
      ],
      playable: true,
    },
  ],
};
