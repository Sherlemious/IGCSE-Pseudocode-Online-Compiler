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
  console.log('Seeding practice questions...');
  await prisma.testCase.deleteMany();
  await prisma.question.deleteMany();

  for (const [idx, q] of questions.entries()) {
    const { testCases, ...questionData } = q;
    await prisma.question.create({
      data: {
        ...questionData,
        testCases: {
          create: testCases.map((tc) => ({
            inputs: tc.inputs,
            expectedOutput: tc.expectedOutput,
            description: tc.description ?? null,
            isHidden: tc.isHidden ?? false,
            sortOrder: tc.sortOrder,
          })),
        },
      },
    });
    process.stdout.write(`  ✓ [${idx + 1}/${questions.length}] ${q.title}\n`);
  }

  console.log(`\nDone — ${exampleData.length} examples + ${questions.length} questions seeded.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
