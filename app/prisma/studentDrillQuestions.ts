// Practice for the mistakes students actually make (90 days of runs and checks):
// exact OUTPUT lines, DIV/MOD with the number alone, arrays that start at 1,
// a counter, a search that prints "Not found" once, and a validation loop
// whose starter is not already the answer.

export const studentDrillQuestions = [
  {
    title: 'Receipt Line',
    description: `Read an item name and an integer price. Output one line, \`Name: price\`.

The colon and the space are part of the text. A comma between OUTPUT items does not insert a space.

**Input:** A string, then an integer.
**Output:** \`Pencil: 3\` for those inputs.

**Example:**
\`\`\`
Input:  Pencil
        3
Output: Pencil: 3
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'String Processing',
    tags: ['IGCSE', '0478', 'Original Practice', 'OUTPUT', 'Exact output'],
    marks: 3,
    starterCode: `DECLARE Item : STRING
DECLARE Price : INTEGER

INPUT Item
INPUT Price

// OUTPUT Item: Price  — include the space after the colon`,
    hints: [
      'OUTPUT can print several items on one line if you separate them with commas.',
      'The comma does not add a space. Put ": " inside a string.',
      'OUTPUT Item, ": ", Price',
    ],
    solution: `DECLARE Item : STRING
DECLARE Price : INTEGER

INPUT Item
INPUT Price

OUTPUT Item, ": ", Price`,
    solutionExplanation: 'The name, the text ": ", and the price are three OUTPUT items. The space sits inside the string because a comma does not insert one.',
    testCases: [
      { inputs: ['Pencil', '3'], expectedOutput: 'Pencil: 3', description: 'Name and price', sortOrder: 0 },
      { inputs: ['Notebook', '12'], expectedOutput: 'Notebook: 12', description: 'Two-digit price', sortOrder: 1 },
      { inputs: ['Eraser', '0'], expectedOutput: 'Eraser: 0', description: 'Zero price', sortOrder: 2, isHidden: true },
      { inputs: ['Pen', '1'], expectedOutput: 'Pen: 1', description: 'Single letter-count price', sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Hours and Remaining Minutes',
    description: `Read a total number of minutes. Output two lines, numbers only: the whole hours, then the minutes left over.

Use DIV for the hours and MOD for the remainder. Do not print the words "hours" or "minutes".

**Input:** One integer, the total minutes.
**Output:** Two integers.

**Example:**
\`\`\`
Input:  130
Output: 2
        10
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arithmetic',
    tags: ['IGCSE', '0478', 'Original Practice', 'DIV', 'MOD'],
    marks: 4,
    starterCode: `DECLARE Total : INTEGER
DECLARE Hours : INTEGER
DECLARE Left : INTEGER

INPUT Total

// Hours is Total DIV 60
// Left is Total MOD 60
// OUTPUT the two numbers on separate lines`,
    hints: [
      'DIV counts how many times 60 fits. MOD is what is left.',
      '130 DIV 60 is 2, and 130 MOD 60 is 10.',
      'OUTPUT Hours and OUTPUT Left on their own lines. No extra text.',
    ],
    solution: `DECLARE Total : INTEGER
DECLARE Hours : INTEGER
DECLARE Left : INTEGER

INPUT Total

Hours <- Total DIV 60
Left <- Total MOD 60
OUTPUT Hours
OUTPUT Left`,
    solutionExplanation: 'Integer division by 60 gives the hours. The remainder is the leftover minutes. Each number is printed alone so extra words cannot change the line.',
    testCases: [
      { inputs: ['130'], expectedOutput: '2\n10', description: 'Two hours and ten minutes', sortOrder: 0 },
      { inputs: ['59'], expectedOutput: '0\n59', description: 'Under one hour', sortOrder: 1 },
      { inputs: ['60'], expectedOutput: '1\n0', description: 'Exact hour', sortOrder: 2, isHidden: true },
      { inputs: ['0'], expectedOutput: '0\n0', description: 'Zero minutes', sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Pass Count Only',
    description: `Read five integer marks, then a pass mark. Output how many of the five are greater than or equal to the pass mark. Output the count alone.

**Input:** Five marks, then the pass mark.
**Output:** One integer.

**Example:**
\`\`\`
Input:  40
        50
        49
        80
        100
        50
Output: 3
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arrays',
    tags: ['IGCSE', '0478', 'Original Practice', 'Arrays', 'Counting'],
    marks: 5,
    starterCode: `DECLARE Marks : ARRAY[1:5] OF INTEGER
DECLARE i, Pass, Count : INTEGER

FOR i <- 1 TO 5
    INPUT Marks[i]
NEXT i
INPUT Pass

// Count how many Marks[i] are >= Pass, then OUTPUT the count`,
    hints: [
      'The first slot is Marks[1], not Marks[0].',
      'Set Count to 0, then add 1 inside the IF.',
      'OUTPUT Count and nothing else.',
    ],
    solution: `DECLARE Marks : ARRAY[1:5] OF INTEGER
DECLARE i, Pass, Count : INTEGER

FOR i <- 1 TO 5
    INPUT Marks[i]
NEXT i
INPUT Pass

Count <- 0
FOR i <- 1 TO 5
    IF Marks[i] >= Pass THEN
        Count <- Count + 1
    ENDIF
NEXT i

OUTPUT Count`,
    solutionExplanation: 'The five marks are stored from index 1. A second pass adds 1 for each mark that meets the pass mark, which is read after the array so it can change between tests.',
    testCases: [
      { inputs: ['40', '50', '49', '80', '100', '50'], expectedOutput: '3', description: 'Pass mark 50', sortOrder: 0 },
      { inputs: ['10', '20', '30', '40', '50', '60'], expectedOutput: '0', description: 'None pass', sortOrder: 1 },
      { inputs: ['70', '70', '70', '70', '70', '70'], expectedOutput: '5', description: 'All equal the pass mark', sortOrder: 2, isHidden: true },
      { inputs: ['0', '1', '2', '3', '4', '0'], expectedOutput: '5', description: 'Pass mark zero', sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Ends of a List',
    description: `Read six integers into an array with bounds 1 to 6. Output the first value, then the last value.

**Input:** Six integers.
**Output:** Two lines, \`Values[1]\` then \`Values[6]\`.

**Example:**
\`\`\`
Input:  4
        8
        1
        1
        1
        9
Output: 4
        9
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Arrays',
    tags: ['IGCSE', '0478', 'Original Practice', 'Arrays', 'Indexing'],
    marks: 4,
    starterCode: `DECLARE Values : ARRAY[1:6] OF INTEGER
DECLARE i : INTEGER

// Read six integers, starting at index 1
// OUTPUT the first and the last`,
    hints: [
      'A Cambridge array declared ARRAY[1:6] has no slot 0.',
      'The first value you read goes in Values[1]. The sixth goes in Values[6].',
      'A FOR loop from 1 to 6 can read them. Then OUTPUT Values[1] and OUTPUT Values[6].',
    ],
    solution: `DECLARE Values : ARRAY[1:6] OF INTEGER
DECLARE i : INTEGER

FOR i <- 1 TO 6
    INPUT Values[i]
NEXT i

OUTPUT Values[1]
OUTPUT Values[6]`,
    solutionExplanation: 'The loop starts at 1, which is the lower bound. The last slot is the upper bound, 6, not 5.',
    testCases: [
      { inputs: ['4', '8', '1', '1', '1', '9'], expectedOutput: '4\n9', description: 'Different ends', sortOrder: 0 },
      { inputs: ['2', '2', '2', '2', '2', '2'], expectedOutput: '2\n2', description: 'All the same', sortOrder: 1 },
      { inputs: ['-3', '0', '0', '0', '0', '5'], expectedOutput: '-3\n5', description: 'Negative first', sortOrder: 2, isHidden: true },
      { inputs: ['9', '1', '1', '1', '1', '0'], expectedOutput: '9\n0', description: 'Zero last', sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Mark for a Name',
    description: `Four students are already stored in two arrays. Read a name. Output that student's mark, or \`Not found\` if the name is not there.

Print \`Not found\` once, after the loop. An ELSE inside the loop prints it for every other student.

**Input:** One name.
**Output:** The mark, or \`Not found\`.

**Example:**
\`\`\`
Input:  Bea
Output: 61
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Arrays',
    tags: ['IGCSE', '0478', 'Original Practice', 'Arrays', 'Linear Search'],
    marks: 6,
    starterCode: `DECLARE Names : ARRAY[1:4] OF STRING
DECLARE Marks : ARRAY[1:4] OF INTEGER
Names[1] <- "Bea"
Marks[1] <- 61
Names[2] <- "Dan"
Marks[2] <- 44
Names[3] <- "Eve"
Marks[3] <- 90
Names[4] <- "Fay"
Marks[4] <- 73

DECLARE Target : STRING
DECLARE Found : BOOLEAN
DECLARE i : INTEGER
Found <- FALSE
INPUT Target

// Search the names. OUTPUT the matching mark and set Found.
// After the loop, OUTPUT "Not found" only if Found is still FALSE`,
    hints: [
      'Compare Names[i] with Target inside a FOR loop from 1 to 4.',
      'When they match, OUTPUT Marks[i] and set Found <- TRUE. Do not use ELSE.',
      'After NEXT, IF Found = FALSE THEN OUTPUT "Not found".',
    ],
    solution: `DECLARE Names : ARRAY[1:4] OF STRING
DECLARE Marks : ARRAY[1:4] OF INTEGER
Names[1] <- "Bea"
Marks[1] <- 61
Names[2] <- "Dan"
Marks[2] <- 44
Names[3] <- "Eve"
Marks[3] <- 90
Names[4] <- "Fay"
Marks[4] <- 73

DECLARE Target : STRING
DECLARE Found : BOOLEAN
DECLARE i : INTEGER
Found <- FALSE
INPUT Target

FOR i <- 1 TO 4
    IF Names[i] = Target THEN
        OUTPUT Marks[i]
        Found <- TRUE
    ENDIF
NEXT i

IF Found = FALSE THEN
    OUTPUT "Not found"
ENDIF`,
    solutionExplanation: 'The flag starts false. A match prints the mark and raises the flag. The miss message is after the loop, so it prints once and only when nobody matched.',
    testCases: [
      { inputs: ['Bea'], expectedOutput: '61', description: 'First student', sortOrder: 0 },
      { inputs: ['Eve'], expectedOutput: '90', description: 'Middle student', sortOrder: 1 },
      { inputs: ['Fay'], expectedOutput: '73', description: 'Last student', sortOrder: 2 },
      { inputs: ['Zoe'], expectedOutput: 'Not found', description: 'Missing name', sortOrder: 3, isHidden: true },
    ],
  },
  {
    title: 'Accept a Mark from 0 to 100',
    description: `Keep reading an integer until it is between 0 and 100 inclusive. Output that accepted mark and nothing else.

**Input:** One or more integers. The last one is in range.
**Output:** The accepted mark.

**Example:**
\`\`\`
Input:  -1
        101
        40
Output: 40
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    tags: ['IGCSE', '0478', 'Original Practice', 'REPEAT', 'Validation'],
    marks: 4,
    starterCode: `DECLARE Mark : INTEGER

// REPEAT
//     INPUT Mark
// UNTIL Mark is from 0 to 100 inclusive
// OUTPUT Mark`,
    hints: [
      'Validation needs a loop that runs at least once. That is REPEAT … UNTIL.',
      'UNTIL is the stop condition: Mark >= 0 AND Mark <= 100.',
      'After the loop, OUTPUT Mark. Do not print "Valid".',
    ],
    solution: `DECLARE Mark : INTEGER

REPEAT
    INPUT Mark
UNTIL Mark >= 0 AND Mark <= 100

OUTPUT Mark`,
    solutionExplanation: 'REPEAT reads at least once. The loop stops when the mark is inside 0 to 100, and that value is the only line printed.',
    testCases: [
      { inputs: ['40'], expectedOutput: '40', description: 'Already valid', sortOrder: 0 },
      { inputs: ['-1', '101', '40'], expectedOutput: '40', description: 'Two rejects then a mark', sortOrder: 1 },
      { inputs: ['0'], expectedOutput: '0', description: 'Lower bound', sortOrder: 2, isHidden: true },
      { inputs: ['150', '-4', '100'], expectedOutput: '100', description: 'Upper bound after rejects', sortOrder: 3, isHidden: true },
    ],
  },
];
