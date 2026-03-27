import { PrismaClient } from '@prisma/client';
import { examples } from '../src/data/examples';

const prisma = new PrismaClient();

// ─── Practice Questions ────────────────────────────────────────────────────────
const questions = [

  // ════════════════════════════════════════════════════════════ EASY ═══
  {
    title: 'Sum of Two Numbers',
    description: `Read two integers and output their sum.

**Input:** Two integers on separate lines.
**Output:** A single integer — the sum.

**Example:**
\`\`\`
Input:  5
        3
Output: 8
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arithmetic',
    starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER

INPUT A
INPUT B

// OUTPUT the sum of A and B`,
    hints: [
      'Think about what arithmetic operation combines two numbers into one result.',
      'You need to use the OUTPUT statement with an expression that adds A and B together.',
      'The solution is simply: OUTPUT A + B',
    ],
    solution: `DECLARE A : INTEGER
DECLARE B : INTEGER

INPUT A
INPUT B

OUTPUT A + B`,
    solutionExplanation: 'Read two integers into variables A and B, then output the result of adding them together using the + operator.',
    testCases: [
      { inputs: ['5', '3'],    expectedOutput: '8',    description: 'Basic addition',  sortOrder: 0 },
      { inputs: ['10', '20'],  expectedOutput: '30',   description: null,              sortOrder: 1 },
      { inputs: ['-5', '3'],   expectedOutput: '-2',   description: 'Negative number', sortOrder: 2 },
      { inputs: ['0', '0'],    expectedOutput: '0',    description: null,              sortOrder: 3, isHidden: true },
      { inputs: ['999', '1'],  expectedOutput: '1000', description: null,              sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Odd or Even',
    description: `Read an integer. Output \`Odd\` if it is odd, or \`Even\` if it is even.

**Input:** A single integer.
**Output:** \`Odd\` or \`Even\`.

**Example:**
\`\`\`
Input:  4
Output: Even
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    starterCode: `DECLARE N : INTEGER

INPUT N

// Use MOD(N, 2) to check if N is even or odd
IF ... THEN
    OUTPUT "Even"
ELSE
    OUTPUT "Odd"
ENDIF`,
    hints: [
      'Even numbers have no remainder when divided by 2. Think about which operation gives you the remainder.',
      'Use MOD(N, 2) to get the remainder when N is divided by 2. If the remainder is 0, the number is even.',
      'Replace the ... with: MOD(N, 2) = 0',
    ],
    solution: `DECLARE N : INTEGER

INPUT N

IF MOD(N, 2) = 0 THEN
    OUTPUT "Even"
ELSE
    OUTPUT "Odd"
ENDIF`,
    solutionExplanation: 'Use MOD(N, 2) to find the remainder when N is divided by 2. If the remainder is 0, the number is even; otherwise it is odd.',
    testCases: [
      { inputs: ['4'],   expectedOutput: 'Even', description: 'Even number',    sortOrder: 0 },
      { inputs: ['7'],   expectedOutput: 'Odd',  description: 'Odd number',     sortOrder: 1 },
      { inputs: ['0'],   expectedOutput: 'Even', description: 'Zero is even',   sortOrder: 2 },
      { inputs: ['1'],   expectedOutput: 'Odd',  description: null,             sortOrder: 3, isHidden: true },
      { inputs: ['100'], expectedOutput: 'Even', description: null,             sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Largest of Three Numbers',
    description: `Read three integers. Output the largest of the three.

**Input:** Three integers on separate lines.
**Output:** The largest integer.

**Example:**
\`\`\`
Input:  3
        7
        5
Output: 7
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER

INPUT A
INPUT B
INPUT C

// Find and OUTPUT the largest value`,
    hints: [
      'You need to compare the three values to find which one is the biggest. Think about using IF statements.',
      'Start by assuming the first value is the largest, then compare it with the other two. Use a variable to track the current largest.',
      'Declare a Max variable. Set Max <- A. Then IF B > Max THEN Max <- B. Then IF C > Max THEN Max <- C. Finally OUTPUT Max.',
    ],
    solution: `DECLARE A : INTEGER
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

OUTPUT Max`,
    solutionExplanation: 'Start by assuming A is the largest and store it in Max. Then compare B and C against Max, updating Max whenever a larger value is found. Finally output Max.',
    testCases: [
      { inputs: ['3', '7', '5'],    expectedOutput: '7',  description: 'Middle value largest',   sortOrder: 0 },
      { inputs: ['10', '10', '10'], expectedOutput: '10', description: 'All equal',              sortOrder: 1 },
      { inputs: ['-1', '-5', '-3'], expectedOutput: '-1', description: 'Negative numbers',       sortOrder: 2 },
      { inputs: ['1', '2', '3'],    expectedOutput: '3',  description: null,                     sortOrder: 3, isHidden: true },
      { inputs: ['5', '3', '5'],    expectedOutput: '5',  description: null,                     sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Absolute Value',
    description: `Read an integer. Output its absolute value (i.e. always non-negative).

**Input:** A single integer.
**Output:** The absolute value.

**Example:**
\`\`\`
Input:  -5
Output: 5
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    starterCode: `DECLARE N : INTEGER

INPUT N

IF N < 0 THEN
    // output the positive version
ELSE
    OUTPUT N
ENDIF`,
    hints: [
      'When a number is negative, how do you make it positive? Think about what mathematical operation flips the sign.',
      'Multiplying a negative number by -1 gives its positive version. Alternatively, you can subtract it from 0.',
      'Inside the IF block, use: OUTPUT N * -1  (or equivalently OUTPUT 0 - N)',
    ],
    solution: `DECLARE N : INTEGER

INPUT N

IF N < 0 THEN
    OUTPUT N * -1
ELSE
    OUTPUT N
ENDIF`,
    solutionExplanation: 'Check if N is negative. If so, multiply by -1 to make it positive before outputting. Otherwise, output N directly since it is already non-negative.',
    testCases: [
      { inputs: ['-5'],  expectedOutput: '5',   description: 'Negative input',  sortOrder: 0 },
      { inputs: ['3'],   expectedOutput: '3',   description: 'Positive input',  sortOrder: 1 },
      { inputs: ['0'],   expectedOutput: '0',   description: 'Zero',            sortOrder: 2 },
      { inputs: ['-100'],expectedOutput: '100', description: null,              sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Count Down',
    description: `Read a positive integer N. Output the integers from N down to 1, each on a new line.

**Input:** A positive integer N.
**Output:** Integers from N to 1, one per line.

**Example:**
\`\`\`
Input:  5
Output: 5
        4
        3
        2
        1
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER

INPUT N

FOR i <- N TO 1 STEP -1
    // OUTPUT each value
NEXT i`,
    hints: [
      'Inside the loop, you need to display the current value of the loop counter.',
      'The loop variable i already counts down from N to 1. You just need to output it each time.',
      'Inside the FOR loop, add: OUTPUT i',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER

INPUT N

FOR i <- N TO 1 STEP -1
    OUTPUT i
NEXT i`,
    solutionExplanation: 'Use a FOR loop with STEP -1 to count from N down to 1. Inside the loop, OUTPUT the loop variable i on each iteration.',
    testCases: [
      { inputs: ['5'], expectedOutput: '5\n4\n3\n2\n1', description: 'Count from 5', sortOrder: 0 },
      { inputs: ['3'], expectedOutput: '3\n2\n1',       description: 'Count from 3', sortOrder: 1 },
      { inputs: ['1'], expectedOutput: '1',             description: 'N = 1',        sortOrder: 2, isHidden: true },
    ],
  },

  {
    title: 'Sum 1 to N',
    description: `Read a positive integer N. Output the sum of all integers from 1 to N (inclusive).

**Input:** A positive integer N.
**Output:** The sum 1 + 2 + 3 + … + N.

**Example:**
\`\`\`
Input:  5
Output: 15
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER

INPUT N

Total <- 0
FOR i <- 1 TO N
    Total <- Total + i
NEXT i

OUTPUT Total`,
    hints: [
      'You need a running total that accumulates each number from 1 to N.',
      'Use a FOR loop from 1 to N. Inside the loop, add the current value of i to a Total variable.',
      'Initialise Total to 0 before the loop, then Total <- Total + i inside the loop, and OUTPUT Total after the loop.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER

INPUT N

Total <- 0
FOR i <- 1 TO N
    Total <- Total + i
NEXT i

OUTPUT Total`,
    solutionExplanation: 'Initialise a Total variable to 0, then use a FOR loop from 1 to N, adding i to Total on each iteration. After the loop, output the accumulated Total.',
    testCases: [
      { inputs: ['5'],   expectedOutput: '15',   description: 'Sum 1–5',   sortOrder: 0 },
      { inputs: ['10'],  expectedOutput: '55',   description: 'Sum 1–10',  sortOrder: 1 },
      { inputs: ['1'],   expectedOutput: '1',    description: 'N = 1',     sortOrder: 2 },
      { inputs: ['100'], expectedOutput: '5050', description: null,        sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Times Table',
    description: `Read a positive integer N. Output the multiplication table for N from N×1 to N×10, one result per line.

**Input:** A positive integer N.
**Output:** Ten lines — N×1, N×2, …, N×10.

**Example:**
\`\`\`
Input:  3
Output: 3
        6
        9
        12
        15
        18
        21
        24
        27
        30
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER

INPUT N

FOR i <- 1 TO 10
    OUTPUT N * i
NEXT i`,
    hints: [
      'You need to multiply N by each number from 1 to 10 and output each result.',
      'Use a FOR loop that goes from 1 to 10. Inside the loop, output the product of N and the loop counter.',
      'FOR i <- 1 TO 10, then OUTPUT N * i inside the loop.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER

INPUT N

FOR i <- 1 TO 10
    OUTPUT N * i
NEXT i`,
    solutionExplanation: 'Use a FOR loop from 1 to 10. On each iteration, output the product of N and the loop variable i to produce the times table.',
    testCases: [
      { inputs: ['3'], expectedOutput: '3\n6\n9\n12\n15\n18\n21\n24\n27\n30',   description: '3 times table', sortOrder: 0 },
      { inputs: ['7'], expectedOutput: '7\n14\n21\n28\n35\n42\n49\n56\n63\n70', description: '7 times table', sortOrder: 1 },
      { inputs: ['1'], expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10',         description: null,            sortOrder: 2, isHidden: true },
    ],
  },

  // ════════════════════════════════════════════════════════════ MEDIUM ═══
  {
    title: 'Grade from Score',
    description: `Read a score (0–100). Output the corresponding letter grade using this scale:

| Score    | Grade |
|----------|-------|
| 90 – 100 | A     |
| 80 – 89  | B     |
| 70 – 79  | C     |
| 60 – 69  | D     |
| 0 – 59   | F     |

**Input:** An integer score.
**Output:** A single letter: \`A\`, \`B\`, \`C\`, \`D\`, or \`F\`.`,
    difficulty: 'MEDIUM' as const,
    topic: 'Selection',
    starterCode: `DECLARE Score : INTEGER

INPUT Score

IF Score >= 90 THEN
    OUTPUT "A"
ELSEIF Score >= 80 THEN
    // ...
ENDIF`,
    hints: [
      'You need a chain of IF/ELSEIF statements that checks the score from highest to lowest grade boundary.',
      'After checking >= 90 and >= 80, continue with ELSEIF for >= 70 (C), >= 60 (D), and ELSE for F.',
      'Complete the chain:\nELSEIF Score >= 80 THEN\n    OUTPUT "B"\nELSEIF Score >= 70 THEN\n    OUTPUT "C"\nELSEIF Score >= 60 THEN\n    OUTPUT "D"\nELSE\n    OUTPUT "F"',
    ],
    solution: `DECLARE Score : INTEGER

INPUT Score

IF Score >= 90 THEN
    OUTPUT "A"
ELSEIF Score >= 80 THEN
    OUTPUT "B"
ELSEIF Score >= 70 THEN
    OUTPUT "C"
ELSEIF Score >= 60 THEN
    OUTPUT "D"
ELSE
    OUTPUT "F"
ENDIF`,
    solutionExplanation: 'Use a chain of IF/ELSEIF statements checking the score from highest boundary downward. Since each check is >= a threshold, the first matching condition gives the correct grade. Anything below 60 falls through to ELSE and outputs F.',
    testCases: [
      { inputs: ['95'], expectedOutput: 'A', description: 'A grade',   sortOrder: 0 },
      { inputs: ['83'], expectedOutput: 'B', description: 'B grade',   sortOrder: 1 },
      { inputs: ['75'], expectedOutput: 'C', description: 'C grade',   sortOrder: 2 },
      { inputs: ['62'], expectedOutput: 'D', description: 'D grade',   sortOrder: 3 },
      { inputs: ['45'], expectedOutput: 'F', description: 'F grade',   sortOrder: 4 },
      { inputs: ['100'],expectedOutput: 'A', description: null,        sortOrder: 5, isHidden: true },
      { inputs: ['0'],  expectedOutput: 'F', description: null,        sortOrder: 6, isHidden: true },
    ],
  },

  {
    title: 'FizzBuzz',
    description: `Read a positive integer N. For each number from 1 to N, output:
- **FizzBuzz** if divisible by both 3 and 5
- **Fizz** if divisible by 3 only
- **Buzz** if divisible by 5 only
- The number itself otherwise

**Input:** A positive integer N.
**Output:** N lines, one per number.

**Example (N = 5):**
\`\`\`
1
2
Fizz
4
Buzz
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER

INPUT N

FOR i <- 1 TO N
    IF MOD(i, 15) = 0 THEN
        OUTPUT "FizzBuzz"
    ELSEIF ...
    ENDIF
NEXT i`,
    hints: [
      'After checking divisible by 15 (both 3 and 5), you need to check divisible by 3 only, then by 5 only, then the default case.',
      'Use ELSEIF MOD(i, 3) = 0 for Fizz, ELSEIF MOD(i, 5) = 0 for Buzz, and ELSE OUTPUT i for everything else.',
      'Complete the chain:\nELSEIF MOD(i, 3) = 0 THEN\n    OUTPUT "Fizz"\nELSEIF MOD(i, 5) = 0 THEN\n    OUTPUT "Buzz"\nELSE\n    OUTPUT i',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER

INPUT N

FOR i <- 1 TO N
    IF MOD(i, 15) = 0 THEN
        OUTPUT "FizzBuzz"
    ELSEIF MOD(i, 3) = 0 THEN
        OUTPUT "Fizz"
    ELSEIF MOD(i, 5) = 0 THEN
        OUTPUT "Buzz"
    ELSE
        OUTPUT i
    ENDIF
NEXT i`,
    solutionExplanation: 'Loop from 1 to N. For each number, check divisibility by 15 first (both 3 and 5), then by 3 alone, then by 5 alone. The order matters because checking 15 first prevents numbers like 15 from being caught by the 3 or 5 checks.',
    testCases: [
      {
        inputs: ['5'],
        expectedOutput: '1\n2\nFizz\n4\nBuzz',
        description: 'First 5',
        sortOrder: 0,
      },
      {
        inputs: ['15'],
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
        description: 'First 15 (includes FizzBuzz)',
        sortOrder: 1,
      },
      {
        inputs: ['20'],
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz',
        description: null,
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  {
    title: 'Array Sum',
    description: `Read an integer N (1 ≤ N ≤ 10), then read N integers. Output their sum.

**Input:** N on the first line, then N integers one per line.
**Output:** The sum of all N integers.

**Example:**
\`\`\`
Input:  3
        10
        20
        30
Output: 60
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Arrays',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N

Total <- 0
FOR i <- 1 TO N
    INPUT Numbers[i]
    Total <- Total + Numbers[i]
NEXT i

OUTPUT Total`,
    hints: [
      'You need to read values into an array and keep a running total as you go.',
      'Use a FOR loop to read each element. After reading each one, add it to a Total variable.',
      'Initialise Total to 0, then inside the loop: INPUT Numbers[i] followed by Total <- Total + Numbers[i]. After the loop, OUTPUT Total.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N

Total <- 0
FOR i <- 1 TO N
    INPUT Numbers[i]
    Total <- Total + Numbers[i]
NEXT i

OUTPUT Total`,
    solutionExplanation: 'Read N values into an array, adding each value to a running Total as it is read. After the loop finishes, output the accumulated Total.',
    testCases: [
      { inputs: ['5', '10', '20', '30', '40', '50'], expectedOutput: '150', description: '5 numbers',         sortOrder: 0 },
      { inputs: ['3', '1', '2', '3'],               expectedOutput: '6',   description: '3 numbers',         sortOrder: 1 },
      { inputs: ['4', '7', '3', '9', '1'],          expectedOutput: '20',  description: null,                sortOrder: 2, isHidden: true },
      { inputs: ['1', '42'],                        expectedOutput: '42',  description: 'Single element',    sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Array Maximum',
    description: `Read an integer N (1 ≤ N ≤ 10), then read N integers. Output the largest value.

**Input:** N on the first line, then N integers one per line.
**Output:** The maximum value.

**Example:**
\`\`\`
Input:  5
        3
        7
        1
        9
        4
Output: 9
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Arrays',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Max : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i

Max <- Numbers[1]
FOR i <- 2 TO N
    IF Numbers[i] > Max THEN
        Max <- Numbers[i]
    ENDIF
NEXT i

OUTPUT Max`,
    hints: [
      'To find the maximum, you need to compare every element and keep track of the largest one seen so far.',
      'Set Max to the first element, then loop from the second element onward. If any element is greater than Max, update Max.',
      'Max <- Numbers[1], then FOR i <- 2 TO N: IF Numbers[i] > Max THEN Max <- Numbers[i]. After the loop, OUTPUT Max.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Max : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i

Max <- Numbers[1]
FOR i <- 2 TO N
    IF Numbers[i] > Max THEN
        Max <- Numbers[i]
    ENDIF
NEXT i

OUTPUT Max`,
    solutionExplanation: 'Read all values into an array. Set Max to the first element, then loop through the rest. Whenever an element is larger than Max, update Max. After the loop, output Max.',
    testCases: [
      { inputs: ['5', '3', '7', '1', '9', '4'],   expectedOutput: '9',  description: 'Max in middle',   sortOrder: 0 },
      { inputs: ['3', '10', '5', '8'],             expectedOutput: '10', description: 'Max at start',    sortOrder: 1 },
      { inputs: ['4', '-1', '-5', '-2', '-3'],     expectedOutput: '-1', description: 'All negative',    sortOrder: 2, isHidden: true },
      { inputs: ['1', '7'],                        expectedOutput: '7',  description: 'Single element',  sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Palindrome Check',
    description: `Read a single word (no spaces). Output \`Yes\` if it is a palindrome, \`No\` otherwise. Ignore case.

A palindrome reads the same forwards and backwards (e.g. \`racecar\`, \`madam\`).

**Input:** A single word.
**Output:** \`Yes\` or \`No\`.

**Example:**
\`\`\`
Input:  racecar
Output: Yes
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    starterCode: `DECLARE Text : STRING
DECLARE Reversed : STRING
DECLARE i : INTEGER
DECLARE Len : INTEGER

INPUT Text

Len <- LENGTH(Text)
Reversed <- ""

FOR i <- Len TO 1 STEP -1
    Reversed <- Reversed & SUBSTRING(Text, i, 1)
NEXT i

IF LCASE(Text) = LCASE(Reversed) THEN
    OUTPUT "Yes"
ELSE
    OUTPUT "No"
ENDIF`,
    hints: [
      'A palindrome reads the same forwards and backwards. Think about how you could check this.',
      'Build the reversed version of the string by looping from the last character to the first, appending each character.',
      'Use a FOR loop from LENGTH(Text) TO 1 STEP -1, building Reversed with SUBSTRING. Then compare LCASE(Text) with LCASE(Reversed).',
    ],
    solution: `DECLARE Text : STRING
DECLARE Reversed : STRING
DECLARE i : INTEGER
DECLARE Len : INTEGER

INPUT Text

Len <- LENGTH(Text)
Reversed <- ""

FOR i <- Len TO 1 STEP -1
    Reversed <- Reversed & SUBSTRING(Text, i, 1)
NEXT i

IF LCASE(Text) = LCASE(Reversed) THEN
    OUTPUT "Yes"
ELSE
    OUTPUT "No"
ENDIF`,
    solutionExplanation: 'Reverse the string by looping from the last character to the first, building a new string. Then compare the lowercase versions of the original and reversed strings to check if they match.',
    testCases: [
      { inputs: ['racecar'], expectedOutput: 'Yes', description: 'Classic palindrome', sortOrder: 0 },
      { inputs: ['hello'],   expectedOutput: 'No',  description: 'Not a palindrome',   sortOrder: 1 },
      { inputs: ['madam'],   expectedOutput: 'Yes', description: 'Another palindrome', sortOrder: 2 },
      { inputs: ['level'],   expectedOutput: 'Yes', description: null,                 sortOrder: 3, isHidden: true },
      { inputs: ['world'],   expectedOutput: 'No',  description: null,                 sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Factorial',
    description: `Read a non-negative integer N (0 ≤ N ≤ 12). Output N! (N factorial).

Recall: 0! = 1, and N! = N × (N−1) × … × 1.

**Input:** A non-negative integer N.
**Output:** The value of N!.

**Example:**
\`\`\`
Input:  5
Output: 120
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Procedures & Functions',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Result : INTEGER

INPUT N

Result <- 1
FOR i <- 1 TO N
    Result <- Result * i
NEXT i

OUTPUT Result`,
    hints: [
      'Factorial means multiplying all integers from 1 up to N together. Think about using a loop with a running product.',
      'Start with Result = 1 (since 0! = 1 and multiplying by 1 has no effect). Then multiply Result by each number from 1 to N.',
      'Set Result <- 1, then FOR i <- 1 TO N: Result <- Result * i. After the loop, OUTPUT Result.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Result : INTEGER

INPUT N

Result <- 1
FOR i <- 1 TO N
    Result <- Result * i
NEXT i

OUTPUT Result`,
    solutionExplanation: 'Initialise Result to 1, then multiply it by each integer from 1 to N using a FOR loop. This works for 0! too, since the loop does not execute when N is 0, leaving Result as 1.',
    testCases: [
      { inputs: ['5'],  expectedOutput: '120',       description: '5!',    sortOrder: 0 },
      { inputs: ['0'],  expectedOutput: '1',         description: '0! = 1', sortOrder: 1 },
      { inputs: ['1'],  expectedOutput: '1',         description: '1!',    sortOrder: 2 },
      { inputs: ['10'], expectedOutput: '3628800',   description: null,    sortOrder: 3, isHidden: true },
      { inputs: ['12'], expectedOutput: '479001600', description: null,    sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Count Vowels',
    description: `Read a word. Output the number of vowels (a, e, i, o, u) it contains. Ignore case.

**Input:** A single word.
**Output:** The count of vowels.

**Example:**
\`\`\`
Input:  hello
Output: 2
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    starterCode: `DECLARE Text : STRING
DECLARE i : INTEGER
DECLARE Ch : STRING
DECLARE VowelCount : INTEGER

INPUT Text

VowelCount <- 0
FOR i <- 1 TO LENGTH(Text)
    Ch <- LCASE(SUBSTRING(Text, i, 1))
    IF Ch = "a" OR Ch = "e" OR Ch = "i" OR Ch = "o" OR Ch = "u" THEN
        VowelCount <- VowelCount + 1
    ENDIF
NEXT i

OUTPUT VowelCount`,
    hints: [
      'Loop through each character in the string and check if it is one of the five vowels.',
      'Convert each character to lowercase first so you only need to check against lowercase vowels. Use a counter variable.',
      'Use LCASE(SUBSTRING(Text, i, 1)) to get each character in lowercase, then check if it equals "a", "e", "i", "o", or "u" using OR.',
    ],
    solution: `DECLARE Text : STRING
DECLARE i : INTEGER
DECLARE Ch : STRING
DECLARE VowelCount : INTEGER

INPUT Text

VowelCount <- 0
FOR i <- 1 TO LENGTH(Text)
    Ch <- LCASE(SUBSTRING(Text, i, 1))
    IF Ch = "a" OR Ch = "e" OR Ch = "i" OR Ch = "o" OR Ch = "u" THEN
        VowelCount <- VowelCount + 1
    ENDIF
NEXT i

OUTPUT VowelCount`,
    solutionExplanation: 'Loop through each character of the string, converting it to lowercase. Check if the character is a vowel (a, e, i, o, u) and increment a counter each time one is found.',
    testCases: [
      { inputs: ['hello'],       expectedOutput: '2', description: 'hello has 2 vowels',       sortOrder: 0 },
      { inputs: ['programming'], expectedOutput: '3', description: 'programming has 3 vowels', sortOrder: 1 },
      { inputs: ['rhythm'],      expectedOutput: '0', description: 'No vowels',                sortOrder: 2 },
      { inputs: ['aeiou'],       expectedOutput: '5', description: null,                       sortOrder: 3, isHidden: true },
      { inputs: ['BANANA'],      expectedOutput: '3', description: null,                       sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Sum of Digits',
    description: `Read a positive integer. Output the sum of its digits.

**Input:** A positive integer.
**Output:** The sum of its digits.

**Example:**
\`\`\`
Input:  123
Output: 6
\`\`\`
*(because 1 + 2 + 3 = 6)*`,
    difficulty: 'MEDIUM' as const,
    topic: 'Arithmetic',
    starterCode: `DECLARE N : INTEGER
DECLARE Sum : INTEGER

INPUT N

Sum <- 0
WHILE N > 0 DO
    Sum <- Sum + MOD(N, 10)
    N <- DIV(N, 10)
ENDWHILE

OUTPUT Sum`,
    hints: [
      'Think about how you can extract individual digits from a number. The last digit of any number can be found using the remainder when dividing by 10.',
      'Use MOD(N, 10) to get the last digit and add it to a sum. Then use DIV(N, 10) to remove the last digit. Repeat until N becomes 0.',
      'Set Sum to 0, then WHILE N > 0: Sum <- Sum + MOD(N, 10), N <- DIV(N, 10). After the loop, OUTPUT Sum.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE Sum : INTEGER

INPUT N

Sum <- 0
WHILE N > 0 DO
    Sum <- Sum + MOD(N, 10)
    N <- DIV(N, 10)
ENDWHILE

OUTPUT Sum`,
    solutionExplanation: 'Repeatedly extract the last digit using MOD(N, 10) and add it to a running sum. Remove the last digit using DIV(N, 10). Continue until N becomes 0.',
    testCases: [
      { inputs: ['123'],  expectedOutput: '6',  description: '1+2+3',     sortOrder: 0 },
      { inputs: ['9999'], expectedOutput: '36', description: '9+9+9+9',   sortOrder: 1 },
      { inputs: ['100'],  expectedOutput: '1',  description: '1+0+0',     sortOrder: 2 },
      { inputs: ['7'],    expectedOutput: '7',  description: 'Single digit', sortOrder: 3, isHidden: true },
    ],
  },

  // ════════════════════════════════════════════════════════════ HARD ═══
  {
    title: 'Bubble Sort',
    description: `Read an integer N (1 ≤ N ≤ 8), then read N integers. Sort them in **ascending** order using bubble sort and output them one per line.

**Input:** N on the first line, then N integers one per line.
**Output:** The sorted integers in ascending order, one per line.

**Example:**
\`\`\`
Input:  5
        64
        34
        25
        12
        22
Output: 12
        22
        25
        34
        64
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Temp : INTEGER
DECLARE Numbers : ARRAY[1:8] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i

// Bubble sort
FOR i <- 1 TO N - 1
    FOR j <- 1 TO N - i
        IF Numbers[j] > Numbers[j + 1] THEN
            Temp <- Numbers[j]
            Numbers[j] <- Numbers[j + 1]
            Numbers[j + 1] <- Temp
        ENDIF
    NEXT j
NEXT i

FOR i <- 1 TO N
    OUTPUT Numbers[i]
NEXT i`,
    hints: [
      'Bubble sort works by repeatedly comparing adjacent elements and swapping them if they are in the wrong order.',
      'Use two nested loops. The outer loop runs N-1 times. The inner loop compares adjacent pairs and swaps them if the left element is larger than the right.',
      'Inner loop: IF Numbers[j] > Numbers[j+1] THEN swap them using a Temp variable. The inner loop goes from 1 to N-i because the largest elements "bubble up" to the end.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE Temp : INTEGER
DECLARE Numbers : ARRAY[1:8] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i

FOR i <- 1 TO N - 1
    FOR j <- 1 TO N - i
        IF Numbers[j] > Numbers[j + 1] THEN
            Temp <- Numbers[j]
            Numbers[j] <- Numbers[j + 1]
            Numbers[j + 1] <- Temp
        ENDIF
    NEXT j
NEXT i

FOR i <- 1 TO N
    OUTPUT Numbers[i]
NEXT i`,
    solutionExplanation: 'Bubble sort uses two nested loops. The inner loop compares each pair of adjacent elements and swaps them if they are in the wrong order. After each pass of the outer loop, the next largest element is in its correct position, so the inner loop can be shortened by i each time.',
    testCases: [
      { inputs: ['5', '64', '34', '25', '12', '22'],    expectedOutput: '12\n22\n25\n34\n64', description: 'Unsorted 5 numbers',  sortOrder: 0 },
      { inputs: ['3', '10', '5', '8'],                  expectedOutput: '5\n8\n10',           description: '3 numbers',           sortOrder: 1 },
      { inputs: ['4', '1', '2', '3', '4'],              expectedOutput: '1\n2\n3\n4',         description: null,                  sortOrder: 2, isHidden: true },
      { inputs: ['5', '5', '4', '3', '2', '1'],        expectedOutput: '1\n2\n3\n4\n5',     description: null,                  sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Prime Number Checker',
    description: `Read a positive integer N. Output \`Prime\` if N is a prime number, or \`Not Prime\` otherwise.

A prime number is a whole number greater than 1 that has no divisors other than 1 and itself.

**Input:** A positive integer N.
**Output:** \`Prime\` or \`Not Prime\`.

**Example:**
\`\`\`
Input:  7
Output: Prime
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE IsPrime : BOOLEAN

INPUT N

IF N < 2 THEN
    OUTPUT "Not Prime"
ELSE
    IsPrime <- TRUE
    FOR i <- 2 TO INT(N / 2)
        IF MOD(N, i) = 0 THEN
            IsPrime <- FALSE
        ENDIF
    NEXT i
    IF IsPrime = TRUE THEN
        OUTPUT "Prime"
    ELSE
        OUTPUT "Not Prime"
    ENDIF
ENDIF`,
    hints: [
      'A prime number has no divisors other than 1 and itself. Think about how you would check if any number between 2 and N divides evenly into N.',
      'Loop from 2 to N/2 and check if MOD(N, i) = 0 for any i. If it does, the number is not prime. Handle the special case where N < 2 separately.',
      'Use a Boolean flag IsPrime set to TRUE. Loop from 2 to INT(N/2). If MOD(N, i) = 0, set IsPrime to FALSE. After the loop, check IsPrime to decide the output.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE IsPrime : BOOLEAN

INPUT N

IF N < 2 THEN
    OUTPUT "Not Prime"
ELSE
    IsPrime <- TRUE
    FOR i <- 2 TO INT(N / 2)
        IF MOD(N, i) = 0 THEN
            IsPrime <- FALSE
        ENDIF
    NEXT i
    IF IsPrime = TRUE THEN
        OUTPUT "Prime"
    ELSE
        OUTPUT "Not Prime"
    ENDIF
ENDIF`,
    solutionExplanation: 'First handle numbers less than 2 as not prime. For other numbers, check every integer from 2 to half of N. If any divides evenly (MOD gives 0), the number is not prime. Use a Boolean flag to track whether a divisor was found.',
    testCases: [
      { inputs: ['7'],  expectedOutput: 'Prime',     description: '7 is prime',        sortOrder: 0 },
      { inputs: ['12'], expectedOutput: 'Not Prime', description: '12 is not prime',   sortOrder: 1 },
      { inputs: ['2'],  expectedOutput: 'Prime',     description: 'Smallest prime',    sortOrder: 2 },
      { inputs: ['1'],  expectedOutput: 'Not Prime', description: '1 is not prime',    sortOrder: 3 },
      { inputs: ['97'], expectedOutput: 'Prime',     description: null,                sortOrder: 4, isHidden: true },
      { inputs: ['100'],expectedOutput: 'Not Prime', description: null,                sortOrder: 5, isHidden: true },
    ],
  },

  {
    title: 'First N Fibonacci Numbers',
    description: `Read a positive integer N. Output the first N Fibonacci numbers, one per line.

The sequence starts: **0, 1, 1, 2, 3, 5, 8, 13, 21, …**

**Input:** A positive integer N (1 ≤ N ≤ 15).
**Output:** The first N Fibonacci numbers, one per line.

**Example (N = 5):**
\`\`\`
0
1
1
2
3
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    starterCode: `DECLARE N : INTEGER
DECLARE First : INTEGER
DECLARE Second : INTEGER
DECLARE Next : INTEGER
DECLARE i : INTEGER

INPUT N

First <- 0
Second <- 1

IF N >= 1 THEN
    OUTPUT First
ENDIF
IF N >= 2 THEN
    OUTPUT Second
ENDIF

FOR i <- 3 TO N
    Next <- First + Second
    OUTPUT Next
    First <- Second
    Second <- Next
NEXT i`,
    hints: [
      'Each Fibonacci number is the sum of the two preceding ones. You need to keep track of the last two values.',
      'Start with First = 0 and Second = 1. Output these first two values. Then for each subsequent number, compute Next = First + Second, output it, and shift the values.',
      'After outputting Next, update: First <- Second, then Second <- Next. This shifts the window forward for the next iteration.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE First : INTEGER
DECLARE Second : INTEGER
DECLARE Next : INTEGER
DECLARE i : INTEGER

INPUT N

First <- 0
Second <- 1

IF N >= 1 THEN
    OUTPUT First
ENDIF
IF N >= 2 THEN
    OUTPUT Second
ENDIF

FOR i <- 3 TO N
    Next <- First + Second
    OUTPUT Next
    First <- Second
    Second <- Next
NEXT i`,
    solutionExplanation: 'Output the first two Fibonacci numbers (0 and 1) as special cases. Then use a loop from 3 to N, computing each new number as the sum of the previous two, outputting it, and shifting the two tracking variables forward.',
    testCases: [
      { inputs: ['5'], expectedOutput: '0\n1\n1\n2\n3',           description: 'First 5',  sortOrder: 0 },
      { inputs: ['8'], expectedOutput: '0\n1\n1\n2\n3\n5\n8\n13', description: 'First 8',  sortOrder: 1 },
      { inputs: ['1'], expectedOutput: '0',                        description: 'N = 1',    sortOrder: 2 },
      { inputs: ['2'], expectedOutput: '0\n1',                     description: null,       sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Greatest Common Divisor',
    description: `Read two positive integers. Output their Greatest Common Divisor (GCD) using the Euclidean algorithm.

**Input:** Two positive integers on separate lines.
**Output:** The GCD.

**Example:**
\`\`\`
Input:  12
        8
Output: 4
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE Temp : INTEGER

INPUT A
INPUT B

// Euclidean algorithm
WHILE B <> 0 DO
    Temp <- B
    B <- MOD(A, B)
    A <- Temp
ENDWHILE

OUTPUT A`,
    hints: [
      'The Euclidean algorithm repeatedly replaces the larger number with the remainder of dividing the larger by the smaller.',
      'Use a WHILE loop that continues until B becomes 0. In each step, replace A with B and B with MOD(A, B). Use a Temp variable to avoid losing values.',
      'WHILE B <> 0: Temp <- B, B <- MOD(A, B), A <- Temp. When B reaches 0, A holds the GCD.',
    ],
    solution: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE Temp : INTEGER

INPUT A
INPUT B

WHILE B <> 0 DO
    Temp <- B
    B <- MOD(A, B)
    A <- Temp
ENDWHILE

OUTPUT A`,
    solutionExplanation: 'The Euclidean algorithm works by repeatedly replacing A with B and B with MOD(A, B). When B becomes 0, A contains the GCD. A Temp variable is needed to hold B before it is overwritten.',
    testCases: [
      { inputs: ['12', '8'],    expectedOutput: '4',  description: 'GCD(12, 8)',    sortOrder: 0 },
      { inputs: ['100', '75'],  expectedOutput: '25', description: 'GCD(100, 75)',  sortOrder: 1 },
      { inputs: ['7', '13'],    expectedOutput: '1',  description: 'Coprime',       sortOrder: 2 },
      { inputs: ['48', '18'],   expectedOutput: '6',  description: null,            sortOrder: 3, isHidden: true },
      { inputs: ['56', '98'],   expectedOutput: '14', description: null,            sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Reverse a String',
    description: `Read a word. Output it reversed.

**Input:** A single word.
**Output:** The word reversed.

**Example:**
\`\`\`
Input:  hello
Output: olleh
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'String Processing',
    starterCode: `DECLARE Text : STRING
DECLARE Reversed : STRING
DECLARE i : INTEGER

INPUT Text

Reversed <- ""
FOR i <- LENGTH(Text) TO 1 STEP -1
    Reversed <- Reversed & SUBSTRING(Text, i, 1)
NEXT i

OUTPUT Reversed`,
    hints: [
      'To reverse a string, you need to read its characters from back to front.',
      'Start with an empty string. Loop from the last character position to the first (using STEP -1), appending each character.',
      'Use FOR i <- LENGTH(Text) TO 1 STEP -1 and build Reversed <- Reversed & SUBSTRING(Text, i, 1) on each iteration.',
    ],
    solution: `DECLARE Text : STRING
DECLARE Reversed : STRING
DECLARE i : INTEGER

INPUT Text

Reversed <- ""
FOR i <- LENGTH(Text) TO 1 STEP -1
    Reversed <- Reversed & SUBSTRING(Text, i, 1)
NEXT i

OUTPUT Reversed`,
    solutionExplanation: 'Start with an empty Reversed string. Loop from the last position to the first using STEP -1, extracting each character with SUBSTRING and appending it to Reversed using the & concatenation operator.',
    testCases: [
      { inputs: ['hello'],   expectedOutput: 'olleh',  description: null,       sortOrder: 0 },
      { inputs: ['racecar'], expectedOutput: 'racecar', description: 'Palindrome stays same', sortOrder: 1 },
      { inputs: ['Python'],  expectedOutput: 'nohtyP', description: null,       sortOrder: 2 },
      { inputs: ['a'],       expectedOutput: 'a',      description: null,       sortOrder: 3, isHidden: true },
      { inputs: ['abcde'],   expectedOutput: 'edcba',  description: null,       sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Linear Search',
    description: `Read N (1 ≤ N ≤ 10), then N integers into an array, then a target value. Output the **1-based position** of the first occurrence of the target in the array, or \`-1\` if not found.

**Input:** N, then N integers, then the target.
**Output:** The position (1-based) or \`-1\`.

**Example:**
\`\`\`
Input:  5
        10  30  20  40  50
        30
Output: 2
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
DECLARE Position : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i
INPUT Target

Found <- FALSE
Position <- -1

FOR i <- 1 TO N
    IF Numbers[i] = Target AND Found = FALSE THEN
        Found <- TRUE
        Position <- i
    ENDIF
NEXT i

OUTPUT Position`,
    hints: [
      'You need to check each element of the array one by one to see if it matches the target.',
      'Loop through the array. When you find a match, record its position and stop looking (or use a flag to ignore further matches).',
      'Use a Found flag initialised to FALSE and Position set to -1. When Numbers[i] = Target AND Found = FALSE, set Found to TRUE and Position to i. Output Position after the loop.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
DECLARE Position : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i
INPUT Target

Found <- FALSE
Position <- -1

FOR i <- 1 TO N
    IF Numbers[i] = Target AND Found = FALSE THEN
        Found <- TRUE
        Position <- i
    ENDIF
NEXT i

OUTPUT Position`,
    solutionExplanation: 'Loop through each element comparing it to the target. Use a Found flag to ensure only the first occurrence is recorded. If no match is found, Position remains -1.',
    testCases: [
      { inputs: ['5', '10', '30', '20', '40', '50', '30'],  expectedOutput: '2',  description: 'Found at index 2',   sortOrder: 0 },
      { inputs: ['5', '10', '30', '20', '40', '50', '99'],  expectedOutput: '-1', description: 'Not found',          sortOrder: 1 },
      { inputs: ['3', '5', '5', '5', '5'],                  expectedOutput: '1',  description: 'Found at index 1',   sortOrder: 2 },
      { inputs: ['4', '1', '2', '3', '4', '3'],             expectedOutput: '3',  description: null,                 sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Count Occurrences',
    description: `Read N (1 ≤ N ≤ 10), then N integers, then a target value. Output how many times the target appears in the array.

**Input:** N, then N integers, then the target.
**Output:** The count of occurrences.

**Example:**
\`\`\`
Input:  5
        3  5  3  5  3
        3
Output: 3
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Count : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i
INPUT Target

Count <- 0
FOR i <- 1 TO N
    IF Numbers[i] = Target THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
    hints: [
      'You need to check every element in the array and count how many match the target.',
      'Use a counter variable initialised to 0. Loop through the array and increment the counter each time an element equals the target.',
      'Set Count <- 0. FOR i <- 1 TO N: IF Numbers[i] = Target THEN Count <- Count + 1. After the loop, OUTPUT Count.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Target : INTEGER
DECLARE Count : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i
INPUT Target

Count <- 0
FOR i <- 1 TO N
    IF Numbers[i] = Target THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
    solutionExplanation: 'Read the array and the target value. Loop through every element, incrementing a counter each time an element matches the target. Output the final count.',
    testCases: [
      { inputs: ['5', '3', '5', '3', '5', '3', '3'],   expectedOutput: '3', description: 'Target appears 3 times', sortOrder: 0 },
      { inputs: ['4', '1', '2', '1', '3', '1'],        expectedOutput: '2', description: 'Target appears twice',   sortOrder: 1 },
      { inputs: ['3', '5', '5', '5', '5'],             expectedOutput: '3', description: null,                     sortOrder: 2, isHidden: true },
      { inputs: ['4', '1', '2', '3', '4', '9'],        expectedOutput: '0', description: 'Not found — 0 times',    sortOrder: 3, isHidden: true },
    ],
  },

  // ════════════════════════════════════════════════ NEW EASY (IGCSE-style) ═══

  {
    title: 'Minimum of Three',
    description: `Read three integers. Output the smallest of the three.

**Input:** Three integers on separate lines.
**Output:** The smallest integer.

**Example:**
\`\`\`
Input:  3
        7
        5
Output: 3
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER

INPUT A
INPUT B
INPUT C

// Find and OUTPUT the minimum value`,
    hints: [
      'You need to compare three values and find the smallest. Think about using IF statements to compare them.',
      'Start by assuming the first value is the smallest. Then check if B or C is smaller and update accordingly.',
      'Declare a Min variable. Set Min <- A. Then IF B < Min THEN Min <- B. Then IF C < Min THEN Min <- C. Finally OUTPUT Min.',
    ],
    solution: `DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
DECLARE Min : INTEGER

INPUT A
INPUT B
INPUT C

Min <- A
IF B < Min THEN
    Min <- B
ENDIF
IF C < Min THEN
    Min <- C
ENDIF

OUTPUT Min`,
    solutionExplanation: 'Start by assuming A is the smallest and store it in Min. Then compare B and C against Min, updating Min whenever a smaller value is found. Finally output Min.',
    testCases: [
      { inputs: ['3', '7', '5'],    expectedOutput: '3',  description: 'First value smallest',  sortOrder: 0 },
      { inputs: ['10', '10', '10'], expectedOutput: '10', description: 'All equal',              sortOrder: 1 },
      { inputs: ['-1', '-5', '-3'], expectedOutput: '-5', description: 'Negative numbers',       sortOrder: 2 },
      { inputs: ['1', '2', '3'],    expectedOutput: '1',  description: null,                     sortOrder: 3, isHidden: true },
      { inputs: ['5', '3', '5'],    expectedOutput: '3',  description: null,                     sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Number Classifier',
    description: `Read an integer. Output \`Positive\`, \`Negative\`, or \`Zero\` depending on its value.

**Input:** A single integer.
**Output:** \`Positive\`, \`Negative\`, or \`Zero\`.

**Example:**
\`\`\`
Input:  -3
Output: Negative
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    starterCode: `DECLARE N : INTEGER

INPUT N

IF N > 0 THEN
    OUTPUT "Positive"
ELSEIF N < 0 THEN
    OUTPUT "Negative"
ELSE
    OUTPUT "Zero"
ENDIF`,
    hints: [
      'You need to classify a number into one of three categories. Think about what conditions define each category.',
      'Use IF/ELSEIF/ELSE to check: is the number greater than 0 (positive), less than 0 (negative), or neither (zero)?',
      'IF N > 0 THEN\n    OUTPUT "Positive"\nELSEIF N < 0 THEN\n    OUTPUT "Negative"\nELSE\n    OUTPUT "Zero"\nENDIF',
    ],
    solution: `DECLARE N : INTEGER

INPUT N

IF N > 0 THEN
    OUTPUT "Positive"
ELSEIF N < 0 THEN
    OUTPUT "Negative"
ELSE
    OUTPUT "Zero"
ENDIF`,
    solutionExplanation: 'Use an IF/ELSEIF/ELSE chain to check three conditions: greater than 0 for positive, less than 0 for negative, and everything else (which must be zero).',
    testCases: [
      { inputs: ['5'],   expectedOutput: 'Positive', description: 'Positive number', sortOrder: 0 },
      { inputs: ['-3'],  expectedOutput: 'Negative', description: 'Negative number', sortOrder: 1 },
      { inputs: ['0'],   expectedOutput: 'Zero',     description: 'Zero',            sortOrder: 2 },
      { inputs: ['100'], expectedOutput: 'Positive', description: null,              sortOrder: 3, isHidden: true },
      { inputs: ['-1'],  expectedOutput: 'Negative', description: null,              sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Celsius to Fahrenheit',
    description: `Read a temperature in Celsius (integer). Convert it to Fahrenheit using the formula:

**F = C × 9 DIV 5 + 32**

Output the result as an integer.

**Input:** An integer Celsius temperature.
**Output:** The Fahrenheit equivalent (integer).

**Example:**
\`\`\`
Input:  100
Output: 212
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arithmetic',
    starterCode: `DECLARE Celsius : INTEGER
DECLARE Fahrenheit : INTEGER

INPUT Celsius

Fahrenheit <- (Celsius * 9) DIV 5 + 32

OUTPUT Fahrenheit`,
    hints: [
      'You need to apply the conversion formula. Think about the order of operations: multiply first, then divide, then add.',
      'The formula is F = C * 9 DIV 5 + 32. Use DIV for integer division to get a whole number result.',
      'Fahrenheit <- (Celsius * 9) DIV 5 + 32, then OUTPUT Fahrenheit.',
    ],
    solution: `DECLARE Celsius : INTEGER
DECLARE Fahrenheit : INTEGER

INPUT Celsius

Fahrenheit <- (Celsius * 9) DIV 5 + 32

OUTPUT Fahrenheit`,
    solutionExplanation: 'Apply the conversion formula: multiply the Celsius value by 9, use integer division (DIV) by 5, then add 32. The parentheses ensure multiplication happens before division.',
    testCases: [
      { inputs: ['0'],   expectedOutput: '32',  description: 'Freezing point',   sortOrder: 0 },
      { inputs: ['100'], expectedOutput: '212', description: 'Boiling point',    sortOrder: 1 },
      { inputs: ['20'],  expectedOutput: '68',  description: 'Room temperature', sortOrder: 2 },
      { inputs: ['-10'], expectedOutput: '14',  description: null,               sortOrder: 3, isHidden: true },
      { inputs: ['37'],  expectedOutput: '98',  description: null,               sortOrder: 4, isHidden: true },
    ],
  },

  // ══════════════════════════════════════════════ NEW MEDIUM (IGCSE-style) ═══

  {
    title: 'Validated Score Entry',
    description: `Write a program that repeatedly asks the user to enter a score until a valid score is entered.
A valid score is an integer in the range **0 to 100 inclusive**.
Once a valid score is entered, output it.

Use a **REPEAT UNTIL** loop for validation.

**Input:** One or more integers (loop repeats until a value in 0–100 is entered).
**Output:** The first valid score entered.

**Example:**
\`\`\`
Input:  150
        -5
        75
Output: 75
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    starterCode: `DECLARE Score : INTEGER

REPEAT
    INPUT Score
UNTIL Score >= 0 AND Score <= 100

OUTPUT Score`,
    hints: [
      'You need a loop that keeps asking for input until the user enters a valid value. Think about which loop type checks the condition after each iteration.',
      'A REPEAT UNTIL loop runs the body at least once, then checks the condition. The condition should be TRUE when the input is valid (in range 0 to 100).',
      'REPEAT INPUT Score UNTIL Score >= 0 AND Score <= 100. After the loop ends, OUTPUT Score.',
    ],
    solution: `DECLARE Score : INTEGER

REPEAT
    INPUT Score
UNTIL Score >= 0 AND Score <= 100

OUTPUT Score`,
    solutionExplanation: 'Use a REPEAT UNTIL loop to keep asking for input. The loop continues until the condition (Score >= 0 AND Score <= 100) is true, meaning a valid score has been entered. Then output the valid score.',
    testCases: [
      { inputs: ['75'],          expectedOutput: '75',  description: 'Valid on first attempt',  sortOrder: 0 },
      { inputs: ['150', '50'],   expectedOutput: '50',  description: 'Invalid then valid',       sortOrder: 1 },
      { inputs: ['-5', '0'],     expectedOutput: '0',   description: 'Edge: 0 is valid',         sortOrder: 2 },
      { inputs: ['200', '101', '100'], expectedOutput: '100', description: null,                 sortOrder: 3, isHidden: true },
      { inputs: ['0'],           expectedOutput: '0',   description: null,                       sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Sum Until Zero',
    description: `Read a series of positive integers from the user. Stop when the user enters **0**.
Output the total of all numbers entered (not counting the 0).
If the first number entered is 0, output 0.

Use a **WHILE** loop.

**Input:** A sequence of integers ending with 0.
**Output:** The sum of all non-zero entries.

**Example:**
\`\`\`
Input:  5
        10
        3
        0
Output: 18
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    starterCode: `DECLARE Total : INTEGER
DECLARE N : INTEGER

Total <- 0
INPUT N

WHILE N <> 0 DO
    Total <- Total + N
    INPUT N
ENDWHILE

OUTPUT Total`,
    hints: [
      'You need a loop that keeps reading numbers and adding them to a total, stopping when 0 is entered.',
      'Read the first number before the loop. Use a WHILE loop that continues as long as the number is not 0. Inside the loop, add to total and read the next number.',
      'INPUT N before the loop. WHILE N <> 0 DO: Total <- Total + N, INPUT N. After the loop, OUTPUT Total.',
    ],
    solution: `DECLARE Total : INTEGER
DECLARE N : INTEGER

Total <- 0
INPUT N

WHILE N <> 0 DO
    Total <- Total + N
    INPUT N
ENDWHILE

OUTPUT Total`,
    solutionExplanation: 'Read the first number before the WHILE loop. The loop continues while the number is not 0, adding each number to a running total and reading the next one. When 0 is entered, the loop ends and the total is output.',
    testCases: [
      { inputs: ['5', '10', '3', '0'],        expectedOutput: '18', description: 'Basic sum',             sortOrder: 0 },
      { inputs: ['0'],                         expectedOutput: '0',  description: 'Immediate zero',        sortOrder: 1 },
      { inputs: ['7', '0'],                    expectedOutput: '7',  description: 'Single number',         sortOrder: 2 },
      { inputs: ['100', '200', '300', '0'],    expectedOutput: '600', description: null,                  sortOrder: 3, isHidden: true },
      { inputs: ['1', '2', '3', '4', '5', '0'], expectedOutput: '15', description: null,                 sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Count Numbers in Range',
    description: `Read an integer N (1 ≤ N ≤ 10), then read N integers.
Count how many of the integers are in the range **10 to 20 inclusive**. Output the count.

**Input:** N on the first line, then N integers one per line.
**Output:** The count of numbers in the range 10–20.

**Example:**
\`\`\`
Input:  5
        5
        15
        20
        25
        10
Output: 3
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Num : INTEGER
DECLARE Count : INTEGER

INPUT N

Count <- 0
FOR i <- 1 TO N
    INPUT Num
    IF Num >= 10 AND Num <= 20 THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
    hints: [
      'You need to read each number and check if it falls within a specific range, keeping a count.',
      'Use a FOR loop to read N numbers. For each one, check if it is >= 10 AND <= 20. If so, increment a counter.',
      'Set Count <- 0. Inside the loop: INPUT Num, then IF Num >= 10 AND Num <= 20 THEN Count <- Count + 1. After the loop, OUTPUT Count.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Num : INTEGER
DECLARE Count : INTEGER

INPUT N

Count <- 0
FOR i <- 1 TO N
    INPUT Num
    IF Num >= 10 AND Num <= 20 THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
    solutionExplanation: 'Read N numbers one at a time using a FOR loop. For each number, check if it is within the range 10 to 20 inclusive using AND. Increment a counter for each match, then output the count after the loop.',
    testCases: [
      { inputs: ['5', '5', '15', '20', '25', '10'],       expectedOutput: '3', description: 'Three in range',    sortOrder: 0 },
      { inputs: ['3', '1', '2', '3'],                      expectedOutput: '0', description: 'None in range',     sortOrder: 1 },
      { inputs: ['4', '10', '20', '15', '5'],              expectedOutput: '3', description: 'Three in range',    sortOrder: 2 },
      { inputs: ['5', '10', '10', '10', '10', '10'],       expectedOutput: '5', description: null,                sortOrder: 3, isHidden: true },
      { inputs: ['1', '9'],                                 expectedOutput: '0', description: null,                sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Username Validator',
    description: `Read a username string. Output \`Valid\` if the username length is between **6 and 12 characters inclusive**, otherwise output \`Invalid\`.

**Input:** A single string.
**Output:** \`Valid\` or \`Invalid\`.

**Example:**
\`\`\`
Input:  student1
Output: Valid
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    starterCode: `DECLARE Username : STRING
DECLARE Len : INTEGER

INPUT Username

Len <- LENGTH(Username)

IF Len >= 6 AND Len <= 12 THEN
    OUTPUT "Valid"
ELSE
    OUTPUT "Invalid"
ENDIF`,
    hints: [
      'You need to check the length of the string. Think about which built-in function gives you the number of characters.',
      'Use LENGTH() to get the string length, then check if it is between 6 and 12 inclusive using AND.',
      'Len <- LENGTH(Username)\nIF Len >= 6 AND Len <= 12 THEN\n    OUTPUT "Valid"\nELSE\n    OUTPUT "Invalid"\nENDIF',
    ],
    solution: `DECLARE Username : STRING
DECLARE Len : INTEGER

INPUT Username

Len <- LENGTH(Username)

IF Len >= 6 AND Len <= 12 THEN
    OUTPUT "Valid"
ELSE
    OUTPUT "Invalid"
ENDIF`,
    solutionExplanation: 'Get the length of the username using LENGTH(). Check if the length is between 6 and 12 inclusive using a compound condition with AND. Output "Valid" or "Invalid" accordingly.',
    testCases: [
      { inputs: ['student1'],           expectedOutput: 'Valid',   description: '8 chars — valid',      sortOrder: 0 },
      { inputs: ['hello'],              expectedOutput: 'Invalid', description: '5 chars — too short',  sortOrder: 1 },
      { inputs: ['averylongusername'],  expectedOutput: 'Invalid', description: '17 chars — too long',  sortOrder: 2 },
      { inputs: ['abcdef'],             expectedOutput: 'Valid',   description: null,                   sortOrder: 3, isHidden: true },
      { inputs: ['abcdefghijkl'],       expectedOutput: 'Valid',   description: null,                   sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Capitalise First Letter',
    description: `Read a word. Output it with the **first letter in uppercase** and all remaining letters in lowercase.

**Input:** A single word.
**Output:** The word with first letter capitalised.

**Example:**
\`\`\`
Input:  hello
Output: Hello
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    starterCode: `DECLARE Word : STRING
DECLARE Result : STRING

INPUT Word

Result <- UCASE(SUBSTRING(Word, 1, 1)) & LCASE(SUBSTRING(Word, 2, LENGTH(Word) - 1))

OUTPUT Result`,
    hints: [
      'You need to extract the first character and the rest of the string separately, then transform and combine them.',
      'Use UCASE() on the first character and LCASE() on the remaining characters. Use SUBSTRING() to extract parts and & to join them.',
      'Result <- UCASE(SUBSTRING(Word, 1, 1)) & LCASE(SUBSTRING(Word, 2, LENGTH(Word) - 1))',
    ],
    solution: `DECLARE Word : STRING
DECLARE Result : STRING

INPUT Word

Result <- UCASE(SUBSTRING(Word, 1, 1)) & LCASE(SUBSTRING(Word, 2, LENGTH(Word) - 1))

OUTPUT Result`,
    solutionExplanation: 'Extract the first character using SUBSTRING(Word, 1, 1) and convert it to uppercase with UCASE(). Extract the rest using SUBSTRING(Word, 2, LENGTH(Word)-1) and convert to lowercase with LCASE(). Concatenate them with & to form the result.',
    testCases: [
      { inputs: ['hello'],   expectedOutput: 'Hello',  description: 'Lowercase input',  sortOrder: 0 },
      { inputs: ['WORLD'],   expectedOutput: 'World',  description: 'Uppercase input',  sortOrder: 1 },
      { inputs: ['pYTHON'],  expectedOutput: 'Python', description: 'Mixed case',       sortOrder: 2 },
      { inputs: ['z'],       expectedOutput: 'Z',      description: null,               sortOrder: 3, isHidden: true },
      { inputs: ['aBC'],     expectedOutput: 'Abc',    description: null,               sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Count Above Average',
    description: `Read an integer N (1 ≤ N ≤ 10), then read N integers into an array.
Compute the integer average (sum DIV N).
Count and output how many values are **strictly greater than** the average.

**Input:** N on the first line, then N integers one per line.
**Output:** The count of values above the integer average.

**Example:**
\`\`\`
Input:  5
        10
        20
        30
        40
        50
Output: 2
\`\`\`
*(sum = 150, average = 30, values above 30: 40, 50 → count = 2)*`,
    difficulty: 'MEDIUM' as const,
    topic: 'Arrays',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Sum : INTEGER
DECLARE Avg : INTEGER
DECLARE Count : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N

Sum <- 0
FOR i <- 1 TO N
    INPUT Numbers[i]
    Sum <- Sum + Numbers[i]
NEXT i

Avg <- Sum DIV N

Count <- 0
FOR i <- 1 TO N
    IF Numbers[i] > Avg THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
    hints: [
      'You need two passes through the data: one to calculate the average, and another to count how many values exceed it.',
      'First, read all values and compute the sum. Calculate the integer average using DIV. Then loop through the array again, counting elements greater than the average.',
      'Sum all elements, Avg <- Sum DIV N. Then loop again: IF Numbers[i] > Avg THEN Count <- Count + 1. Output Count.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Sum : INTEGER
DECLARE Avg : INTEGER
DECLARE Count : INTEGER
DECLARE Numbers : ARRAY[1:10] OF INTEGER

INPUT N

Sum <- 0
FOR i <- 1 TO N
    INPUT Numbers[i]
    Sum <- Sum + Numbers[i]
NEXT i

Avg <- Sum DIV N

Count <- 0
FOR i <- 1 TO N
    IF Numbers[i] > Avg THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
    solutionExplanation: 'Read all N values into an array while computing the sum. Calculate the integer average using DIV. Then loop through the array a second time, counting how many values are strictly greater than the average.',
    testCases: [
      { inputs: ['5', '10', '20', '30', '40', '50'], expectedOutput: '2', description: 'Average = 30',         sortOrder: 0 },
      { inputs: ['4', '1', '2', '3', '4'],           expectedOutput: '2', description: 'Average = 2 (int div)', sortOrder: 1 },
      { inputs: ['3', '5', '5', '5'],                expectedOutput: '0', description: 'All equal',             sortOrder: 2 },
      { inputs: ['4', '5', '10', '15', '20'],        expectedOutput: '2', description: null,                    sortOrder: 3, isHidden: true },
      { inputs: ['1', '7'],                           expectedOutput: '0', description: null,                    sortOrder: 4, isHidden: true },
    ],
  },

  // ════════════════════════════════════════════════ NEW HARD (IGCSE-style) ═══

  {
    title: 'Leap Year Checker',
    description: `Read a year. Output \`Leap Year\` if it is a leap year, or \`Not a Leap Year\` otherwise.

**Rules:**
- Divisible by 400 → Leap Year
- Divisible by 100 (but not 400) → Not a Leap Year
- Divisible by 4 (but not 100) → Leap Year
- Otherwise → Not a Leap Year

**Input:** A positive integer year.
**Output:** \`Leap Year\` or \`Not a Leap Year\`.

**Example:**
\`\`\`
Input:  2024
Output: Leap Year
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Selection',
    starterCode: `DECLARE Year : INTEGER

INPUT Year

IF MOD(Year, 400) = 0 THEN
    OUTPUT "Leap Year"
ELSEIF MOD(Year, 100) = 0 THEN
    OUTPUT "Not a Leap Year"
ELSEIF MOD(Year, 4) = 0 THEN
    OUTPUT "Leap Year"
ELSE
    OUTPUT "Not a Leap Year"
ENDIF`,
    hints: [
      'Leap year rules have exceptions to exceptions. The order you check the conditions matters a lot.',
      'Check divisibility by 400 first (leap), then 100 (not leap), then 4 (leap), then everything else (not leap). This order handles all the special cases correctly.',
      'IF MOD(Year, 400) = 0 THEN "Leap Year" ELSEIF MOD(Year, 100) = 0 THEN "Not a Leap Year" ELSEIF MOD(Year, 4) = 0 THEN "Leap Year" ELSE "Not a Leap Year"',
    ],
    solution: `DECLARE Year : INTEGER

INPUT Year

IF MOD(Year, 400) = 0 THEN
    OUTPUT "Leap Year"
ELSEIF MOD(Year, 100) = 0 THEN
    OUTPUT "Not a Leap Year"
ELSEIF MOD(Year, 4) = 0 THEN
    OUTPUT "Leap Year"
ELSE
    OUTPUT "Not a Leap Year"
ENDIF`,
    solutionExplanation: 'Check leap year rules in the correct order using IF/ELSEIF. Check divisible by 400 first (leap year), then by 100 (not leap), then by 4 (leap). The order matters because 400 is a special case of 100, which is a special case of 4.',
    testCases: [
      { inputs: ['2000'], expectedOutput: 'Leap Year',     description: 'Divisible by 400',       sortOrder: 0 },
      { inputs: ['1900'], expectedOutput: 'Not a Leap Year', description: 'Div by 100, not 400',  sortOrder: 1 },
      { inputs: ['2024'], expectedOutput: 'Leap Year',     description: 'Divisible by 4',         sortOrder: 2 },
      { inputs: ['2023'], expectedOutput: 'Not a Leap Year', description: 'Not divisible by 4',   sortOrder: 3 },
      { inputs: ['1600'], expectedOutput: 'Leap Year',     description: null,                     sortOrder: 4, isHidden: true },
      { inputs: ['2100'], expectedOutput: 'Not a Leap Year', description: null,                   sortOrder: 5, isHidden: true },
    ],
  },

  {
    title: 'Selection Sort',
    description: `Read an integer N (1 ≤ N ≤ 8), then read N integers. Sort them in **ascending** order using selection sort and output them one per line.

**Selection Sort:** For each position i from 1 to N-1, find the minimum value in positions i to N, then swap it into position i.

**Input:** N on the first line, then N integers one per line.
**Output:** The sorted integers in ascending order, one per line.

**Example:**
\`\`\`
Input:  5
        64
        25
        12
        22
        11
Output: 11
        12
        22
        25
        64
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE MinIdx : INTEGER
DECLARE Temp : INTEGER
DECLARE Numbers : ARRAY[1:8] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i

// Selection sort
FOR i <- 1 TO N - 1
    MinIdx <- i
    FOR j <- i + 1 TO N
        IF Numbers[j] < Numbers[MinIdx] THEN
            MinIdx <- j
        ENDIF
    NEXT j
    IF MinIdx <> i THEN
        Temp <- Numbers[i]
        Numbers[i] <- Numbers[MinIdx]
        Numbers[MinIdx] <- Temp
    ENDIF
NEXT i

FOR i <- 1 TO N
    OUTPUT Numbers[i]
NEXT i`,
    hints: [
      'Selection sort works by finding the smallest unsorted element and placing it in its correct position, one at a time.',
      'For each position i, scan the remaining positions (i+1 to N) to find the index of the minimum value. Then swap that minimum into position i.',
      'Use MinIdx to track the position of the smallest element. After the inner loop, swap Numbers[i] with Numbers[MinIdx] using a Temp variable.',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE j : INTEGER
DECLARE MinIdx : INTEGER
DECLARE Temp : INTEGER
DECLARE Numbers : ARRAY[1:8] OF INTEGER

INPUT N
FOR i <- 1 TO N
    INPUT Numbers[i]
NEXT i

FOR i <- 1 TO N - 1
    MinIdx <- i
    FOR j <- i + 1 TO N
        IF Numbers[j] < Numbers[MinIdx] THEN
            MinIdx <- j
        ENDIF
    NEXT j
    IF MinIdx <> i THEN
        Temp <- Numbers[i]
        Numbers[i] <- Numbers[MinIdx]
        Numbers[MinIdx] <- Temp
    ENDIF
NEXT i

FOR i <- 1 TO N
    OUTPUT Numbers[i]
NEXT i`,
    solutionExplanation: 'Selection sort uses two nested loops. The outer loop selects each position from 1 to N-1. The inner loop finds the minimum element in the unsorted portion. After finding it, swap it into the current position. This builds the sorted array from left to right.',
    testCases: [
      { inputs: ['5', '64', '25', '12', '22', '11'], expectedOutput: '11\n12\n22\n25\n64', description: 'Unsorted 5 numbers',  sortOrder: 0 },
      { inputs: ['3', '3', '1', '2'],               expectedOutput: '1\n2\n3',            description: '3 numbers',           sortOrder: 1 },
      { inputs: ['4', '5', '4', '3', '2'],          expectedOutput: '2\n3\n4\n5',         description: null,                  sortOrder: 2, isHidden: true },
      { inputs: ['5', '1', '2', '3', '4', '5'],    expectedOutput: '1\n2\n3\n4\n5',      description: null,                  sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Password Strength Checker',
    description: `Read a password string. Output \`Strong\` if it meets **both** of the following criteria:

1. At least **8 characters** long
2. Contains at least **one digit** (0–9)

Otherwise output \`Weak\`.

**Input:** A single string (the password).
**Output:** \`Strong\` or \`Weak\`.

**Example:**
\`\`\`
Input:  hello123
Output: Strong
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'String Processing',
    starterCode: `DECLARE Password : STRING
DECLARE i : INTEGER
DECLARE Ch : STRING
DECLARE HasDigit : BOOLEAN
DECLARE Len : INTEGER

INPUT Password

Len <- LENGTH(Password)
HasDigit <- FALSE

FOR i <- 1 TO Len
    Ch <- SUBSTRING(Password, i, 1)
    IF Ch >= "0" AND Ch <= "9" THEN
        HasDigit <- TRUE
    ENDIF
NEXT i

IF Len >= 8 AND HasDigit = TRUE THEN
    OUTPUT "Strong"
ELSE
    OUTPUT "Weak"
ENDIF`,
    hints: [
      'You need to check two things: the length of the password and whether it contains at least one digit.',
      'Use LENGTH() to check the length. Loop through each character and compare it to "0" and "9" to check for digits. Use a Boolean flag.',
      'Set HasDigit <- FALSE. Loop through each character: IF Ch >= "0" AND Ch <= "9" THEN HasDigit <- TRUE. After the loop, check IF Len >= 8 AND HasDigit = TRUE.',
    ],
    solution: `DECLARE Password : STRING
DECLARE i : INTEGER
DECLARE Ch : STRING
DECLARE HasDigit : BOOLEAN
DECLARE Len : INTEGER

INPUT Password

Len <- LENGTH(Password)
HasDigit <- FALSE

FOR i <- 1 TO Len
    Ch <- SUBSTRING(Password, i, 1)
    IF Ch >= "0" AND Ch <= "9" THEN
        HasDigit <- TRUE
    ENDIF
NEXT i

IF Len >= 8 AND HasDigit = TRUE THEN
    OUTPUT "Strong"
ELSE
    OUTPUT "Weak"
ENDIF`,
    solutionExplanation: 'Check the password length using LENGTH(). Loop through each character, checking if it is a digit by comparing with "0" and "9". Use a Boolean flag HasDigit. After the loop, the password is strong only if both conditions are met: length >= 8 AND at least one digit found.',
    testCases: [
      { inputs: ['hello123'],  expectedOutput: 'Strong', description: '8 chars with digit',    sortOrder: 0 },
      { inputs: ['abc123'],    expectedOutput: 'Weak',   description: 'Too short',             sortOrder: 1 },
      { inputs: ['abcdefgh'],  expectedOutput: 'Weak',   description: '8 chars, no digit',     sortOrder: 2 },
      { inputs: ['password1'], expectedOutput: 'Strong', description: null,                    sortOrder: 3, isHidden: true },
      { inputs: ['12345678'],  expectedOutput: 'Strong', description: null,                    sortOrder: 4, isHidden: true },
      { inputs: ['short'],     expectedOutput: 'Weak',   description: null,                    sortOrder: 5, isHidden: true },
    ],
  },

  {
    title: '2D Array Row Sums',
    description: `Read a 3×3 matrix of integers, entered row by row (9 values in total). For each row, output the sum of that row's three values, one sum per line.

**Input:** 9 integers in row-major order (3 values per row, 3 rows).
**Output:** Three integers — the sum of row 1, row 2, and row 3.

**Example:**
\`\`\`
Input:  1 2 3     (row 1)
        4 5 6     (row 2)
        7 8 9     (row 3)
Output: 6
        15
        24
\`\`\`
*(Enter all 9 values one per line)*`,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    starterCode: `DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE RowSum : INTEGER

FOR Row <- 1 TO 3
    FOR Col <- 1 TO 3
        INPUT Grid[Row, Col]
    NEXT Col
NEXT Row

FOR Row <- 1 TO 3
    RowSum <- 0
    FOR Col <- 1 TO 3
        RowSum <- RowSum + Grid[Row, Col]
    NEXT Col
    OUTPUT RowSum
NEXT Row`,
    hints: [
      'You need to read values into a 2D array, then calculate the sum for each row separately.',
      'Use nested loops: outer for rows, inner for columns. Read all values first, then use another pair of nested loops to sum each row.',
      'For each row: reset RowSum to 0, loop through columns adding Grid[Row, Col] to RowSum, then OUTPUT RowSum before moving to the next row.',
    ],
    solution: `DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE RowSum : INTEGER

FOR Row <- 1 TO 3
    FOR Col <- 1 TO 3
        INPUT Grid[Row, Col]
    NEXT Col
NEXT Row

FOR Row <- 1 TO 3
    RowSum <- 0
    FOR Col <- 1 TO 3
        RowSum <- RowSum + Grid[Row, Col]
    NEXT Col
    OUTPUT RowSum
NEXT Row`,
    solutionExplanation: 'Use nested loops to read values into a 3x3 2D array. Then use another pair of nested loops to compute each row sum: reset RowSum to 0 for each row, add all three column values, and output the sum before moving to the next row.',
    testCases: [
      {
        inputs: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        expectedOutput: '6\n15\n24',
        description: '1–9 matrix',
        sortOrder: 0,
      },
      {
        inputs: ['10', '20', '30', '0', '0', '0', '5', '5', '5'],
        expectedOutput: '60\n0\n15',
        description: 'Mixed rows',
        sortOrder: 1,
      },
      {
        inputs: ['1', '1', '1', '2', '2', '2', '3', '3', '3'],
        expectedOutput: '3\n6\n9',
        description: 'Uniform rows',
        sortOrder: 2,
      },
      {
        inputs: ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
        expectedOutput: '0\n0\n0',
        description: null,
        sortOrder: 3,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════════════ REAL PAST PAPERS ═══

  // ── Question A: Energy Efficiency Rating ─────────────────────────────
  {
    title: 'Energy Efficiency Rating',
    description: `Read an appliance's energy efficiency as an integer percentage. If efficiency is 92 or over, output \`A-rated\`. If below 92, output \`Not A-rated\`.

**Source:** 2023 Feb/Mar Variant 2 Q6(b)

**Input:** A single integer — the efficiency percentage.
**Output:** \`A-rated\` or \`Not A-rated\`.

**Example:**
\`\`\`
Input:  95
Output: A-rated
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    year: 2023,
    session: 'Feb/Mar',
    variant: 2,
    questionNumber: 6,
    part: 'b',
    marks: 2,
    starterCode: `DECLARE Efficiency : INTEGER

INPUT Efficiency

// Check if efficiency is 92% or over and output the rating`,
    hints: [
      'You only need a simple selection statement here — think about which value separates A-rated from non-A-rated.',
      'Use IF ... THEN ... ELSE ... ENDIF with the condition Efficiency >= 92.',
      'IF Efficiency >= 92 THEN\n    OUTPUT "A-rated"\nELSE\n    OUTPUT "Not A-rated"\nENDIF',
    ],
    solution: `DECLARE Efficiency : INTEGER

INPUT Efficiency

IF Efficiency >= 92 THEN
    OUTPUT "A-rated"
ELSE
    OUTPUT "Not A-rated"
ENDIF`,
    solutionExplanation: 'A simple IF/ELSE checks whether the efficiency meets the 92% threshold. Output the appropriate rating string based on the condition.',
    testCases: [
      { inputs: ['95'], expectedOutput: 'A-rated',     description: 'Above threshold',       sortOrder: 0 },
      { inputs: ['92'], expectedOutput: 'A-rated',     description: 'Exactly 92 — boundary', sortOrder: 1 },
      { inputs: ['80'], expectedOutput: 'Not A-rated', description: 'Below threshold',        sortOrder: 2 },
      { inputs: ['100'], expectedOutput: 'A-rated',    description: null,                     sortOrder: 3, isHidden: true },
      { inputs: ['91'], expectedOutput: 'Not A-rated', description: null,                     sortOrder: 4, isHidden: true },
    ],
  },

  // ── Question B: Average of Numbers in Array ───────────────────────────
  {
    title: 'Average of Numbers in Array',
    description: `Read N numbers (1 ≤ N ≤ 50) and store them in a 1D array. Use a single loop to compute the total, then output the integer average (using integer division).

**Source:** Inspired by 2023 Feb/Mar Variant 2 Q2(b)

**Input:** N on the first line, then N integers one per line.
**Output:** The integer average (integer division — no decimals).

**Example:**
\`\`\`
Input:  5
        10
        20
        30
        40
        50
Output: 30
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arrays',
    year: 2023,
    session: 'Feb/Mar',
    variant: 2,
    questionNumber: 2,
    part: 'b',
    marks: 5,
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Avg : INTEGER
DECLARE Number : ARRAY[1:50] OF INTEGER

INPUT N

Total <- 0
FOR i <- 1 TO N
    INPUT Number[i]
    // add to total
NEXT i

// Calculate and output the average`,
    hints: [
      'You need a running total variable that starts at 0 and is updated inside the loop.',
      'Accumulate: Total <- Total + Number[i] inside the FOR loop. After the loop, divide to get the average.',
      'After the loop: Avg <- Total DIV N then OUTPUT Avg',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Total : INTEGER
DECLARE Avg : INTEGER
DECLARE Number : ARRAY[1:50] OF INTEGER

INPUT N

Total <- 0
FOR i <- 1 TO N
    INPUT Number[i]
    Total <- Total + Number[i]
NEXT i

Avg <- Total DIV N
OUTPUT Avg`,
    solutionExplanation: 'Use a FOR loop to iterate through all N elements, accumulating the total. After the loop, divide using DIV for integer division and output the result.',
    testCases: [
      { inputs: ['5', '10', '20', '30', '40', '50'], expectedOutput: '30', description: 'Average of 5 numbers', sortOrder: 0 },
      { inputs: ['4', '2', '4', '6', '8'],           expectedOutput: '5',  description: 'Average of 4 numbers', sortOrder: 1 },
      { inputs: ['3', '9', '9', '9'],                 expectedOutput: '9',  description: 'All same values',      sortOrder: 2 },
      { inputs: ['1', '42'],                          expectedOutput: '42', description: null,                   sortOrder: 3, isHidden: true },
      { inputs: ['6', '1', '2', '3', '4', '5', '6'], expectedOutput: '3',  description: null,                   sortOrder: 4, isHidden: true },
    ],
  },

  // ── Question C: Find Minimum in Array ────────────────────────────────
  {
    title: 'Find Minimum in Array',
    description: `Read 10 integers (each between -20 and 100 inclusive) into a 1D array. Using a single loop, find and output the lowest value.

**Source:** Inspired by 2023 Oct/Nov Variant 2 Q3(b)

**Input:** 10 integers on separate lines.
**Output:** The minimum value.

**Example:**
\`\`\`
Input:  5
        3
        -1
        10
        7
        2
        -20
        8
        4
        6
Output: -20
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arrays',
    year: 2023,
    session: 'Oct/Nov',
    variant: 2,
    questionNumber: 3,
    part: 'b',
    marks: 4,
    starterCode: `DECLARE i : INTEGER
DECLARE Min : INTEGER
DECLARE Temp : ARRAY[1:10] OF INTEGER

FOR i <- 1 TO 10
    INPUT Temp[i]
NEXT i

// Find the minimum value using a loop
Min <- Temp[1]
FOR i <- 2 TO 10
    // update Min if a smaller value is found
NEXT i

OUTPUT Min`,
    hints: [
      'Set Min to the first element before the loop, then compare each subsequent element.',
      'Inside the loop: IF Temp[i] < Min THEN update Min.',
      'Min <- Temp[1], then FOR i <- 2 TO 10 — IF Temp[i] < Min THEN Min <- Temp[i] ENDIF',
    ],
    solution: `DECLARE i : INTEGER
DECLARE Min : INTEGER
DECLARE Temp : ARRAY[1:10] OF INTEGER

FOR i <- 1 TO 10
    INPUT Temp[i]
NEXT i

Min <- Temp[1]
FOR i <- 2 TO 10
    IF Temp[i] < Min THEN
        Min <- Temp[i]
    ENDIF
NEXT i

OUTPUT Min`,
    solutionExplanation: 'Initialise Min with the first element, then loop from the second element onwards. If any element is smaller than the current Min, update Min. Output the final minimum after the loop.',
    testCases: [
      { inputs: ['5', '3', '-1', '10', '7', '2', '-20', '8', '4', '6'],     expectedOutput: '-20', description: 'Min is negative', sortOrder: 0 },
      { inputs: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'], expectedOutput: '10', description: 'Min is first',    sortOrder: 1 },
      { inputs: ['50', '50', '50', '50', '50', '50', '50', '50', '50', '1'],   expectedOutput: '1',  description: 'Min is last',     sortOrder: 2 },
      { inputs: ['-5', '-10', '-15', '-20', '-3', '-8', '-12', '-1', '-6', '-9'], expectedOutput: '-20', description: null, sortOrder: 3, isHidden: true },
      { inputs: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],          expectedOutput: '0',  description: null,            sortOrder: 4, isHidden: true },
    ],
  },

  // ── Question D: Maximum, Minimum and Range ────────────────────────────
  {
    title: 'Maximum, Minimum and Range',
    description: `Read N positive integers (each less than 1000). Find and output the largest, smallest, and range (largest minus smallest) — each on a separate line.

**Source:** 2021 May/June Variant 2 Q2(a)

**Input:** N on the first line (2 ≤ N ≤ 10), then N integers.
**Output:** Three lines — largest, smallest, range.

**Example:**
\`\`\`
Input:  5
        34
        12
        78
        5
        56
Output: 78
        5
        73
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    year: 2021,
    session: 'May/June',
    variant: 2,
    questionNumber: 2,
    part: 'a',
    marks: 6,
    starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Num : INTEGER
DECLARE Largest : INTEGER
DECLARE Smallest : INTEGER

INPUT N
INPUT Num
Largest <- Num
Smallest <- Num

FOR i <- 2 TO N
    INPUT Num
    // Update Largest and Smallest as needed
NEXT i

// Output the results`,
    hints: [
      'Read the first number before the loop, set both Largest and Smallest to it, then loop from 2 to N.',
      'Inside the loop: use two separate IF statements — one to update Largest, one to update Smallest.',
      'After the loop: OUTPUT Largest, OUTPUT Smallest, OUTPUT Largest - Smallest',
    ],
    solution: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Num : INTEGER
DECLARE Largest : INTEGER
DECLARE Smallest : INTEGER

INPUT N
INPUT Num
Largest <- Num
Smallest <- Num

FOR i <- 2 TO N
    INPUT Num
    IF Num > Largest THEN
        Largest <- Num
    ENDIF
    IF Num < Smallest THEN
        Smallest <- Num
    ENDIF
NEXT i

OUTPUT Largest
OUTPUT Smallest
OUTPUT Largest - Smallest`,
    solutionExplanation: 'Read the first number and initialise both Largest and Smallest to it. For each subsequent number, update Largest if larger or Smallest if smaller. The range is simply Largest minus Smallest.',
    testCases: [
      { inputs: ['5', '34', '12', '78', '5', '56'],    expectedOutput: '78\n5\n73',   description: 'Mixed values',          sortOrder: 0 },
      { inputs: ['3', '100', '50', '75'],               expectedOutput: '100\n50\n50', description: '3 numbers',             sortOrder: 1 },
      { inputs: ['4', '10', '10', '10', '10'],          expectedOutput: '10\n10\n0',   description: 'All same — range is 0', sortOrder: 2 },
      { inputs: ['2', '999', '1'],                      expectedOutput: '999\n1\n998', description: null,                   sortOrder: 3, isHidden: true },
      { inputs: ['6', '4', '8', '15', '16', '23', '42'], expectedOutput: '42\n4\n38', description: null,                   sortOrder: 4, isHidden: true },
    ],
  },

  // ── Question E: Count Students by Age Group ───────────────────────────
  {
    title: 'Count Students by Age Group',
    description: `Read 10 student ages. Count and output how many are:
- aged 7 to 11 (i.e. ≥ 7 AND < 12)
- aged 12 to 17 (i.e. ≥ 12 AND < 18)
- aged 18 or over

Output the three counts on separate lines in that order.

**Source:** Inspired by 2022 Feb/Mar Variant 2 Q2(a)(b)

**Input:** 10 integers — the student ages.
**Output:** Three lines — count of 7–11, count of 12–17, count of 18+.

**Example:**
\`\`\`
Input:  8 10 13 16 20 25 7 12 18 11
Output: 4
        3
        3
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    year: 2022,
    session: 'Feb/Mar',
    variant: 2,
    questionNumber: 2,
    part: 'a',
    marks: 8,
    starterCode: `DECLARE Student : INTEGER
DECLARE Age : INTEGER
DECLARE Count7to11 : INTEGER
DECLARE Count12to17 : INTEGER
DECLARE Count18Plus : INTEGER

Count7to11 <- 0
Count12to17 <- 0
Count18Plus <- 0

FOR Student <- 1 TO 10
    INPUT Age
    // Classify age into the correct group
NEXT Student

OUTPUT Count7to11
OUTPUT Count12to17
OUTPUT Count18Plus`,
    hints: [
      'You need three counters — one per age group. Initialise them all to 0 before the loop.',
      'Use three separate IF statements (not ELSEIF) to check each range independently. The ranges are: 7≤age<12, 12≤age<18, age≥18.',
      'Each IF uses AND: IF Age >= 7 AND Age < 12 THEN Count7to11 <- Count7to11 + 1 ENDIF',
    ],
    solution: `DECLARE Student : INTEGER
DECLARE Age : INTEGER
DECLARE Count7to11 : INTEGER
DECLARE Count12to17 : INTEGER
DECLARE Count18Plus : INTEGER

Count7to11 <- 0
Count12to17 <- 0
Count18Plus <- 0

FOR Student <- 1 TO 10
    INPUT Age
    IF Age >= 7 AND Age < 12 THEN
        Count7to11 <- Count7to11 + 1
    ENDIF
    IF Age >= 12 AND Age < 18 THEN
        Count12to17 <- Count12to17 + 1
    ENDIF
    IF Age >= 18 THEN
        Count18Plus <- Count18Plus + 1
    ENDIF
NEXT Student

OUTPUT Count7to11
OUTPUT Count12to17
OUTPUT Count18Plus`,
    solutionExplanation: 'Use three separate IF statements (not ELSEIF) inside the loop to check each age range independently. Each counter is incremented when the age falls in that range. Output the three counts in order after the loop.',
    testCases: [
      { inputs: ['8', '10', '13', '16', '20', '25', '7', '12', '18', '11'], expectedOutput: '4\n3\n3',  description: 'Mixed ages',      sortOrder: 0 },
      { inputs: ['8', '9', '10', '11', '7', '8', '9', '10', '11', '7'],     expectedOutput: '10\n0\n0', description: 'All in 7-11',     sortOrder: 1 },
      { inputs: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29'], expectedOutput: '0\n0\n10', description: 'All 18+',       sortOrder: 2 },
      { inputs: ['12', '13', '14', '15', '16', '17', '12', '13', '14', '15'], expectedOutput: '0\n10\n0', description: null,           sortOrder: 3, isHidden: true },
      { inputs: ['5', '6', '8', '13', '20', '3', '9', '15', '22', '1'],      expectedOutput: '2\n2\n2',  description: null,            sortOrder: 4, isHidden: true },
    ],
  },

  // ── Question F: String Extraction and Lowercase ───────────────────────
  {
    title: 'String Extraction and Lowercase',
    description: `The string \`"Learning Never Exhausts The Mind"\` is stored in a variable \`Quote\`.

Write pseudocode to:
1. Store that string in \`Quote\`
2. Extract and output the last 8 characters (\`"The Mind"\`)
3. Output the entire string in lowercase

**Source:** 2023 Oct/Nov Variant 2 Q7

**Input:** None — the string is hardcoded in the program.
**Output:** Two lines — \`The Mind\` then \`learning never exhausts the mind\`

**Note:** \`SUBSTRING(str, start, length)\` returns \`length\` characters from position \`start\`. The string has 32 characters, so \`"The Mind"\` starts at position 25.`,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    year: 2023,
    session: 'Oct/Nov',
    variant: 2,
    questionNumber: 7,
    part: null,
    marks: 5,
    starterCode: `DECLARE Quote : STRING

Quote <- "Learning Never Exhausts The Mind"

// Extract and output the last 8 characters ("The Mind")

// Output the full string in lowercase`,
    hints: [
      'Count the characters in the string to find where \'The Mind\' starts. Remember: position 1 is the first character.',
      'The string \'Learning Never Exhausts The Mind\' has 32 characters total. \'The Mind\' is 8 characters long — count backwards from the end to find its starting position.',
      'OUTPUT SUBSTRING(Quote, 25, 8) to get \'The Mind\', then OUTPUT LCASE(Quote) for the lowercase version.',
    ],
    solution: `DECLARE Quote : STRING

Quote <- "Learning Never Exhausts The Mind"

OUTPUT SUBSTRING(Quote, 25, 8)
OUTPUT LCASE(Quote)`,
    solutionExplanation: 'The string has 32 characters. "The Mind" starts at position 25 and is 8 characters long, so SUBSTRING(Quote, 25, 8) extracts it. LCASE() converts the entire string to lowercase.',
    testCases: [
      {
        inputs: [],
        expectedOutput: 'The Mind\nlearning never exhausts the mind',
        description: 'Fixed string operations',
        sortOrder: 0,
      },
    ],
  },

  // ── Question G: Double Entry Validation ──────────────────────────────
  {
    title: 'Double Entry Validation',
    description: `Implement a double-entry check for a measurement.

Ask the user to enter the measurement twice. If both entries match, store the value in \`Measurement\` and output \`Accepted\`. If they don't match, repeat the process until they do.

**Source:** Inspired by 2023 May/June Variant 2 Q4(b)(ii)

**Input:** Pairs of integers until both match. Each pair is two lines.
**Output:** \`Accepted\` followed by the accepted value, each on a separate line.

**Example:**
\`\`\`
Input:  10
        5       (mismatch — try again)
        10
        10      (match!)
Output: Accepted
        10
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    year: 2023,
    session: 'May/June',
    variant: 2,
    questionNumber: 4,
    part: 'b',
    marks: 3,
    starterCode: `DECLARE Measurement : INTEGER
DECLARE Entry1 : INTEGER
DECLARE Entry2 : INTEGER

REPEAT
    INPUT Entry1
    INPUT Entry2
UNTIL Entry1 = Entry2

Measurement <- Entry1
OUTPUT "Accepted"
OUTPUT Measurement`,
    hints: [
      'A double-entry check repeats until both entries match. Which loop type is ideal when you always run at least once?',
      'Use REPEAT ... UNTIL with two INPUT statements inside — one for each entry. The condition is Entry1 = Entry2.',
      'REPEAT / INPUT Entry1 / INPUT Entry2 / UNTIL Entry1 = Entry2, then Measurement <- Entry1',
    ],
    solution: `DECLARE Measurement : INTEGER
DECLARE Entry1 : INTEGER
DECLARE Entry2 : INTEGER

REPEAT
    INPUT Entry1
    INPUT Entry2
UNTIL Entry1 = Entry2

Measurement <- Entry1
OUTPUT "Accepted"
OUTPUT Measurement`,
    solutionExplanation: 'A REPEAT/UNTIL loop keeps asking for two inputs until they match. Once the loop exits (both entries equal), store the value and output the confirmation.',
    testCases: [
      { inputs: ['10', '10'],               expectedOutput: 'Accepted\n10', description: 'Match on first attempt',  sortOrder: 0 },
      { inputs: ['5', '3', '5', '5'],       expectedOutput: 'Accepted\n5',  description: 'Match on second attempt', sortOrder: 1 },
      { inputs: ['0', '0'],                 expectedOutput: 'Accepted\n0',  description: 'Zero value',              sortOrder: 2 },
      { inputs: ['99', '1', '99', '99'],    expectedOutput: 'Accepted\n99', description: null,                     sortOrder: 3, isHidden: true },
      { inputs: ['7', '8', '7', '9', '7', '7'], expectedOutput: 'Accepted\n7', description: null,                  sortOrder: 4, isHidden: true },
    ],
  },

  // ── Question H: Validate Input in Range ──────────────────────────────
  {
    title: 'Validate Input in Range',
    description: `Write an algorithm to ensure the variable \`Length\` is between 15 and 35 inclusive. Keep asking for input until a valid value is entered. Output \`Valid\` followed by the accepted value.

**Source:** Inspired by 2023 May/June Variant 3 Q5(b)

**Input:** One or more integers until a value in the range 15–35 is entered.
**Output:** \`Valid\` then the valid value, each on a separate line.

**Note:** The prompt \`"Enter a length between 15 and 35: "\` is output before each input attempt.

**Example:**
\`\`\`
Input:  20
Output: Enter a length between 15 and 35:
        Valid
        20
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    year: 2023,
    session: 'May/June',
    variant: 3,
    questionNumber: 5,
    part: 'b',
    marks: 3,
    starterCode: `DECLARE Length : INTEGER

REPEAT
    OUTPUT "Enter a length between 15 and 35: "
    INPUT Length
UNTIL Length >= 15 AND Length <= 35

OUTPUT "Valid"
OUTPUT Length`,
    hints: [
      'Use a REPEAT/UNTIL loop — it always runs at least once, which is perfect for input validation.',
      'The condition after UNTIL should be the valid range check: Length >= 15 AND Length <= 35.',
      'REPEAT / OUTPUT prompt / INPUT Length / UNTIL Length >= 15 AND Length <= 35',
    ],
    solution: `DECLARE Length : INTEGER

REPEAT
    OUTPUT "Enter a length between 15 and 35: "
    INPUT Length
UNTIL Length >= 15 AND Length <= 35

OUTPUT "Valid"
OUTPUT Length`,
    solutionExplanation: 'A REPEAT/UNTIL loop continues to prompt and read input until the value is within the valid range. After the loop exits, output the confirmation and the valid value.',
    testCases: [
      {
        inputs: ['20'],
        expectedOutput: 'Enter a length between 15 and 35: \nValid\n20',
        description: 'Valid on first attempt',
        sortOrder: 0,
      },
      {
        inputs: ['5', '40', '15'],
        expectedOutput: 'Enter a length between 15 and 35: \nEnter a length between 15 and 35: \nEnter a length between 15 and 35: \nValid\n15',
        description: 'Two invalid then valid',
        sortOrder: 1,
      },
      {
        inputs: ['35'],
        expectedOutput: 'Enter a length between 15 and 35: \nValid\n35',
        description: 'Upper boundary',
        sortOrder: 2,
      },
      {
        inputs: ['15'],
        expectedOutput: 'Enter a length between 15 and 35: \nValid\n15',
        description: null,
        sortOrder: 3,
        isHidden: true,
      },
      {
        inputs: ['0', '36', '25'],
        expectedOutput: 'Enter a length between 15 and 35: \nEnter a length between 15 and 35: \nEnter a length between 15 and 35: \nValid\n25',
        description: null,
        sortOrder: 4,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════════════ FILE HANDLING ═══

  {
    title: 'Read Names from File',
    description: `A file called \`names.txt\` has already been created and contains three names, one per line:

\`\`\`
Alice
Bob
Charlie
\`\`\`

Open the file for reading. Read each name and output it. Close the file when done.

**Input:** None (read from the file).
**Output:** Three names, each on a separate line, exactly as stored in the file.

**Example output:**
\`\`\`
Alice
Bob
Charlie
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'File Handling',
    starterCode: `DECLARE Name : STRING

OPENFILE "names.txt" FOR READ
WHILE NOT EOF("names.txt") DO
    READFILE "names.txt", Name
    OUTPUT Name
ENDWHILE
CLOSEFILE "names.txt"`,
    hints: [
      'File I/O uses OPENFILE, READFILE, and CLOSEFILE. The EOF() function returns TRUE when there are no more lines to read.',
      'Open the file with OPENFILE "names.txt" FOR READ. Use a WHILE NOT EOF("names.txt") DO loop to repeatedly read a line with READFILE and OUTPUT it.',
      'OPENFILE "names.txt" FOR READ → WHILE NOT EOF("names.txt") DO → READFILE "names.txt", Name → OUTPUT Name → ENDWHILE → CLOSEFILE "names.txt"',
    ],
    solution: `DECLARE Name : STRING

OPENFILE "names.txt" FOR READ
WHILE NOT EOF("names.txt") DO
    READFILE "names.txt", Name
    OUTPUT Name
ENDWHILE
CLOSEFILE "names.txt"`,
    solutionExplanation: 'Open the file for reading with OPENFILE. Use a WHILE NOT EOF loop: each iteration reads the next line into Name using READFILE and immediately outputs it. Once EOF is reached the loop ends and CLOSEFILE releases the file.',
    testCases: [
      {
        inputs: [],
        expectedOutput: 'Alice\nBob\nCharlie',
        description: 'Three names in file',
        sortOrder: 0,
        initialFiles: JSON.stringify({ 'names.txt': 'Alice\nBob\nCharlie' }),
      },
      {
        inputs: [],
        expectedOutput: 'Xena\nYuki\nZara',
        description: null,
        sortOrder: 1,
        isHidden: true,
        initialFiles: JSON.stringify({ 'names.txt': 'Xena\nYuki\nZara' }),
      },
      {
        inputs: [],
        expectedOutput: 'Solo',
        description: null,
        sortOrder: 2,
        isHidden: true,
        initialFiles: JSON.stringify({ 'names.txt': 'Solo' }),
      },
    ],
  },

  {
    title: 'Write Names to File and Read Back',
    description: `Read **3 names** from the user (one per line). Write each name to a file called \`output.txt\`, one name per line. Then close the file, reopen it for reading, and output each name in **UPPERCASE**.

**Input:** 3 names on separate lines.
**Output:** The 3 names in uppercase, one per line.

**Example:**
\`\`\`
Input:  alice
        bob
        charlie
Output: ALICE
        BOB
        CHARLIE
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'File Handling',
    starterCode: `DECLARE Name : STRING
DECLARE i : INTEGER

// Write the 3 names to the file
OPENFILE "output.txt" FOR WRITE
FOR i <- 1 TO 3
    INPUT Name
    WRITEFILE "output.txt", Name
NEXT i
CLOSEFILE "output.txt"

// Read back and output in uppercase
OPENFILE "output.txt" FOR READ
WHILE NOT EOF("output.txt") DO
    READFILE "output.txt", Name
    OUTPUT UCASE(Name)
ENDWHILE
CLOSEFILE "output.txt"`,
    hints: [
      'You need two phases: first open FOR WRITE and use WRITEFILE, then CLOSEFILE and reopen FOR READ to use READFILE. Always CLOSEFILE between phases.',
      'Phase 1: OPENFILE FOR WRITE → FOR loop with INPUT + WRITEFILE → CLOSEFILE. Phase 2: OPENFILE FOR READ → WHILE NOT EOF loop with READFILE + OUTPUT UCASE → CLOSEFILE.',
      'Make sure to CLOSEFILE "output.txt" after writing before reopening for reading. The starter code shows the full structure — focus on filling in each section correctly.',
    ],
    solution: `DECLARE Name : STRING
DECLARE i : INTEGER

OPENFILE "output.txt" FOR WRITE
FOR i <- 1 TO 3
    INPUT Name
    WRITEFILE "output.txt", Name
NEXT i
CLOSEFILE "output.txt"

OPENFILE "output.txt" FOR READ
WHILE NOT EOF("output.txt") DO
    READFILE "output.txt", Name
    OUTPUT UCASE(Name)
ENDWHILE
CLOSEFILE "output.txt"`,
    solutionExplanation: 'Open the file for writing and use a FOR loop to read each name and write it with WRITEFILE. Close the file. Reopen for reading and use WHILE NOT EOF to read each name back, outputting it in uppercase with UCASE(). Close the file again.',
    testCases: [
      {
        inputs: ['alice', 'bob', 'charlie'],
        expectedOutput: 'ALICE\nBOB\nCHARLIE',
        description: 'Lowercase → uppercase',
        sortOrder: 0,
      },
      {
        inputs: ['XENA', 'Yuki', 'zara'],
        expectedOutput: 'XENA\nYUKI\nZARA',
        description: 'Mixed case → uppercase',
        sortOrder: 1,
      },
      {
        inputs: ['apple', 'Mango', 'PEAR'],
        expectedOutput: 'APPLE\nMANGO\nPEAR',
        description: null,
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════ OCT/NOV 2025 PAST PAPERS ═══

  {
    title: 'Theme Park Booking',
    description: `Calculate the total cost of a theme park booking based on the number of adult and child tickets required.

**Input:** Two integers on separate lines: number of adult tickets, then number of child tickets.
**Output:** The total cost of the booking including a fixed booking fee, formatted exactly as shown.

- Adult tickets cost $12.99 each.
- Child tickets cost $7.99 each.
- A booking fee of $1.99 is added to every booking.

**Example:**
\`\`\`
Input:  2
        2
Output: The total cost is 43.95
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arithmetic',
    tags: ['Past Paper', 'Unseen'],
    year: 2025,
    session: 'Oct/Nov',
    variant: 3,
    starterCode: `DECLARE Adult : INTEGER
DECLARE Child : INTEGER
DECLARE Total : REAL

INPUT Adult
INPUT Child

// Calculate the total cost using the ticket prices and booking fee
// Output the total with the exact message format required`,
    hints: [
      'Multiply the number of adults by 12.99 and children by 7.99.',
      'Do not forget to add the 1.99 booking fee at the end of your calculation.',
      'Use string concatenation: OUTPUT "The total cost is " & Total',
    ],
    solution: `DECLARE Adult : INTEGER
DECLARE Child : INTEGER
DECLARE Total : REAL

INPUT Adult
INPUT Child

Total <- (Adult * 12.99) + (Child * 7.99) + 1.99

OUTPUT "The total cost is " & Total`,
    solutionExplanation: 'Read the ticket counts, compute the total using the three constants, and output the result with the required label using string concatenation.',
    testCases: [
      { inputs: ['2', '2'],   expectedOutput: 'The total cost is 43.95', description: '2 adults, 2 children', sortOrder: 0 },
      { inputs: ['1', '0'],   expectedOutput: 'The total cost is 14.98', description: '1 adult, 0 children',  sortOrder: 1 },
      { inputs: ['0', '3'],   expectedOutput: 'The total cost is 25.96', description: '0 adults, 3 children', sortOrder: 2, isHidden: true },
      { inputs: ['10', '10'], expectedOutput: 'The total cost is 211.79', description: 'Large group',         sortOrder: 3, isHidden: true },
      { inputs: ['2', '1'],   expectedOutput: 'The total cost is 35.96', description: '2 adults, 1 child',   sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Seconds to Minutes and Seconds',
    description: `Convert a total number of seconds into minutes and remaining seconds.

**Input:** A single integer representing the total number of seconds.
**Output:** Two lines stating the number of minutes and the number of remaining seconds.

**Example:**
\`\`\`
Input:  130
Output: The number of minutes is 2
        The number of seconds is 10
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arithmetic',
    tags: ['Past Paper', 'Unseen'],
    year: 2025,
    session: 'Oct/Nov',
    variant: 1,
    starterCode: `DECLARE TotalSeconds : INTEGER
DECLARE Minutes : INTEGER
DECLARE Seconds : INTEGER

INPUT TotalSeconds

// Use integer division to find the minutes
// Use modulo to find the remaining seconds
// Output both results`,
    hints: [
      'Think about which built-in math functions give you the whole number of times 60 fits into a number, and the remainder.',
      'Use the DIV function for minutes and the MOD function for seconds.',
      'Minutes <- DIV(TotalSeconds, 60) and Seconds <- MOD(TotalSeconds, 60)',
    ],
    solution: `DECLARE TotalSeconds : INTEGER
DECLARE Minutes : INTEGER
DECLARE Seconds : INTEGER

INPUT TotalSeconds

Minutes <- DIV(TotalSeconds, 60)
Seconds <- MOD(TotalSeconds, 60)

OUTPUT "The number of minutes is " & Minutes
OUTPUT "The number of seconds is " & Seconds`,
    solutionExplanation: 'DIV extracts the integer quotient (minutes) and MOD extracts the remainder (seconds) when dividing by 60.',
    testCases: [
      { inputs: ['130'],  expectedOutput: 'The number of minutes is 2\nThe number of seconds is 10',  description: 'Over two minutes',  sortOrder: 0 },
      { inputs: ['59'],   expectedOutput: 'The number of minutes is 0\nThe number of seconds is 59',  description: 'Under a minute',    sortOrder: 1 },
      { inputs: ['3600'], expectedOutput: 'The number of minutes is 60\nThe number of seconds is 0',  description: 'Exactly one hour',  sortOrder: 2, isHidden: true },
      { inputs: ['3665'], expectedOutput: 'The number of minutes is 61\nThe number of seconds is 5',  description: 'Over an hour',      sortOrder: 3, isHidden: true },
      { inputs: ['0'],    expectedOutput: 'The number of minutes is 0\nThe number of seconds is 0',   description: 'Zero seconds',      sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Email Validation Check',
    description: `Validate an email address by checking that it contains an @ symbol. Use the SUBSTRING function to inspect each character.

**Input:** A string representing the email address to check.
**Output:** The original email address followed by " is valid" or " is NOT valid".

**Example:**
\`\`\`
Input:  hello@world.com
Output: hello@world.com is valid
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    tags: ['Past Paper', 'Unseen', 'Validation'],
    year: 2025,
    session: 'Oct/Nov',
    variant: 2,
    starterCode: `DECLARE EmailAddress : STRING
DECLARE Valid : BOOLEAN
DECLARE i : INTEGER
DECLARE Char : CHAR

INPUT EmailAddress
Valid <- FALSE

// Loop through the length of the string
// Use SUBSTRING to extract one character at a time
// If the character is "@" then set Valid to TRUE

// Output the final decision`,
    hints: [
      'You will need a FOR loop that runs from 1 to LENGTH(EmailAddress).',
      'Inside the loop, check if SUBSTRING(EmailAddress, i, 1) = "@".',
      'After the loop, use IF/ELSE to output the right message based on the boolean flag.',
    ],
    solution: `DECLARE EmailAddress : STRING
DECLARE Valid : BOOLEAN
DECLARE i : INTEGER
DECLARE Char : CHAR

INPUT EmailAddress
Valid <- FALSE

FOR i <- 1 TO LENGTH(EmailAddress)
    Char <- SUBSTRING(EmailAddress, i, 1)
    IF Char = "@" THEN
        Valid <- TRUE
    ENDIF
NEXT i

IF Valid = TRUE THEN
    OUTPUT EmailAddress & " is valid"
ELSE
    OUTPUT EmailAddress & " is NOT valid"
ENDIF`,
    solutionExplanation: 'Iterate each character via SUBSTRING, flipping a boolean flag to TRUE when "@" is found, then format the output based on that flag.',
    testCases: [
      { inputs: ['hello@world.com'],  expectedOutput: 'hello@world.com is valid',     description: 'Valid email',       sortOrder: 0 },
      { inputs: ['no_at_symbol.com'], expectedOutput: 'no_at_symbol.com is NOT valid', description: 'Missing @ symbol',  sortOrder: 1 },
      { inputs: ['a@b'],              expectedOutput: 'a@b is valid',                  description: 'Short valid email', sortOrder: 2, isHidden: true },
      { inputs: ['just_text'],        expectedOutput: 'just_text is NOT valid',         description: 'Plain text',        sortOrder: 3, isHidden: true },
      { inputs: ['@start'],           expectedOutput: '@start is valid',                description: 'Starts with @',     sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: '8-Bit Binary Converter',
    description: `Convert a positive denary (base-10) integer into an 8-bit binary string.

**Input:** A whole number between 1 and 255 inclusive.
**Output:** An 8-character string representing the binary equivalent (with leading zeros).

**Example:**
\`\`\`
Input:  127
Output: 01111111
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Algorithms',
    tags: ['Past Paper', 'Unseen', 'Number Systems'],
    year: 2025,
    session: 'Oct/Nov',
    variant: 3,
    starterCode: `DECLARE DenaryNumber : INTEGER
DECLARE BinaryStr : STRING
DECLARE Remainder : INTEGER
DECLARE Count : INTEGER

INPUT DenaryNumber
BinaryStr <- ""

// Loop exactly 8 times to get all 8 bits
// Find the remainder of DenaryNumber divided by 2
// Put the new bit at the FRONT of BinaryStr
// Divide DenaryNumber by 2 (using DIV to drop fractions)`,
    hints: [
      'Use a FOR loop that runs 8 times to guarantee exactly 8 bits are generated.',
      'To put the bit at the front of the string, use: BinaryStr <- "1" & BinaryStr',
      'Use MOD(DenaryNumber, 2) to get the bit, and DIV(DenaryNumber, 2) to reduce the number each iteration.',
    ],
    solution: `DECLARE DenaryNumber : INTEGER
DECLARE BinaryStr : STRING
DECLARE Remainder : INTEGER
DECLARE Count : INTEGER

INPUT DenaryNumber
BinaryStr <- ""

FOR Count <- 1 TO 8
    Remainder <- MOD(DenaryNumber, 2)
    IF Remainder = 1 THEN
        BinaryStr <- "1" & BinaryStr
    ELSE
        BinaryStr <- "0" & BinaryStr
    ENDIF
    DenaryNumber <- DIV(DenaryNumber, 2)
NEXT Count

OUTPUT BinaryStr`,
    solutionExplanation: 'Repeated division by 2 discovers the LSB first, so each new bit is prepended to maintain correct binary order.',
    testCases: [
      { inputs: ['127'], expectedOutput: '01111111', description: 'Max value starting with 0', sortOrder: 0 },
      { inputs: ['255'], expectedOutput: '11111111', description: 'All ones',                   sortOrder: 1 },
      { inputs: ['1'],   expectedOutput: '00000001', description: 'Just one',                   sortOrder: 2, isHidden: true },
      { inputs: ['170'], expectedOutput: '10101010', description: 'Alternating bits',           sortOrder: 3, isHidden: true },
      { inputs: ['12'],  expectedOutput: '00001100', description: 'Small even number',          sortOrder: 4, isHidden: true },
    ],
  },

  // ════════════════════════════════════════ MAY/JUN 2025 PAST PAPERS ════

  {
    title: 'Extract Country Code',
    description: `A telephone number is input as a 13-character string. The first character is always '+', followed by a 2-digit country code (e.g. "+441234567890").

Extract the 2-digit country code and check its value:
- Code "44" → output \`UK\`
- Code "20" → output \`Egypt\`
- Any other code → output \`Unknown\`

**Input:** A single 13-character string.
**Output:** \`UK\`, \`Egypt\`, or \`Unknown\`.

**Example:**
\`\`\`
Input:  +201234567890
Output: Egypt
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    tags: ['Past Paper', 'Selection'],
    year: 2025,
    session: 'May/June',
    variant: 1,
    starterCode: `DECLARE Telephone : STRING
DECLARE CountryCode : STRING

INPUT Telephone

// Extract the country code using SUBSTRING
// The code starts at position 2 and is 2 characters long
// Check the code and output the appropriate country`,
    hints: [
      'Use the SUBSTRING function to extract the 2-digit code. Strings are 1-indexed and the "+" is at position 1.',
      'SUBSTRING(Telephone, 2, 2) will give you the two digits you need.',
      'Use IF...ELSE to compare the extracted string to "44" and "20".',
    ],
    solution: `DECLARE Telephone : STRING
DECLARE CountryCode : STRING

INPUT Telephone
CountryCode <- SUBSTRING(Telephone, 2, 2)

IF CountryCode = "44" THEN
    OUTPUT "UK"
ELSE
    IF CountryCode = "20" THEN
        OUTPUT "Egypt"
    ELSE
        OUTPUT "Unknown"
    ENDIF
ENDIF`,
    solutionExplanation: 'SUBSTRING grabs exactly 2 characters from index 2, skipping the "+". Nested IF statements then determine the matching country.',
    testCases: [
      { inputs: ['+441234567890'], expectedOutput: 'UK',      description: 'UK country code',      sortOrder: 0 },
      { inputs: ['+209876543210'], expectedOutput: 'Egypt',   description: 'Egypt country code',   sortOrder: 1 },
      { inputs: ['+115555555555'], expectedOutput: 'Unknown', description: 'Unknown country code', sortOrder: 2 },
      { inputs: ['+440000000000'], expectedOutput: 'UK',      description: null,                   sortOrder: 3, isHidden: true },
      { inputs: ['+991234567890'], expectedOutput: 'Unknown', description: null,                   sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Odd or Even Function',
    description: `Write a function named \`Odds\` that takes an integer parameter \`X\` and returns \`"Even"\` if the number is even, or \`"Odd"\` if it is odd.

In the main program: input an integer into \`A\`, call \`Odds(A)\`, store the result in \`B\`, and output \`B\`.

**Input:** A single integer.
**Output:** \`"Even"\` or \`"Odd"\`.

**Example:**
\`\`\`
Input:  7
Output: Odd
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Procedures & Functions',
    tags: ['Past Paper', 'Functions'],
    year: 2025,
    session: 'May/June',
    variant: 1,
    starterCode: `DECLARE A : INTEGER
DECLARE B : STRING

// Define your function here
FUNCTION Odds(X : INTEGER) RETURNS STRING
    // Check if X is divisible by 2

ENDFUNCTION

INPUT A
// Call the function and assign to B
// Output B`,
    hints: [
      'Use the MOD library routine to find the remainder of X divided by 2.',
      'If MOD(X, 2) = 0, the number is even. Use RETURN to send the string back.',
      'Assign the result: B <- Odds(A), then OUTPUT B.',
    ],
    solution: `DECLARE A : INTEGER
DECLARE B : STRING

FUNCTION Odds(X : INTEGER) RETURNS STRING
    IF MOD(X, 2) = 0 THEN
        RETURN "Even"
    ELSE
        RETURN "Odd"
    ENDIF
ENDFUNCTION

INPUT A
B <- Odds(A)
OUTPUT B`,
    solutionExplanation: 'The function uses MOD to determine divisibility by 2. The main program inputs the value, calls the function, and outputs the returned string.',
    testCases: [
      { inputs: ['4'],   expectedOutput: 'Even', description: 'Positive even', sortOrder: 0 },
      { inputs: ['7'],   expectedOutput: 'Odd',  description: 'Positive odd',  sortOrder: 1 },
      { inputs: ['0'],   expectedOutput: 'Even', description: 'Zero is even',  sortOrder: 2 },
      { inputs: ['-3'],  expectedOutput: 'Odd',  description: null,            sortOrder: 3, isHidden: true },
      { inputs: ['100'], expectedOutput: 'Even', description: null,            sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Password Length Validation',
    description: `A password must contain at least 12 characters. Write an algorithm that prompts a user to enter a password. If it is less than 12 characters, output \`"Password too short, please try again"\` and ask again. Repeat until valid, then output \`"Password accepted"\`.

**Input:** One or more strings representing password attempts.
**Output:** Error messages for each invalid attempt, then the success message.

**Example:**
\`\`\`
Input:  short
        thisislongenough
Output: Password too short, please try again
        Password accepted
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Validation'],
    year: 2025,
    session: 'May/June',
    variant: 3,
    starterCode: `DECLARE Password : STRING

// Use a REPEAT...UNTIL loop for validation
REPEAT
    INPUT Password

    // Check length and output error if necessary

UNTIL // Add condition here

OUTPUT "Password accepted"`,
    hints: [
      'A REPEAT...UNTIL loop is perfect here because you always want to ask at least once.',
      'Use the LENGTH() function to check the number of characters in Password.',
      'The loop continues UNTIL LENGTH(Password) >= 12. Inside, use IF to print the error if LENGTH(Password) < 12.',
    ],
    solution: `DECLARE Password : STRING

REPEAT
    INPUT Password
    IF LENGTH(Password) < 12 THEN
        OUTPUT "Password too short, please try again"
    ENDIF
UNTIL LENGTH(Password) >= 12

OUTPUT "Password accepted"`,
    solutionExplanation: 'A REPEAT loop guarantees the user is prompted at least once. LENGTH validates the size, prints an error if too short, and exits when valid.',
    testCases: [
      { inputs: ['tooshort', 'validpassword123'],                   expectedOutput: 'Password too short, please try again\nPassword accepted',                                                                  description: 'One invalid then valid',      sortOrder: 0 },
      { inputs: ['exactlytwelv'],                                    expectedOutput: 'Password accepted',                                                                                                         description: 'Exactly 12 characters',       sortOrder: 1 },
      { inputs: ['123', '456', 'superlongpassword'],                 expectedOutput: 'Password too short, please try again\nPassword too short, please try again\nPassword accepted',                            description: 'Two invalid then valid',      sortOrder: 2 },
      { inputs: ['a', 'b', 'c', 'thisisacceptable'],                 expectedOutput: 'Password too short, please try again\nPassword too short, please try again\nPassword too short, please try again\nPassword accepted', description: null, sortOrder: 3, isHidden: true },
      { inputs: ['verylongpasswordfromthestart'],                    expectedOutput: 'Password accepted',                                                                                                         description: null,                          sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Double Entry Verification',
    description: `To prevent data entry errors, a double-entry check is used.

Write a program that:
1. Inputs 3 numbers into an array called \`Numbers\`.
2. Asks the user to re-enter each number for verification.
3. If the second entry does not match, output \`"Error, re-enter"\` and store the corrected input in the array.
4. After all checks, output \`"The check has been completed."\`

**Input:** 3 integers (initial), then 3 verification integers (plus corrections if mismatched).
**Output:** Error messages for mismatches, then the completion message.

**Example:**
\`\`\`
Input:  1
        2
        3
        1
        9
        2
Output: Error, re-enter
        The check has been completed.
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Arrays',
    tags: ['Past Paper', 'Verification'],
    year: 2025,
    session: 'May/June',
    variant: 2,
    starterCode: `DECLARE Numbers : ARRAY[1:3] OF INTEGER
DECLARE Index : INTEGER
DECLARE CheckNumber : INTEGER

// First loop: populate the array
FOR Index <- 1 TO 3
    INPUT Numbers[Index]
NEXT Index

// Second loop: verify the entries
FOR Index <- 1 TO 3
    INPUT CheckNumber

    // Compare CheckNumber to Numbers[Index]
    // If different, print error and overwrite Numbers[Index] with a new INPUT

NEXT Index

OUTPUT "The check has been completed."`,
    hints: [
      'You need two separate FOR loops from 1 TO 3. The first fills the array.',
      'In the second loop, compare the new input CheckNumber with Numbers[Index].',
      'If CheckNumber <> Numbers[Index], output the error and INPUT Numbers[Index] to store the correction.',
    ],
    solution: `DECLARE Numbers : ARRAY[1:3] OF INTEGER
DECLARE Index : INTEGER
DECLARE CheckNumber : INTEGER

FOR Index <- 1 TO 3
    INPUT Numbers[Index]
NEXT Index

FOR Index <- 1 TO 3
    INPUT CheckNumber
    IF CheckNumber <> Numbers[Index] THEN
        OUTPUT "Error, re-enter"
        INPUT Numbers[Index]
    ENDIF
NEXT Index

OUTPUT "The check has been completed."`,
    solutionExplanation: 'Two loops: first fills the array, second verifies each entry. A mismatch triggers an error message and a corrective INPUT that overwrites the stored value.',
    testCases: [
      { inputs: ['5', '10', '15', '5', '10', '15'],         expectedOutput: 'The check has been completed.',                    description: 'All match',          sortOrder: 0 },
      { inputs: ['1', '2', '3', '1', '9', '2', '3'],        expectedOutput: 'Error, re-enter\nThe check has been completed.',   description: 'One mismatch',       sortOrder: 1 },
      { inputs: ['0', '0', '0', '0', '1', '0', '0'],        expectedOutput: 'Error, re-enter\nThe check has been completed.',   description: null,                 sortOrder: 2, isHidden: true },
      { inputs: ['99', '88', '77', '99', '88', '77'],        expectedOutput: 'The check has been completed.',                    description: null,                 sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Extract Consonants',
    description: `Given an uppercase string, output each consonant on a new line. Vowels (A, E, I, O, U) should be skipped.

**Input:** A single string in uppercase.
**Output:** The consonants of the string, each on a new line.

**Example:**
\`\`\`
Input:  COMPUTER
Output: C
        M
        P
        T
        R
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    tags: ['Past Paper', 'Iteration'],
    year: 2025,
    session: 'May/June',
    variant: 3,
    starterCode: `DECLARE Word : STRING
DECLARE Index : INTEGER
DECLARE Letter : CHAR

INPUT Word

// Loop through each character using LENGTH(Word)
FOR Index <- 1 TO LENGTH(Word)
    Letter <- SUBSTRING(Word, Index, 1)

    // Use a CASE statement to skip vowels and output consonants

NEXT Index`,
    hints: [
      'Use a FOR loop from 1 TO LENGTH(Word) to examine each letter.',
      'Use a CASE statement with cases for "A", "E", "I", "O", "U" that do nothing, and an OTHERWISE case that outputs the letter.',
      'Alternatively: IF Letter <> "A" AND Letter <> "E" AND Letter <> "I" AND Letter <> "O" AND Letter <> "U" THEN OUTPUT Letter',
    ],
    solution: `DECLARE Word : STRING
DECLARE Index : INTEGER
DECLARE Letter : CHAR

INPUT Word

FOR Index <- 1 TO LENGTH(Word)
    Letter <- SUBSTRING(Word, Index, 1)
    CASE OF Letter
        "A" : Letter <- ""
        "E" : Letter <- ""
        "I" : Letter <- ""
        "O" : Letter <- ""
        "U" : Letter <- ""
        OTHERWISE : OUTPUT Letter
    ENDCASE
NEXT Index`,
    solutionExplanation: 'SUBSTRING extracts each character. The CASE statement acts as a filter — doing nothing for vowels but triggering OUTPUT for any other character.',
    testCases: [
      { inputs: ['COMPUTER'], expectedOutput: 'C\nM\nP\nT\nR',    description: 'Standard word',                sortOrder: 0 },
      { inputs: ['SCIENCE'],  expectedOutput: 'S\nC\nN\nC',       description: 'Multiple consecutive vowels',  sortOrder: 1 },
      { inputs: ['AEIOU'],    expectedOutput: '',                   description: 'All vowels — no output',       sortOrder: 2 },
      { inputs: ['RHYTHM'],   expectedOutput: 'R\nH\nY\nT\nH\nM', description: null,                           sortOrder: 3, isHidden: true },
      { inputs: ['APPLE'],    expectedOutput: 'P\nP\nL',           description: null,                           sortOrder: 4, isHidden: true },
    ],
  },

  // ════════════════════════════════════════ FEB/MAR 2025 PAST PAPERS ════

  {
    title: 'Integer Input Validation',
    description: `Write an algorithm to allow a number to be input and check whether it is an integer.

If the number is an integer, the loop ends. If not, output \`"Please try again"\` and repeat until a valid integer is provided.

**Input:** A sequence of numbers.
**Output:** \`"Please try again"\` for each non-integer input.

**Example:**
\`\`\`
Input:  4.5
        3.14
        7
Output: Please try again
        Please try again
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Complete Question', 'Validation'],
    year: 2025,
    session: 'Feb/Mar',
    starterCode: `DECLARE Number : REAL

// Add your loop and validation logic here`,
    hints: [
      'You need a loop that continues until a valid integer is entered. A REPEAT...UNTIL loop runs the body at least once.',
      'To check if a number is an integer, use MOD() to find the remainder when divided by 1.',
      'Check if MOD(Number, 1) <> 0 to output the error, and set UNTIL MOD(Number, 1) = 0.',
    ],
    solution: `DECLARE Number : REAL

REPEAT
    INPUT Number
    IF MOD(Number, 1) <> 0 THEN
        OUTPUT "Please try again"
    ENDIF
UNTIL MOD(Number, 1) = 0`,
    solutionExplanation: 'A REPEAT...UNTIL loop prompts for input. MOD(Number, 1) checks for a fractional part; if non-zero, the number is not an integer and the error message is output.',
    testCases: [
      { inputs: ['4.5', '3.14', '7'], expectedOutput: 'Please try again\nPlease try again', description: 'Two invalid then valid',     sortOrder: 0 },
      { inputs: ['10'],               expectedOutput: '',                                    description: 'Valid on first try',         sortOrder: 1 },
      { inputs: ['0.99', '1'],        expectedOutput: 'Please try again',                   description: null,                         sortOrder: 2, isHidden: true },
      { inputs: ['-4.5', '-4'],       expectedOutput: 'Please try again',                   description: null,                         sortOrder: 3, isHidden: true },
      { inputs: ['0'],                expectedOutput: '',                                    description: null,                         sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Highest, Smallest, Total and Average',
    description: `Write an algorithm that takes 5 positive integers as input, finds the highest and smallest values, calculates their total, and outputs the average rounded to 2 decimal places.

**Input:** 5 positive integers.
**Output:** Four lines: the highest number, the smallest number, the total, and the average.

**Example:**
\`\`\`
Input:  10
        20
        30
        40
        50
Output: The highest number is 50
        The smallest number is 10
        The total is 150
        The average is 30
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Algorithms',
    tags: ['Past Paper', 'Adapted'],
    year: 2025,
    session: 'Feb/Mar',
    starterCode: `DECLARE Highest : INTEGER
DECLARE Smallest : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER
DECLARE Num : INTEGER

Highest <- 0
Smallest <- 99999
Total <- 0

// Add your loop to read 5 numbers and calculate the required values

OUTPUT "The highest number is " & Highest
// Output the remaining results`,
    hints: [
      'Use a FOR loop running from 1 to 5 to handle the inputs.',
      'Inside the loop, add the input to Total and use IF statements to update Highest and Smallest.',
      'Use ROUND(Total / 5, 2) for the average in the final OUTPUT statement.',
    ],
    solution: `DECLARE Highest : INTEGER
DECLARE Smallest : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER
DECLARE Num : INTEGER

Highest <- 0
Smallest <- 99999
Total <- 0

FOR Count <- 1 TO 5
    INPUT Num
    Total <- Total + Num
    IF Num > Highest THEN
        Highest <- Num
    ENDIF
    IF Num < Smallest THEN
        Smallest <- Num
    ENDIF
NEXT Count

OUTPUT "The highest number is " & Highest
OUTPUT "The smallest number is " & Smallest
OUTPUT "The total is " & Total
OUTPUT "The average is " & ROUND(Total / 5, 2)`,
    solutionExplanation: 'A FOR loop gathers 5 inputs. Standard min/max algorithms compare each input against tracked values. ROUND formats the average.',
    testCases: [
      { inputs: ['10', '20', '30', '40', '50'],   expectedOutput: 'The highest number is 50\nThe smallest number is 10\nThe total is 150\nThe average is 30',  description: 'Ascending',       sortOrder: 0 },
      { inputs: ['5', '5', '5', '5', '5'],         expectedOutput: 'The highest number is 5\nThe smallest number is 5\nThe total is 25\nThe average is 5',      description: 'All identical',   sortOrder: 1 },
      { inputs: ['1', '2', '3', '4', '6'],          expectedOutput: 'The highest number is 6\nThe smallest number is 1\nThe total is 16\nThe average is 3.2',   description: null,              sortOrder: 2, isHidden: true },
      { inputs: ['100', '10', '50', '20', '80'],    expectedOutput: 'The highest number is 100\nThe smallest number is 10\nThe total is 260\nThe average is 52', description: null,              sortOrder: 3, isHidden: true },
      { inputs: ['99', '1', '45', '45', '10'],      expectedOutput: 'The highest number is 99\nThe smallest number is 1\nThe total is 200\nThe average is 40',  description: null,              sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Sports Club Membership System',
    description: `A sports club uses a six-character alphanumeric membership code. Manage members using three 1D arrays: \`MemberID\`, \`FirstName\`, and \`LastName\`.

The menu must offer three options:
1. Input a new member (validate code length = 6, then check uniqueness)
2. Output all stored members
3. Stop

For each new member: validate the code is exactly 6 characters, check it is unique, then store the code, first name, and last name. Invalid menu input should prompt the error \`"You must input 1, 2 or 3. Please try again"\`.

*Arrays sized for up to 5 members.*`,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    tags: ['Past Paper', 'Complete Question', '15 Marks'],
    year: 2025,
    session: 'Feb/Mar',
    starterCode: `DECLARE MemberID : ARRAY[1:5] OF STRING
DECLARE FirstName : ARRAY[1:5] OF STRING
DECLARE LastName : ARRAY[1:5] OF STRING

DECLARE Answer : INTEGER
DECLARE Code : STRING
DECLARE NextIndex : INTEGER
DECLARE Used : BOOLEAN

NextIndex <- 1

// Start your menu loop here`,
    hints: [
      'Use nested REPEAT...UNTIL loops: an outer loop for the main menu and inner loops for validating inputs.',
      'To check for uniqueness, use a WHILE loop (linear search) comparing Code against all elements in MemberID up to NextIndex.',
      'Increment NextIndex only AFTER a valid, unique code and both names have been stored.',
    ],
    solution: `DECLARE MemberID : ARRAY[1:5] OF STRING
DECLARE FirstName : ARRAY[1:5] OF STRING
DECLARE LastName : ARRAY[1:5] OF STRING

DECLARE Answer : INTEGER
DECLARE Code : STRING
DECLARE IndexCheck : INTEGER
DECLARE Used : BOOLEAN
DECLARE NextIndex : INTEGER

NextIndex <- 1

REPEAT
    OUTPUT "Enter 1 to input, 2 to output, 3 to stop"
    REPEAT
        INPUT Answer
        IF Answer < 1 OR Answer > 3 THEN
            OUTPUT "You must input 1, 2 or 3. Please try again"
        ENDIF
    UNTIL Answer >= 1 AND Answer <= 3

    IF Answer = 1 THEN
        REPEAT
            Used <- FALSE
            OUTPUT "Enter a new six-character membership code"
            INPUT Code
            IF LENGTH(Code) <> 6 THEN
                OUTPUT "The code must contain six characters, please try again."
            ELSE
                IndexCheck <- 1
                WHILE IndexCheck < NextIndex AND NOT Used DO
                    IF Code = MemberID[IndexCheck] THEN
                        Used <- TRUE
                        OUTPUT "This code has already been used, please try again"
                    ELSE
                        IndexCheck <- IndexCheck + 1
                    ENDIF
                ENDWHILE
                IF NOT Used THEN
                    MemberID[NextIndex] <- Code
                    OUTPUT "Enter your first name"
                    INPUT FirstName[NextIndex]
                    OUTPUT "Enter your last name"
                    INPUT LastName[NextIndex]
                    NextIndex <- NextIndex + 1
                ENDIF
            ENDIF
        UNTIL LENGTH(Code) = 6 AND NOT Used
    ENDIF

    IF Answer = 2 THEN
        IndexCheck <- 1
        WHILE IndexCheck < NextIndex DO
            OUTPUT "Membership code: " & MemberID[IndexCheck]
            OUTPUT "First name: " & FirstName[IndexCheck]
            OUTPUT "Last name: " & LastName[IndexCheck]
            IndexCheck <- IndexCheck + 1
        ENDWHILE
    ENDIF
UNTIL Answer = 3`,
    solutionExplanation: 'The outer REPEAT loop drives the menu. Input validation uses LENGTH and a linear search for uniqueness. Parallel arrays maintain data integrity across indexes.',
    testCases: [
      {
        inputs: ['3'],
        expectedOutput: 'Enter 1 to input, 2 to output, 3 to stop',
        description: 'Immediate stop',
        sortOrder: 0,
      },
      {
        inputs: ['1', '123456', 'Alice', 'Smith', '2', '3'],
        expectedOutput: 'Enter 1 to input, 2 to output, 3 to stop\nEnter a new six-character membership code\nEnter your first name\nEnter your last name\nEnter 1 to input, 2 to output, 3 to stop\nMembership code: 123456\nFirst name: Alice\nLast name: Smith\nEnter 1 to input, 2 to output, 3 to stop',
        description: 'Add one member and list',
        sortOrder: 1,
      },
      {
        inputs: ['1', 'SHORT', '123456', 'Bob', 'Jones', '3'],
        expectedOutput: 'Enter 1 to input, 2 to output, 3 to stop\nEnter a new six-character membership code\nThe code must contain six characters, please try again.\nEnter a new six-character membership code\nEnter your first name\nEnter your last name\nEnter 1 to input, 2 to output, 3 to stop',
        description: 'Triggers length validation',
        sortOrder: 2,
      },
      {
        inputs: ['4', '3'],
        expectedOutput: 'Enter 1 to input, 2 to output, 3 to stop\nYou must input 1, 2 or 3. Please try again\nEnter 1 to input, 2 to output, 3 to stop',
        description: null,
        sortOrder: 3,
        isHidden: true,
      },
      {
        inputs: ['1', '123456', 'A', 'B', '1', '123456', '654321', 'C', 'D', '2', '3'],
        expectedOutput: 'Enter 1 to input, 2 to output, 3 to stop\nEnter a new six-character membership code\nEnter your first name\nEnter your last name\nEnter 1 to input, 2 to output, 3 to stop\nEnter a new six-character membership code\nThis code has already been used, please try again\nEnter a new six-character membership code\nEnter your first name\nEnter your last name\nEnter 1 to input, 2 to output, 3 to stop\nMembership code: 123456\nFirst name: A\nLast name: B\nMembership code: 654321\nFirst name: C\nLast name: D\nEnter 1 to input, 2 to output, 3 to stop',
        description: null,
        sortOrder: 4,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════════ PRACTICE QUESTIONS ═══

  {
    title: 'Array Zero Counter & Total',
    description: `Read 5 integer values into an array. Count how many are exactly 0, and calculate the sum of all non-zero values.

**Input:** 5 integers entered one by one.
**Output:** Two lines: the count of zeros, then the total of non-zero numbers.

**Example:**
\`\`\`
Input:  0
        5
        0
        10
        -2
Output: Zeros: 2
        Total: 13
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arrays',
    tags: ['Counting', 'Totalling'],
    starterCode: `DECLARE A : ARRAY[1:5] OF INTEGER
DECLARE Index : INTEGER
DECLARE Zeros : INTEGER
DECLARE Total : INTEGER

Zeros <- 0
Total <- 0

// Add your loop here to read 5 integers into the array
// Then process the array to update Zeros and Total

OUTPUT "Zeros: " & Zeros
OUTPUT "Total: " & Total`,
    hints: [
      'You need a count-controlled FOR loop running from 1 to 5.',
      'Inside the loop, use an IF...ELSE statement to check if A[Index] = 0.',
      'If it is 0, increment Zeros. ELSE, add A[Index] to Total.',
    ],
    solution: `DECLARE A : ARRAY[1:5] OF INTEGER
DECLARE Index : INTEGER
DECLARE Zeros : INTEGER
DECLARE Total : INTEGER

Zeros <- 0
Total <- 0

FOR Index <- 1 TO 5
    INPUT A[Index]
    IF A[Index] = 0 THEN
        Zeros <- Zeros + 1
    ELSE
        Total <- Total + A[Index]
    ENDIF
NEXT Index

OUTPUT "Zeros: " & Zeros
OUTPUT "Total: " & Total`,
    solutionExplanation: 'A FOR loop reads 5 values. An IF/ELSE checks each for zero: matching values increment the counter, others add to the total.',
    testCases: [
      { inputs: ['0', '5', '0', '10', '-2'], expectedOutput: 'Zeros: 2\nTotal: 13',   description: 'Mix of zeros, positives, negatives', sortOrder: 0 },
      { inputs: ['1', '2', '3', '4', '5'],   expectedOutput: 'Zeros: 0\nTotal: 15',   description: 'No zeros',                          sortOrder: 1 },
      { inputs: ['0', '0', '0', '0', '0'],   expectedOutput: 'Zeros: 5\nTotal: 0',    description: 'All zeros',                          sortOrder: 2, isHidden: true },
      { inputs: ['-5', '0', '5', '0', '1'],  expectedOutput: 'Zeros: 2\nTotal: 1',    description: null,                                 sortOrder: 3, isHidden: true },
      { inputs: ['10', '20', '30', '40', '50'], expectedOutput: 'Zeros: 0\nTotal: 150', description: null,                              sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Password Validation Rules',
    description: `A password is valid only if it meets all three rules:
1. Length is between 8 and 20 characters inclusive.
2. Contains a mix of uppercase and lowercase letters (not entirely one case).
3. Contains the exclamation mark character \`!\`.

Read a password and output \`"Accepted"\` if all rules pass, or \`"Rejected"\` otherwise.

**Input:** A single string.
**Output:** \`"Accepted"\` or \`"Rejected"\`.

**Example:**
\`\`\`
Input:  My!Hidden
Output: Accepted
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    tags: ['Validation', 'Flags'],
    starterCode: `DECLARE Password : STRING
DECLARE Accept : BOOLEAN
DECLARE HasExclamation : BOOLEAN
DECLARE Index : INTEGER

INPUT Password
Accept <- TRUE
HasExclamation <- FALSE

// 1. Check length
IF LENGTH(Password) < 8 OR LENGTH(Password) > 20 THEN
    Accept <- FALSE
ENDIF

// 2. Check for mixed case (compare against UCASE and LCASE versions)

// 3. Loop to find '!'
// Use SUBSTRING to check each character

IF Accept = TRUE THEN
    OUTPUT "Accepted"
ELSE
    OUTPUT "Rejected"
ENDIF`,
    hints: [
      'To check for mixed case: if UCASE(Password) = Password, there are no lowercase letters. Similarly for LCASE.',
      'Use a FOR loop from 1 to LENGTH(Password). Check SUBSTRING(Password, Index, 1) = "!".',
      'If HasExclamation remains FALSE after the loop, set Accept <- FALSE before the final IF.',
    ],
    solution: `DECLARE Password : STRING
DECLARE Accept : BOOLEAN
DECLARE HasExclamation : BOOLEAN
DECLARE Index : INTEGER

INPUT Password
Accept <- TRUE
HasExclamation <- FALSE

IF LENGTH(Password) < 8 OR LENGTH(Password) > 20 THEN
    Accept <- FALSE
ENDIF

IF LCASE(Password) = Password OR UCASE(Password) = Password THEN
    Accept <- FALSE
ENDIF

FOR Index <- 1 TO LENGTH(Password)
    IF SUBSTRING(Password, Index, 1) = "!" THEN
        HasExclamation <- TRUE
    ENDIF
NEXT Index

IF HasExclamation = FALSE THEN
    Accept <- FALSE
ENDIF

IF Accept = TRUE THEN
    OUTPUT "Accepted"
ELSE
    OUTPUT "Rejected"
ENDIF`,
    solutionExplanation: 'A boolean flag (Accept) starts TRUE. Three independent checks — length, case mix, and exclamation mark — can each flip it to FALSE. The character search uses SUBSTRING inside a FOR loop.',
    testCases: [
      { inputs: ['My!Hidden'],             expectedOutput: 'Accepted', description: 'All criteria met',         sortOrder: 0 },
      { inputs: ['M!word'],                expectedOutput: 'Rejected', description: 'Too short',                sortOrder: 1 },
      { inputs: ['my!hidden'],             expectedOutput: 'Rejected', description: 'No uppercase',             sortOrder: 2 },
      { inputs: ['MY!HIDDEN'],             expectedOutput: 'Rejected', description: 'No lowercase',             sortOrder: 3, isHidden: true },
      { inputs: ['MyHiddenWord'],          expectedOutput: 'Rejected', description: 'Missing !',                sortOrder: 4, isHidden: true },
      { inputs: ['A!b123456789012345678'], expectedOutput: 'Rejected', description: 'Too long',                 sortOrder: 5, isHidden: true },
    ],
  },

  {
    title: 'Running Club Top 3 & Certificates',
    description: `A running club records names and times (in seconds) for 4 members in a 1-km race. Store them in parallel arrays, sort in ascending order of time (fastest first), output the top 3 runners, and count how many earned a certificate (time strictly less than 240 seconds).

**Input:** 8 alternating lines: Name, Time, Name, Time…
**Output:** "First: [Name]", "Second: [Name]", "Third: [Name]", then "Certificates: [Count]".

**Example:**
\`\`\`
Input:  Alice
        230
        Bob
        250
        Charlie
        210
        Dave
        235
Output: First: Charlie
        Second: Alice
        Third: Dave
        Certificates: 3
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    tags: ['Sorting', 'Parallel Arrays'],
    starterCode: `DECLARE MemberName : ARRAY[1:4] OF STRING
DECLARE MemberTime : ARRAY[1:4] OF INTEGER
DECLARE Index : INTEGER
DECLARE Swap : BOOLEAN
DECLARE TempTime : INTEGER
DECLARE TempName : STRING
DECLARE CertCount : INTEGER

// 1. Input data into the parallel arrays
FOR Index <- 1 TO 4
    INPUT MemberName[Index]
    INPUT MemberTime[Index]
NEXT Index

// 2. Sort in ascending order of time (Bubble Sort)
REPEAT
    Swap <- FALSE
    FOR Index <- 1 TO 3
        // Add sorting logic — swap both arrays when needed
    NEXT Index
UNTIL Swap = FALSE

// 3. Output top 3

// 4. Count and output certificates`,
    hints: [
      'Every time you swap in MemberTime, also swap the same indices in MemberName.',
      'Inside the loop: IF MemberTime[Index] > MemberTime[Index + 1] THEN swap both arrays using Temp variables.',
      'After outputting First/Second/Third, use another FOR loop from 1 TO 4 checking MemberTime[Index] < 240.',
    ],
    solution: `DECLARE MemberName : ARRAY[1:4] OF STRING
DECLARE MemberTime : ARRAY[1:4] OF INTEGER
DECLARE Index : INTEGER
DECLARE Swap : BOOLEAN
DECLARE TempTime : INTEGER
DECLARE TempName : STRING
DECLARE CertCount : INTEGER

FOR Index <- 1 TO 4
    INPUT MemberName[Index]
    INPUT MemberTime[Index]
NEXT Index

REPEAT
    Swap <- FALSE
    FOR Index <- 1 TO 3
        IF MemberTime[Index] > MemberTime[Index + 1] THEN
            TempTime <- MemberTime[Index]
            MemberTime[Index] <- MemberTime[Index + 1]
            MemberTime[Index + 1] <- TempTime
            TempName <- MemberName[Index]
            MemberName[Index] <- MemberName[Index + 1]
            MemberName[Index + 1] <- TempName
            Swap <- TRUE
        ENDIF
    NEXT Index
UNTIL Swap = FALSE

OUTPUT "First: " & MemberName[1]
OUTPUT "Second: " & MemberName[2]
OUTPUT "Third: " & MemberName[3]

CertCount <- 0
FOR Index <- 1 TO 4
    IF MemberTime[Index] < 240 THEN
        CertCount <- CertCount + 1
    ENDIF
NEXT Index
OUTPUT "Certificates: " & CertCount`,
    solutionExplanation: 'Parallel 1D arrays hold names and times. Bubble sort keeps them synchronised by swapping both arrays whenever a swap occurs. A final linear scan counts qualifying times.',
    testCases: [
      { inputs: ['Alice', '230', 'Bob', '250', 'Charlie', '210', 'Dave', '235'],     expectedOutput: 'First: Charlie\nSecond: Alice\nThird: Dave\nCertificates: 3',  description: 'Unsorted, 3 certificates',    sortOrder: 0 },
      { inputs: ['Zara', '240', 'Yara', '241', 'Xara', '242', 'Wara', '243'],       expectedOutput: 'First: Zara\nSecond: Yara\nThird: Xara\nCertificates: 0',      description: 'Already sorted, 0 certs',     sortOrder: 1 },
      { inputs: ['D', '210', 'C', '200', 'B', '190', 'A', '180'],                   expectedOutput: 'First: A\nSecond: B\nThird: C\nCertificates: 4',               description: 'Reverse sorted, all certs',   sortOrder: 2, isHidden: true },
      { inputs: ['Fast', '150', 'Slow', '300', 'Mid1', '239', 'Mid2', '240'],       expectedOutput: 'First: Fast\nSecond: Mid1\nThird: Mid2\nCertificates: 2',      description: 'Edge around 240s',            sortOrder: 3, isHidden: true },
      { inputs: ['Runner1', '215', 'Runner2', '220', 'Runner3', '215', 'Runner4', '205'], expectedOutput: 'First: Runner4\nSecond: Runner1\nThird: Runner3\nCertificates: 4', description: 'Duplicate times',  sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Temperature Range Sentinel',
    description: `Monitor temperature readings (real numbers) and output a warning for each:
- Strictly below 35.0 → \`"Temperature too low"\`
- Strictly above 38.0 → \`"Temperature too high"\`
- Otherwise → \`"Temperature normal"\`

Continue until the rogue value \`999.0\` is entered (do not evaluate 999.0).

**Input:** A sequence of REAL numbers ending with 999.0.
**Output:** A string evaluation for each valid temperature.

**Example:**
\`\`\`
Input:  34.2
        36.1
        38.5
        999.0
Output: Temperature too low
        Temperature normal
        Temperature too high
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    tags: ['Sentinel Loop', 'While Loop'],
    starterCode: `DECLARE Temp : REAL

INPUT Temp

WHILE Temp <> 999.0 DO
    // Write your nested IF or IF-ELSE statements here


    // Remember to read the next value before the loop restarts!
    INPUT Temp
ENDWHILE`,
    hints: [
      'A WHILE loop checks the sentinel value before executing the body — perfect here.',
      'Inside the loop: IF Temp < 35.0 THEN ... ELSE IF Temp > 38.0 THEN ... ELSE ... ENDIF.',
      'Do not forget to read the next Temp at the very end of the WHILE loop body.',
    ],
    solution: `DECLARE Temp : REAL

INPUT Temp
WHILE Temp <> 999.0 DO
    IF Temp < 35.0 THEN
        OUTPUT "Temperature too low"
    ELSE
        IF Temp > 38.0 THEN
            OUTPUT "Temperature too high"
        ELSE
            OUTPUT "Temperature normal"
        ENDIF
    ENDIF
    INPUT Temp
ENDWHILE`,
    solutionExplanation: 'A pre-condition WHILE loop checks for the sentinel 999.0. Nested IF statements categorise the temperature. A secondary INPUT at the bottom of the loop captures the next reading.',
    testCases: [
      { inputs: ['34.2', '36.1', '38.5', '999.0'], expectedOutput: 'Temperature too low\nTemperature normal\nTemperature too high', description: 'One of each category',         sortOrder: 0 },
      { inputs: ['999.0'],                          expectedOutput: '',                                                              description: 'Immediate sentinel, no output', sortOrder: 1 },
      { inputs: ['35.0', '38.0', '999.0'],          expectedOutput: 'Temperature normal\nTemperature normal',                       description: 'Exact boundary values',        sortOrder: 2, isHidden: true },
      { inputs: ['10.5', '20.0', '999.0'],          expectedOutput: 'Temperature too low\nTemperature too low',                     description: 'Multiple lows',               sortOrder: 3, isHidden: true },
      { inputs: ['40.1', '100.0', '37.5', '999.0'], expectedOutput: 'Temperature too high\nTemperature too high\nTemperature normal', description: 'Highs then normal',          sortOrder: 4, isHidden: true },
    ],
  },

  // ════════════════════════════════════════ FEB/MAR 2024 PAST PAPERS ════

  {
    title: 'Linear Search in an Array',
    description: `Read 5 numbers into an array called \`Values\`, then read a search number \`MyNumber\`. Use a linear search to find if \`MyNumber\` is in the array.

**Input:** 5 numbers (array), then the search target.
**Output:** The 1-based position if found, or \`"Not found"\`.

**Example:**
\`\`\`
Input:  10
        20
        30
        40
        50
        30
Output: 3
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Arrays',
    tags: ['Past Paper', 'Adapted'],
    year: 2024,
    session: 'Feb/Mar',
    variant: 2,
    starterCode: `DECLARE Values : ARRAY[1:5] OF INTEGER
DECLARE MyNumber : INTEGER
DECLARE i : INTEGER
DECLARE Found : BOOLEAN
DECLARE Position : INTEGER

// 1. Read 5 numbers into the Values array

// 2. Read MyNumber

// 3. Search for MyNumber

// 4. Output Position or "Not found"`,
    hints: [
      'Use a FOR loop from 1 TO 5 to INPUT the array values.',
      'Set Found <- FALSE before starting your search loop.',
      'Inside the search loop: IF Values[i] = MyNumber THEN set Found <- TRUE and save Position <- i.',
    ],
    solution: `DECLARE Values : ARRAY[1:5] OF INTEGER
DECLARE MyNumber : INTEGER
DECLARE i : INTEGER
DECLARE Found : BOOLEAN
DECLARE Position : INTEGER

FOR i <- 1 TO 5
    INPUT Values[i]
NEXT i

INPUT MyNumber
Found <- FALSE

FOR i <- 1 TO 5
    IF Values[i] = MyNumber THEN
        Found <- TRUE
        Position <- i
    ENDIF
NEXT i

IF Found = TRUE THEN
    OUTPUT Position
ELSE
    OUTPUT "Not found"
ENDIF`,
    solutionExplanation: 'Two FOR loops: the first populates the array, the second performs a linear search by comparing each element to MyNumber. The flag and position are updated on each match (so duplicates return the last position). The flag is then checked to produce the output.',
    testCases: [
      { inputs: ['10', '20', '30', '40', '50', '30'],   expectedOutput: '3',         description: 'Found in middle',                        sortOrder: 0 },
      { inputs: ['5', '15', '25', '35', '45', '99'],    expectedOutput: 'Not found', description: 'Not in array',                          sortOrder: 1 },
      { inputs: ['1', '2', '3', '4', '5', '1'],         expectedOutput: '1',         description: null,                                    sortOrder: 2, isHidden: true },
      { inputs: ['9', '9', '9', '9', '9', '9'],         expectedOutput: '5',         description: 'Multiple instances — last position',    sortOrder: 3, isHidden: true },
      { inputs: ['-10', '0', '10', '20', '30', '-10'],  expectedOutput: '1',         description: null,                                    sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Bubble Sort an Array',
    description: `Sort an array of 5 numbers into ascending order using bubble sort.

**Input:** 5 numbers.
**Output:** The 5 numbers sorted in ascending order, each on a new line.

**Example:**
\`\`\`
Input:  50
        20
        10
        40
        30
Output: 10
        20
        30
        40
        50
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    tags: ['Past Paper', 'Adapted'],
    year: 2024,
    session: 'Feb/Mar',
    variant: 2,
    starterCode: `DECLARE Values : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Swap : BOOLEAN
DECLARE Temp : INTEGER
DECLARE Last : INTEGER

FOR i <- 1 TO 5
    INPUT Values[i]
NEXT i

Last <- 5
REPEAT
    Swap <- FALSE
    // Write your inner loop here

    Last <- Last - 1
UNTIL Swap = FALSE OR Last = 1

FOR i <- 1 TO 5
    OUTPUT Values[i]
NEXT i`,
    hints: [
      'Use a REPEAT UNTIL loop to keep making passes until no swaps are made.',
      'Inside, use a FOR loop from 1 TO Last - 1 to compare adjacent elements.',
      'If Values[i] > Values[i + 1], use a Temp variable to swap them and set Swap <- TRUE.',
    ],
    solution: `DECLARE Values : ARRAY[1:5] OF INTEGER
DECLARE i : INTEGER
DECLARE Swap : BOOLEAN
DECLARE Temp : INTEGER
DECLARE Last : INTEGER

FOR i <- 1 TO 5
    INPUT Values[i]
NEXT i

Last <- 5
REPEAT
    Swap <- FALSE
    FOR i <- 1 TO Last - 1
        IF Values[i] > Values[i + 1] THEN
            Temp <- Values[i]
            Values[i] <- Values[i + 1]
            Values[i + 1] <- Temp
            Swap <- TRUE
        ENDIF
    NEXT i
    Last <- Last - 1
UNTIL Swap = FALSE OR Last = 1

FOR i <- 1 TO 5
    OUTPUT Values[i]
NEXT i`,
    solutionExplanation: 'The outer REPEAT loop continues until a full pass occurs without swaps. The inner FOR loop checks adjacent elements and swaps them when out of order. Decrementing Last avoids redundant comparisons.',
    testCases: [
      { inputs: ['50', '20', '10', '40', '30'],     expectedOutput: '10\n20\n30\n40\n50',    description: 'Random order',     sortOrder: 0 },
      { inputs: ['1', '2', '3', '4', '5'],          expectedOutput: '1\n2\n3\n4\n5',         description: 'Already sorted',   sortOrder: 1 },
      { inputs: ['5', '4', '3', '2', '1'],          expectedOutput: '1\n2\n3\n4\n5',         description: null,               sortOrder: 2, isHidden: true },
      { inputs: ['-5', '0', '-10', '10', '5'],      expectedOutput: '-10\n-5\n0\n5\n10',     description: null,               sortOrder: 3, isHidden: true },
      { inputs: ['10', '10', '10', '5', '5'],       expectedOutput: '5\n5\n10\n10\n10',      description: null,               sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Profit Calculator with Validation',
    description: `Continuously read pairs of cost price and selling price, calculate the profit (sell − cost), and output it. Repeat until both values are 0.

Both inputs must be validated to ensure they are **0 or greater** (negative values are rejected).
The pair \`0, 0\` stops the algorithm without producing output.

**Input:** Alternating cost and sell prices.
**Output:** \`"Profit is X"\` for each valid non-exit pair.

**Example:**
\`\`\`
Input:  -5
        10
        15
        0
        0
Output: Profit is 5
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Adapted', 'Validation'],
    year: 2024,
    session: 'Feb/Mar',
    variant: 2,
    starterCode: `DECLARE Cost : REAL
DECLARE Sell : REAL
DECLARE Profit : REAL

REPEAT
    // Input and validate Cost

    // Input and validate Sell

    // Calculate and output if not the exit pair

UNTIL Cost = 0 AND Sell = 0`,
    hints: [
      'Use nested REPEAT UNTIL loops to validate inputs: REPEAT INPUT Cost UNTIL Cost >= 0.',
      'After reading both valid values, check IF Cost <> 0 OR Sell <> 0 THEN before outputting — this skips the exit pair.',
      'Calculate Profit <- Sell - Cost and OUTPUT "Profit is " & Profit.',
    ],
    solution: `DECLARE Cost : REAL
DECLARE Sell : REAL
DECLARE Profit : REAL

REPEAT
    REPEAT
        INPUT Cost
    UNTIL Cost >= 0

    REPEAT
        INPUT Sell
    UNTIL Sell >= 0

    IF Cost <> 0 OR Sell <> 0 THEN
        Profit <- Sell - Cost
        OUTPUT "Profit is " & Profit
    ENDIF
UNTIL Cost = 0 AND Sell = 0`,
    solutionExplanation: 'Nested REPEAT loops ensure valid (non-negative) inputs. An IF guard prevents outputting for the 0,0 exit pair. The outer loop repeats until both inputs are 0.',
    testCases: [
      { inputs: ['10', '15', '0', '0'],            expectedOutput: 'Profit is 5',                    description: 'Simple valid case',           sortOrder: 0 },
      { inputs: ['-5', '10', '12', '0', '0'],      expectedOutput: 'Profit is 2',                    description: 'Negative cost validation',    sortOrder: 1 },
      { inputs: ['10', '-10', '5', '0', '0'],      expectedOutput: 'Profit is -5',                   description: null,                          sortOrder: 2, isHidden: true },
      { inputs: ['20', '30', '50', '100', '0', '0'], expectedOutput: 'Profit is 10\nProfit is 50', description: null,                          sortOrder: 3, isHidden: true },
      { inputs: ['0', '0'],                         expectedOutput: '',                               description: 'Immediate exit',              sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Screen Time Tracker',
    description: `Process screen time data for a class of students over 5 days.

For each student:
1. Input their name, then 5 daily screen times in minutes (validate each is >= 0).
2. Immediately output: their name, total screen time formatted as hours and minutes, and the count of days with > 300 minutes.

After all students, output the class average weekly screen time and the name of the student with the lowest total.

**Input:** Number of students, then for each student: name then 5 daily minutes.
**Output:** Per-student stats, then class summary.

**Example:**
\`\`\`
Input:  2
        Ali
        300 310 100 0 0
        Sam
        400 400 400 400 400
Output: Ali
        Screen time 11 hours 50 minutes
        Days with more than 300 minutes screen time 1
        Sam
        Screen time 33 hours 20 minutes
        Days with more than 300 minutes screen time 5
        Average weekly screen time for class 1355
        Lowest weekly time Ali
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    tags: ['Past Paper', 'Complete Question', '15 Marks'],
    year: 2024,
    session: 'Feb/Mar',
    variant: 2,
    starterCode: `DECLARE ClassSize : INTEGER
DECLARE StudentName : STRING
DECLARE DayCounter : INTEGER
DECLARE StudentCounter : INTEGER
DECLARE Minutes : INTEGER
DECLARE Total : INTEGER
DECLARE DaysOver300 : INTEGER
DECLARE ClassTotal : INTEGER
DECLARE LowestMinutes : INTEGER
DECLARE LowestName : STRING

INPUT ClassSize
ClassTotal <- 0
LowestMinutes <- 999999

FOR StudentCounter <- 1 TO ClassSize
    INPUT StudentName
    Total <- 0
    DaysOver300 <- 0

    // Loop over 5 days: validate input, accumulate Total, count days > 300

    // Update LowestMinutes/LowestName

    // Output student stats

    ClassTotal <- ClassTotal + Total
NEXT StudentCounter

// Output class summary`,
    hints: [
      'Inside the student loop, use FOR DayCounter <- 1 TO 5 with a nested REPEAT INPUT Minutes UNTIL Minutes >= 0 to validate.',
      'Use DIV(Total, 60) for hours and MOD(Total, 60) for remaining minutes.',
      'After all students, Average <- ClassTotal / ClassSize. Output it along with LowestName.',
    ],
    solution: `DECLARE ClassSize : INTEGER
DECLARE StudentName : STRING
DECLARE DayCounter : INTEGER
DECLARE StudentCounter : INTEGER
DECLARE Minutes : INTEGER
DECLARE Total : INTEGER
DECLARE DaysOver300 : INTEGER
DECLARE ClassTotal : INTEGER
DECLARE LowestMinutes : INTEGER
DECLARE LowestName : STRING

INPUT ClassSize
ClassTotal <- 0
LowestMinutes <- 999999

FOR StudentCounter <- 1 TO ClassSize
    INPUT StudentName
    Total <- 0
    DaysOver300 <- 0

    FOR DayCounter <- 1 TO 5
        REPEAT
            INPUT Minutes
        UNTIL Minutes >= 0
        Total <- Total + Minutes
        IF Minutes > 300 THEN
            DaysOver300 <- DaysOver300 + 1
        ENDIF
    NEXT DayCounter

    IF Total < LowestMinutes THEN
        LowestMinutes <- Total
        LowestName <- StudentName
    ENDIF

    OUTPUT StudentName
    OUTPUT "Screen time " & DIV(Total, 60) & " hours " & MOD(Total, 60) & " minutes"
    OUTPUT "Days with more than 300 minutes screen time " & DaysOver300

    ClassTotal <- ClassTotal + Total
NEXT StudentCounter

OUTPUT "Average weekly screen time for class " & (ClassTotal / ClassSize)
OUTPUT "Lowest weekly time " & LowestName`,
    solutionExplanation: 'Nested loops (students then days) collect and validate input. DIV and MOD format the time output. Running totals track the class average and a comparison finds the minimum.',
    testCases: [
      {
        inputs: ['2', 'Ali', '300', '310', '100', '0', '0', 'Sam', '400', '400', '400', '400', '400'],
        expectedOutput: 'Ali\nScreen time 11 hours 50 minutes\nDays with more than 300 minutes screen time 1\nSam\nScreen time 33 hours 20 minutes\nDays with more than 300 minutes screen time 5\nAverage weekly screen time for class 1355\nLowest weekly time Ali',
        description: 'Two students, Ali lowest',
        sortOrder: 0,
      },
      {
        inputs: ['1', 'John', '60', '120', '180', '240', '300'],
        expectedOutput: 'John\nScreen time 15 hours 0 minutes\nDays with more than 300 minutes screen time 0\nAverage weekly screen time for class 900\nLowest weekly time John',
        description: 'Single student',
        sortOrder: 1,
      },
      {
        inputs: ['2', 'A', '0', '0', '0', '0', '0', 'B', '100', '100', '100', '100', '100'],
        expectedOutput: 'A\nScreen time 0 hours 0 minutes\nDays with more than 300 minutes screen time 0\nB\nScreen time 8 hours 20 minutes\nDays with more than 300 minutes screen time 0\nAverage weekly screen time for class 250\nLowest weekly time A',
        description: null,
        sortOrder: 2,
        isHidden: true,
      },
      {
        inputs: ['1', 'Val', '-10', '301', '0', '0', '0', '0'],
        expectedOutput: 'Val\nScreen time 5 hours 1 minutes\nDays with more than 300 minutes screen time 1\nAverage weekly screen time for class 301\nLowest weekly time Val',
        description: 'Validation — negative input rejected',
        sortOrder: 3,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════ OCT/NOV 2023 PAST PAPERS ════

  {
    title: 'Rope Cost Calculator',
    description: `Calculate the cost of a length of rope. Read the length (between 0.5 and 6.0 inclusive), validate it with a WHILE loop, then read the cost per metre. Output the total price.

**Input:** First the length (re-input until valid), then the cost per metre.
**Output:** The calculated price (numeric value only).

**Example:**
\`\`\`
Input:  8.0
        0.4
        2.5
        2.0
Output: 5
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Selection',
    tags: ['Past Paper', 'Unseen', 'Validation'],
    year: 2023,
    session: 'Oct/Nov',
    variant: 1,
    starterCode: `DECLARE Length : REAL
DECLARE Cost : REAL
DECLARE Price : REAL

INPUT Length

// Add validation loop here

INPUT Cost
// Calculate and output price`,
    hints: [
      'Use a WHILE loop with the condition for an invalid length: Length < 0.5 OR Length > 6.0.',
      'Inside the WHILE loop, simply INPUT Length again.',
      'After the loop, INPUT Cost, then Price <- Length * Cost, then OUTPUT Price.',
    ],
    solution: `DECLARE Length : REAL
DECLARE Cost : REAL
DECLARE Price : REAL

INPUT Length
WHILE Length < 0.5 OR Length > 6.0 DO
    INPUT Length
ENDWHILE

INPUT Cost
Price <- Length * Cost
OUTPUT Price`,
    solutionExplanation: 'A WHILE loop re-asks for length while it is outside bounds. Once valid, the cost is read, the total price computed, and output.',
    testCases: [
      { inputs: ['2.5', '2.0'],                  expectedOutput: '5',    description: 'Valid on first try',   sortOrder: 0 },
      { inputs: ['7.0', '0.2', '3.0', '1.5'],    expectedOutput: '4.5',  description: 'Invalid then valid',   sortOrder: 1 },
      { inputs: ['0.5', '10'],                   expectedOutput: '5',    description: 'Lower boundary',       sortOrder: 2, isHidden: true },
      { inputs: ['6.0', '3'],                    expectedOutput: '18',   description: 'Upper boundary',       sortOrder: 3, isHidden: true },
      { inputs: ['-1.0', '8.5', '4.0', '2.5'],  expectedOutput: '10',   description: 'Negative rejected',    sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Theatre Seat Booking Validation',
    description: `Accept only whole numbers between 1 and 6 inclusive for the number of seats. Repeatedly ask until valid, then output the valid number.

**Input:** A sequence of integers.
**Output:** The first valid integer entered.

**Example:**
\`\`\`
Input:  0
        7
        4
Output: 4
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Validation'],
    year: 2023,
    session: 'Oct/Nov',
    variant: 3,
    starterCode: `DECLARE Seats : INTEGER

INPUT Seats

// Add your validation loop here`,
    hints: [
      'The input is invalid if it is less than 1 OR greater than 6.',
      'Use WHILE Seats < 1 OR Seats > 6 DO ... ENDWHILE.',
      'Inside the loop, just INPUT Seats again.',
    ],
    solution: `DECLARE Seats : INTEGER

INPUT Seats
WHILE Seats < 1 OR Seats > 6 DO
    INPUT Seats
ENDWHILE

OUTPUT Seats`,
    solutionExplanation: 'A WHILE loop continues while the value is out of range, forcing re-entry until a valid number is provided.',
    testCases: [
      { inputs: ['0', '7', '4'],   expectedOutput: '4', description: 'Two invalid then valid', sortOrder: 0 },
      { inputs: ['5'],             expectedOutput: '5', description: 'Valid on first try',     sortOrder: 1 },
      { inputs: ['1'],             expectedOutput: '1', description: 'Lower boundary',         sortOrder: 2, isHidden: true },
      { inputs: ['6'],             expectedOutput: '6', description: 'Upper boundary',         sortOrder: 3, isHidden: true },
      { inputs: ['-5', '10', '3'], expectedOutput: '3', description: 'Negative and large rejected', sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Extracting String Data',
    description: `Input a string, a starting position, and a length. Output the extracted substring, then the entire original string in lowercase.

**Input:** A string, an integer start position (1-indexed), and an integer length.
**Output:** The substring, then the lowercase string.

**Example:**
\`\`\`
Input:  Learning Never Exhausts The Mind
        25
        8
Output: The Mind
        learning never exhausts the mind
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'String Processing',
    tags: ['Past Paper', 'String Operations', 'Complete Question'],
    year: 2023,
    session: 'Oct/Nov',
    variant: 2,
    starterCode: `DECLARE Quote : STRING
DECLARE StartPos : INTEGER
DECLARE NumChars : INTEGER

INPUT Quote
INPUT StartPos
INPUT NumChars

// Output the substring

// Output the lowercase string`,
    hints: [
      'Pass the variables directly into SUBSTRING and LCASE inside OUTPUT statements.',
      'OUTPUT SUBSTRING(Quote, StartPos, NumChars)',
      'OUTPUT LCASE(Quote)',
    ],
    solution: `DECLARE Quote : STRING
DECLARE StartPos : INTEGER
DECLARE NumChars : INTEGER

INPUT Quote
INPUT StartPos
INPUT NumChars

OUTPUT SUBSTRING(Quote, StartPos, NumChars)
OUTPUT LCASE(Quote)`,
    solutionExplanation: 'SUBSTRING uses the provided start and length; LCASE converts to lowercase. Each OUTPUT produces a new line.',
    testCases: [
      { inputs: ['Learning Never Exhausts The Mind', '25', '8'], expectedOutput: 'The Mind\nlearning never exhausts the mind', description: 'Past paper example',  sortOrder: 0 },
      { inputs: ['Computer Science', '1', '8'],                  expectedOutput: 'Computer\ncomputer science',                description: 'First word',          sortOrder: 1 },
      { inputs: ['IGCSE 2023', '7', '4'],                        expectedOutput: '2023\nigcse 2023',                          description: null,                  sortOrder: 2, isHidden: true },
      { inputs: ['HELLO', '2', '2'],                             expectedOutput: 'EL\nhello',                                 description: null,                  sortOrder: 3, isHidden: true },
      { inputs: ['Pseudocode', '1', '10'],                       expectedOutput: 'Pseudocode\npseudocode',                    description: 'Full string',         sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Lowest Temperature Finder',
    description: `Read exactly 5 temperature readings using a loop. Output the single lowest temperature.

**Input:** 5 numbers.
**Output:** The lowest temperature.

**Example:**
\`\`\`
Input:  25
        10
        30
        -5
        15
Output: -5
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Algorithms',
    tags: ['Past Paper', 'Min/Max'],
    year: 2023,
    session: 'Oct/Nov',
    variant: 2,
    starterCode: `DECLARE Temp : REAL
DECLARE MinTemp : REAL
DECLARE i : INTEGER

MinTemp <- 1000

FOR i <- 1 TO 5
    // Add your logic here
NEXT i

OUTPUT MinTemp`,
    hints: [
      'Initialise MinTemp to a high number so the first input replaces it.',
      'Inside the loop: INPUT Temp, then compare with MinTemp.',
      'IF Temp < MinTemp THEN MinTemp <- Temp ENDIF.',
    ],
    solution: `DECLARE Temp : REAL
DECLARE MinTemp : REAL
DECLARE i : INTEGER

MinTemp <- 1000

FOR i <- 1 TO 5
    INPUT Temp
    IF Temp < MinTemp THEN
        MinTemp <- Temp
    ENDIF
NEXT i

OUTPUT MinTemp`,
    solutionExplanation: 'Initialised to a high sentinel. Each reading updates the minimum when smaller, guaranteeing the lowest value is captured.',
    testCases: [
      { inputs: ['25', '10', '30', '-5', '15'],     expectedOutput: '-5',  description: 'Contains negatives', sortOrder: 0 },
      { inputs: ['100', '90', '80', '70', '60'],    expectedOutput: '60',  description: 'Descending',         sortOrder: 1 },
      { inputs: ['5', '5', '5', '5', '5'],          expectedOutput: '5',   description: 'All identical',      sortOrder: 2, isHidden: true },
      { inputs: ['-10', '-20', '-5', '-30', '-15'], expectedOutput: '-30', description: 'All negative',       sortOrder: 3, isHidden: true },
      { inputs: ['42', '105', '12', '99', '1'],     expectedOutput: '1',   description: 'Lowest at end',      sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Daily Temperature Aggregator',
    description: `Read 3 temperature readings for a day. Find the maximum, the minimum, and calculate the average.

**Input:** 3 numbers.
**Output:** Maximum, minimum, and average on separate lines.

**Example:**
\`\`\`
Input:  12.0
        15.0
        9.0
Output: 15
        9
        12
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Algorithms',
    tags: ['Past Paper', 'Min/Max', 'Totalling'],
    year: 2023,
    session: 'Oct/Nov',
    variant: 3,
    starterCode: `DECLARE Temp : REAL
DECLARE MaxTemp : REAL
DECLARE MinTemp : REAL
DECLARE Total : REAL
DECLARE Average : REAL
DECLARE i : INTEGER

MaxTemp <- -1000
MinTemp <- 1000
Total <- 0

// Write your loop to read 3 temperatures
// Update MaxTemp, MinTemp, and Total inside

Average <- Total / 3

OUTPUT MaxTemp
OUTPUT MinTemp
OUTPUT Average`,
    hints: [
      'Use a FOR loop from 1 TO 3.',
      'Inside: add Temp to Total; check IF Temp > MaxTemp and IF Temp < MinTemp separately.',
      'Output MaxTemp, then MinTemp, then Average.',
    ],
    solution: `DECLARE Temp : REAL
DECLARE MaxTemp : REAL
DECLARE MinTemp : REAL
DECLARE Total : REAL
DECLARE Average : REAL
DECLARE i : INTEGER

MaxTemp <- -1000
MinTemp <- 1000
Total <- 0

FOR i <- 1 TO 3
    INPUT Temp
    Total <- Total + Temp
    IF Temp > MaxTemp THEN
        MaxTemp <- Temp
    ENDIF
    IF Temp < MinTemp THEN
        MinTemp <- Temp
    ENDIF
NEXT i

Average <- Total / 3

OUTPUT MaxTemp
OUTPUT MinTemp
OUTPUT Average`,
    solutionExplanation: 'A single FOR loop reads and processes all three temperatures, accumulating the sum and continuously updating running max and min values.',
    testCases: [
      { inputs: ['12.0', '15.0', '9.0'],  expectedOutput: '15\n9\n12',  description: 'Standard',       sortOrder: 0 },
      { inputs: ['-5', '-2', '-8'],        expectedOutput: '-2\n-8\n-5', description: 'All negative',   sortOrder: 1 },
      { inputs: ['10', '10', '10'],        expectedOutput: '10\n10\n10', description: 'Constant',       sortOrder: 2, isHidden: true },
      { inputs: ['0', '30', '15'],         expectedOutput: '30\n0\n15',  description: 'Zero included',  sortOrder: 3, isHidden: true },
      { inputs: ['100', '50', '0'],        expectedOutput: '100\n0\n50', description: 'Descending',     sortOrder: 4, isHidden: true },
    ],
  },

  // ════════════════════════════════════════ MAY/JUN 2023 PAST PAPERS ════

  {
    title: 'Validation Range Check',
    description: `Ensure a length is between 15 and 35 inclusive. Output an initial prompt, then show an error and re-ask for each invalid input, until a valid value is entered.

**Input:** A sequence of integers.
**Output:** Initial prompt, error messages for invalid inputs, then "Accepted".

**Example:**
\`\`\`
Input:  10
        40
        20
Output: Enter a number between 15 and 35 inclusive
        Your number must be between 15 and 35 inclusive
        Your number must be between 15 and 35 inclusive
        Accepted
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    tags: ['Past Paper', 'Validation'],
    year: 2023,
    session: 'May/June',
    variant: 3,
    starterCode: `DECLARE Length : INTEGER

// Output initial prompt and read input

// Start your validation loop here`,
    hints: [
      'Use a WHILE loop with the condition: Length < 15 OR Length > 35.',
      'Inside the loop, output the error message and INPUT Length again.',
      'After the loop, output "Accepted".',
    ],
    solution: `DECLARE Length : INTEGER

OUTPUT "Enter a number between 15 and 35 inclusive"
INPUT Length

WHILE Length < 15 OR Length > 35 DO
    OUTPUT "Your number must be between 15 and 35 inclusive"
    INPUT Length
ENDWHILE

OUTPUT "Accepted"`,
    solutionExplanation: 'The initial prompt and input happen before the loop. The WHILE loop repeats with an error message as long as the value is out of range.',
    testCases: [
      { inputs: ['25'],             expectedOutput: 'Enter a number between 15 and 35 inclusive\nAccepted',                                                                                                                                      description: 'Valid on first try',   sortOrder: 0 },
      { inputs: ['10', '40', '20'], expectedOutput: 'Enter a number between 15 and 35 inclusive\nYour number must be between 15 and 35 inclusive\nYour number must be between 15 and 35 inclusive\nAccepted',                                    description: 'Two invalid then valid', sortOrder: 1 },
      { inputs: ['14', '36', '15'], expectedOutput: 'Enter a number between 15 and 35 inclusive\nYour number must be between 15 and 35 inclusive\nYour number must be between 15 and 35 inclusive\nAccepted',                                    description: null,                    sortOrder: 2, isHidden: true },
      { inputs: ['0', '100', '35'], expectedOutput: 'Enter a number between 15 and 35 inclusive\nYour number must be between 15 and 35 inclusive\nYour number must be between 15 and 35 inclusive\nAccepted',                                    description: null,                    sortOrder: 3, isHidden: true },
      { inputs: ['-5', '22'],       expectedOutput: 'Enter a number between 15 and 35 inclusive\nYour number must be between 15 and 35 inclusive\nAccepted',                                                                                     description: null,                    sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Measurement Double-Entry Check',
    description: `Ask the user to enter a measurement, then ask them to re-enter it to verify. If the two values do not match, repeat the entire process until they do. Once matched, output \`"Verified"\`.

**Input:** Measurement pairs (real numbers) until both match.
**Output:** A prompt before each entry attempt, then "Verified".

**Example:**
\`\`\`
Input:  5.5
        5.6
        5.5
        5.5
Output: Please enter measurement
        Please re-enter measurement
        Please enter measurement
        Please re-enter measurement
        Verified
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Verification'],
    year: 2023,
    session: 'May/June',
    variant: 2,
    starterCode: `DECLARE Measurement : REAL
DECLARE MeasurementCheck : REAL

// Use a loop to perform the double entry verification`,
    hints: [
      'A REPEAT...UNTIL loop is ideal — it always runs at least once.',
      'Inside: output the prompt, INPUT Measurement, output the check prompt, INPUT MeasurementCheck.',
      'UNTIL Measurement = MeasurementCheck.',
    ],
    solution: `DECLARE Measurement : REAL
DECLARE MeasurementCheck : REAL

REPEAT
    OUTPUT "Please enter measurement"
    INPUT Measurement
    OUTPUT "Please re-enter measurement"
    INPUT MeasurementCheck
UNTIL Measurement = MeasurementCheck

OUTPUT "Verified"`,
    solutionExplanation: 'A REPEAT UNTIL loop guarantees the prompts run at least once, repeating only when the two entries do not match.',
    testCases: [
      { inputs: ['10.5', '10.5'],                  expectedOutput: 'Please enter measurement\nPlease re-enter measurement\nVerified',                                                                                                                            description: 'Matches first time',      sortOrder: 0 },
      { inputs: ['5.5', '5.6', '5.5', '5.5'],      expectedOutput: 'Please enter measurement\nPlease re-enter measurement\nPlease enter measurement\nPlease re-enter measurement\nVerified',                                                                   description: 'Fails once then matches', sortOrder: 1 },
      { inputs: ['1', '2', '3', '4', '5', '5'],    expectedOutput: 'Please enter measurement\nPlease re-enter measurement\nPlease enter measurement\nPlease re-enter measurement\nPlease enter measurement\nPlease re-enter measurement\nVerified',             description: null,                      sortOrder: 2, isHidden: true },
      { inputs: ['-3.14', '-3.14'],                 expectedOutput: 'Please enter measurement\nPlease re-enter measurement\nVerified',                                                                                                                            description: null,                      sortOrder: 3, isHidden: true },
      { inputs: ['0', '1', '0', '0'],               expectedOutput: 'Please enter measurement\nPlease re-enter measurement\nPlease enter measurement\nPlease re-enter measurement\nVerified',                                                                   description: null,                      sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Character Position Finder',
    description: `Input a string \`P\` and a single character \`Q\`. Convert both to uppercase, then find the 1-based position of the first occurrence of \`Q\` in \`P\`. Output \`0\` if not found.

**Input:** A string, then a single character.
**Output:** An integer representing the position (or 0).

**Example:**
\`\`\`
Input:  The world
        w
Output: 5
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    tags: ['Past Paper', 'String Manipulation'],
    year: 2023,
    session: 'May/June',
    variant: 2,
    starterCode: `DECLARE P : STRING
DECLARE Q : CHAR
DECLARE Position : INTEGER
DECLARE Counter : INTEGER

INPUT P
INPUT Q

Position <- 0
// Convert to uppercase and search`,
    hints: [
      'Use UCASE() to convert both P and Q to uppercase for case-insensitive comparison.',
      'Loop: WHILE Counter <= LENGTH(P) AND Position = 0 DO',
      'Inside: IF SUBSTRING(P, Counter, 1) = Q THEN Position <- Counter; Counter <- Counter + 1.',
    ],
    solution: `DECLARE P : STRING
DECLARE Q : CHAR
DECLARE Position : INTEGER
DECLARE Counter : INTEGER

INPUT P
INPUT Q

P <- UCASE(P)
Q <- UCASE(Q)
Position <- 0
Counter <- 1

WHILE Counter <= LENGTH(P) AND Position = 0 DO
    IF SUBSTRING(P, Counter, 1) = Q THEN
        Position <- Counter
    ENDIF
    Counter <- Counter + 1
ENDWHILE

OUTPUT Position`,
    solutionExplanation: 'Both strings are uppercased for case-insensitive comparison. The WHILE loop stops early (Position > 0) when the first match is found.',
    testCases: [
      { inputs: ['The world', 'w'], expectedOutput: '5', description: 'Found (case insensitive)', sortOrder: 0 },
      { inputs: ['Apple', 'z'],     expectedOutput: '0', description: 'Not found',                sortOrder: 1 },
      { inputs: ['BANANA', 'A'],    expectedOutput: '2', description: 'First occurrence',         sortOrder: 2, isHidden: true },
      { inputs: ['hello', 'H'],     expectedOutput: '1', description: null,                       sortOrder: 3, isHidden: true },
      { inputs: ['abcdefg', 'G'],   expectedOutput: '7', description: null,                       sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Totalling Positive Numbers',
    description: `Read numbers until 0 is entered. Total only the positive numbers and count how many there were.

**Input:** A sequence of integers ending with 0.
**Output:** The total and the count of positive numbers.

**Example:**
\`\`\`
Input:  5
        -2
        10
        0
Output: Total: 15
        Count: 2
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Totalling'],
    year: 2023,
    session: 'May/June',
    variant: 1,
    starterCode: `DECLARE Number : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER

Total <- 0
Count <- 0

// Loop until 0 is entered`,
    hints: [
      'Read an initial input before the WHILE loop, and another at the end of the loop body.',
      'WHILE Number <> 0 DO ... ENDWHILE.',
      'Inside: IF Number > 0 THEN Total <- Total + Number, Count <- Count + 1.',
    ],
    solution: `DECLARE Number : INTEGER
DECLARE Total : INTEGER
DECLARE Count : INTEGER

Total <- 0
Count <- 0

INPUT Number
WHILE Number <> 0 DO
    IF Number > 0 THEN
        Total <- Total + Number
        Count <- Count + 1
    ENDIF
    INPUT Number
ENDWHILE

OUTPUT "Total: " & Total
OUTPUT "Count: " & Count`,
    solutionExplanation: 'A sentinel-controlled WHILE loop ends on 0. An IF filters negatives, maintaining a running total and count of positive inputs only.',
    testCases: [
      { inputs: ['5', '-2', '10', '0'],        expectedOutput: 'Total: 15\nCount: 2',  description: 'Mix positive/negative', sortOrder: 0 },
      { inputs: ['-5', '-10', '0'],             expectedOutput: 'Total: 0\nCount: 0',  description: 'Only negatives',        sortOrder: 1 },
      { inputs: ['0'],                           expectedOutput: 'Total: 0\nCount: 0',  description: 'Immediate zero',        sortOrder: 2, isHidden: true },
      { inputs: ['1', '2', '3', '4', '5', '0'], expectedOutput: 'Total: 15\nCount: 5', description: null,                    sortOrder: 3, isHidden: true },
      { inputs: ['100', '-99', '1', '0'],       expectedOutput: 'Total: 101\nCount: 2', description: null,                   sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Temperature Readings & Conversion',
    description: `Use a 1D array \`Readings[1:5]\` to store 5 validated temperature readings (−20.0 to +50.0 inclusive). Prompt before each reading; show "Invalid temperature" and re-ask if out of range.

After all readings, output the Celsius average (rounded to 1 d.p.), then the Fahrenheit equivalent using F = C × 9/5 + 32 (also 1 d.p.).

**Input:** Valid/invalid temperatures for 5 positions.
**Output:** "Enter temperature" prompts, "Invalid temperature" for rejects, then the two averages.

**Example:**
\`\`\`
Input:  10.0
        60.0
        20.0
        15.0
        15.0
        15.0
Output: Enter temperature
        Enter temperature
        Invalid temperature
        Enter temperature
        Enter temperature
        Enter temperature
        Average C: 15.0
        Average F: 59.0
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    tags: ['Past Paper', 'Validation', 'Arrays'],
    year: 2023,
    session: 'May/June',
    variant: 1,
    starterCode: `DECLARE Readings : ARRAY[1:5] OF REAL
DECLARE DayLoop : INTEGER
DECLARE InTemp : REAL
DECLARE TotalDayTemp : REAL
DECLARE AverageTemp : REAL
DECLARE Fahrenheit : REAL

TotalDayTemp <- 0.0

// Write loop to read, validate, and store 5 readings`,
    hints: [
      'FOR DayLoop <- 1 TO 5: OUTPUT "Enter temperature", INPUT InTemp.',
      'Nested WHILE InTemp < -20.0 OR InTemp > 50.0: OUTPUT "Invalid temperature", INPUT InTemp.',
      'Use ROUND(TotalDayTemp / 5, 1) for Celsius average, ROUND(AverageTemp * 9 / 5 + 32, 1) for Fahrenheit.',
    ],
    solution: `DECLARE Readings : ARRAY[1:5] OF REAL
DECLARE DayLoop : INTEGER
DECLARE InTemp : REAL
DECLARE TotalDayTemp : REAL
DECLARE AverageTemp : REAL
DECLARE Fahrenheit : REAL

TotalDayTemp <- 0.0

FOR DayLoop <- 1 TO 5
    OUTPUT "Enter temperature"
    INPUT InTemp
    WHILE InTemp < -20.0 OR InTemp > 50.0 DO
        OUTPUT "Invalid temperature"
        INPUT InTemp
    ENDWHILE
    Readings[DayLoop] <- InTemp
    TotalDayTemp <- TotalDayTemp + InTemp
NEXT DayLoop

AverageTemp <- ROUND(TotalDayTemp / 5, 1)
Fahrenheit <- ROUND(AverageTemp * 9 / 5 + 32, 1)

OUTPUT "Average C: " & AverageTemp
OUTPUT "Average F: " & Fahrenheit`,
    solutionExplanation: 'A FOR loop with a nested WHILE loop for range validation populates the array. DIV/MOD are not needed here — ROUND formats the computed averages.',
    testCases: [
      { inputs: ['10.0', '60.0', '20.0', '15.0', '15.0', '15.0'],  expectedOutput: 'Enter temperature\nEnter temperature\nInvalid temperature\nEnter temperature\nEnter temperature\nEnter temperature\nAverage C: 15.0\nAverage F: 59.0', description: 'One invalid',  sortOrder: 0 },
      { inputs: ['0.0', '0.0', '0.0', '0.0', '0.0'],                expectedOutput: 'Enter temperature\nEnter temperature\nEnter temperature\nEnter temperature\nEnter temperature\nAverage C: 0.0\nAverage F: 32.0',                      description: 'All zeros',   sortOrder: 1 },
      { inputs: ['-20.0', '50.0', '10.0', '-10.0', '20.0'],         expectedOutput: 'Enter temperature\nEnter temperature\nEnter temperature\nEnter temperature\nEnter temperature\nAverage C: 10.0\nAverage F: 50.0',                    description: null,          sortOrder: 2, isHidden: true },
      { inputs: ['-25.0', '25.0', '25.0', '25.0', '25.0', '25.0'],  expectedOutput: 'Enter temperature\nInvalid temperature\nEnter temperature\nEnter temperature\nEnter temperature\nEnter temperature\nAverage C: 25.0\nAverage F: 77.0', description: null,         sortOrder: 3, isHidden: true },
      { inputs: ['-5.5', '2.5', '10.0', '12.5', '18.0'],            expectedOutput: 'Enter temperature\nEnter temperature\nEnter temperature\nEnter temperature\nEnter temperature\nAverage C: 7.5\nAverage F: 45.5',                     description: null,          sortOrder: 4, isHidden: true },
    ],
  },

  // ═══ FEB/MAR 2023 PAST PAPERS ═══

  {
    title: 'Energy Efficiency A-rated Check',
    description: `An appliance is classified as "A-rated" if its energy efficiency is 92% or greater.

Write a program that reads a real number representing the energy efficiency percentage and outputs "A-rated" if it meets the threshold. If the value is below 92, the program outputs nothing.

**Input:** A single real number representing energy efficiency (e.g. 92.0).
**Output:** "A-rated" if efficiency >= 92, or nothing otherwise.

**Example:**
\`\`\`
Input:  95
Output: A-rated
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Selection',
    tags: ['Past Paper'],
    year: 2023,
    session: 'Feb/Mar',
    variant: 1,
    starterCode: `DECLARE Efficiency : REAL

INPUT Efficiency

// Output "A-rated" if Efficiency is 92 or greater`,
    hints: [
      'Use an IF statement with the condition `Efficiency >= 92`.',
      'Inside the IF block, use OUTPUT to print "A-rated".',
      'There is no ELSE clause needed — the program does nothing if the condition is false.',
    ],
    solution: `DECLARE Efficiency : REAL

INPUT Efficiency

IF Efficiency >= 92 THEN
    OUTPUT "A-rated"
ENDIF`,
    solutionExplanation: 'A simple IF statement checks if the input variable Efficiency is greater than or equal to 92. If the condition evaluates to true, it outputs "A-rated".',
    testCases: [
      { inputs: ['95'],    expectedOutput: 'A-rated', description: 'Above threshold',      sortOrder: 0 },
      { inputs: ['92'],    expectedOutput: 'A-rated', description: 'Exactly on threshold', sortOrder: 1 },
      { inputs: ['85'],    expectedOutput: '',         description: 'Below threshold',      sortOrder: 2, isHidden: true },
      { inputs: ['91.9'],  expectedOutput: '',         description: 'Just below threshold', sortOrder: 3, isHidden: true },
      { inputs: ['100'],   expectedOutput: 'A-rated', description: 'Maximum efficiency',   sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Rounding Comparison Function',
    description: `Write a program that defines and tests a function called \`Same\`.

The function \`Same(A, B)\` should take an integer \`A\` and a real number \`B\` as parameters, and return \`TRUE\` if the value of \`A\` is the same as the value of \`B\` when \`B\` is rounded to the nearest whole number. Otherwise, it returns \`FALSE\`.

After defining the function, your program should input an integer \`X\` and a real number \`Y\`, call the function, and output "Match" if it returns \`TRUE\`, or "No Match" if it returns \`FALSE\`.

**Input:** An integer \`X\` followed by a real number \`Y\`.
**Output:** "Match" or "No Match".

**Example:**
\`\`\`
Input:  5
        4.8
Output: Match
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Procedures & Functions',
    tags: ['Past Paper', 'Functions', 'Built-in Functions'],
    year: 2023,
    session: 'Feb/Mar',
    variant: 2,
    starterCode: `// Define the function Same here
FUNCTION Same(A : INTEGER, B : REAL) RETURNS BOOLEAN
    // Your logic here using the ROUND() function
ENDFUNCTION

DECLARE X : INTEGER
DECLARE Y : REAL
DECLARE Z : BOOLEAN

INPUT X
INPUT Y

// Call the function and output "Match" or "No Match"`,
    hints: [
      'Inside the function, compare `A` to `ROUND(B, 0)`.',
      'Use an IF statement in the main code to check if `Same(X, Y)` evaluates to TRUE.',
      'Remember to store the result of the function call in the boolean variable `Z` (e.g., `Z <- Same(X, Y)`).',
    ],
    solution: `FUNCTION Same(A : INTEGER, B : REAL) RETURNS BOOLEAN
    IF A = ROUND(B, 0) THEN
        RETURN TRUE
    ELSE
        RETURN FALSE
    ENDIF
ENDFUNCTION

DECLARE X : INTEGER
DECLARE Y : REAL
DECLARE Z : BOOLEAN

INPUT X
INPUT Y

Z <- Same(X, Y)

IF Z = TRUE THEN
    OUTPUT "Match"
ELSE
    OUTPUT "No Match"
ENDIF`,
    solutionExplanation: 'The function uses the built-in ROUND(B, 0) to round the real number to the nearest integer before comparing it to A. The main program passes the inputs to the function and branches the output based on the returned boolean flag.',
    testCases: [
      { inputs: ['5', '4.8'],   expectedOutput: 'Match',    description: 'Rounds up to match',        sortOrder: 0 },
      { inputs: ['5', '5.2'],   expectedOutput: 'Match',    description: 'Rounds down to match',      sortOrder: 1 },
      { inputs: ['5', '5.6'],   expectedOutput: 'No Match', description: 'Rounds up to wrong number', sortOrder: 2, isHidden: true },
      { inputs: ['10', '9.1'],  expectedOutput: 'No Match', description: 'Rounds down to wrong number', sortOrder: 3, isHidden: true },
      { inputs: ['-3', '-2.9'], expectedOutput: 'Match',    description: 'Negative numbers rounding', sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Sports League Match Tracker',
    description: `A sports team earns points based on match results: 3 for an away win, 2 for a home win, 1 for a drawn match, and 0 for a lost match.

Write a program that first reads the total number of matches played (\`MatchNo\`). Then, it should loop \`MatchNo\` times, reading the result of each match (3, 2, 1, or 0). Calculate the total points for the team and count the number of away wins, home wins, draws, and losses.

**Input:** An integer representing \`MatchNo\`, followed by \`MatchNo\` integers representing the match results.
**Output:** 5 lines displaying the total points and the counts for each result type.

**Example:**
\`\`\`
Input:  4
        3
        2
        1
        0
Output: Total points: 6
        Away wins: 1
        Home wins: 1
        Draws: 1
        Losses: 1
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Algorithms',
    tags: ['Past Paper', 'Counting', 'Totalling', 'CASE OF'],
    year: 2023,
    session: 'Feb/Mar',
    variant: 2,
    starterCode: `DECLARE MatchNo : INTEGER
DECLARE Result : INTEGER
DECLARE TotalPoints : INTEGER
DECLARE AwayWins : INTEGER
DECLARE HomeWins : INTEGER
DECLARE Draws : INTEGER
DECLARE Losses : INTEGER
DECLARE Count : INTEGER

TotalPoints <- 0
AwayWins <- 0
HomeWins <- 0
Draws <- 0
Losses <- 0

INPUT MatchNo

// Write a FOR loop from 1 TO MatchNo
// INPUT Result each iteration
// Use CASE OF to update counters and add to TotalPoints

OUTPUT "Total points: " & TotalPoints
OUTPUT "Away wins: " & AwayWins
OUTPUT "Home wins: " & HomeWins
OUTPUT "Draws: " & Draws
OUTPUT "Losses: " & Losses`,
    hints: [
      'You need a FOR loop running from 1 to `MatchNo`.',
      'Inside the loop, INPUT Result, then add Result to TotalPoints.',
      'Use a CASE OF Result block to increment AwayWins (if 3), HomeWins (if 2), Draws (if 1), or Losses (if 0).',
    ],
    solution: `DECLARE MatchNo : INTEGER
DECLARE Result : INTEGER
DECLARE TotalPoints : INTEGER
DECLARE AwayWins : INTEGER
DECLARE HomeWins : INTEGER
DECLARE Draws : INTEGER
DECLARE Losses : INTEGER
DECLARE Count : INTEGER

TotalPoints <- 0
AwayWins <- 0
HomeWins <- 0
Draws <- 0
Losses <- 0

INPUT MatchNo

FOR Count <- 1 TO MatchNo
    INPUT Result
    TotalPoints <- TotalPoints + Result
    CASE OF Result
        3 : AwayWins <- AwayWins + 1
        2 : HomeWins <- HomeWins + 1
        1 : Draws <- Draws + 1
        0 : Losses <- Losses + 1
    ENDCASE
NEXT Count

OUTPUT "Total points: " & TotalPoints
OUTPUT "Away wins: " & AwayWins
OUTPUT "Home wins: " & HomeWins
OUTPUT "Draws: " & Draws
OUTPUT "Losses: " & Losses`,
    solutionExplanation: 'The algorithm uses a definite iteration loop (FOR) to process a pre-determined number of match results. A CASE statement effectively acts as a selection structure to update individual tally counters, while a running total keeps track of the overall score.',
    testCases: [
      { inputs: ['4', '3', '2', '1', '0'],          expectedOutput: 'Total points: 6\nAway wins: 1\nHome wins: 1\nDraws: 1\nLosses: 1',   description: 'One of each result', sortOrder: 0 },
      { inputs: ['5', '3', '3', '3', '3', '3'],     expectedOutput: 'Total points: 15\nAway wins: 5\nHome wins: 0\nDraws: 0\nLosses: 0', description: 'All away wins',      sortOrder: 1 },
      { inputs: ['0'],                               expectedOutput: 'Total points: 0\nAway wins: 0\nHome wins: 0\nDraws: 0\nLosses: 0',  description: 'Zero matches',       sortOrder: 2, isHidden: true },
      { inputs: ['3', '0', '0', '0'],               expectedOutput: 'Total points: 0\nAway wins: 0\nHome wins: 0\nDraws: 0\nLosses: 3',  description: 'All losses',         sortOrder: 3, isHidden: true },
      { inputs: ['6', '2', '2', '2', '1', '1', '0'], expectedOutput: 'Total points: 8\nAway wins: 0\nHome wins: 3\nDraws: 2\nLosses: 1', description: 'Mixed results',      sortOrder: 4, isHidden: true },
    ],
  },

  // ═══ OCT/NOV 2022 PAST PAPERS ═══

  {
    title: 'Bread Rolls Stock Tracker',
    description: `A bakery needs a program to make sure there are always enough fresh bread rolls available. The bakery starts with a stock of 50 bread rolls. The program should repeatedly take in the number of rolls sold until a value of -1 is entered.

Whenever the stock falls below 20, the program should output "Add new stock" and add 50 to the current stock. When -1 is entered, the program should stop and output the total number of rolls sold.

**Input:** A sequence of integers representing rolls sold, ending with -1.
**Output:** "Add new stock" each time stock drops below 20, then the total rolls sold at the end.

**Example:**
\`\`\`
Input:  24
        12
        -1
Output: Add new stock
        36
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Complete Question'],
    year: 2022,
    session: 'Oct/Nov',
    variant: 1,
    starterCode: `DECLARE Stock : INTEGER
DECLARE Total : INTEGER
DECLARE Sold : INTEGER

Stock <- 50
Total <- 0

// Add your WHILE loop and logic here`,
    hints: [
      'You will need a WHILE loop that continues as long as Sold is not equal to -1.',
      'Inside the loop, subtract the Sold amount from Stock. Then use an IF statement to check if Stock < 20.',
      'If Stock < 20, output the message and add 50 to Stock. Keep a running total of rolls sold and input the next Sold before the loop repeats.',
    ],
    solution: `DECLARE Stock : INTEGER
DECLARE Total : INTEGER
DECLARE Sold : INTEGER

Stock <- 50
Total <- 0

INPUT Sold
WHILE Sold <> -1 DO
    Stock <- Stock - Sold
    IF Stock < 20 THEN
        OUTPUT "Add new stock"
        Stock <- Stock + 50
    ENDIF
    Total <- Total + Sold
    INPUT Sold
ENDWHILE

OUTPUT Total`,
    solutionExplanation: 'The program uses a WHILE loop to process sales until a sentinel value (-1) is encountered. It continuously updates the running stock and total sold variables, using a conditional check to trigger restocking when the threshold is breached.',
    testCases: [
      { inputs: ['24', '12', '-1'],                        expectedOutput: 'Add new stock\n36',                description: 'One restock triggered',         sortOrder: 0 },
      { inputs: ['5', '5', '5', '-1'],                     expectedOutput: '15',                              description: 'No restocking needed',          sortOrder: 1 },
      { inputs: ['10', '10', '10', '10', '-1'],            expectedOutput: 'Add new stock\n40',               description: null,                            sortOrder: 2, isHidden: true },
      { inputs: ['45', '-1'],                              expectedOutput: 'Add new stock\n45',               description: null,                            sortOrder: 3, isHidden: true },
      { inputs: ['-1'],                                    expectedOutput: '0',                               description: null,                            sortOrder: 4, isHidden: true },
      { inputs: ['24', '12', '6', '30', '12', '18', '-1'], expectedOutput: 'Add new stock\nAdd new stock\n102', description: 'Multiple restocks',           sortOrder: 5, isHidden: true },
    ],
  },

  {
    title: 'Three-Digit Number Breakdown',
    description: `Write an algorithm to divide a three-digit number into its hundreds, tens, and units components using the built-in mathematical operators \`DIV\` (integer division) and \`MOD\` (remainder).

**Input:** A single positive integer between 100 and 999.
**Output:** A single line in the format: "Hundreds: H Tens: T Units: U"

**Example:**
\`\`\`
Input:  876
Output: Hundreds: 8 Tens: 7 Units: 6
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arithmetic',
    tags: ['Past Paper', 'Flowchart Conversion'],
    year: 2022,
    session: 'Oct/Nov',
    variant: 2,
    starterCode: `DECLARE Number : INTEGER
DECLARE Hundreds : INTEGER
DECLARE Tens : INTEGER
DECLARE Units : INTEGER
DECLARE Temp : INTEGER

INPUT Number

// Calculate Hundreds, Tens, and Units here

OUTPUT "Hundreds: " & Hundreds & " Tens: " & Tens & " Units: " & Units`,
    hints: [
      'To isolate the hundreds digit, use integer division by 100: `Hundreds <- Number DIV 100`.',
      'To find the remaining part without the hundreds, use MOD 100 and store it in Temp.',
      'Then `Tens <- Temp DIV 10` and `Units <- Number MOD 10`.',
    ],
    solution: `DECLARE Number : INTEGER
DECLARE Hundreds : INTEGER
DECLARE Tens : INTEGER
DECLARE Units : INTEGER
DECLARE Temp : INTEGER

INPUT Number

Hundreds <- Number DIV 100
Temp <- Number MOD 100
Tens <- Temp DIV 10
Units <- Number MOD 10

OUTPUT "Hundreds: " & Hundreds & " Tens: " & Tens & " Units: " & Units`,
    solutionExplanation: 'By using integer division (DIV), we extract the most significant digit. By using modulus (MOD), we strip away the higher digits to process the remainder.',
    testCases: [
      { inputs: ['876'], expectedOutput: 'Hundreds: 8 Tens: 7 Units: 6', description: 'Standard 3-digit number',        sortOrder: 0 },
      { inputs: ['606'], expectedOutput: 'Hundreds: 6 Tens: 0 Units: 6', description: 'Zero in tens place',             sortOrder: 1 },
      { inputs: ['124'], expectedOutput: 'Hundreds: 1 Tens: 2 Units: 4', description: null,                             sortOrder: 2, isHidden: true },
      { inputs: ['999'], expectedOutput: 'Hundreds: 9 Tens: 9 Units: 9', description: null,                             sortOrder: 3, isHidden: true },
      { inputs: ['100'], expectedOutput: 'Hundreds: 1 Tens: 0 Units: 0', description: null,                             sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Wheelbarrow Restock Tracker',
    description: `A hardware store uses an algorithm to ensure there are enough wheelbarrows in stock. The initial stock is 10 and total sold starts at 0.

The program takes a sequence of string inputs ("Y" for a sale, "N" to stop). Every time a wheelbarrow is sold ("Y"), the stock drops by 1. If the stock drops below 5, the program outputs "Add new stock" and adds 10 to the stock. When "N" is entered, output the total number sold.

**Input:** A sequence of "Y" and "N" string inputs, ending with "N".
**Output:** "Add new stock" when stock falls below 5, then the total sold after "N".

**Example:**
\`\`\`
Input:  Y Y Y Y Y Y N
Output: Add new stock
        6
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Loops',
    tags: ['Past Paper', 'Flowchart Conversion'],
    year: 2022,
    session: 'Oct/Nov',
    variant: 3,
    starterCode: `DECLARE Stock : INTEGER
DECLARE Total : INTEGER
DECLARE Sale : STRING

Stock <- 10
Total <- 0

INPUT Sale

WHILE Sale <> "N" DO
    // Decrement stock, check threshold, count total

    INPUT Sale
ENDWHILE

OUTPUT Total`,
    hints: [
      'Subtract 1 from Stock at the start of the loop body. Then check if Stock < 5.',
      'If the condition is met, output "Add new stock" and increase Stock by 10.',
      'Always add 1 to Total before asking for the next Sale input at the bottom of the loop.',
    ],
    solution: `DECLARE Stock : INTEGER
DECLARE Total : INTEGER
DECLARE Sale : STRING

Stock <- 10
Total <- 0

INPUT Sale

WHILE Sale <> "N" DO
    Stock <- Stock - 1
    IF Stock < 5 THEN
        OUTPUT "Add new stock"
        Stock <- Stock + 10
    ENDIF
    Total <- Total + 1
    INPUT Sale
ENDWHILE

OUTPUT Total`,
    solutionExplanation: 'The WHILE loop runs until the exit condition "N" is provided. For each sale, stock is reduced. A nested IF handles the conditional restocking logic independently of the total sales counter, which increments unconditionally for every "Y" processed.',
    testCases: [
      { inputs: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N'],                               expectedOutput: 'Add new stock\n6',  description: 'Triggers one restock',  sortOrder: 0 },
      { inputs: ['Y', 'Y', 'Y', 'N'],                                               expectedOutput: '3',                 description: 'No restock triggered', sortOrder: 1 },
      { inputs: ['N'],                                                               expectedOutput: '0',                 description: 'Immediate stop',       sortOrder: 2, isHidden: true },
      { inputs: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N'],    expectedOutput: 'Add new stock\n11', description: null,                   sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Student Mark Categorizer',
    description: `A teacher needs a program to categorize student test marks. The program will continuously read integer marks until a value of -1 is entered.

The marks should be sorted into three categories:
- **Higher**: 80 or greater
- **Middle**: 50 to 79 (inclusive)
- **Lower**: less than 50

At the end, output the total counts for each category.

**Input:** A sequence of integers ending with -1.
**Output:** Three lines formatted as "Higher: X", "Middle: Y", and "Lower: Z".

**Example:**
\`\`\`
Input:  85 50 49 90 12 -1
Output: Higher: 2
        Middle: 1
        Lower: 2
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Selection',
    tags: ['Past Paper', 'Adapted'],
    year: 2022,
    session: 'Oct/Nov',
    variant: 2,
    starterCode: `DECLARE Mark : INTEGER
DECLARE HighCount : INTEGER
DECLARE MidCount : INTEGER
DECLARE LowCount : INTEGER

HighCount <- 0
MidCount <- 0
LowCount <- 0

INPUT Mark

// Add WHILE loop and nested IF selection here

OUTPUT "Higher: " & HighCount
OUTPUT "Middle: " & MidCount
OUTPUT "Lower: " & LowCount`,
    hints: [
      'Use a WHILE loop that runs as long as Mark <> -1.',
      'Use IF/ELSE inside the loop. Start by checking if Mark >= 80.',
      'If not >= 80, nest another IF inside the ELSE block to check if Mark >= 50. Anything left falls into Lower.',
    ],
    solution: `DECLARE Mark : INTEGER
DECLARE HighCount : INTEGER
DECLARE MidCount : INTEGER
DECLARE LowCount : INTEGER

HighCount <- 0
MidCount <- 0
LowCount <- 0

INPUT Mark

WHILE Mark <> -1 DO
    IF Mark >= 80 THEN
        HighCount <- HighCount + 1
    ELSE
        IF Mark >= 50 THEN
            MidCount <- MidCount + 1
        ELSE
            LowCount <- LowCount + 1
        ENDIF
    ENDIF
    INPUT Mark
ENDWHILE

OUTPUT "Higher: " & HighCount
OUTPUT "Middle: " & MidCount
OUTPUT "Lower: " & LowCount`,
    solutionExplanation: 'The algorithm uses a WHILE loop for continuous input and nested IF statements to correctly bucket each score into one of three mutually exclusive categories.',
    testCases: [
      { inputs: ['85', '50', '49', '90', '12', '-1'], expectedOutput: 'Higher: 2\nMiddle: 1\nLower: 2', description: 'Standard mix of grades',   sortOrder: 0 },
      { inputs: ['-1'],                               expectedOutput: 'Higher: 0\nMiddle: 0\nLower: 0', description: 'Immediate termination',    sortOrder: 1 },
      { inputs: ['100', '80', '81', '-1'],            expectedOutput: 'Higher: 3\nMiddle: 0\nLower: 0', description: null,                       sortOrder: 2, isHidden: true },
      { inputs: ['79', '50', '65', '-1'],             expectedOutput: 'Higher: 0\nMiddle: 3\nLower: 0', description: null,                       sortOrder: 3, isHidden: true },
      { inputs: ['49', '0', '1', '-1'],              expectedOutput: 'Higher: 0\nMiddle: 0\nLower: 3', description: null,                       sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Parking Booking Validator',
    description: `A visitor car park booking system requires the user to input the day they want to book within a two-week period (days 1 to 14).

Write a program that repeatedly takes an integer input. If the input is outside the valid range (1 to 14 inclusive), output "Invalid day" and ask again. Once a valid day is entered, output "Accepted: " followed by the day number and terminate.

**Input:** A sequence of integers.
**Output:** "Invalid day" for out-of-range inputs, then "Accepted: X" for the valid input.

**Example:**
\`\`\`
Input:  0
        15
        14
Output: Invalid day
        Invalid day
        Accepted: 14
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Validation',
    tags: ['Past Paper', 'Adapted'],
    year: 2022,
    session: 'Oct/Nov',
    variant: 2,
    starterCode: `DECLARE Day : INTEGER
INPUT Day

// Add validation loop here

OUTPUT "Accepted: " & Day`,
    hints: [
      'Use a WHILE loop to repeatedly check the value.',
      'The loop condition should catch values that are out of range — use the OR operator.',
      'The condition should be `Day < 1 OR Day > 14`.',
    ],
    solution: `DECLARE Day : INTEGER
INPUT Day

WHILE Day < 1 OR Day > 14 DO
    OUTPUT "Invalid day"
    INPUT Day
ENDWHILE

OUTPUT "Accepted: " & Day`,
    solutionExplanation: 'A standard range-check validation loop. It uses a WHILE loop that executes as long as the input is out of bounds, preventing invalid data from passing further into the system.',
    testCases: [
      { inputs: ['0', '15', '14'],   expectedOutput: 'Invalid day\nInvalid day\nAccepted: 14', description: 'Testing boundaries',   sortOrder: 0 },
      { inputs: ['1'],               expectedOutput: 'Accepted: 1',                            description: 'Valid day immediately', sortOrder: 1 },
      { inputs: ['100', '-5', '7'], expectedOutput: 'Invalid day\nInvalid day\nAccepted: 7',  description: null,                   sortOrder: 2, isHidden: true },
      { inputs: ['14'],             expectedOutput: 'Accepted: 14',                            description: null,                   sortOrder: 3, isHidden: true },
      { inputs: ['2'],              expectedOutput: 'Accepted: 2',                             description: null,                   sortOrder: 4, isHidden: true },
    ],
  },
];

// ─── Main seed function ────────────────────────────────────────────────────────
async function main() {
  // ── Examples ──────────────────────────────────────────────────────────────
  console.log('Seeding examples...');
  await prisma.example.deleteMany();

  const exampleData = examples.map((ex, i) => ({
    title: ex.title,
    category: ex.category,
    code: ex.code,
    sortOrder: i,
  }));
  await prisma.example.createMany({ data: exampleData });
  console.log(`  ✓ ${exampleData.length} examples`);

  // ── Questions ─────────────────────────────────────────────────────────────
  // Upsert by title so existing question IDs (and all linked Progress /
  // ExamAnswer / ExamAttempt records) are preserved.
  console.log('Seeding practice questions...');

  const testCaseData = (tc: { inputs: string[]; expectedOutput: string; description: string | null; isHidden?: boolean; sortOrder: number; initialFiles?: string | null }) => ({
    inputs: tc.inputs,
    expectedOutput: tc.expectedOutput,
    description: tc.description ?? null,
    isHidden: tc.isHidden ?? false,
    sortOrder: tc.sortOrder,
    initialFiles: tc.initialFiles ?? null,
  });

  for (const [idx, q] of questions.entries()) {
    const { testCases, ...questionData } = q;

    const existing = await prisma.question.findFirst({ where: { title: q.title } });

    if (existing) {
      // Update question fields and refresh test cases
      await prisma.testCase.deleteMany({ where: { questionId: existing.id } });
      await prisma.question.update({
        where: { id: existing.id },
        data: {
          ...questionData,
          testCases: { create: testCases.map(testCaseData) },
        },
      });
    } else {
      await prisma.question.create({
        data: {
          ...questionData,
          testCases: { create: testCases.map(testCaseData) },
        },
      });
    }

    process.stdout.write(`  ✓ [${idx + 1}/${questions.length}] ${q.title}\n`);
  }

  console.log(`\nDone — ${exampleData.length} examples + ${questions.length} questions seeded.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
