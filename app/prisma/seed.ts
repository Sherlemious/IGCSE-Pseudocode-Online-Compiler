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
      'Complete the chain: ELSEIF Score >= 80 THEN OUTPUT "B" ELSEIF Score >= 70 THEN OUTPUT "C" ELSEIF Score >= 60 THEN OUTPUT "D" ELSE OUTPUT "F"',
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
      'Complete the chain: ELSEIF MOD(i, 3) = 0 THEN OUTPUT "Fizz" ELSEIF MOD(i, 5) = 0 THEN OUTPUT "Buzz" ELSE OUTPUT i',
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
      'IF N > 0 THEN OUTPUT "Positive" ELSEIF N < 0 THEN OUTPUT "Negative" ELSE OUTPUT "Zero"',
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
      'Len <- LENGTH(Username). IF Len >= 6 AND Len <= 12 THEN OUTPUT "Valid" ELSE OUTPUT "Invalid".',
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
      'IF Efficiency >= 92 THEN OUTPUT "A-rated" ELSE OUTPUT "Not A-rated" ENDIF',
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

**Source:** 2021 May/Jun Variant 2 Q2(a)

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
    session: 'May/Jun',
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

**Source:** Inspired by 2023 May/Jun Variant 2 Q4(b)(ii)

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
    session: 'May/Jun',
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

**Source:** Inspired by 2023 May/Jun Variant 3 Q5(b)

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
    session: 'May/Jun',
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
