// Flowchart practice: draw a flowchart, complete one, or turn one into pseudocode.
// Paper 2 asks all three. Every diagram and template is drawn from the model
// solution by the flowchart converter, so nothing here is hand-written JSON and
// a diagram can never disagree with its solution.
//
// FLOWCHART answers are graded by turning the student's flowchart into
// pseudocode and running the same test cases (see flowchartToPseudocode).

import type { Prisma } from '@prisma/client';
import { convertToFlowchart } from '../src/modules/interpreter/converters/flowchartConverter';
import { docFromConversion, makeTemplate } from '../src/modules/interpreter/converters/flowchartDoc';

function json(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function drawn(code: string) {
  const conv = convertToFlowchart(code, { fullLabels: true });
  if (conv.errors.length) throw new Error(`flowchart seed: solution does not parse: ${conv.errors[0].message}`);
  return docFromConversion(conv);
}

/** The solution drawn as a flowchart (shown with "flowchart → pseudocode" questions). */
export function diagramOf(code: string): Prisma.InputJsonValue {
  return json(drawn(code));
}

/** The solution's flowchart with the boxes labelled `blanks` left for the student to fill in. */
export function templateOf(code: string, blanks: string[]): Prisma.InputJsonValue {
  return json(makeTemplate(drawn(code), blanks));
}

const TAGS = ['Flowchart', 'IGCSE'];

// ── Draw the flowchart ───────────────────────────────────────────────────────

const passFail = `INPUT Mark
IF Mark >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`;

const totalOfTen = `Total <- 0
FOR Count <- 1 TO 10
    INPUT Number
    Total <- Total + Number
NEXT Count
OUTPUT Total`;

const validAge = `REPEAT
    INPUT Age
    IF Age < 0 OR Age > 120 THEN
        OUTPUT "Invalid"
    ENDIF
UNTIL Age >= 0 AND Age <= 120
OUTPUT "Accepted ", Age`;

// ── Complete the flowchart ───────────────────────────────────────────────────

const larger = `INPUT A
INPUT B
IF A > B THEN
    OUTPUT A
ELSE
    OUTPUT B
ENDIF`;

const countdown = `INPUT N
WHILE N > 0
    OUTPUT N
    N <- N - 1
ENDWHILE
OUTPUT "Go!"`;

const highest = `Max <- -1
FOR Pupil <- 1 TO 5
    INPUT Mark
    IF Mark > Max THEN
        Max <- Mark
    ENDIF
NEXT Pupil
OUTPUT Max`;

// ── Flowchart → pseudocode ───────────────────────────────────────────────────

const ticket = `INPUT Age
IF Age < 12 THEN
    Price <- 5
ELSE
    Price <- 8
ENDIF
OUTPUT Price`;

const sumUntilZero = `Total <- 0
INPUT Number
WHILE Number <> 0
    Total <- Total + Number
    INPUT Number
ENDWHILE
OUTPUT Total`;

const password = `Attempts <- 0
REPEAT
    INPUT Password
    Attempts <- Attempts + 1
UNTIL Password = "Secret1" OR Attempts = 3
IF Password = "Secret1" THEN
    OUTPUT "Access granted"
ELSE
    OUTPUT "Locked out"
ENDIF`;

export const flowchartQuestions = [
  // ════════════════════════════════════════════════════ DRAW THE FLOWCHART ═══
  {
    title: 'Flowchart: Pass or Fail',
    description: `Draw a flowchart that inputs a mark and outputs \`Pass\` if the mark is 50 or more, otherwise \`Fail\`.

Use the flowchart symbols: a parallelogram for INPUT and OUTPUT, and a diamond for the decision. Label the two arrows out of the diamond **Yes** and **No**.

**Input:** one integer mark.
**Output:** \`Pass\` or \`Fail\`.`,
    difficulty: 'EASY' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    answerFormat: 'FLOWCHART' as const,
    hints: [
      'Start with an INPUT box for the mark, straight after START.',
      'A decision diamond asks one Yes/No question, e.g. Mark >= 50.',
      'Each arrow out of the diamond goes to its own OUTPUT box, and both OUTPUT boxes lead to STOP.',
    ],
    solution: passFail,
    solutionExplanation:
      'INPUT the mark, then one decision splits the flow: the Yes branch outputs Pass, the No branch outputs Fail, and both branches rejoin at STOP.',
    testCases: [
      { inputs: ['72'], expectedOutput: 'Pass', description: 'Well above', sortOrder: 0 },
      { inputs: ['31'], expectedOutput: 'Fail', description: 'Below', sortOrder: 1 },
      { inputs: ['50'], expectedOutput: 'Pass', description: 'Exactly 50', sortOrder: 2, isHidden: true },
      { inputs: ['49'], expectedOutput: 'Fail', description: null, sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Flowchart: Total of Ten Numbers',
    description: `Draw a flowchart that inputs 10 numbers and outputs their total.

Use a counter and a decision that loops back, as a count-controlled loop does.

**Input:** 10 integers.
**Output:** their total.`,
    difficulty: 'MEDIUM' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    answerFormat: 'FLOWCHART' as const,
    hints: [
      'Set Total ← 0 and Count ← 1 before the loop.',
      'The decision Count <= 10 goes to the loop body on Yes and to the OUTPUT on No.',
      'At the end of the body add 1 to Count and draw the arrow back up to the decision.',
    ],
    solution: totalOfTen,
    solutionExplanation:
      'A running total starts at 0. The decision checks the counter before each pass; the body inputs a number, adds it, and increments the counter before looping back. When the counter passes 10, the No branch outputs the total.',
    testCases: [
      { inputs: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], expectedOutput: '55', description: '1 to 10', sortOrder: 0 },
      { inputs: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], expectedOutput: '0', description: 'All zero', sortOrder: 1 },
      { inputs: ['5', '-5', '10', '-10', '3', '3', '3', '3', '3', '3'], expectedOutput: '18', description: null, sortOrder: 2, isHidden: true },
    ],
  },
  {
    title: 'Flowchart: Validated Age Entry',
    description: `Draw a flowchart that keeps asking for an age until it is between 0 and 120 inclusive.

Each time an invalid age is entered, output \`Invalid\`. When a valid age is entered, output \`Accepted\` followed by the age.

**Input:** one or more integers.
**Output:** \`Invalid\` for each rejected age, then \`Accepted <age>\`.`,
    difficulty: 'HARD' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    answerFormat: 'FLOWCHART' as const,
    hints: [
      'This is a post-condition loop (REPEAT … UNTIL): the INPUT always happens at least once.',
      'Inside the loop, one decision outputs Invalid for a bad age.',
      'A second decision at the bottom of the loop checks Age >= 0 AND Age <= 120; its No arrow goes back up to the INPUT.',
    ],
    solution: validAge,
    solutionExplanation:
      'The INPUT sits at the top of the loop. A decision outputs Invalid for an out-of-range age, and the decision at the bottom repeats the loop until the age is in range. Then the accepted age is output.',
    testCases: [
      { inputs: ['25'], expectedOutput: 'Accepted 25', description: 'Valid first time', sortOrder: 0 },
      { inputs: ['-3', '130', '40'], expectedOutput: 'Invalid\nInvalid\nAccepted 40', description: 'Two bad entries', sortOrder: 1 },
      { inputs: ['121', '120'], expectedOutput: 'Invalid\nAccepted 120', description: 'Boundary', sortOrder: 2, isHidden: true },
      { inputs: ['0'], expectedOutput: 'Accepted 0', description: null, sortOrder: 3, isHidden: true },
    ],
  },

  // ══════════════════════════════════════════════ COMPLETE THE FLOWCHART ═══
  {
    title: 'Complete the Flowchart: Larger Number',
    description: `The flowchart inputs two numbers, A and B, and should output the larger one.

Two boxes are blank. Fill them in so the flowchart works. If the numbers are equal, output either.`,
    difficulty: 'EASY' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    answerFormat: 'FLOWCHART' as const,
    flowchart: templateOf(larger, ['A > B', 'OUTPUT B']),
    hints: [
      'The diamond is a Yes/No question comparing A and B.',
      'Look at which output is on the Yes arrow: the question must be true when A is the larger.',
      'The No branch outputs the other number.',
    ],
    solution: larger,
    solutionExplanation: 'The decision is A > B. When it is true, A is larger and is output; otherwise B is output.',
    testCases: [
      { inputs: ['8', '3'], expectedOutput: '8', description: 'A larger', sortOrder: 0 },
      { inputs: ['2', '9'], expectedOutput: '9', description: 'B larger', sortOrder: 1 },
      { inputs: ['-1', '-7'], expectedOutput: '-1', description: null, sortOrder: 2, isHidden: true },
      { inputs: ['4', '4'], expectedOutput: '4', description: 'Equal', sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Complete the Flowchart: Countdown',
    description: `The flowchart inputs a whole number N and counts down to 1, then outputs \`Go!\`.

Fill in the blank decision and the blank process box.

**Input:** one integer N.
**Output:** N, N − 1, … 1 on separate lines, then \`Go!\`.`,
    difficulty: 'MEDIUM' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    answerFormat: 'FLOWCHART' as const,
    flowchart: templateOf(countdown, ['N > 0', 'N ← N - 1']),
    hints: [
      'The decision is checked before each output: should the loop carry on?',
      'Its Yes arrow outputs N, so it must be true while N is still positive.',
      'The process box must make N smaller, or the loop never ends.',
    ],
    solution: countdown,
    solutionExplanation:
      'This is a pre-condition loop: while N > 0 the body outputs N and decreases it by one. When N reaches 0 the No branch outputs Go!.',
    testCases: [
      { inputs: ['3'], expectedOutput: '3\n2\n1\nGo!', description: 'From 3', sortOrder: 0 },
      { inputs: ['1'], expectedOutput: '1\nGo!', description: 'From 1', sortOrder: 1 },
      { inputs: ['0'], expectedOutput: 'Go!', description: 'Nothing to count', sortOrder: 2, isHidden: true },
      { inputs: ['5'], expectedOutput: '5\n4\n3\n2\n1\nGo!', description: null, sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Complete the Flowchart: Highest Mark',
    description: `The flowchart inputs the marks of 5 pupils and outputs the highest. Marks are between 0 and 100.

Fill in the two blank boxes inside the loop.`,
    difficulty: 'HARD' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    answerFormat: 'FLOWCHART' as const,
    flowchart: templateOf(highest, ['Mark > Max', 'Max ← Mark']),
    hints: [
      'Max holds the highest mark seen so far. It starts at -1, lower than any real mark.',
      'The blank decision compares the new mark with Max.',
      'When the new mark is higher, the blank process box stores it in Max.',
    ],
    solution: highest,
    solutionExplanation:
      'Max starts below any possible mark. Each new mark is compared with Max and replaces it when higher, so after the loop Max is the highest mark.',
    testCases: [
      { inputs: ['45', '82', '67', '90', '12'], expectedOutput: '90', description: 'Highest fourth', sortOrder: 0 },
      { inputs: ['100', '3', '4', '5', '6'], expectedOutput: '100', description: 'Highest first', sortOrder: 1 },
      { inputs: ['0', '0', '0', '0', '0'], expectedOutput: '0', description: 'All zero', sortOrder: 2, isHidden: true },
      { inputs: ['10', '20', '30', '40', '50'], expectedOutput: '50', description: null, sortOrder: 3, isHidden: true },
    ],
  },

  // ════════════════════════════════════════════ FLOWCHART → PSEUDOCODE ═══
  {
    title: 'Flowchart to Pseudocode: Ticket Price',
    description: `The flowchart below sets the price of a cinema ticket from the customer's age.

Write the pseudocode for this flowchart.`,
    difficulty: 'EASY' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    flowchart: diagramOf(ticket),
    starterCode: `DECLARE Age : INTEGER
DECLARE Price : INTEGER

// Write the pseudocode for the flowchart`,
    hints: [
      'A parallelogram is INPUT or OUTPUT; a rectangle is a process such as an assignment.',
      'The diamond with Yes and No arrows becomes IF … THEN … ELSE … ENDIF.',
      'Both branches rejoin before the OUTPUT, so OUTPUT Price comes after ENDIF.',
    ],
    solution: `DECLARE Age : INTEGER
DECLARE Price : INTEGER

${ticket}`,
    solutionExplanation: 'The decision becomes an IF with an ELSE. Each branch assigns a price, and the output after the branches rejoin comes after ENDIF.',
    testCases: [
      { inputs: ['8'], expectedOutput: '5', description: 'Child', sortOrder: 0 },
      { inputs: ['30'], expectedOutput: '8', description: 'Adult', sortOrder: 1 },
      { inputs: ['12'], expectedOutput: '8', description: 'Exactly 12', sortOrder: 2, isHidden: true },
      { inputs: ['11'], expectedOutput: '5', description: null, sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Flowchart to Pseudocode: Sum Until Zero',
    description: `The flowchart below adds up numbers until 0 is entered, then outputs the total.

Write the pseudocode for this flowchart. Use the loop the flowchart shows: the decision comes **before** the loop body.`,
    difficulty: 'MEDIUM' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    flowchart: diagramOf(sumUntilZero),
    starterCode: `DECLARE Total : INTEGER
DECLARE Number : INTEGER

// Write the pseudocode for the flowchart`,
    hints: [
      'A decision before the body whose arrow loops back to it is a WHILE loop.',
      'Notice there are two INPUT boxes: one before the loop and one at the end of the body.',
      'The loop runs while Number <> 0, and OUTPUT Total comes after ENDWHILE.',
    ],
    solution: `DECLARE Total : INTEGER
DECLARE Number : INTEGER

${sumUntilZero}`,
    solutionExplanation:
      'The first number is read before the loop so the WHILE condition can test it. The body adds the number and reads the next one; 0 ends the loop.',
    testCases: [
      { inputs: ['4', '6', '0'], expectedOutput: '10', description: 'Two numbers', sortOrder: 0 },
      { inputs: ['0'], expectedOutput: '0', description: 'Zero straight away', sortOrder: 1 },
      { inputs: ['7', '-2', '5', '0'], expectedOutput: '10', description: null, sortOrder: 2, isHidden: true },
    ],
  },
  {
    title: 'Flowchart to Pseudocode: Password Attempts',
    description: `The flowchart below gives a user up to three attempts to enter the password \`Secret1\`.

Write the pseudocode for this flowchart. The loop's decision comes **after** the loop body.`,
    difficulty: 'HARD' as const,
    topic: 'Flowcharts',
    tags: TAGS,
    flowchart: diagramOf(password),
    starterCode: `DECLARE Attempts : INTEGER
DECLARE Password : STRING

// Write the pseudocode for the flowchart`,
    hints: [
      'A decision at the bottom of the body, whose No arrow goes back to the top, is REPEAT … UNTIL.',
      'The loop stops when the password is right OR three attempts have been used.',
      'After the loop, a second decision checks which of the two ended it.',
    ],
    solution: `DECLARE Attempts : INTEGER
DECLARE Password : STRING

${password}`,
    solutionExplanation:
      'The body (INPUT, then count the attempt) always runs at least once, so it is a REPEAT loop ending when the password matches or the attempts reach 3. An IF after the loop reports which happened.',
    testCases: [
      { inputs: ['Secret1'], expectedOutput: 'Access granted', description: 'First try', sortOrder: 0 },
      { inputs: ['abc', 'Secret1'], expectedOutput: 'Access granted', description: 'Second try', sortOrder: 1 },
      { inputs: ['a', 'b', 'c'], expectedOutput: 'Locked out', description: 'Three wrong', sortOrder: 2 },
      { inputs: ['x', 'y', 'Secret1'], expectedOutput: 'Access granted', description: 'Last chance', sortOrder: 3, isHidden: true },
    ],
  },
];
