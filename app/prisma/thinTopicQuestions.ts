// Extra practice for topics documented as thin in docs/course-and-monetization-plan.md:
// 2D arrays, procedures & functions, file handling, and 9618 OOP.
// Questions are original auto-gradable tasks in Cambridge exam style
// (not verbatim past-paper text). Metadata points at the paper / skill
// they train when there is a clear analogue.

export const thinTopicQuestions = [

  // ══════════════════════════════════════════════════════ 2D ARRAYS ═══

  {
    title: 'Cinema Seat Free-Count',
    description: `A cinema screen is stored in a 3×4 2D array. Each cell is \`F\` (free) or \`B\` (booked). Read the 12 seat codes row by row and output how many seats are still free.

**Input:** 12 strings, one per seat, in row-major order.
**Output:** \`Free seats: <count>\`.

**Example:**
\`\`\`
Input:  F
        F
        B
        F
        B
        F
        F
        B
        F
        F
        F
        B
Output: Free seats: 8
\`\`\``,
    difficulty: 'EASY' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Original Practice', '2D Arrays', 'Nested Loops', 'Counting'],
    marks: 6,
    starterCode: `DECLARE Seats : ARRAY[1:3, 1:4] OF STRING
DECLARE Row, Col, FreeCount : INTEGER

FOR Row <- 1 TO 3
    FOR Col <- 1 TO 4
        INPUT Seats[Row, Col]
    NEXT Col
NEXT Row

// Count how many seats are "F" and output Free seats: <count>`,
    hints: [
      'Use nested FOR loops: the outer loop is the row, the inner loop is the column.',
      'Start FreeCount at 0, then add 1 whenever Seats[Row, Col] = "F".',
      'After both loops finish, OUTPUT "Free seats: " & FreeCount.',
    ],
    solution: `DECLARE Seats : ARRAY[1:3, 1:4] OF STRING
DECLARE Row, Col, FreeCount : INTEGER

FOR Row <- 1 TO 3
    FOR Col <- 1 TO 4
        INPUT Seats[Row, Col]
    NEXT Col
NEXT Row

FreeCount <- 0
FOR Row <- 1 TO 3
    FOR Col <- 1 TO 4
        IF Seats[Row, Col] = "F" THEN
            FreeCount <- FreeCount + 1
        ENDIF
    NEXT Col
NEXT Row

OUTPUT "Free seats: " & FreeCount`,
    solutionExplanation: 'A 2D array is a grid, so both filling and scanning it need nested loops. The count only increases when the stored code is F, so booked seats are ignored.',
    testCases: [
      { inputs: ['F', 'F', 'B', 'F', 'B', 'F', 'F', 'B', 'F', 'F', 'F', 'B'], expectedOutput: 'Free seats: 8', description: 'Mixed free and booked', sortOrder: 0 },
      { inputs: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'], expectedOutput: 'Free seats: 0', description: 'Full house', sortOrder: 1 },
      { inputs: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'], expectedOutput: 'Free seats: 12', description: 'Every seat free', sortOrder: 2, isHidden: true },
      { inputs: ['B', 'F', 'B', 'F', 'B', 'F', 'B', 'F', 'B', 'F', 'B', 'F'], expectedOutput: 'Free seats: 6', description: 'Alternating seats', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Find a Value in a 2D Grid',
    description: `Read a 3×3 grid of integers, then a target value. Output the position of the **first** match in row-major order, or \`Not found\`.

**Input:** 9 integers (row by row), then the target integer.
**Output:** \`Found at row <r> column <c>\` or \`Not found\`.

**Example:**
\`\`\`
Input:  1
        2
        3
        4
        5
        6
        7
        8
        9
        5
Output: Found at row 2 column 2
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Original Practice', '2D Arrays', 'Linear Search', 'Nested Loops'],
    marks: 8,
    starterCode: `DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Row, Col, Target : INTEGER
DECLARE Found : BOOLEAN

FOR Row <- 1 TO 3
    FOR Col <- 1 TO 3
        INPUT Grid[Row, Col]
    NEXT Col
NEXT Row
INPUT Target

// Search Grid for Target and output its first position`,
    hints: [
      'Use a BOOLEAN flag so you can stop checking once the first match is stored.',
      'Scan row by row, column by column — that is row-major order.',
      'If Found is still FALSE after both loops, output Not found.',
    ],
    solution: `DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Row, Col, Target, FoundRow, FoundCol : INTEGER
DECLARE Found : BOOLEAN

FOR Row <- 1 TO 3
    FOR Col <- 1 TO 3
        INPUT Grid[Row, Col]
    NEXT Col
NEXT Row
INPUT Target

Found <- FALSE
FOR Row <- 1 TO 3
    FOR Col <- 1 TO 3
        IF Found = FALSE AND Grid[Row, Col] = Target THEN
            Found <- TRUE
            FoundRow <- Row
            FoundCol <- Col
        ENDIF
    NEXT Col
NEXT Row

IF Found = TRUE THEN
    OUTPUT "Found at row " & FoundRow & " column " & FoundCol
ELSE
    OUTPUT "Not found"
ENDIF`,
    solutionExplanation: 'The inner nested loop is a linear search over a table. Keeping a Found flag means a later duplicate does not overwrite the first (top-left-most) position.',
    testCases: [
      { inputs: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '5'], expectedOutput: 'Found at row 2 column 2', description: 'Value in the centre', sortOrder: 0 },
      { inputs: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], expectedOutput: 'Not found', description: 'Target missing', sortOrder: 1 },
      { inputs: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '9'], expectedOutput: 'Found at row 1 column 1', description: 'First cell', sortOrder: 2, isHidden: true },
      { inputs: ['2', '2', '2', '2', '2', '2', '2', '2', '2', '2'], expectedOutput: 'Found at row 1 column 1', description: 'Duplicates keep the first match', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Weekly Screen Time Grid',
    description: `Students log daily screen time (minutes) in a 2D array. \`StudentName[1:3]\` holds the names. \`ScreenTime[1:3, 1:3]\` holds three days of minutes for those same students (row = student, column = day).

Read the three names, then the 9 daily totals. For each student output their name, weekly total minutes, and how many days were **more than 300** minutes. Then output the name of the student with the lowest weekly total (the earlier student wins a tie).

Inspired by Cambridge IGCSE Computer Science (0478) Feb/Mar 2024 Paper 22 Question 11 — shortened to 3 students × 3 days so it can be auto-graded.

**Input:** 3 names, then 9 integers (row by row).
**Output:** Three \`<name> <total> <daysOver300>\` lines, then \`Lowest: <name>\`.

**Example:**
\`\`\`
Input:  Amal
        Ben
        Chen
        320
        100
        80
        50
        60
        70
        310
        305
        10
Output: Amal 500 1
        Ben 180 0
        Chen 625 2
        Lowest: Ben
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Feb/Mar 2024', 'Paper 22', 'Past Paper', 'Unseen', '2D Arrays', 'Parallel Arrays'],
    year: 2024,
    session: 'Feb/Mar',
    variant: 2,
    paper: '0478/22',
    questionNumber: 11,
    marks: 12,
    starterCode: `DECLARE StudentName : ARRAY[1:3] OF STRING
DECLARE ScreenTime : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Student, Day, Total, DaysOver, LowestTotal, LowestIndex : INTEGER

FOR Student <- 1 TO 3
    INPUT StudentName[Student]
NEXT Student

FOR Student <- 1 TO 3
    FOR Day <- 1 TO 3
        INPUT ScreenTime[Student, Day]
    NEXT Day
NEXT Student

// Output each student's weekly total and days over 300, then the lowest name`,
    hints: [
      'Keep a running Total and DaysOver for each student row, resetting both before that row\'s inner loop.',
      'A day counts as over 300 only when ScreenTime[Student, Day] > 300 (not equal to 300).',
      'Track LowestTotal / LowestIndex with a strict < comparison so an earlier student wins a tie.',
    ],
    solution: `DECLARE StudentName : ARRAY[1:3] OF STRING
DECLARE ScreenTime : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Student, Day, Total, DaysOver, LowestTotal, LowestIndex : INTEGER

FOR Student <- 1 TO 3
    INPUT StudentName[Student]
NEXT Student

FOR Student <- 1 TO 3
    FOR Day <- 1 TO 3
        INPUT ScreenTime[Student, Day]
    NEXT Day
NEXT Student

LowestTotal <- 0
LowestIndex <- 1

FOR Student <- 1 TO 3
    Total <- 0
    DaysOver <- 0
    FOR Day <- 1 TO 3
        Total <- Total + ScreenTime[Student, Day]
        IF ScreenTime[Student, Day] > 300 THEN
            DaysOver <- DaysOver + 1
        ENDIF
    NEXT Day

    OUTPUT StudentName[Student] & " " & Total & " " & DaysOver

    IF Student = 1 THEN
        LowestTotal <- Total
        LowestIndex <- 1
    ELSE
        IF Total < LowestTotal THEN
            LowestTotal <- Total
            LowestIndex <- Student
        ENDIF
    ENDIF
NEXT Student

OUTPUT "Lowest: " & StudentName[LowestIndex]`,
    solutionExplanation: 'Each student is one row of the 2D array, so the inner loop totals that row and counts days over 300. A strict less-than when updating the lowest total keeps the first name on a tie — the usual IGCSE “first found” rule.',
    testCases: [
      { inputs: ['Amal', 'Ben', 'Chen', '320', '100', '80', '50', '60', '70', '310', '305', '10'], expectedOutput: 'Amal 500 1\nBen 180 0\nChen 625 2\nLowest: Ben', description: 'Mixed days over 300', sortOrder: 0 },
      { inputs: ['Ivy', 'Omar', 'Pat', '10', '10', '10', '20', '20', '20', '30', '30', '30'], expectedOutput: 'Ivy 30 0\nOmar 60 0\nPat 90 0\nLowest: Ivy', description: 'No day over 300; first student lowest', sortOrder: 1 },
      { inputs: ['Rae', 'Sam', 'Tess', '301', '301', '301', '0', '0', '0', '300', '300', '300'], expectedOutput: 'Rae 903 3\nSam 0 0\nTess 900 0\nLowest: Sam', description: '300 is not more than 300', sortOrder: 2, isHidden: true },
      { inputs: ['A', 'B', 'C', '100', '100', '100', '100', '100', '100', '50', '50', '50'], expectedOutput: 'A 300 0\nB 300 0\nC 150 0\nLowest: C', description: 'Tie between A and B is not the lowest', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Patient Reading Warnings',
    description: `A ward stores each patient's latest temperature and pulse in a 2D array \`Readings[1:3, 1:2]\`: column 1 is temperature (°C, real) and column 2 is pulse (beats per minute). A parallel 1D array \`Patient[1:3]\` holds the names.

Normal ranges (inclusive): temperature 36.1 to 37.2, pulse 60 to 100.

For each patient output:
- \`Normal\` if both readings are in range
- \`Warning: temperature\` or \`Warning: pulse\` if exactly one is out of range
- \`Severe warning: pulse and temperature\` if both are out of range

Inspired by the Cambridge IGCSE (0478) specimen Paper 2B hospital-readings task, reduced to 3 patients.

**Input:** 3 names, then 3 pairs of temperature and pulse.
**Output:** Three lines \`<name>: <status>\`.

**Example:**
\`\`\`
Input:  Amal
        Ben
        Chen
        36.5
        72
        36.8
        110
        38.0
        55
Output: Amal: Normal
        Ben: Warning: pulse
        Chen: Severe warning: pulse and temperature
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Specimen', 'Paper 2B', 'Past Paper', 'Unseen', '2D Arrays', 'Validation', 'Parallel Arrays'],
    paper: '0478/2B',
    questionNumber: 11,
    marks: 12,
    starterCode: `DECLARE Patient : ARRAY[1:3] OF STRING
DECLARE Readings : ARRAY[1:3, 1:2] OF REAL
DECLARE Index : INTEGER
DECLARE TempBad, PulseBad : BOOLEAN

FOR Index <- 1 TO 3
    INPUT Patient[Index]
NEXT Index

FOR Index <- 1 TO 3
    INPUT Readings[Index, 1]
    INPUT Readings[Index, 2]
NEXT Index

// Classify each patient and output Name: status`,
    hints: [
      'Readings[Index, 1] is temperature and Readings[Index, 2] is pulse — both stored as REAL.',
      'Set two BOOLEAN flags, then build the status from those flags rather than nesting lots of IFs.',
      'Inclusive bounds: temperature 36.1 to 37.2, pulse 60 to 100.',
    ],
    solution: `DECLARE Patient : ARRAY[1:3] OF STRING
DECLARE Readings : ARRAY[1:3, 1:2] OF REAL
DECLARE Index : INTEGER
DECLARE TempBad, PulseBad : BOOLEAN
DECLARE Status : STRING

FOR Index <- 1 TO 3
    INPUT Patient[Index]
NEXT Index

FOR Index <- 1 TO 3
    INPUT Readings[Index, 1]
    INPUT Readings[Index, 2]
NEXT Index

FOR Index <- 1 TO 3
    TempBad <- Readings[Index, 1] < 36.1 OR Readings[Index, 1] > 37.2
    PulseBad <- Readings[Index, 2] < 60 OR Readings[Index, 2] > 100

    IF TempBad = TRUE AND PulseBad = TRUE THEN
        Status <- "Severe warning: pulse and temperature"
    ELSEIF PulseBad = TRUE THEN
        Status <- "Warning: pulse"
    ELSEIF TempBad = TRUE THEN
        Status <- "Warning: temperature"
    ELSE
        Status <- "Normal"
    ENDIF

    OUTPUT Patient[Index] & ": " & Status
NEXT Index`,
    solutionExplanation: 'A 2D array of readings sits beside a 1D name list — the same index joins them. Two BOOLEAN flags turn the four exam outcomes (normal / one warning / the other warning / severe) into a short IF/ELSEIF chain.',
    testCases: [
      { inputs: ['Amal', 'Ben', 'Chen', '36.5', '72', '36.8', '110', '38.0', '55'], expectedOutput: 'Amal: Normal\nBen: Warning: pulse\nChen: Severe warning: pulse and temperature', description: 'One of each outcome', sortOrder: 0 },
      { inputs: ['Dee', 'Eli', 'Fay', '36.1', '60', '37.2', '100', '36.0', '80'], expectedOutput: 'Dee: Normal\nEli: Normal\nFay: Warning: temperature', description: 'Inclusive boundaries', sortOrder: 1 },
      { inputs: ['Gus', 'Hana', 'Ivy', '37.3', '80', '36.5', '59', '36.5', '101'], expectedOutput: 'Gus: Warning: temperature\nHana: Warning: pulse\nIvy: Warning: pulse', description: 'Just outside each bound', sortOrder: 2, isHidden: true },
      { inputs: ['Jo', 'Kai', 'Liv', '35.0', '50', '39.0', '130', '36.8', '72'], expectedOutput: 'Jo: Severe warning: pulse and temperature\nKai: Severe warning: pulse and temperature\nLiv: Normal', description: 'Two severe, one normal', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'League Points from a Results Grid',
    description: `A 1D array \`Teams[1:3]\` stores team names. A 2D array \`Results[1:3, 1:3]\` stores, for each team, games won (column 1), drawn (column 2) and lost (column 3).

Points: 3 for a win, 1 for a draw, 0 for a loss. Read the three names and nine result counts. Output each team's name and points, then the name of the team with the highest points (the earlier team wins a tie).

Inspired by Cambridge IGCSE (0478) May/June 2024 Paper 23 Question 9, reduced to 3 teams.

**Input:** 3 names, then 9 integers (won, drawn, lost for each team).
**Output:** Three \`<name> <points>\` lines, then \`Winner: <name>\`.

**Example:**
\`\`\`
Input:  Lions
        Tigers
        Bears
        2
        1
        0
        1
        1
        1
        0
        2
        1
Output: Lions 7
        Tigers 4
        Bears 2
        Winner: Lions
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'May/June 2024', 'Paper 23', 'Past Paper', 'Unseen', '2D Arrays', 'Parallel Arrays', 'Totalling'],
    year: 2024,
    session: 'May/June',
    variant: 3,
    paper: '0478/23',
    questionNumber: 9,
    marks: 10,
    starterCode: `DECLARE Teams : ARRAY[1:3] OF STRING
DECLARE Results : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Index, Points, BestPoints, BestIndex : INTEGER

FOR Index <- 1 TO 3
    INPUT Teams[Index]
NEXT Index

FOR Index <- 1 TO 3
    INPUT Results[Index, 1]
    INPUT Results[Index, 2]
    INPUT Results[Index, 3]
NEXT Index

// Points = 3 * won + 1 * drawn. Output each team, then the winner.`,
    hints: [
      'Results[Index, 1] is wins and Results[Index, 2] is draws — losses do not add points.',
      'Points <- 3 * Results[Index, 1] + Results[Index, 2]',
      'Update BestIndex only when Points > BestPoints so the first team keeps a tie.',
    ],
    solution: `DECLARE Teams : ARRAY[1:3] OF STRING
DECLARE Results : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Index, Points, BestPoints, BestIndex : INTEGER

FOR Index <- 1 TO 3
    INPUT Teams[Index]
NEXT Index

FOR Index <- 1 TO 3
    INPUT Results[Index, 1]
    INPUT Results[Index, 2]
    INPUT Results[Index, 3]
NEXT Index

BestPoints <- -1
BestIndex <- 1

FOR Index <- 1 TO 3
    Points <- 3 * Results[Index, 1] + Results[Index, 2]
    OUTPUT Teams[Index] & " " & Points

    IF Points > BestPoints THEN
        BestPoints <- Points
        BestIndex <- Index
    ENDIF
NEXT Index

OUTPUT "Winner: " & Teams[BestIndex]`,
    solutionExplanation: 'Each team occupies one row of Results. Column 1 (wins) is worth 3 points and column 2 (draws) is worth 1; column 3 is stored because that is how the exam table is laid out, but it does not affect the total. A strict greater-than keeps the first team on a points tie.',
    testCases: [
      { inputs: ['Lions', 'Tigers', 'Bears', '2', '1', '0', '1', '1', '1', '0', '2', '1'], expectedOutput: 'Lions 7\nTigers 4\nBears 2\nWinner: Lions', description: 'Clear winner', sortOrder: 0 },
      { inputs: ['Red', 'Blue', 'Green', '0', '0', '3', '0', '0', '3', '0', '0', '3'], expectedOutput: 'Red 0\nBlue 0\nGreen 0\nWinner: Red', description: 'All lost; first team wins the tie', sortOrder: 1 },
      { inputs: ['AFC', 'BFC', 'CFC', '1', '0', '2', '0', '3', '0', '0', '0', '3'], expectedOutput: 'AFC 3\nBFC 3\nCFC 0\nWinner: AFC', description: 'Win-total ties with three draws', sortOrder: 2, isHidden: true },
      { inputs: ['Utd', 'City', 'Town', '0', '1', '2', '3', '0', '0', '2', '2', '0'], expectedOutput: 'Utd 1\nCity 9\nTown 8\nWinner: City', description: 'Three wins beats two wins and two draws', sortOrder: 3, isHidden: true },
    ],
  },

  // ══════════════════════════════════════════════ PROCEDURES & FUNCTIONS ═══

  {
    title: 'Greet By Name Procedure',
    description: `Write procedure \`Greet(Name)\` that outputs \`Hello, <Name>!\`. The main program reads a name and calls the procedure.

**Input:** One name.
**Output:** The greeting line.

**Example:**
\`\`\`
Input:  Maya
Output: Hello, Maya!
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Procedures & Functions',
    tags: ['IGCSE', '0478', 'Original Practice', 'Procedures', 'Parameters'],
    marks: 4,
    starterCode: `PROCEDURE Greet(Name : STRING)
    // Output Hello, <Name>!
ENDPROCEDURE

DECLARE Person : STRING
INPUT Person
CALL Greet(Person)`,
    hints: [
      'A procedure does not RETURN a value — it just performs an action, here OUTPUT.',
      'Use CALL Greet(Person) in the main program after INPUT.',
      'OUTPUT "Hello, ", Name, "!" concatenates the three pieces with no extra spaces.',
    ],
    solution: `PROCEDURE Greet(Name : STRING)
    OUTPUT "Hello, ", Name, "!"
ENDPROCEDURE

DECLARE Person : STRING
INPUT Person
CALL Greet(Person)`,
    solutionExplanation: 'The parameter Name is a local copy of the value passed in. CALL runs the procedure, which writes the formatted greeting.',
    testCases: [
      { inputs: ['Maya'], expectedOutput: 'Hello, Maya!', description: 'Typical name', sortOrder: 0 },
      { inputs: ['Omar'], expectedOutput: 'Hello, Omar!', description: 'Another name', sortOrder: 1 },
      { inputs: ['A'], expectedOutput: 'Hello, A!', description: 'Single letter', sortOrder: 2, isHidden: true },
      { inputs: ['Ann-Marie'], expectedOutput: 'Hello, Ann-Marie!', description: 'Hyphenated name', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Times Table Procedure',
    description: `Write procedure \`TimesTable(N)\` that outputs the 1-to-5 times table for N, one line per multiplier, in the form \`<N> x <k> = <product>\`.

**Input:** One integer N.
**Output:** Five lines.

**Example:**
\`\`\`
Input:  3
Output: 3 x 1 = 3
        3 x 2 = 6
        3 x 3 = 9
        3 x 4 = 12
        3 x 5 = 15
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Procedures & Functions',
    tags: ['IGCSE', '0478', 'Original Practice', 'Procedures', 'Loops', 'Parameters'],
    marks: 5,
    starterCode: `PROCEDURE TimesTable(N : INTEGER)
    // Output N x 1 = ... through N x 5 = ...
ENDPROCEDURE

DECLARE Number : INTEGER
INPUT Number
CALL TimesTable(Number)`,
    hints: [
      'Loop k from 1 TO 5 inside the procedure.',
      'The product is N * k.',
      'Build each line with & so the spaces around x and = are part of the string literals.',
    ],
    solution: `PROCEDURE TimesTable(N : INTEGER)
    DECLARE k : INTEGER
    FOR k <- 1 TO 5
        OUTPUT N & " x " & k & " = " & (N * k)
    NEXT k
ENDPROCEDURE

DECLARE Number : INTEGER
INPUT Number
CALL TimesTable(Number)`,
    solutionExplanation: 'The procedure owns the loop. N is passed in once, then each line is built from N, the multiplier, and their product.',
    testCases: [
      { inputs: ['3'], expectedOutput: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15', description: '3 times table', sortOrder: 0 },
      { inputs: ['1'], expectedOutput: '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5', description: '1 times table', sortOrder: 1 },
      { inputs: ['10'], expectedOutput: '10 x 1 = 10\n10 x 2 = 20\n10 x 3 = 30\n10 x 4 = 40\n10 x 5 = 50', description: '10 times table', sortOrder: 2, isHidden: true },
      { inputs: ['0'], expectedOutput: '0 x 1 = 0\n0 x 2 = 0\n0 x 3 = 0\n0 x 4 = 0\n0 x 5 = 0', description: 'Zero times table', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'In-Range Function',
    description: `Write function \`InRange(Value, Low, High)\` that returns \`TRUE\` if Value is between Low and High inclusive, otherwise \`FALSE\`.

The main program reads three integers and outputs the function result.

**Input:** Value, then Low, then High.
**Output:** \`TRUE\` or \`FALSE\`.

**Example:**
\`\`\`
Input:  7
        1
        10
Output: TRUE
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Procedures & Functions',
    tags: ['IGCSE', '0478', 'Original Practice', 'Functions', 'BOOLEAN', 'Validation'],
    marks: 5,
    starterCode: `FUNCTION InRange(Value : INTEGER, Low : INTEGER, High : INTEGER) RETURNS BOOLEAN
    // Return TRUE if Value is between Low and High inclusive
ENDFUNCTION

DECLARE Value, Low, High : INTEGER
INPUT Value
INPUT Low
INPUT High
OUTPUT InRange(Value, Low, High)`,
    hints: [
      'Inclusive means Low and High themselves are allowed.',
      'The condition is Value >= Low AND Value <= High.',
      'RETURN TRUE or RETURN FALSE from inside the function — do not OUTPUT there.',
    ],
    solution: `FUNCTION InRange(Value : INTEGER, Low : INTEGER, High : INTEGER) RETURNS BOOLEAN
    IF Value >= Low AND Value <= High THEN
        RETURN TRUE
    ELSE
        RETURN FALSE
    ENDIF
ENDFUNCTION

DECLARE Value, Low, High : INTEGER
INPUT Value
INPUT Low
INPUT High
OUTPUT InRange(Value, Low, High)`,
    solutionExplanation: 'A function returns a value the caller can OUTPUT or use in a condition. Inclusive range checks use >= and <= so the boundaries count as in range.',
    testCases: [
      { inputs: ['7', '1', '10'], expectedOutput: 'TRUE', description: 'Inside the range', sortOrder: 0 },
      { inputs: ['0', '1', '10'], expectedOutput: 'FALSE', description: 'Below the range', sortOrder: 1 },
      { inputs: ['1', '1', '10'], expectedOutput: 'TRUE', description: 'Low boundary', sortOrder: 2, isHidden: true },
      { inputs: ['10', '1', '10'], expectedOutput: 'TRUE', description: 'High boundary', sortOrder: 3, isHidden: true },
      { inputs: ['11', '1', '10'], expectedOutput: 'FALSE', description: 'Above the range', sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'AddOn BYREF Accumulator',
    description: `Write procedure \`AddOn(BYREF Total, BYVAL Amount)\` that adds Amount onto Total. Because \`Total\` is passed \`BYREF\`, the caller's variable must change.

The main program reads a starting total and how many amounts to add, then reads that many amounts, calling \`AddOn\` each time. Output the final total.

**Input:** Start, count, then that many integers.
**Output:** The accumulated total.

**Example:**
\`\`\`
Input:  10
        3
        4
        5
        6
Output: 25
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Procedures & Functions',
    tags: ['AS & A Level', '9618', 'Original Practice', 'Procedures', 'BYREF', 'BYVAL', 'Parameters'],
    marks: 6,
    starterCode: `PROCEDURE AddOn(BYREF Total : INTEGER, BYVAL Amount : INTEGER)
    // Add Amount onto Total
ENDPROCEDURE

DECLARE Total, Count, Index, Amount : INTEGER
INPUT Total
INPUT Count
FOR Index <- 1 TO Count
    INPUT Amount
    CALL AddOn(Total, Amount)
NEXT Index
OUTPUT Total`,
    hints: [
      'BYREF Total means assignments to Total change the caller\'s variable.',
      'BYVAL Amount is a copy — changing it would not matter here, and we do not change it.',
      'The body is a single assignment: Total <- Total + Amount.',
    ],
    solution: `PROCEDURE AddOn(BYREF Total : INTEGER, BYVAL Amount : INTEGER)
    Total <- Total + Amount
ENDPROCEDURE

DECLARE Total, Count, Index, Amount : INTEGER
INPUT Total
INPUT Count
FOR Index <- 1 TO Count
    INPUT Amount
    CALL AddOn(Total, Amount)
NEXT Index
OUTPUT Total`,
    solutionExplanation: 'Without BYREF the procedure would only update a local copy and OUTPUT Total would still show the start value. BYVAL on Amount makes the switch back from the sticky BYREF explicit.',
    testCases: [
      { inputs: ['10', '3', '4', '5', '6'], expectedOutput: '25', description: 'Three additions', sortOrder: 0 },
      { inputs: ['0', '1', '8'], expectedOutput: '8', description: 'One addition from zero', sortOrder: 1 },
      { inputs: ['20', '2', '-5', '-7'], expectedOutput: '8', description: 'Negative amounts subtract', sortOrder: 2, isHidden: true },
      { inputs: ['5', '4', '0', '0', '0', '0'], expectedOutput: '5', description: 'Adding zeros leaves the start value', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Count Letter Function',
    description: `Write function \`CountLetter(Text, Target)\` that returns how many times the character \`Target\` appears in \`Text\`. The check must be **case-insensitive** (\`A\` and \`a\` both count).

**Input:** A string, then a single-character string.
**Output:** The count.

**Example:**
\`\`\`
Input:  Banana
        a
Output: 3
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Procedures & Functions',
    tags: ['IGCSE', '0478', 'Original Practice', 'Functions', 'String Processing', 'Counting'],
    marks: 7,
    starterCode: `FUNCTION CountLetter(Text : STRING, Target : STRING) RETURNS INTEGER
    // Count case-insensitive occurrences of Target in Text
ENDFUNCTION

DECLARE Text, Target : STRING
INPUT Text
INPUT Target
OUTPUT CountLetter(Text, Target)`,
    hints: [
      'UCASE both the current character and Target so A and a match.',
      'Loop Index from 1 TO LENGTH(Text) and use SUBSTRING(Text, Index, 1).',
      'Add 1 to a running Count whenever the uppercase characters are equal, then RETURN Count.',
    ],
    solution: `FUNCTION CountLetter(Text : STRING, Target : STRING) RETURNS INTEGER
    DECLARE Index, Count : INTEGER
    DECLARE Ch : STRING

    Count <- 0
    FOR Index <- 1 TO LENGTH(Text)
        Ch <- UCASE(SUBSTRING(Text, Index, 1))
        IF Ch = UCASE(Target) THEN
            Count <- Count + 1
        ENDIF
    NEXT Index

    RETURN Count
ENDFUNCTION

DECLARE Text, Target : STRING
INPUT Text
INPUT Target
OUTPUT CountLetter(Text, Target)`,
    solutionExplanation: 'UCASE on both sides makes the comparison case-insensitive. The function returns the count so the main program can OUTPUT it (or reuse it later).',
    testCases: [
      { inputs: ['Banana', 'a'], expectedOutput: '3', description: 'Three a/A letters', sortOrder: 0 },
      { inputs: ['Banana', 'A'], expectedOutput: '3', description: 'Uppercase target still matches', sortOrder: 1 },
      { inputs: ['xyz', 'a'], expectedOutput: '0', description: 'No matches', sortOrder: 2, isHidden: true },
      { inputs: ['MISSISSIPPI', 's'], expectedOutput: '4', description: 'Repeated letter', sortOrder: 3, isHidden: true },
    ],
  },

  // ══════════════════════════════════════════════════ FILE HANDLING ═══

  {
    title: 'Search a Product File',
    description: `The file \`products.txt\` already contains one product name per line. Read a search term from the user and output \`Found\` if that name appears in the file (ignore case), otherwise \`Not found\`.

**Input:** One product name.
**Output:** \`Found\` or \`Not found\`.

**Example:**
\`\`\`
Input:  pencil
Output: Found
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'File Handling',
    tags: ['IGCSE', '0478', 'Original Practice', 'File Handling', 'Linear Search', 'EOF Loop'],
    marks: 7,
    starterCode: `DECLARE Search, Line : STRING
DECLARE Found : BOOLEAN

INPUT Search

// Open products.txt FOR READ, search for Search ignoring case, then CLOSEFILE`,
    hints: [
      'Open FOR READ, then loop WHILE NOT EOF("products.txt").',
      'Compare UCASE(Line) with UCASE(Search) so Pencil and pencil both match.',
      'Set a BOOLEAN Found flag; do not stop the loop early — just remember a match, then CLOSEFILE.',
    ],
    solution: `DECLARE Search, Line : STRING
DECLARE Found : BOOLEAN

INPUT Search
Found <- FALSE

OPENFILE "products.txt" FOR READ
WHILE NOT EOF("products.txt") DO
    READFILE "products.txt", Line
    IF UCASE(Line) = UCASE(Search) THEN
        Found <- TRUE
    ENDIF
ENDWHILE
CLOSEFILE "products.txt"

IF Found = TRUE THEN
    OUTPUT "Found"
ELSE
    OUTPUT "Not found"
ENDIF`,
    solutionExplanation: 'A sequential file is searched with READFILE inside an EOF loop. UCASE on both strings makes the match case-insensitive, which is how exam name-lookups are usually marked.',
    testCases: [
      {
        inputs: ['pencil'],
        expectedOutput: 'Found',
        description: 'Match ignoring case',
        sortOrder: 0,
        initialFiles: JSON.stringify({ 'products.txt': 'Pen\nPencil\nRuler' }),
      },
      {
        inputs: ['Book'],
        expectedOutput: 'Not found',
        description: 'Missing product',
        sortOrder: 1,
        initialFiles: JSON.stringify({ 'products.txt': 'Pen\nPencil\nRuler' }),
      },
      {
        inputs: ['Pen'],
        expectedOutput: 'Found',
        description: 'First line, exact case',
        sortOrder: 2,
        isHidden: true,
        initialFiles: JSON.stringify({ 'products.txt': 'Pen\nPencil\nRuler' }),
      },
      {
        inputs: ['eraser'],
        expectedOutput: 'Found',
        description: 'Last line, different case',
        sortOrder: 3,
        isHidden: true,
        initialFiles: JSON.stringify({ 'products.txt': 'Pen\nPencil\nEraser' }),
      },
    ],
  },

  {
    title: 'Append a Visitor to the Log',
    description: `The file \`visitors.txt\` already has some names, one per line. Read one new name, **append** it to the file, then read the whole file back and output every name.

**Input:** One name.
**Output:** All names in the file after appending, one per line.

**Example:**
\`\`\`
Input:  Chen
Output: Ali
        Ben
        Chen
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'File Handling',
    tags: ['IGCSE', '0478', 'Original Practice', 'File Handling', 'APPEND', 'EOF Loop'],
    marks: 8,
    starterCode: `DECLARE Name : STRING
INPUT Name

// OPENFILE visitors.txt FOR APPEND, write Name, close, then reopen FOR READ and output every line`,
    hints: [
      'FOR APPEND adds lines without wiping the names already in the file. FOR WRITE would overwrite them.',
      'Always CLOSEFILE before opening the same file in a different mode.',
      'The second phase is a standard WHILE NOT EOF read loop.',
    ],
    solution: `DECLARE Name : STRING
INPUT Name

OPENFILE "visitors.txt" FOR APPEND
WRITEFILE "visitors.txt", Name
CLOSEFILE "visitors.txt"

OPENFILE "visitors.txt" FOR READ
WHILE NOT EOF("visitors.txt") DO
    READFILE "visitors.txt", Name
    OUTPUT Name
ENDWHILE
CLOSEFILE "visitors.txt"`,
    solutionExplanation: 'APPEND extends an existing file. Closing between the two OPENFILE calls is required so the read starts at the beginning of the updated file.',
    testCases: [
      {
        inputs: ['Chen'],
        expectedOutput: 'Ali\nBen\nChen',
        description: 'Append a third name',
        sortOrder: 0,
        initialFiles: JSON.stringify({ 'visitors.txt': 'Ali\nBen' }),
      },
      {
        inputs: ['Zara'],
        expectedOutput: 'Maya\nZara',
        description: 'Append to a single existing name',
        sortOrder: 1,
        initialFiles: JSON.stringify({ 'visitors.txt': 'Maya' }),
      },
      {
        inputs: ['Omar'],
        expectedOutput: 'Jo\nKai\nLiv\nOmar',
        description: 'Append to three existing names',
        sortOrder: 2,
        isHidden: true,
        initialFiles: JSON.stringify({ 'visitors.txt': 'Jo\nKai\nLiv' }),
      },
      {
        inputs: ['Ann'],
        expectedOutput: 'Ann',
        description: 'Append to an empty file',
        sortOrder: 3,
        isHidden: true,
        initialFiles: JSON.stringify({ 'visitors.txt': '' }),
      },
    ],
  },

  {
    title: 'Filter Pass Marks to a File',
    description: `The file \`marks.txt\` contains integer marks, one per line. Copy every mark that is 50 or more into a new file \`pass.txt\`. Then output \`Passes: <count>\` followed by each passing mark (read back from \`pass.txt\`).

**Input:** None (data is already in the file).
**Output:** The pass count, then each passing mark.

**Example:**
\`\`\`
Output: Passes: 3
        50
        72
        90
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'File Handling',
    tags: ['IGCSE', '0478', 'Original Practice', 'File Handling', 'Filtering', 'WRITEFILE'],
    marks: 10,
    starterCode: `DECLARE Line : STRING
DECLARE Mark, PassCount : INTEGER

// Read marks.txt, write passes to pass.txt, then output the count and the pass file`,
    hints: [
      'You need two files open at once in the first phase: marks.txt FOR READ and pass.txt FOR WRITE.',
      'Convert each line with INT(STRING_TO_NUM(Line)) before comparing with 50.',
      'Close both files, then reopen pass.txt FOR READ to output the saved marks.',
    ],
    solution: `DECLARE Line : STRING
DECLARE Mark, PassCount : INTEGER

PassCount <- 0
OPENFILE "marks.txt" FOR READ
OPENFILE "pass.txt" FOR WRITE
WHILE NOT EOF("marks.txt") DO
    READFILE "marks.txt", Line
    Mark <- INT(STRING_TO_NUM(Line))
    IF Mark >= 50 THEN
        WRITEFILE "pass.txt", Line
        PassCount <- PassCount + 1
    ENDIF
ENDWHILE
CLOSEFILE "marks.txt"
CLOSEFILE "pass.txt"

OUTPUT "Passes: " & PassCount

OPENFILE "pass.txt" FOR READ
WHILE NOT EOF("pass.txt") DO
    READFILE "pass.txt", Line
    OUTPUT Line
ENDWHILE
CLOSEFILE "pass.txt"`,
    solutionExplanation: 'A filter copies a subset of records to a second file. STRING_TO_NUM (then INT) turns the stored text into a number so the 50-or-more test works. Reading pass.txt back proves the write succeeded.',
    testCases: [
      {
        inputs: [],
        expectedOutput: 'Passes: 3\n50\n72\n90',
        description: 'Three passes including the boundary 50',
        sortOrder: 0,
        initialFiles: JSON.stringify({ 'marks.txt': '45\n50\n72\n33\n90' }),
      },
      {
        inputs: [],
        expectedOutput: 'Passes: 0',
        description: 'No mark reaches 50',
        sortOrder: 1,
        initialFiles: JSON.stringify({ 'marks.txt': '0\n20\n49' }),
      },
      {
        inputs: [],
        expectedOutput: 'Passes: 2\n100\n50',
        description: 'All but one pass',
        sortOrder: 2,
        isHidden: true,
        initialFiles: JSON.stringify({ 'marks.txt': '100\n49\n50' }),
      },
      {
        inputs: [],
        expectedOutput: 'Passes: 1\n50',
        description: 'Single passing mark',
        sortOrder: 3,
        isHidden: true,
        initialFiles: JSON.stringify({ 'marks.txt': '50' }),
      },
    ],
  },

  {
    title: 'Highest Score in a Results File',
    description: `The file \`results.txt\` stores student records as **pairs of lines**: name, then integer mark, repeating to the end of the file. Output the name of the student with the highest mark and their mark on the next line. If marks tie, keep the student who appears first in the file.

**Input:** None (data is already in the file).
**Output:** Name, then mark.

**Example:**
\`\`\`
Output: Ben
        88
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'File Handling',
    tags: ['AS & A Level', '9618', 'Original Practice', 'File Handling', 'Max/Min', 'EOF Loop'],
    marks: 8,
    starterCode: `DECLARE Name, BestName, MarkText : STRING
DECLARE Mark, BestMark : INTEGER

// Read name/mark pairs from results.txt and remember the highest mark`,
    hints: [
      'Each iteration of the EOF loop must READFILE twice: once for the name, once for the mark line.',
      'Convert the mark line with INT(STRING_TO_NUM(MarkText)).',
      'Use Mark > BestMark (not >=) so an earlier student keeps a tie. Initialise BestMark to -1.',
    ],
    solution: `DECLARE Name, BestName, MarkText : STRING
DECLARE Mark, BestMark : INTEGER

BestMark <- -1
BestName <- ""

OPENFILE "results.txt" FOR READ
WHILE NOT EOF("results.txt") DO
    READFILE "results.txt", Name
    READFILE "results.txt", MarkText
    Mark <- INT(STRING_TO_NUM(MarkText))
    IF Mark > BestMark THEN
        BestMark <- Mark
        BestName <- Name
    ENDIF
ENDWHILE
CLOSEFILE "results.txt"

OUTPUT BestName
OUTPUT BestMark`,
    solutionExplanation: 'Sequential files often store records as groups of lines. Reading two lines per loop keeps name and mark together. A strict greater-than preserves the first student when marks are equal.',
    testCases: [
      {
        inputs: [],
        expectedOutput: 'Ben\n88',
        description: 'Middle student highest',
        sortOrder: 0,
        initialFiles: JSON.stringify({ 'results.txt': 'Amal\n71\nBen\n88\nChen\n79' }),
      },
      {
        inputs: [],
        expectedOutput: 'Amal\n95',
        description: 'First student highest',
        sortOrder: 1,
        initialFiles: JSON.stringify({ 'results.txt': 'Amal\n95\nBen\n80\nChen\n90' }),
      },
      {
        inputs: [],
        expectedOutput: 'Eli\n70',
        description: 'Earlier student wins a tie',
        sortOrder: 2,
        isHidden: true,
        initialFiles: JSON.stringify({ 'results.txt': 'Dee\n60\nEli\n70\nFay\n70' }),
      },
      {
        inputs: [],
        expectedOutput: 'Ivy\n0',
        description: 'Zero is still the maximum',
        sortOrder: 3,
        isHidden: true,
        initialFiles: JSON.stringify({ 'results.txt': 'Gia\n-2\nHao\n-1\nIvy\n0' }),
      },
    ],
  },

  // ════════════════════════════════════════════════════ 9618 OOP ═══

  {
    title: 'Book Class Catalogue Card',
    description: `Declare class \`Book\` with private attributes \`Title\`, \`Author\` and \`Year\`. Write the constructor \`NEW\` and getter methods. Procedure \`PrintBook(Item)\` must output \`<Title> by <Author> (<Year>)\`.

The test harness reads one book and calls \`PrintBook\`.

**Input:** Title, author, year.
**Output:** One formatted line.

**Example:**
\`\`\`
Input:  1984
        George Orwell
        1949
Output: 1984 by George Orwell (1949)
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Object-Oriented Programming',
    tags: ['AS & A Level', '9618', 'Original Practice', 'OOP', 'Classes', 'Getters', 'Encapsulation'],
    marks: 10,
    starterCode: `CLASS Book
    // Private Title, Author, Year — constructor and getters
ENDCLASS

PROCEDURE PrintBook(Item : Book)
    // Output Title by Author (Year)
ENDPROCEDURE

DECLARE Title, Author : STRING
DECLARE Year : INTEGER
INPUT Title
INPUT Author
INPUT Year
MyBook <- NEW Book(Title, Author, Year)
CALL PrintBook(MyBook)`,
    hints: [
      'Declare fields with PRIVATE FieldName : Type inside CLASS.',
      'The constructor is PUBLIC PROCEDURE NEW(...) and stores each parameter in the matching field.',
      'PrintBook must use getters such as Item.GetTitle() — it cannot read private fields directly.',
    ],
    solution: `CLASS Book
    PRIVATE Title : STRING
    PRIVATE Author : STRING
    PRIVATE Year : INTEGER

    PUBLIC PROCEDURE NEW(T : STRING, A : STRING, Y : INTEGER)
        Title <- T
        Author <- A
        Year <- Y
    ENDPROCEDURE

    PUBLIC FUNCTION GetTitle() RETURNS STRING
        RETURN Title
    ENDFUNCTION

    PUBLIC FUNCTION GetAuthor() RETURNS STRING
        RETURN Author
    ENDFUNCTION

    PUBLIC FUNCTION GetYear() RETURNS INTEGER
        RETURN Year
    ENDFUNCTION
ENDCLASS

PROCEDURE PrintBook(Item : Book)
    OUTPUT Item.GetTitle(), " by ", Item.GetAuthor(), " (", Item.GetYear(), ")"
ENDPROCEDURE

DECLARE Title, Author : STRING
DECLARE Year : INTEGER
INPUT Title
INPUT Author
INPUT Year
MyBook <- NEW Book(Title, Author, Year)
CALL PrintBook(MyBook)`,
    solutionExplanation: 'Private attributes plus public getters is encapsulation. PrintBook is a separate procedure that only talks to the object through those getters, which is how Paper 4 mark schemes usually wire a display routine.',
    testCases: [
      { inputs: ['1984', 'George Orwell', '1949'], expectedOutput: '1984 by George Orwell (1949)', description: 'Classic title', sortOrder: 0 },
      { inputs: ['Kindred', 'Octavia Butler', '1979'], expectedOutput: 'Kindred by Octavia Butler (1979)', description: 'Another book', sortOrder: 1 },
      { inputs: ['Beowulf', 'Unknown', '1000'], expectedOutput: 'Beowulf by Unknown (1000)', description: 'Anonymous author', sortOrder: 2, isHidden: true },
    ],
  },

  {
    title: 'Bank Account Encapsulation',
    description: `Declare class \`BankAccount\` with a private integer \`Balance\`.

- Constructor \`NEW(Start)\` stores the opening balance
- \`Deposit(Amount)\` adds Amount only when Amount > 0
- \`Withdraw(Amount)\` subtracts Amount only when Amount > 0 **and** Amount <= Balance
- \`GetBalance()\` returns the current balance

The test harness reads an opening balance, then N operations. Each operation is \`D\` (deposit) or \`W\` (withdraw) followed by an amount. Output the final balance.

**Input:** Start, N, then N pairs of operation and amount.
**Output:** One integer.

**Example:**
\`\`\`
Input:  100
        4
        D
        50
        W
        20
        D
        -5
        W
        1000
Output: 130
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Object-Oriented Programming',
    tags: ['AS & A Level', '9618', 'Original Practice', 'OOP', 'Classes', 'Encapsulation', 'Setters'],
    marks: 12,
    starterCode: `CLASS BankAccount
    // Private Balance, NEW, Deposit, Withdraw, GetBalance
ENDCLASS

DECLARE Start, Count, Index, Amount, Final : INTEGER
DECLARE Op : STRING
INPUT Start
Account <- NEW BankAccount(Start)
INPUT Count
FOR Index <- 1 TO Count
    INPUT Op
    INPUT Amount
    IF Op = "D" THEN
        CALL Account.Deposit(Amount)
    ELSE
        CALL Account.Withdraw(Amount)
    ENDIF
NEXT Index
Final <- Account.GetBalance()
OUTPUT Final`,
    hints: [
      'Balance must be PRIVATE — the main program is not allowed to say Account.Balance <- ...',
      'Deposit ignores Amount <= 0. Withdraw ignores Amount <= 0 and anything larger than Balance.',
      'GetBalance is a FUNCTION that RETURNS INTEGER.',
    ],
    solution: `CLASS BankAccount
    PRIVATE Balance : INTEGER

    PUBLIC PROCEDURE NEW(Start : INTEGER)
        Balance <- Start
    ENDPROCEDURE

    PUBLIC PROCEDURE Deposit(Amount : INTEGER)
        IF Amount > 0 THEN
            Balance <- Balance + Amount
        ENDIF
    ENDPROCEDURE

    PUBLIC PROCEDURE Withdraw(Amount : INTEGER)
        IF Amount > 0 AND Amount <= Balance THEN
            Balance <- Balance - Amount
        ENDIF
    ENDPROCEDURE

    PUBLIC FUNCTION GetBalance() RETURNS INTEGER
        RETURN Balance
    ENDFUNCTION
ENDCLASS

DECLARE Start, Count, Index, Amount, Final : INTEGER
DECLARE Op : STRING
INPUT Start
Account <- NEW BankAccount(Start)
INPUT Count
FOR Index <- 1 TO Count
    INPUT Op
    INPUT Amount
    IF Op = "D" THEN
        CALL Account.Deposit(Amount)
    ELSE
        CALL Account.Withdraw(Amount)
    ENDIF
NEXT Index
Final <- Account.GetBalance()
OUTPUT Final`,
    solutionExplanation: 'Encapsulation hides Balance so the only legal updates go through Deposit and Withdraw, which enforce the business rules. Rejected operations leave the balance unchanged.',
    testCases: [
      { inputs: ['100', '4', 'D', '50', 'W', '20', 'D', '-5', 'W', '1000'], expectedOutput: '130', description: 'Invalid deposit and overdraft ignored', sortOrder: 0 },
      { inputs: ['0', '1', 'D', '25'], expectedOutput: '25', description: 'Deposit into an empty account', sortOrder: 1 },
      { inputs: ['40', '2', 'W', '40', 'W', '1'], expectedOutput: '0', description: 'Exact withdraw allowed; next withdraw refused', sortOrder: 2, isHidden: true },
      { inputs: ['10', '3', 'D', '0', 'W', '0', 'D', '5'], expectedOutput: '15', description: 'Zero amounts ignored', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Manager Pay with Inheritance',
    description: `Class \`Employee\` stores private \`EmpName\` and \`Salary\`, with constructor \`NEW(N, S)\`, \`GetName()\` and \`GetSalary()\`.

Class \`Manager INHERITS Employee\` adds private \`Bonus\`. Its constructor must call \`SUPER.NEW(N, S)\` then store Bonus. Override \`GetPay()\` on both classes: an employee is paid Salary; a manager is paid Salary + Bonus.

The test harness reads name, salary and bonus, constructs a Manager, and outputs \`<name> earns <pay>\`.

**Input:** Name, salary, bonus.
**Output:** One formatted line.

**Example:**
\`\`\`
Input:  Asha
        40000
        5000
Output: Asha earns 45000
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Object-Oriented Programming',
    tags: ['AS & A Level', '9618', 'Original Practice', 'OOP', 'Inheritance', 'SUPER', 'Polymorphism'],
    marks: 12,
    starterCode: `CLASS Employee
    // Private EmpName and Salary, NEW, GetName, GetSalary, GetPay
ENDCLASS

CLASS Manager INHERITS Employee
    // Private Bonus, NEW calling SUPER.NEW, overridden GetPay
ENDCLASS

DECLARE Name : STRING
DECLARE Salary, Bonus : INTEGER
INPUT Name
INPUT Salary
INPUT Bonus
Boss <- NEW Manager(Name, Salary, Bonus)
OUTPUT Boss.GetName(), " earns ", Boss.GetPay()`,
    hints: [
      'Manager\'s constructor should call SUPER.NEW(N, S) before Bonus <- B.',
      'Salary is private in Employee, so Manager.GetPay cannot read it directly — use GetSalary().',
      'Employee.GetPay returns Salary; Manager.GetPay returns GetSalary() + Bonus.',
    ],
    solution: `CLASS Employee
    PRIVATE EmpName : STRING
    PRIVATE Salary : INTEGER

    PUBLIC PROCEDURE NEW(N : STRING, S : INTEGER)
        EmpName <- N
        Salary <- S
    ENDPROCEDURE

    PUBLIC FUNCTION GetName() RETURNS STRING
        RETURN EmpName
    ENDFUNCTION

    PUBLIC FUNCTION GetSalary() RETURNS INTEGER
        RETURN Salary
    ENDFUNCTION

    PUBLIC FUNCTION GetPay() RETURNS INTEGER
        RETURN Salary
    ENDFUNCTION
ENDCLASS

CLASS Manager INHERITS Employee
    PRIVATE Bonus : INTEGER

    PUBLIC PROCEDURE NEW(N : STRING, S : INTEGER, B : INTEGER)
        SUPER.NEW(N, S)
        Bonus <- B
    ENDPROCEDURE

    PUBLIC FUNCTION GetPay() RETURNS INTEGER
        RETURN GetSalary() + Bonus
    ENDFUNCTION
ENDCLASS

DECLARE Name : STRING
DECLARE Salary, Bonus : INTEGER
INPUT Name
INPUT Salary
INPUT Bonus
Boss <- NEW Manager(Name, Salary, Bonus)
OUTPUT Boss.GetName(), " earns ", Boss.GetPay()`,
    solutionExplanation: 'INHERITS copies the parent attributes and methods. SUPER.NEW sets the inherited fields; the subclass only initialises Bonus. GetPay is overridden so a Manager object answers with salary plus bonus while still using the inherited GetName / GetSalary getters.',
    testCases: [
      { inputs: ['Asha', '40000', '5000'], expectedOutput: 'Asha earns 45000', description: 'Typical manager pay', sortOrder: 0 },
      { inputs: ['Ben', '30000', '0'], expectedOutput: 'Ben earns 30000', description: 'Zero bonus', sortOrder: 1 },
      { inputs: ['Cara', '0', '1200'], expectedOutput: 'Cara earns 1200', description: 'Bonus-only pay', sortOrder: 2, isHidden: true },
      { inputs: ['Drew', '25000', '25000'], expectedOutput: 'Drew earns 50000', description: 'Bonus equals salary', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Quiz Item Loaded from a File',
    description: `Declare class \`QuizItem\` with private \`Question\`, \`Answer\` and \`Points\`. Write \`NEW\`, \`GetQuestion()\` and \`CheckAnswer(Guess)\` which returns \`TRUE\` when Guess matches Answer exactly.

The file \`quiz.txt\` stores three items as repeating triples of lines: question, answer, points. Load the three objects, then read a choice 1–3 and a guess. Output the chosen question, then \`Correct\` or \`Wrong\`.

Inspired by Cambridge International AS & A Level Computer Science (9618) May/June 2021 Paper 42 TreasureChest (class + file load), rewritten as an original auto-gradable task.

**Input:** Choice (1, 2 or 3), then a guess.
**Output:** The question text, then Correct or Wrong.

**Example:**
\`\`\`
Input:  2
        Paris
Output: Capital of France
        Correct
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Object-Oriented Programming',
    tags: ['AS & A Level', '9618', 'May/June 2021', 'Paper 42', 'Past Paper', 'Unseen', 'OOP', 'Classes', 'File Handling'],
    year: 2021,
    session: 'May/June',
    variant: 2,
    paper: '9618/42',
    questionNumber: 3,
    marks: 15,
    starterCode: `CLASS QuizItem
    // Private Question, Answer, Points — NEW, GetQuestion, CheckAnswer
ENDCLASS

DECLARE QText, AText, PText : STRING
DECLARE Points : INTEGER
DECLARE Q1, Q2, Q3, Chosen : QuizItem

// Read three items from quiz.txt, then mark the chosen guess`,
    hints: [
      'Each item is three READFILE calls: question, answer, points. Convert points with INT(STRING_TO_NUM(PText)).',
      'CheckAnswer should RETURN Guess = Answer.',
      'After loading, INPUT Choice and Guess, pick Q1/Q2/Q3, OUTPUT GetQuestion(), then Correct or Wrong.',
    ],
    solution: `CLASS QuizItem
    PRIVATE Question : STRING
    PRIVATE Answer : STRING
    PRIVATE Points : INTEGER

    PUBLIC PROCEDURE NEW(Q : STRING, A : STRING, P : INTEGER)
        Question <- Q
        Answer <- A
        Points <- P
    ENDPROCEDURE

    PUBLIC FUNCTION GetQuestion() RETURNS STRING
        RETURN Question
    ENDFUNCTION

    PUBLIC FUNCTION CheckAnswer(Guess : STRING) RETURNS BOOLEAN
        IF Guess = Answer THEN
            RETURN TRUE
        ELSE
            RETURN FALSE
        ENDIF
    ENDFUNCTION
ENDCLASS

DECLARE QText, AText, PText : STRING
DECLARE Points, Choice : INTEGER
DECLARE Guess : STRING
DECLARE Q1, Q2, Q3, Chosen : QuizItem

OPENFILE "quiz.txt" FOR READ
READFILE "quiz.txt", QText
READFILE "quiz.txt", AText
READFILE "quiz.txt", PText
Q1 <- NEW QuizItem(QText, AText, INT(STRING_TO_NUM(PText)))
READFILE "quiz.txt", QText
READFILE "quiz.txt", AText
READFILE "quiz.txt", PText
Q2 <- NEW QuizItem(QText, AText, INT(STRING_TO_NUM(PText)))
READFILE "quiz.txt", QText
READFILE "quiz.txt", AText
READFILE "quiz.txt", PText
Q3 <- NEW QuizItem(QText, AText, INT(STRING_TO_NUM(PText)))
CLOSEFILE "quiz.txt"

INPUT Choice
INPUT Guess

IF Choice = 1 THEN
    Chosen <- Q1
ELSEIF Choice = 2 THEN
    Chosen <- Q2
ELSE
    Chosen <- Q3
ENDIF

OUTPUT Chosen.GetQuestion()
IF Chosen.CheckAnswer(Guess) = TRUE THEN
    OUTPUT "Correct"
ELSE
    OUTPUT "Wrong"
ENDIF`,
    solutionExplanation: 'Paper 4 routinely loads objects from a text file: read the fields, construct the object, store it. CheckAnswer keeps the stored answer private so the main program only learns whether the guess was right.',
    testCases: [
      {
        inputs: ['2', 'Paris'],
        expectedOutput: 'Capital of France\nCorrect',
        description: 'Second item, exact match',
        sortOrder: 0,
        initialFiles: JSON.stringify({ 'quiz.txt': '2*2\n4\n10\nCapital of France\nParis\n5\n5+3\n8\n8' }),
      },
      {
        inputs: ['1', '5'],
        expectedOutput: '2*2\nWrong',
        description: 'Wrong guess on the first item',
        sortOrder: 1,
        initialFiles: JSON.stringify({ 'quiz.txt': '2*2\n4\n10\nCapital of France\nParis\n5\n5+3\n8\n8' }),
      },
      {
        inputs: ['3', '8'],
        expectedOutput: '5+3\nCorrect',
        description: 'Third item correct',
        sortOrder: 2,
        isHidden: true,
        initialFiles: JSON.stringify({ 'quiz.txt': '2*2\n4\n10\nCapital of France\nParis\n5\n5+3\n8\n8' }),
      },
      {
        inputs: ['2', 'paris'],
        expectedOutput: 'Capital of France\nWrong',
        description: 'Case-sensitive answer',
        sortOrder: 3,
        isHidden: true,
        initialFiles: JSON.stringify({ 'quiz.txt': '2*2\n4\n10\nCapital of France\nParis\n5\n5+3\n8\n8' }),
      },
    ],
  },
];
