// Original auto-gradable IGCSE (0478) Paper 2 practice covering sessions from
// 2024 onwards that were thin or missing in seed.ts. Questions train the same
// skills as those papers (validation, 2D arrays, 15-mark scenarios, bubble
// sort, counting/totalling) but are not verbatim past-paper text.

export const igcseRecentPaperQuestions = [

  // ════════════════════════════════════════ MAY/JUNE 2024 ═══

  {
    title: 'Product Code Format Check',
    description: `A shop's product codes must pass three checks, in this order:

1. The code is exactly 6 characters long.
2. The first two characters are \`SK\`.
3. The last four characters form an integer from 1000 to 9999 inclusive.

Keep reading a code until it passes all three checks. Output a specific error for the first check that fails, then output \`Accepted\` and the valid code.

**Input:** One or more product codes.
**Output:** An error line for each rejected code, then \`Accepted\` and the valid code.

**Example:**
\`\`\`
Input:  AB
        SK12AB
        SK1000
Output: Length must be 6
        Last four must be 1000 to 9999
        Accepted
        SK1000
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'Validation',
    tags: ['IGCSE', '0478', 'May/June 2024', 'Paper 22', 'Past Paper', 'Adapted', 'Validation', 'String Processing'],
    year: 2024,
    session: 'May/June',
    variant: 2,
    paper: '0478/22',
    questionNumber: 4,
    marks: 6,
    starterCode: `DECLARE Code : STRING
DECLARE Valid : BOOLEAN
DECLARE Pos : INTEGER
DECLARE Ch : STRING
DECLARE DigitsOk : BOOLEAN
DECLARE Num : INTEGER

// Repeat INPUT until the code passes length, prefix, and number checks`,
    hints: [
      'Check LENGTH(Code) = 6 first. Only if that passes, compare SUBSTRING(Code, 1, 2) with "SK".',
      'For the last four characters, confirm each one is between "0" and "9", then convert with STRING_TO_NUM.',
      'Set Valid <- FALSE and OUTPUT the matching error as soon as a check fails, then loop until Valid is TRUE.',
    ],
    solution: `DECLARE Code : STRING
DECLARE Valid : BOOLEAN
DECLARE Pos : INTEGER
DECLARE Ch : STRING
DECLARE DigitsOk : BOOLEAN
DECLARE Num : INTEGER

REPEAT
    INPUT Code
    Valid <- TRUE
    IF LENGTH(Code) <> 6 THEN
        OUTPUT "Length must be 6"
        Valid <- FALSE
    ELSE
        IF SUBSTRING(Code, 1, 2) <> "SK" THEN
            OUTPUT "Must start with SK"
            Valid <- FALSE
        ELSE
            DigitsOk <- TRUE
            FOR Pos <- 3 TO 6
                Ch <- SUBSTRING(Code, Pos, 1)
                IF Ch < "0" OR Ch > "9" THEN
                    DigitsOk <- FALSE
                ENDIF
            NEXT Pos
            IF NOT DigitsOk THEN
                OUTPUT "Last four must be 1000 to 9999"
                Valid <- FALSE
            ELSE
                Num <- STRING_TO_NUM(SUBSTRING(Code, 3, 4))
                IF Num < 1000 OR Num > 9999 THEN
                    OUTPUT "Last four must be 1000 to 9999"
                    Valid <- FALSE
                ENDIF
            ENDIF
        ENDIF
    ENDIF
UNTIL Valid

OUTPUT "Accepted"
OUTPUT Code`,
    solutionExplanation: 'The three rules are length, prefix, then numeric range — the same pattern Cambridge uses for format checks. Each failed rule prints its own message and forces another INPUT. STRING_TO_NUM is only called after every character in the last four positions is a digit, so invalid text cannot crash the conversion.',
    testCases: [
      { inputs: ['SK1000'], expectedOutput: 'Accepted\nSK1000', description: 'Already valid', sortOrder: 0 },
      { inputs: ['AB', 'SK12AB', 'SK1000'], expectedOutput: 'Length must be 6\nLast four must be 1000 to 9999\nAccepted\nSK1000', description: 'Length then digit-range errors', sortOrder: 1 },
      { inputs: ['XX1000', 'SK0999', 'SK9999'], expectedOutput: 'Must start with SK\nLast four must be 1000 to 9999\nAccepted\nSK9999', description: 'Prefix then leading-zero range error', sortOrder: 2, isHidden: true },
      { inputs: ['SKABCD', 'SK1500'], expectedOutput: 'Last four must be 1000 to 9999\nAccepted\nSK1500', description: 'Non-digit suffix', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Sentinel Total and High Count',
    description: `Read real numbers until the sentinel value \`9999.9\` is entered. The sentinel is not part of the data.

Output two lines: the total of the numbers entered, then how many of those numbers were greater than 100.

**Input:** One or more real numbers, ending with \`9999.9\`.
**Output:** The total, then the count of values greater than 100.

**Example:**
\`\`\`
Input:  10
        150
        9999.9
Output: 160
        1
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    tags: ['IGCSE', '0478', 'May/June 2024', 'Paper 22', 'Past Paper', 'Adapted', 'Totalling', 'Counting', 'Sentinel Loop'],
    year: 2024,
    session: 'May/June',
    variant: 2,
    paper: '0478/22',
    questionNumber: 6,
    marks: 8,
    starterCode: `DECLARE Value, Total : REAL
DECLARE CountOver : INTEGER

Total <- 0
CountOver <- 0

// Read values until 9999.9. Do not include the sentinel in the total.`,
    hints: [
      'INPUT the first Value before the loop, then WHILE Value <> 9999.9 DO process it and INPUT the next one.',
      'Add every non-sentinel value to Total. Only increase CountOver when Value > 100.',
      'OUTPUT Total on one line and CountOver on the next. Do not add 9999.9 into either result.',
    ],
    solution: `DECLARE Value, Total : REAL
DECLARE CountOver : INTEGER

Total <- 0
CountOver <- 0
INPUT Value
WHILE Value <> 9999.9 DO
    Total <- Total + Value
    IF Value > 100 THEN
        CountOver <- CountOver + 1
    ENDIF
    INPUT Value
ENDWHILE

OUTPUT Total
OUTPUT CountOver`,
    solutionExplanation: 'A pre-tested WHILE loop with a sentinel lets the user supply any number of values. The sentinel is read but never added or counted, which is the standard Cambridge totalling/counting pattern.',
    testCases: [
      { inputs: ['10', '150', '9999.9'], expectedOutput: '160\n1', description: 'One value above 100', sortOrder: 0 },
      { inputs: ['9999.9'], expectedOutput: '0\n0', description: 'Immediate sentinel', sortOrder: 1 },
      { inputs: ['100', '100.1', '50', '9999.9'], expectedOutput: '250.1\n1', description: '100 is not greater than 100', sortOrder: 2, isHidden: true },
      { inputs: ['200', '300', '400', '9999.9'], expectedOutput: '900\n3', description: 'Every value counts', sortOrder: 3, isHidden: true },
    ],
  },

  {
    title: 'Secret Cell Hunt',
    description: `A 5×5 grid stores one hidden flag \`"F"\`. The player starts at cell \`[1, 1]\` and has at most 10 successful moves.

Read the flag's row and column (not \`[1, 1]\`). Then read moves as \`L\`, \`R\`, \`U\`, or \`D\` (uppercase or lowercase). A move that would leave the grid, or any other character, is invalid: output \`Invalid move\` and do not count it.

After each successful move, check whether the player landed on the flag. Output \`You Win\` if they find it in 10 moves or fewer, otherwise \`You Lose\`.

**Input:** Flag row, flag column, then move letters.
**Output:** \`Invalid move\` for each rejected attempt, then \`You Win\` or \`You Lose\`.

**Example:**
\`\`\`
Input:  1
        3
        R
        R
Output: You Win
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'May/June 2024', 'Paper 22', 'Past Paper', 'Adapted', '15 Marks', '2D Arrays'],
    year: 2024,
    session: 'May/June',
    variant: 2,
    paper: '0478/22',
    questionNumber: 11,
    marks: 15,
    starterCode: `DECLARE Grid : ARRAY[1:5, 1:5] OF STRING
DECLARE Row, Col, FlagRow, FlagCol : INTEGER
DECLARE PlayerRow, PlayerCol, TempRow, TempCol : INTEGER
DECLARE NumberMoves : INTEGER
DECLARE Move : STRING
DECLARE Win, MoveError : BOOLEAN

INPUT FlagRow
INPUT FlagCol

// Empty the grid, place "F", start at [1,1], then process up to 10 valid moves`,
    hints: [
      'Use nested FOR loops to set every cell to "", then store "F" at Grid[FlagRow, FlagCol].',
      'Keep TempRow/TempCol copies of the player position so an out-of-range move can be rejected without changing the real position.',
      'Only increment NumberMoves after a valid move. Stop when NumberMoves reaches 10 or Win is TRUE.',
    ],
    solution: `DECLARE Grid : ARRAY[1:5, 1:5] OF STRING
DECLARE Row, Col, FlagRow, FlagCol : INTEGER
DECLARE PlayerRow, PlayerCol, TempRow, TempCol : INTEGER
DECLARE NumberMoves : INTEGER
DECLARE Move : STRING
DECLARE Win, MoveError : BOOLEAN

INPUT FlagRow
INPUT FlagCol

FOR Row <- 1 TO 5
    FOR Col <- 1 TO 5
        Grid[Row, Col] <- ""
    NEXT Col
NEXT Row
Grid[FlagRow, FlagCol] <- "F"

PlayerRow <- 1
PlayerCol <- 1
NumberMoves <- 0
Win <- FALSE

WHILE NumberMoves < 10 AND NOT Win DO
    INPUT Move
    Move <- UCASE(Move)
    TempRow <- PlayerRow
    TempCol <- PlayerCol
    MoveError <- FALSE
    IF Move = "L" THEN
        TempCol <- PlayerCol - 1
    ELSE
        IF Move = "R" THEN
            TempCol <- PlayerCol + 1
        ELSE
            IF Move = "U" THEN
                TempRow <- PlayerRow - 1
            ELSE
                IF Move = "D" THEN
                    TempRow <- PlayerRow + 1
                ELSE
                    MoveError <- TRUE
                ENDIF
            ENDIF
        ENDIF
    ENDIF
    IF TempCol < 1 OR TempCol > 5 OR TempRow < 1 OR TempRow > 5 THEN
        MoveError <- TRUE
    ENDIF
    IF MoveError THEN
        OUTPUT "Invalid move"
    ELSE
        PlayerRow <- TempRow
        PlayerCol <- TempCol
        NumberMoves <- NumberMoves + 1
        IF Grid[PlayerRow, PlayerCol] = "F" THEN
            Win <- TRUE
        ENDIF
    ENDIF
ENDWHILE

IF Win THEN
    OUTPUT "You Win"
ELSE
    OUTPUT "You Lose"
ENDIF`,
    solutionExplanation: 'The 2D array holds the hidden flag. Temporary coordinates let the program reject wall hits and unknown letters without moving the player or using up a turn. A WHILE loop combining a move counter with a win flag is the usual structure for this style of 15-mark game.',
    testCases: [
      { inputs: ['1', '3', 'R', 'R'], expectedOutput: 'You Win', description: 'Two steps right onto the flag', sortOrder: 0 },
      { inputs: ['5', '5', 'R', 'L', 'R', 'L', 'R', 'L', 'R', 'L', 'R', 'L'], expectedOutput: 'You Lose', description: 'Ten valid moves that miss the flag', sortOrder: 1 },
      { inputs: ['1', '2', 'L', 'U', 'X', 'R'], expectedOutput: 'Invalid move\nInvalid move\nInvalid move\nYou Win', description: 'Rejected moves do not count', sortOrder: 2, isHidden: true },
      { inputs: ['5', '5', 'D', 'D', 'D', 'D', 'R', 'R', 'R', 'R'], expectedOutput: 'You Win', description: 'Reach the far corner in eight moves', sortOrder: 3, isHidden: true },
    ],
  },

  // ════════════════════════════════════════ OCT/NOV 2024 ═══

  {
    title: 'House Room Area Report',
    description: `A house has between 3 and 6 rooms. Read the number of rooms (re-read until it is in range). For each room, read its name, length in metres, and width in metres. Store the area in a second index of a 2D array as length × width.

Then output every room's name, length, width, and area, followed by:

- the name of the largest room
- the name of the smallest room
- the total area
- the average area, rounded to 2 decimal places

If two rooms share the same extreme area, keep the first one found.

**Input:** Room count (validated 3–6), then name, length, width for each room.
**Output:** One block per room, then the four summary lines.

**Example:**
\`\`\`
Input:  3
        Kitchen
        4
        5
        Store
        3
        3
        Lounge
        6
        4
Output: Room: Kitchen
        Length: 4 metres
        Width: 5 metres
        Area: 20 square metres
        Room: Store
        Length: 3 metres
        Width: 3 metres
        Area: 9 square metres
        Room: Lounge
        Length: 6 metres
        Width: 4 metres
        Area: 24 square metres
        Largest: Lounge
        Smallest: Store
        Total area: 53
        Average area: 17.67
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Oct/Nov 2024', 'Paper 22', 'Past Paper', 'Adapted', '15 Marks', '2D Arrays'],
    year: 2024,
    session: 'Oct/Nov',
    variant: 2,
    paper: '0478/22',
    questionNumber: 11,
    marks: 15,
    starterCode: `DECLARE Rooms : ARRAY[1:6] OF STRING
DECLARE Dimensions : ARRAY[1:6, 1:3] OF REAL
DECLARE Number, Index : INTEGER
DECLARE TotArea, AvArea : REAL
DECLARE LIndex, SIndex : INTEGER

// Validate Number (3 to 6), store each room, then output the report`,
    hints: [
      'Store length in Dimensions[Index, 1], width in column 2, and area (length * width) in column 3.',
      'After the input loop, walk the rooms once to total the areas and remember the indexes of the largest and smallest.',
      'Average is ROUND(TotArea / Number, 2). Output the per-room blocks before the summary.',
    ],
    solution: `DECLARE Rooms : ARRAY[1:6] OF STRING
DECLARE Dimensions : ARRAY[1:6, 1:3] OF REAL
DECLARE Number, Index : INTEGER
DECLARE TotArea, AvArea : REAL
DECLARE LIndex, SIndex : INTEGER

REPEAT
    INPUT Number
UNTIL Number >= 3 AND Number <= 6

FOR Index <- 1 TO Number
    INPUT Rooms[Index]
    INPUT Dimensions[Index, 1]
    INPUT Dimensions[Index, 2]
    Dimensions[Index, 3] <- Dimensions[Index, 1] * Dimensions[Index, 2]
NEXT Index

TotArea <- 0
LIndex <- 1
SIndex <- 1
FOR Index <- 1 TO Number
    TotArea <- TotArea + Dimensions[Index, 3]
    IF Dimensions[Index, 3] > Dimensions[LIndex, 3] THEN
        LIndex <- Index
    ENDIF
    IF Dimensions[Index, 3] < Dimensions[SIndex, 3] THEN
        SIndex <- Index
    ENDIF
NEXT Index
AvArea <- ROUND(TotArea / Number, 2)

FOR Index <- 1 TO Number
    OUTPUT "Room: " & Rooms[Index]
    OUTPUT "Length: " & Dimensions[Index, 1] & " metres"
    OUTPUT "Width: " & Dimensions[Index, 2] & " metres"
    OUTPUT "Area: " & Dimensions[Index, 3] & " square metres"
NEXT Index
OUTPUT "Largest: " & Rooms[LIndex]
OUTPUT "Smallest: " & Rooms[SIndex]
OUTPUT "Total area: " & TotArea
OUTPUT "Average area: " & AvArea`,
    solutionExplanation: 'A 1D name array sits beside a 2D measurements array so each room keeps a matching index. One pass after input both totals the areas and tracks the extreme rooms; ROUND(..., 2) matches the usual Paper 2 rounding instruction for averages.',
    testCases: [
      {
        inputs: ['3', 'Kitchen', '4', '5', 'Store', '3', '3', 'Lounge', '6', '4'],
        expectedOutput: 'Room: Kitchen\nLength: 4 metres\nWidth: 5 metres\nArea: 20 square metres\nRoom: Store\nLength: 3 metres\nWidth: 3 metres\nArea: 9 square metres\nRoom: Lounge\nLength: 6 metres\nWidth: 4 metres\nArea: 24 square metres\nLargest: Lounge\nSmallest: Store\nTotal area: 53\nAverage area: 17.67',
        description: 'Three rooms, lounge largest',
        sortOrder: 0,
      },
      {
        inputs: ['2', '4', 'A', '2', '2', 'B', '2', '2', 'C', '3', '3', 'D', '1', '1'],
        expectedOutput: 'Room: A\nLength: 2 metres\nWidth: 2 metres\nArea: 4 square metres\nRoom: B\nLength: 2 metres\nWidth: 2 metres\nArea: 4 square metres\nRoom: C\nLength: 3 metres\nWidth: 3 metres\nArea: 9 square metres\nRoom: D\nLength: 1 metres\nWidth: 1 metres\nArea: 1 square metres\nLargest: C\nSmallest: D\nTotal area: 18\nAverage area: 4.5',
        description: 'Invalid count 2 rejected, then four rooms',
        sortOrder: 1,
      },
      {
        inputs: ['3', 'One', '5', '5', 'Two', '5', '5', 'Three', '5', '5'],
        expectedOutput: 'Room: One\nLength: 5 metres\nWidth: 5 metres\nArea: 25 square metres\nRoom: Two\nLength: 5 metres\nWidth: 5 metres\nArea: 25 square metres\nRoom: Three\nLength: 5 metres\nWidth: 5 metres\nArea: 25 square metres\nLargest: One\nSmallest: One\nTotal area: 75\nAverage area: 25',
        description: 'Tied areas keep the first room',
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════ MAY/JUNE 2025 ═══

  {
    title: 'Tournament Event Medals',
    description: `Three named competitors each take part in three events. Read the three names, then a score from 0 to 100 for every competitor in every event (re-read a score until it is in range).

Award a medal to every competitor who has the highest score in an event (ties share the medal). Also award a medal to every competitor with the highest total across all three events.

**Input:** Three names, then nine scores in competitor-major order (all of competitor 1's events, then competitor 2, then competitor 3).
**Output:** For each event a header \`Event <n> medal\` followed by the medal winner names, then \`Highest total\` followed by those names.

**Example:**
\`\`\`
Input:  Ali
        Bob
        Cai
        80
        70
        90
        80
        85
        60
        90
        85
        90
Output: Event 1 medal
        Cai
        Event 2 medal
        Bob
        Cai
        Event 3 medal
        Ali
        Cai
        Highest total
        Cai
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'May/June 2025', 'Paper 21', 'Past Paper', 'Adapted', '15 Marks', '2D Arrays'],
    year: 2025,
    session: 'May/June',
    variant: 1,
    paper: '0478/21',
    questionNumber: 11,
    marks: 15,
    starterCode: `DECLARE CompetitorName : ARRAY[1:3] OF STRING
DECLARE CompetitorScore : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Points, Highest : ARRAY[1:3] OF INTEGER
DECLARE X, Event, Score, MaxTotal : INTEGER

// Read names, validate scores 0-100, then output event medals and the overall total medal`,
    hints: [
      'Use nested loops: the outer loop is the competitor, the inner loop is the event. Wrap each INPUT Score in REPEAT ... UNTIL Score >= 0 AND Score <= 100.',
      'Add each accepted score into Points[X] as you store it. A second pass finds Highest[Event] for each event.',
      'When printing medals, loop through every competitor and OUTPUT the name whenever their score equals the highest — that automatically handles ties.',
    ],
    solution: `DECLARE CompetitorName : ARRAY[1:3] OF STRING
DECLARE CompetitorScore : ARRAY[1:3, 1:3] OF INTEGER
DECLARE Points, Highest : ARRAY[1:3] OF INTEGER
DECLARE X, Event, Score, MaxTotal : INTEGER

FOR X <- 1 TO 3
    INPUT CompetitorName[X]
    Points[X] <- 0
NEXT X
FOR Event <- 1 TO 3
    Highest[Event] <- 0
NEXT Event

FOR X <- 1 TO 3
    FOR Event <- 1 TO 3
        REPEAT
            INPUT Score
        UNTIL Score >= 0 AND Score <= 100
        CompetitorScore[X, Event] <- Score
        Points[X] <- Points[X] + Score
    NEXT Event
NEXT X

FOR Event <- 1 TO 3
    FOR X <- 1 TO 3
        IF CompetitorScore[X, Event] > Highest[Event] THEN
            Highest[Event] <- CompetitorScore[X, Event]
        ENDIF
    NEXT X
NEXT Event

MaxTotal <- Points[1]
FOR X <- 2 TO 3
    IF Points[X] > MaxTotal THEN
        MaxTotal <- Points[X]
    ENDIF
NEXT X

FOR Event <- 1 TO 3
    OUTPUT "Event " & Event & " medal"
    FOR X <- 1 TO 3
        IF CompetitorScore[X, Event] = Highest[Event] THEN
            OUTPUT CompetitorName[X]
        ENDIF
    NEXT X
NEXT Event
OUTPUT "Highest total"
FOR X <- 1 TO 3
    IF Points[X] = MaxTotal THEN
        OUTPUT CompetitorName[X]
    ENDIF
NEXT X`,
    solutionExplanation: 'A 2D score table is indexed by competitor then event, with a parallel 1D total array. Medals are not stored as flags — after the highest value is known, every matching name is printed, which is how Cambridge expects ties to be handled.',
    testCases: [
      {
        inputs: ['Ali', 'Bob', 'Cai', '80', '70', '90', '80', '85', '60', '90', '85', '90'],
        expectedOutput: 'Event 1 medal\nCai\nEvent 2 medal\nBob\nCai\nEvent 3 medal\nAli\nCai\nHighest total\nCai',
        description: 'Mixed medals with two event ties',
        sortOrder: 0,
      },
      {
        inputs: ['Ann', 'Ben', 'Cat', '-1', '100', '100', '100', '0', '0', '0', '50', '50', '50'],
        expectedOutput: 'Event 1 medal\nAnn\nEvent 2 medal\nAnn\nEvent 3 medal\nAnn\nHighest total\nAnn',
        description: 'Negative score rejected, then Ann sweeps',
        sortOrder: 1,
      },
      {
        inputs: ['A', 'B', 'C', '10', '10', '10', '10', '10', '10', '10', '10', '10'],
        expectedOutput: 'Event 1 medal\nA\nB\nC\nEvent 2 medal\nA\nB\nC\nEvent 3 medal\nA\nB\nC\nHighest total\nA\nB\nC',
        description: 'Every competitor tied',
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════ OCT/NOV 2025 ═══

  {
    title: 'Dice Roll Frequency Table',
    description: `Read how many rolls were recorded (\`N\`), then \`N\` integers between 1 and 6. Count how many times each face appeared, sort those six faces into descending order of frequency (bubble sort; leave equal frequencies in their original numeric order), and output each face, its count, and its relative frequency rounded to 4 decimal places.

**Input:** \`N\`, then \`N\` dice values.
**Output:** Six lines \`<face> <count> <frequency>\` in descending count order.

**Example:**
\`\`\`
Input:  10
        1
        1
        1
        2
        2
        3
        4
        5
        6
        6
Output: 1 3 0.3
        2 2 0.2
        6 2 0.2
        3 1 0.1
        4 1 0.1
        5 1 0.1
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    tags: ['IGCSE', '0478', 'Oct/Nov 2025', 'Paper 22', 'Past Paper', 'Adapted', '15 Marks', 'Sorting', 'Counting'],
    year: 2025,
    session: 'Oct/Nov',
    variant: 2,
    paper: '0478/22',
    questionNumber: 10,
    marks: 15,
    starterCode: `DECLARE Rolls : ARRAY[1:20] OF INTEGER
DECLARE Counted : ARRAY[1:6, 1:2] OF INTEGER
DECLARE N, Index, Face, Temp1, Temp2 : INTEGER
DECLARE Swap : BOOLEAN

INPUT N
FOR Index <- 1 TO N
    INPUT Rolls[Index]
NEXT Index

// Count faces 1-6, bubble-sort by frequency descending, output face, count, ROUND(count/N, 4)`,
    hints: [
      'Store the face number in Counted[Face, 1] and the tally in Counted[Face, 2], starting each tally at 0.',
      'Bubble sort should swap when Counted[Index, 2] < Counted[Index + 1, 2] so larger counts move towards the front. Equal counts must not swap.',
      'Frequency is ROUND(Counted[Index, 2] / N, 4). Trailing zeros are omitted when you OUTPUT the real.',
    ],
    solution: `DECLARE Rolls : ARRAY[1:20] OF INTEGER
DECLARE Counted : ARRAY[1:6, 1:2] OF INTEGER
DECLARE N, Index, Face, Temp1, Temp2 : INTEGER
DECLARE Swap : BOOLEAN

INPUT N
FOR Index <- 1 TO N
    INPUT Rolls[Index]
NEXT Index

FOR Face <- 1 TO 6
    Counted[Face, 1] <- Face
    Counted[Face, 2] <- 0
NEXT Face
FOR Index <- 1 TO N
    Face <- Rolls[Index]
    Counted[Face, 2] <- Counted[Face, 2] + 1
NEXT Index

Swap <- TRUE
WHILE Swap DO
    Swap <- FALSE
    FOR Index <- 1 TO 5
        IF Counted[Index, 2] < Counted[Index + 1, 2] THEN
            Temp1 <- Counted[Index, 1]
            Temp2 <- Counted[Index, 2]
            Counted[Index, 1] <- Counted[Index + 1, 1]
            Counted[Index, 2] <- Counted[Index + 1, 2]
            Counted[Index + 1, 1] <- Temp1
            Counted[Index + 1, 2] <- Temp2
            Swap <- TRUE
        ENDIF
    NEXT Index
ENDWHILE

FOR Index <- 1 TO 6
    OUTPUT Counted[Index, 1] & " " & Counted[Index, 2] & " " & ROUND(Counted[Index, 2] / N, 4)
NEXT Index`,
    solutionExplanation: 'A 2D table pairs each face with its frequency so a bubble sort can reorder both columns together. Sorting only when the left count is strictly smaller keeps equal faces in numeric order. Dividing by N and rounding to 4 d.p. is the usual relative-frequency finish for this style of 15-mark task.',
    testCases: [
      {
        inputs: ['10', '1', '1', '1', '2', '2', '3', '4', '5', '6', '6'],
        expectedOutput: '1 3 0.3\n2 2 0.2\n6 2 0.2\n3 1 0.1\n4 1 0.1\n5 1 0.1',
        description: 'Mixed frequencies',
        sortOrder: 0,
      },
      {
        inputs: ['6', '6', '6', '6', '6', '6', '6'],
        expectedOutput: '6 6 1\n1 0 0\n2 0 0\n3 0 0\n4 0 0\n5 0 0',
        description: 'Every roll is a six',
        sortOrder: 1,
      },
      {
        inputs: ['6', '1', '2', '3', '4', '5', '6'],
        expectedOutput: '1 1 0.1667\n2 1 0.1667\n3 1 0.1667\n4 1 0.1667\n5 1 0.1667\n6 1 0.1667',
        description: 'One of each face',
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  {
    title: 'Two-Player Dice Match',
    description: `Two players each roll a die four times. Store the rolls in a 2D array \`NumberGenerated[1:2, 1:4]\`. Each round, the player with the higher roll scores 1 point (a draw scores nothing).

If the four-round totals are equal, keep reading extra pairs of rolls until one player is higher, then add 2 points to that player.

Output the players in descending order of points: name then points, two lines each.

**Input:** Two names, eight round rolls (player 1 then player 2, four times), then extra pairs only if needed for a tie-break.
**Output:** Winner name and points, then runner-up name and points.

**Example:**
\`\`\`
Input:  Ana
        Ben
        6
        1
        6
        1
        6
        1
        1
        6
Output: Ana
        3
        Ben
        1
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Oct/Nov 2025', 'Paper 23', 'Past Paper', 'Adapted', '15 Marks', '2D Arrays'],
    year: 2025,
    session: 'Oct/Nov',
    variant: 3,
    paper: '0478/23',
    questionNumber: 10,
    marks: 15,
    starterCode: `DECLARE NumberGenerated : ARRAY[1:2, 1:4] OF INTEGER
DECLARE Points : ARRAY[1:2] OF INTEGER
DECLARE Name1, Name2 : STRING
DECLARE Round, Extra1, Extra2 : INTEGER

INPUT Name1
INPUT Name2
Points[1] <- 0
Points[2] <- 0

// Read 4 rounds, score them, tie-break if needed, then OUTPUT names by points descending`,
    hints: [
      'Each round reads NumberGenerated[1, Round] then NumberGenerated[2, Round]. Compare the two values to award 1 point.',
      'After the four rounds, IF Points[1] = Points[2] THEN REPEAT two extra INPUTs UNTIL they differ, and add 2 to the winner of that pair.',
      'Print the higher-scoring name first. Use an IF on the two totals — there will be a winner after the tie-break.',
    ],
    solution: `DECLARE NumberGenerated : ARRAY[1:2, 1:4] OF INTEGER
DECLARE Points : ARRAY[1:2] OF INTEGER
DECLARE Name1, Name2 : STRING
DECLARE Round, Extra1, Extra2 : INTEGER

INPUT Name1
INPUT Name2
Points[1] <- 0
Points[2] <- 0

FOR Round <- 1 TO 4
    INPUT NumberGenerated[1, Round]
    INPUT NumberGenerated[2, Round]
    IF NumberGenerated[1, Round] > NumberGenerated[2, Round] THEN
        Points[1] <- Points[1] + 1
    ELSE
        IF NumberGenerated[2, Round] > NumberGenerated[1, Round] THEN
            Points[2] <- Points[2] + 1
        ENDIF
    ENDIF
NEXT Round

IF Points[1] = Points[2] THEN
    REPEAT
        INPUT Extra1
        INPUT Extra2
    UNTIL Extra1 <> Extra2
    IF Extra1 > Extra2 THEN
        Points[1] <- Points[1] + 2
    ELSE
        Points[2] <- Points[2] + 2
    ENDIF
ENDIF

IF Points[1] > Points[2] THEN
    OUTPUT Name1
    OUTPUT Points[1]
    OUTPUT Name2
    OUTPUT Points[2]
ELSE
    OUTPUT Name2
    OUTPUT Points[2]
    OUTPUT Name1
    OUTPUT Points[1]
ENDIF`,
    solutionExplanation: 'The 2D array keeps each player\'s four rolls. Round scoring uses a simple comparison; the REPEAT/UNTIL tie-break is the part candidates often miss — it must run only when the totals match, and it awards 2 points rather than 1.',
    testCases: [
      {
        inputs: ['Ana', 'Ben', '6', '1', '6', '1', '6', '1', '1', '6'],
        expectedOutput: 'Ana\n3\nBen\n1',
        description: 'Ana wins 3-1, no tie-break',
        sortOrder: 0,
      },
      {
        inputs: ['Ana', 'Ben', '3', '3', '4', '2', '2', '4', '5', '5', '3', '3', '6', '2'],
        expectedOutput: 'Ana\n3\nBen\n1',
        description: 'Tied 1-1 then Ana wins the tie-break',
        sortOrder: 1,
      },
      {
        inputs: ['Jo', 'Mo', '1', '6', '1', '6', '1', '6', '1', '6'],
        expectedOutput: 'Mo\n4\nJo\n0',
        description: 'Mo wins every round',
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════ FEB/MAR 2026 ═══

  {
    title: 'Collect Five Negatives',
    description: `Read numbers one at a time until five negative numbers have been stored in array \`NegNumbers\`. If a number is not negative, output \`Please enter a negative number\` and read again. When five negatives are stored, output \`Check complete\` followed by the five numbers, one per line.

**Input:** Numbers until five negatives have been accepted.
**Output:** An error line for each rejected value, then \`Check complete\` and the five stored numbers.

**Example:**
\`\`\`
Input:  5
        -1
        3
        -2
        -3
        -4
        -5
Output: Please enter a negative number
        Please enter a negative number
        Check complete
        -1
        -2
        -3
        -4
        -5
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Validation',
    tags: ['IGCSE', '0478', 'Feb/Mar 2026', 'Paper 22', 'Past Paper', 'Adapted', 'Validation'],
    year: 2026,
    session: 'Feb/Mar',
    variant: 2,
    paper: '0478/22',
    questionNumber: 2,
    marks: 6,
    starterCode: `DECLARE NegNumbers : ARRAY[1:5] OF INTEGER
DECLARE Index, Value : INTEGER

Index <- 1
// Keep reading until five negative numbers are stored`,
    hints: [
      'Use a WHILE Index <= 5 loop. Inside it, INPUT Value.',
      'Zero is not negative — only store Value when Value < 0.',
      'After the loop, OUTPUT "Check complete" and then a FOR loop that prints NegNumbers[1] to [5].',
    ],
    solution: `DECLARE NegNumbers : ARRAY[1:5] OF INTEGER
DECLARE Index, Value : INTEGER

Index <- 1
WHILE Index <= 5 DO
    INPUT Value
    IF Value < 0 THEN
        NegNumbers[Index] <- Value
        Index <- Index + 1
    ELSE
        OUTPUT "Please enter a negative number"
    ENDIF
ENDWHILE

OUTPUT "Check complete"
FOR Index <- 1 TO 5
    OUTPUT NegNumbers[Index]
NEXT Index`,
    solutionExplanation: 'The count of stored values is the loop driver, not the number of inputs. Rejected values print a message and leave the index unchanged, which is the standard "re-enter until valid" pattern scaled down from the 20-value exam version.',
    testCases: [
      { inputs: ['5', '-1', '3', '-2', '-3', '-4', '-5'], expectedOutput: 'Please enter a negative number\nPlease enter a negative number\nCheck complete\n-1\n-2\n-3\n-4\n-5', description: 'Two positives rejected', sortOrder: 0 },
      { inputs: ['-9', '-8', '-7', '-6', '-5'], expectedOutput: 'Check complete\n-9\n-8\n-7\n-6\n-5', description: 'All five already negative', sortOrder: 1 },
      { inputs: ['0', '-1', '-2', '-3', '-4', '-5'], expectedOutput: 'Please enter a negative number\nCheck complete\n-1\n-2\n-3\n-4\n-5', description: 'Zero is rejected', sortOrder: 2, isHidden: true },
    ],
  },

  {
    title: 'Sort Names by Surname',
    description: `Four people are stored in a 2D array \`Names[1:4, 1:2]\`: column 1 is the last name, column 2 is the first name. Read the four pairs (last name then first name), bubble-sort the rows into ascending last-name order, and output each person as \`Last First\`.

Equal last names should keep their original order.

**Input:** Eight strings — last name, first name, four times.
**Output:** Four lines after sorting.

**Example:**
\`\`\`
Input:  Chen
        Amy
        Patel
        Bo
        Adams
        Cy
        Chen
        Dan
Output: Adams Cy
        Chen Amy
        Chen Dan
        Patel Bo
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Feb/Mar 2026', 'Paper 22', 'Past Paper', 'Adapted', 'Sorting', '2D Arrays'],
    year: 2026,
    session: 'Feb/Mar',
    variant: 2,
    paper: '0478/22',
    questionNumber: 5,
    marks: 8,
    starterCode: `DECLARE Names : ARRAY[1:4, 1:2] OF STRING
DECLARE Row : INTEGER
DECLARE Temp1, Temp2 : STRING
DECLARE Swap : BOOLEAN

FOR Row <- 1 TO 4
    INPUT Names[Row, 1]
    INPUT Names[Row, 2]
NEXT Row

// Bubble-sort rows by last name (column 1), then output "Last First"`,
    hints: [
      'Use WHILE Swap DO with Swap starting TRUE. Inside, set Swap <- FALSE at the start of each pass.',
      'Compare Names[Row, 1] > Names[Row + 1, 1] and swap both columns when that is true. Loop Row from 1 TO 3.',
      'After sorting, OUTPUT Names[Row, 1] & " " & Names[Row, 2] for each row.',
    ],
    solution: `DECLARE Names : ARRAY[1:4, 1:2] OF STRING
DECLARE Row : INTEGER
DECLARE Temp1, Temp2 : STRING
DECLARE Swap : BOOLEAN

FOR Row <- 1 TO 4
    INPUT Names[Row, 1]
    INPUT Names[Row, 2]
NEXT Row

Swap <- TRUE
WHILE Swap DO
    Swap <- FALSE
    FOR Row <- 1 TO 3
        IF Names[Row, 1] > Names[Row + 1, 1] THEN
            Temp1 <- Names[Row, 1]
            Temp2 <- Names[Row, 2]
            Names[Row, 1] <- Names[Row + 1, 1]
            Names[Row, 2] <- Names[Row + 1, 2]
            Names[Row + 1, 1] <- Temp1
            Names[Row + 1, 2] <- Temp2
            Swap <- TRUE
        ENDIF
    NEXT Row
ENDWHILE

FOR Row <- 1 TO 4
    OUTPUT Names[Row, 1] & " " & Names[Row, 2]
NEXT Row`,
    solutionExplanation: 'Each row is a person, so a swap must move last name and first name together. A flag-controlled bubble sort with a strict > comparison is the corrected form of the buggy 2D sort that Paper 2 often asks candidates to fix.',
    testCases: [
      { inputs: ['Chen', 'Amy', 'Patel', 'Bo', 'Adams', 'Cy', 'Chen', 'Dan'], expectedOutput: 'Adams Cy\nChen Amy\nChen Dan\nPatel Bo', description: 'Two Chens keep input order', sortOrder: 0 },
      { inputs: ['Zed', 'A', 'Yap', 'B', 'Xu', 'C', 'Wu', 'D'], expectedOutput: 'Wu D\nXu C\nYap B\nZed A', description: 'Reverse alphabetical last names', sortOrder: 1 },
      { inputs: ['Lee', 'Sam', 'Lee', 'Pat', 'Lee', 'Kim', 'Lee', 'Alex'], expectedOutput: 'Lee Sam\nLee Pat\nLee Kim\nLee Alex', description: 'Identical last names stay stable', sortOrder: 2, isHidden: true },
    ],
  },

  {
    title: 'Class Survey Vote Tally',
    description: `Run a class vote. Options are stored in \`Options[]\` and each voter's choice (the option number) in \`Votes[]\`.

1. Read the number of options (re-read until it is between 2 and 4) and the number of voters (re-read until it is between 2 and 6).
2. Read each option name.
3. For every voter, output the numbered list of options, then read a choice from 1 to the option count (re-read until valid).
4. Count the votes for each option. Output the most popular option and its vote count, then the least popular option and its count. If there is a tie, keep the earliest option.

**Input:** Option count, voter count, option names, then each voter's choice.
**Output:** The option list once per voter, then the most/least summary.

**Example:**
\`\`\`
Input:  3
        3
        Apple
        Banana
        Cherry
        1
        1
        2
Output: 1. Apple
        2. Banana
        3. Cherry
        1. Apple
        2. Banana
        3. Cherry
        1. Apple
        2. Banana
        3. Cherry
        Most popular: Apple 2
        Least popular: Cherry 0
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    tags: ['IGCSE', '0478', 'Feb/Mar 2026', 'Paper 22', 'Past Paper', 'Adapted', '15 Marks', 'Arrays', 'Validation'],
    year: 2026,
    session: 'Feb/Mar',
    variant: 2,
    paper: '0478/22',
    questionNumber: 10,
    marks: 15,
    starterCode: `DECLARE Options : ARRAY[1:4] OF STRING
DECLARE Votes : ARRAY[1:6] OF INTEGER
DECLARE VoteCount : ARRAY[1:4] OF INTEGER
DECLARE NumOptions, NumVoters, Index, Choice, Most, Least : INTEGER

// Validate counts, read option names, collect votes, then output most and least popular`,
    hints: [
      'Initialise VoteCount[1] to VoteCount[NumOptions] to 0 before counting.',
      'Show the list inside the voter loop: OUTPUT Index & ". " & Options[Index]. Then REPEAT INPUT Choice UNTIL it is between 1 and NumOptions.',
      'After counting, start Most and Least at 1 and only update when a count is strictly greater or strictly smaller.',
    ],
    solution: `DECLARE Options : ARRAY[1:4] OF STRING
DECLARE Votes : ARRAY[1:6] OF INTEGER
DECLARE VoteCount : ARRAY[1:4] OF INTEGER
DECLARE NumOptions, NumVoters, Index, Choice, Most, Least : INTEGER

REPEAT
    INPUT NumOptions
UNTIL NumOptions >= 2 AND NumOptions <= 4
REPEAT
    INPUT NumVoters
UNTIL NumVoters >= 2 AND NumVoters <= 6

FOR Index <- 1 TO NumOptions
    INPUT Options[Index]
    VoteCount[Index] <- 0
NEXT Index

FOR Index <- 1 TO NumVoters
    FOR Choice <- 1 TO NumOptions
        OUTPUT Choice & ". " & Options[Choice]
    NEXT Choice
    REPEAT
        INPUT Votes[Index]
    UNTIL Votes[Index] >= 1 AND Votes[Index] <= NumOptions
NEXT Index

FOR Index <- 1 TO NumVoters
    Choice <- Votes[Index]
    VoteCount[Choice] <- VoteCount[Choice] + 1
NEXT Index

Most <- 1
Least <- 1
FOR Index <- 2 TO NumOptions
    IF VoteCount[Index] > VoteCount[Most] THEN
        Most <- Index
    ENDIF
    IF VoteCount[Index] < VoteCount[Least] THEN
        Least <- Index
    ENDIF
NEXT Index

OUTPUT "Most popular: " & Options[Most] & " " & VoteCount[Most]
OUTPUT "Least popular: " & Options[Least] & " " & VoteCount[Least]`,
    solutionExplanation: 'Three parallel 1D arrays (names, raw votes, tallies) are the data structure Cambridge names in this scenario. Nested validation loops keep both the sizes and each vote in range. A single pass for most/least, updating only on a strict comparison, matches the paper\'s instruction not to resolve ties.',
    testCases: [
      {
        inputs: ['3', '3', 'Apple', 'Banana', 'Cherry', '1', '1', '2'],
        expectedOutput: '1. Apple\n2. Banana\n3. Cherry\n1. Apple\n2. Banana\n3. Cherry\n1. Apple\n2. Banana\n3. Cherry\nMost popular: Apple 2\nLeast popular: Cherry 0',
        description: 'Three options, Apple wins',
        sortOrder: 0,
      },
      {
        inputs: ['1', '2', '0', '2', 'Red', 'Blue', '2', '2'],
        expectedOutput: '1. Red\n2. Blue\n1. Red\n2. Blue\nMost popular: Blue 2\nLeast popular: Red 0',
        description: 'Invalid counts rejected, both votes for Blue',
        sortOrder: 1,
      },
      {
        inputs: ['2', '2', 'Yes', 'No', '5', '1', '1'],
        expectedOutput: '1. Yes\n2. No\n1. Yes\n2. No\nMost popular: Yes 2\nLeast popular: No 0',
        description: 'Out-of-range vote 5 is rejected',
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  {
    title: 'Split Sentence Into Words',
    description: `Read one sentence whose words are separated by single spaces (no leading or trailing space). Output each word followed by a space and its length.

**Input:** One line of text.
**Output:** One line per word: \`<word> <length>\`.

**Example:**
\`\`\`
Input:  Computing is fun
Output: Computing 9
        is 2
        fun 3
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    tags: ['IGCSE', '0478', 'Feb/Mar 2026', 'Paper 22', 'Past Paper', 'Adapted', 'String Processing'],
    year: 2026,
    session: 'Feb/Mar',
    variant: 2,
    paper: '0478/22',
    questionNumber: 6,
    marks: 8,
    starterCode: `DECLARE Sentence, Word : STRING
DECLARE LetterNo, Start, SentLength : INTEGER

INPUT Sentence

// Walk the sentence. A space ends a word; remember to output the last word too.`,
    hints: [
      'Keep a Start index for the current word and a LetterNo index that walks from 1 to LENGTH(Sentence).',
      'When you hit a space, the word is SUBSTRING(Sentence, Start, LetterNo - Start). Then set Start <- LetterNo + 1.',
      'After the loop, output the final word with SUBSTRING(Sentence, Start, LENGTH(Sentence) - Start + 1).',
    ],
    solution: `DECLARE Sentence, Word : STRING
DECLARE LetterNo, Start, SentLength : INTEGER

INPUT Sentence
SentLength <- LENGTH(Sentence)
Start <- 1
LetterNo <- 1
WHILE LetterNo <= SentLength DO
    IF SUBSTRING(Sentence, LetterNo, 1) = " " THEN
        Word <- SUBSTRING(Sentence, Start, LetterNo - Start)
        OUTPUT Word & " " & LENGTH(Word)
        Start <- LetterNo + 1
    ENDIF
    LetterNo <- LetterNo + 1
ENDWHILE
Word <- SUBSTRING(Sentence, Start, SentLength - Start + 1)
OUTPUT Word & " " & LENGTH(Word)`,
    solutionExplanation: 'This is the flowchart algorithm from Paper 2 turned into runnable pseudocode: spaces delimit words, SUBSTRING extracts each one, and the last word is handled after the scan because it has no trailing space.',
    testCases: [
      { inputs: ['Computing is fun'], expectedOutput: 'Computing 9\nis 2\nfun 3', description: 'Three words', sortOrder: 0 },
      { inputs: ['Hello'], expectedOutput: 'Hello 5', description: 'Single word', sortOrder: 1 },
      { inputs: ['A B'], expectedOutput: 'A 1\nB 1', description: 'Two one-letter words', sortOrder: 2, isHidden: true },
      { inputs: ['IGCSE Computer Science'], expectedOutput: 'IGCSE 5\nComputer 8\nScience 7', description: 'Title case words', sortOrder: 3, isHidden: true },
    ],
  },

  // ════════════════════════════════════════ MAY/JUNE 2026 ═══

  {
    title: 'Rainfall Dry-Spell Report',
    description: `Read 10 daily rainfall totals in millimetres into array \`Rainfall\`. Then output:

- total rainfall for the period in centimetres, rounded to 2 decimal places (divide millimetres by 10)
- mean daily rainfall in millimetres, rounded to 4 decimal places
- how many days had no rain
- the longest run of consecutive dry days
- \`Drought\` if that longest run is 4 days or more, otherwise \`No drought\`

**Input:** 10 real numbers (mm of rain each day).
**Output:** Five lines in the order above.

**Example:**
\`\`\`
Input:  2
        0
        0
        0
        0
        5
        0
        3
        1
        4
Output: Total: 1.5 cm
        Average: 1.5 mm
        Dry days: 5
        Longest dry spell: 4
        Drought
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    tags: ['IGCSE', '0478', 'May/June 2026', 'Paper 22', 'Past Paper', 'Adapted', '15 Marks', 'Arrays', 'Counting'],
    year: 2026,
    session: 'May/June',
    variant: 2,
    paper: '0478/22',
    questionNumber: 10,
    marks: 15,
    starterCode: `DECLARE Rainfall : ARRAY[1:10] OF REAL
DECLARE Index, NoRain, DryDays, MaxDryDays : INTEGER
DECLARE TotalRain, AverageRain : REAL

FOR Index <- 1 TO 10
    INPUT Rainfall[Index]
NEXT Index

// Compute total (cm), average (mm), dry-day count, longest dry spell, drought flag`,
    hints: [
      'Total millimetres first, then TotalRain <- ROUND(TotalRain / 10, 2) for centimetres and AverageRain <- ROUND(originalTotal / 10, 4).',
      'A dry spell counter should increase on 0 mm and reset to 0 on any rain. Track MaxDryDays whenever the current spell is longer.',
      'After the scan, OUTPUT "Drought" if MaxDryDays >= 4, otherwise "No drought".',
    ],
    solution: `DECLARE Rainfall : ARRAY[1:10] OF REAL
DECLARE Index, NoRain, DryDays, MaxDryDays : INTEGER
DECLARE TotalRain, AverageRain : REAL

FOR Index <- 1 TO 10
    INPUT Rainfall[Index]
NEXT Index

TotalRain <- 0
NoRain <- 0
DryDays <- 0
MaxDryDays <- 0
FOR Index <- 1 TO 10
    TotalRain <- TotalRain + Rainfall[Index]
    IF Rainfall[Index] = 0 THEN
        NoRain <- NoRain + 1
        DryDays <- DryDays + 1
        IF DryDays > MaxDryDays THEN
            MaxDryDays <- DryDays
        ENDIF
    ELSE
        DryDays <- 0
    ENDIF
NEXT Index
AverageRain <- ROUND(TotalRain / 10, 4)
TotalRain <- ROUND(TotalRain / 10, 2)

OUTPUT "Total: " & TotalRain & " cm"
OUTPUT "Average: " & AverageRain & " mm"
OUTPUT "Dry days: " & NoRain
OUTPUT "Longest dry spell: " & MaxDryDays
IF MaxDryDays >= 4 THEN
    OUTPUT "Drought"
ELSE
    OUTPUT "No drought"
ENDIF`,
    solutionExplanation: 'One scan of the array can total, count dry days, and track the current consecutive run. Converting millimetres to centimetres divides by 10; the drought flag uses a shortened 4-day threshold so a 10-day sample still trains the same selection as the 365-day exam task.',
    testCases: [
      {
        inputs: ['2', '0', '0', '0', '0', '5', '0', '3', '1', '4'],
        expectedOutput: 'Total: 1.5 cm\nAverage: 1.5 mm\nDry days: 5\nLongest dry spell: 4\nDrought',
        description: 'Four-day dry spell triggers drought',
        sortOrder: 0,
      },
      {
        inputs: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
        expectedOutput: 'Total: 1 cm\nAverage: 1 mm\nDry days: 0\nLongest dry spell: 0\nNo drought',
        description: 'Rain every day',
        sortOrder: 1,
      },
      {
        inputs: ['0', '1', '0', '1', '0', '1', '0', '1', '0', '1'],
        expectedOutput: 'Total: 0.5 cm\nAverage: 0.5 mm\nDry days: 5\nLongest dry spell: 1\nNo drought',
        description: 'Isolated dry days',
        sortOrder: 2,
        isHidden: true,
      },
      {
        inputs: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        expectedOutput: 'Total: 0 cm\nAverage: 0 mm\nDry days: 10\nLongest dry spell: 10\nDrought',
        description: 'Entire period dry',
        sortOrder: 3,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════ MAY/JUNE 2025 UNSEEN + ALGORITHMS ═══

  {
    title: 'Video Library Catalogue',
    description: `A video collector stores each title in a 2D array \`Video[1:5, 1:4]\`: title, format, year (string), storage code. A second 2D array \`Results[1:3, 1:4]\` holds search hits.

Menu (re-read until 1, 2 or 3):

1. Add a video in the first empty row (title, format, year, code), then return to the menu.
2. Search by title. Copy every matching row into \`Results\` (reset to \`""\` first). Output the four fields of each hit, or \`Not found\`.
3. Stop.

Invalid menu input outputs \`You must input 1, 2 or 3\`.

**Input:** Menu choices and the data they need.
**Output:** Menu errors, search rows, or \`Not found\`.

**Example:**
\`\`\`
Input:  1
        Macbeth
        DVD
        2015
        DG1
        2
        Macbeth
        3
Output: Macbeth
        DVD
        2015
        DG1
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'May/June 2025', 'Paper 23', 'Past Paper', 'Unseen', '15 Marks', '2D Arrays'],
    year: 2025,
    session: 'May/June',
    variant: 3,
    paper: '0478/23',
    questionNumber: 10,
    marks: 15,
    starterCode: `DECLARE Video : ARRAY[1:5, 1:4] OF STRING
DECLARE Results : ARRAY[1:3, 1:4] OF STRING
DECLARE Answer, NextIndex, Index, Col, FoundCount : INTEGER
DECLARE Title : STRING

NextIndex <- 1

// Menu loop: 1 add, 2 search, 3 stop. Initialise Video to "" first.`,
    hints: [
      'Fill every Video cell with "" before the menu. NextIndex is the first empty row.',
      'On search, wipe Results to "" then scan rows 1 TO NextIndex - 1. Copy all four columns when the title matches.',
      'If FoundCount stays 0, OUTPUT "Not found". Otherwise print Results row by row.',
    ],
    solution: `DECLARE Video : ARRAY[1:5, 1:4] OF STRING
DECLARE Results : ARRAY[1:3, 1:4] OF STRING
DECLARE Answer, NextIndex, Index, Col, FoundCount : INTEGER
DECLARE Title : STRING

FOR Index <- 1 TO 5
    FOR Col <- 1 TO 4
        Video[Index, Col] <- ""
    NEXT Col
NEXT Index
NextIndex <- 1

REPEAT
    REPEAT
        INPUT Answer
        IF Answer < 1 OR Answer > 3 THEN
            OUTPUT "You must input 1, 2 or 3"
        ENDIF
    UNTIL Answer >= 1 AND Answer <= 3

    IF Answer = 1 THEN
        INPUT Video[NextIndex, 1]
        INPUT Video[NextIndex, 2]
        INPUT Video[NextIndex, 3]
        INPUT Video[NextIndex, 4]
        NextIndex <- NextIndex + 1
    ENDIF

    IF Answer = 2 THEN
        FOR Index <- 1 TO 3
            FOR Col <- 1 TO 4
                Results[Index, Col] <- ""
            NEXT Col
        NEXT Index
        INPUT Title
        FoundCount <- 0
        FOR Index <- 1 TO NextIndex - 1
            IF Video[Index, 1] = Title THEN
                FoundCount <- FoundCount + 1
                FOR Col <- 1 TO 4
                    Results[FoundCount, Col] <- Video[Index, Col]
                NEXT Col
            ENDIF
        NEXT Index
        IF FoundCount = 0 THEN
            OUTPUT "Not found"
        ELSE
            FOR Index <- 1 TO FoundCount
                FOR Col <- 1 TO 4
                    OUTPUT Results[Index, Col]
                NEXT Col
            NEXT Index
        ENDIF
    ENDIF
UNTIL Answer = 3`,
    solutionExplanation: 'This is the May/June 2025 Paper 23 unseen 15-mark: a validated menu, append into the first free 2D-array row, then a linear search that can return several copies of the same title via a Results table.',
    testCases: [
      {
        inputs: ['1', 'Macbeth', 'DVD', '2015', 'DG1', '2', 'Macbeth', '3'],
        expectedOutput: 'Macbeth\nDVD\n2015\nDG1',
        description: 'Add one title then find it',
        sortOrder: 0,
      },
      {
        inputs: ['2', 'Macbeth', '3'],
        expectedOutput: 'Not found',
        description: 'Search an empty library',
        sortOrder: 1,
      },
      {
        inputs: ['4', '1', 'Hamlet', '4K', '2018', 'A1', '1', 'Hamlet', 'DVD', '2000', 'B2', '2', 'Hamlet', '3'],
        expectedOutput: 'You must input 1, 2 or 3\nHamlet\n4K\n2018\nA1\nHamlet\nDVD\n2000\nB2',
        description: 'Invalid menu then two matching titles',
        sortOrder: 2,
        isHidden: true,
      },
      {
        inputs: ['1', 'Othello', 'BD', '2011', 'C3', '2', 'Hamlet', '3'],
        expectedOutput: 'Not found',
        description: 'Title is not in the library',
        sortOrder: 3,
        isHidden: true,
      },
    ],
  },

  {
    title: 'Two-Pointer Palindrome Word',
    description: `Read one uppercase word. Use two indexes: one at the first character and one at the last. Walk them towards the middle. If every pair matches, output \`Palindrome\`; as soon as a pair differs, output \`Not palindrome\`.

**Input:** One word.
**Output:** \`Palindrome\` or \`Not palindrome\`.

**Example:**
\`\`\`
Input:  RACECAR
Output: Palindrome
\`\`\``,
    difficulty: 'MEDIUM' as const,
    topic: 'String Processing',
    tags: ['IGCSE', '0478', 'May/June 2025', 'Paper 22', 'Past Paper', 'Adapted', 'Unseen', 'String Processing'],
    year: 2025,
    session: 'May/June',
    variant: 2,
    paper: '0478/22',
    questionNumber: 6,
    marks: 6,
    starterCode: `DECLARE Word : STRING
DECLARE Left, Right : INTEGER
DECLARE Pal : BOOLEAN

INPUT Word

// Compare characters from both ends until they meet or a mismatch is found`,
    hints: [
      'Set Left <- 1 and Right <- LENGTH(Word). Loop WHILE Left < Right.',
      'Compare SUBSTRING(Word, Left, 1) with SUBSTRING(Word, Right, 1). On a mismatch, set Pal <- FALSE.',
      'If the loop finishes with Pal still TRUE, the word reads the same forwards and backwards.',
    ],
    solution: `DECLARE Word : STRING
DECLARE Left, Right : INTEGER
DECLARE Pal : BOOLEAN

INPUT Word
Left <- 1
Right <- LENGTH(Word)
Pal <- TRUE
WHILE Left < Right AND Pal DO
    IF SUBSTRING(Word, Left, 1) <> SUBSTRING(Word, Right, 1) THEN
        Pal <- FALSE
    ELSE
        Left <- Left + 1
        Right <- Right - 1
    ENDIF
ENDWHILE

IF Pal THEN
    OUTPUT "Palindrome"
ELSE
    OUTPUT "Not palindrome"
ENDIF`,
    solutionExplanation: 'Paper 22 May/June 2025 traces this exact two-index scan on RACECAR and TREAT. Stopping at the first mismatch is what makes the algorithm O(length/2) rather than building a reversed copy.',
    testCases: [
      { inputs: ['RACECAR'], expectedOutput: 'Palindrome', description: 'Odd-length palindrome', sortOrder: 0 },
      { inputs: ['TREAT'], expectedOutput: 'Not palindrome', description: 'Mismatch on the second pair', sortOrder: 1 },
      { inputs: ['AA'], expectedOutput: 'Palindrome', description: 'Two matching letters', sortOrder: 2, isHidden: true },
      { inputs: ['A'], expectedOutput: 'Palindrome', description: 'Single letter', sortOrder: 3, isHidden: true },
      { inputs: ['AB'], expectedOutput: 'Not palindrome', description: 'Two different letters', sortOrder: 4, isHidden: true },
    ],
  },

  {
    title: 'Exclusive Range Running Total',
    description: `Read real numbers until five values have been accepted. A value is accepted only when it is strictly between \`-20\` and \`50\` (so \`-20\` and \`50\` are rejected). Output the total of the five accepted values, then their average.

**Input:** Numbers until five are in range.
**Output:** Total, then average.

**Example:**
\`\`\`
Input:  -20
        50
        0
        10
        20
        30
        40
Output: 100
        20
\`\`\``,
    difficulty: 'EASY' as const,
    topic: 'Loops',
    tags: ['IGCSE', '0478', 'May/June 2025', 'Paper 22', 'Past Paper', 'Adapted', 'Unseen', 'Validation', 'Totalling'],
    year: 2025,
    session: 'May/June',
    variant: 2,
    paper: '0478/22',
    questionNumber: 7,
    marks: 6,
    starterCode: `DECLARE Value, Total : REAL
DECLARE Count : INTEGER

Total <- 0
Count <- 0

// Accept five values that are greater than -20 and less than 50`,
    hints: [
      'The valid test is Value > -20 AND Value < 50. Equal to either bound must be ignored.',
      'Only increment Count after a valid value has been added to Total.',
      'Average is Total / 5 — there are always exactly five accepted numbers.',
    ],
    solution: `DECLARE Value, Total : REAL
DECLARE Count : INTEGER

Total <- 0
Count <- 0
WHILE Count < 5 DO
    INPUT Value
    IF Value > -20 AND Value < 50 THEN
        Total <- Total + Value
        Count <- Count + 1
    ENDIF
ENDWHILE

OUTPUT Total
OUTPUT Total / 5`,
    solutionExplanation: 'The May/June 2025 Paper 22 flowchart uses an exclusive range check before totalling. Rejected values are not counted, so the loop is driven by how many valid numbers have been stored, not by how many times INPUT ran.',
    testCases: [
      { inputs: ['-20', '50', '0', '10', '20', '30', '40'], expectedOutput: '100\n20', description: 'Both bounds rejected', sortOrder: 0 },
      { inputs: ['1', '2', '3', '4', '5'], expectedOutput: '15\n3', description: 'Five valid values immediately', sortOrder: 1 },
      { inputs: ['-19', '49', '0', '0', '0'], expectedOutput: '30\n6', description: 'Values just inside the exclusive bounds', sortOrder: 2, isHidden: true },
    ],
  },

  // ════════════════════════════════════════ OCT/NOV 2025 UNSEEN ═══

  {
    title: 'Dropped-Score Qualifier',
    description: `Three named competitors each complete 4 rounds. Read the names, then a score from 0 to 30 for every competitor in every round (re-read until valid).

For each competitor, drop their highest round and their lowest round, then total the two remaining scores:

- \`qualified\` if the remaining total is 40 or more
- \`reserve\` if it is 30 to 39 inclusive
- \`not qualified\` otherwise

Output each name with their category, then the three category counts.

**Input:** 3 names, then 12 scores in competitor-major order.
**Output:** Three result lines, then three count lines.

**Example:**
\`\`\`
Input:  Ann
        Ben
        Cat
        30
        30
        20
        20
        10
        10
        10
        10
        15
        15
        15
        15
Output: Ann qualified
        Ben not qualified
        Cat reserve
        Qualified: 1
        Reserve: 1
        Not qualified: 1
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'Oct/Nov 2025', 'Paper 21', 'Past Paper', 'Unseen', '15 Marks', '2D Arrays'],
    year: 2025,
    session: 'Oct/Nov',
    variant: 1,
    paper: '0478/21',
    questionNumber: 11,
    marks: 15,
    starterCode: `DECLARE CompetitorName : ARRAY[1:3] OF STRING
DECLARE CompetitorScore : ARRAY[1:3, 1:4] OF INTEGER
DECLARE X, Round, Score, Highest, Lowest, Kept : INTEGER
DECLARE Qualified, Reserve, NotQualified : INTEGER

// Read names, validate 0-30 scores, drop high and low, then classify`,
    hints: [
      'After storing four scores, walk them once to find Highest and Lowest, then Kept <- total - Highest - Lowest.',
      'Reset Highest to 0 and Lowest to 999 at the start of each competitor.',
      'Use three counters and output the counts after every competitor has been classified.',
    ],
    solution: `DECLARE CompetitorName : ARRAY[1:3] OF STRING
DECLARE CompetitorScore : ARRAY[1:3, 1:4] OF INTEGER
DECLARE X, Round, Score, Highest, Lowest, Kept : INTEGER
DECLARE Qualified, Reserve, NotQualified : INTEGER

Qualified <- 0
Reserve <- 0
NotQualified <- 0

FOR X <- 1 TO 3
    INPUT CompetitorName[X]
NEXT X

FOR X <- 1 TO 3
    FOR Round <- 1 TO 4
        REPEAT
            INPUT Score
        UNTIL Score >= 0 AND Score <= 30
        CompetitorScore[X, Round] <- Score
    NEXT Round
NEXT X

FOR X <- 1 TO 3
    Highest <- 0
    Lowest <- 999
    Score <- 0
    FOR Round <- 1 TO 4
        Score <- Score + CompetitorScore[X, Round]
        IF CompetitorScore[X, Round] > Highest THEN
            Highest <- CompetitorScore[X, Round]
        ENDIF
        IF CompetitorScore[X, Round] < Lowest THEN
            Lowest <- CompetitorScore[X, Round]
        ENDIF
    NEXT Round
    Kept <- Score - Highest - Lowest
    IF Kept >= 40 THEN
        OUTPUT CompetitorName[X] & " qualified"
        Qualified <- Qualified + 1
    ELSE
        IF Kept >= 30 THEN
            OUTPUT CompetitorName[X] & " reserve"
            Reserve <- Reserve + 1
        ELSE
            OUTPUT CompetitorName[X] & " not qualified"
            NotQualified <- NotQualified + 1
        ENDIF
    ENDIF
NEXT X

OUTPUT "Qualified: " & Qualified
OUTPUT "Reserve: " & Reserve
OUTPUT "Not qualified: " & NotQualified`,
    solutionExplanation: 'The Oct/Nov 2025 Paper 21 unseen 15-mark discards each competitor\'s best and worst rounds before classifying. Nested validation fills the 2D score table; a second pass totals, finds the extremes, and bands the remaining score.',
    testCases: [
      {
        inputs: ['Ann', 'Ben', 'Cat', '30', '30', '20', '20', '10', '10', '10', '10', '15', '15', '15', '15'],
        expectedOutput: 'Ann qualified\nBen not qualified\nCat reserve\nQualified: 1\nReserve: 1\nNot qualified: 1',
        description: 'One of each category',
        sortOrder: 0,
      },
      {
        inputs: ['Jo', 'Mo', 'Bo', '-1', '30', '30', '30', '30', '0', '0', '0', '0', '15', '15', '15', '15'],
        expectedOutput: 'Jo qualified\nMo not qualified\nBo reserve\nQualified: 1\nReserve: 1\nNot qualified: 1',
        description: 'Negative score rejected, then Jo 60 / Mo 0 / Bo 30 after drops',
        sortOrder: 1,
      },
      {
        inputs: ['A', 'B', 'C', '10', '10', '10', '10', '10', '10', '10', '10', '10', '10', '10', '10'],
        expectedOutput: 'A not qualified\nB not qualified\nC not qualified\nQualified: 0\nReserve: 0\nNot qualified: 3',
        description: 'All remaining totals are 20',
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },

  // ════════════════════════════════════════ MAY/JUNE 2026 UNSEEN ═══

  {
    title: 'Monthly Sunshine Totals',
    description: `Sunshine is stored in minutes. For this practice version January has 3 days, February has 2 (3 in a leap year), and March has 3. A year is treated as a leap year when \`MOD(Year, 4) = 0\`.

Read the year, then the month name. Set February's length from the leap-year test. Then read that many daily totals, each validated to 0–1440 inclusive.

Output the month total as hours and minutes, and the highest single day in minutes.

**Input:** Year, month name, then one integer per day of that month.
**Output:** \`Total: <h> hours <m> minutes\` then \`Highest: <n> minutes\`.

**Example:**
\`\`\`
Input:  2024
        February
        60
        120
        180
Output: Total: 6 hours 0 minutes
        Highest: 180 minutes
\`\`\``,
    difficulty: 'HARD' as const,
    topic: 'Arrays',
    tags: ['IGCSE', '0478', 'May/June 2026', 'Paper 21', 'Past Paper', 'Unseen', '15 Marks', 'Arrays', 'Validation'],
    year: 2026,
    session: 'May/June',
    variant: 1,
    paper: '0478/21',
    questionNumber: 12,
    marks: 15,
    starterCode: `DECLARE MonthDays : ARRAY[1:3] OF INTEGER
DECLARE Sunshine : ARRAY[1:3] OF INTEGER
DECLARE Year, Days, Count, Sun, Total, Max : INTEGER
DECLARE Month, Month1 : STRING

MonthDays[1] <- 3
MonthDays[2] <- 2
MonthDays[3] <- 3

// Read year and month, adjust February for leap years, then total the validated daily minutes`,
    hints: [
      'If MOD(Year, 4) = 0 then MonthDays[2] <- 3, otherwise it stays 2.',
      'LCASE the month name and CASE OF "january" / "february" / "march" to set Days from MonthDays.',
      'REPEAT INPUT Sun UNTIL Sun >= 0 AND Sun <= 1440. Track Total and Max inside that day loop.',
    ],
    solution: `DECLARE MonthDays : ARRAY[1:3] OF INTEGER
DECLARE Sunshine : ARRAY[1:3] OF INTEGER
DECLARE Year, Days, Count, Sun, Total, Max : INTEGER
DECLARE Month, Month1 : STRING

MonthDays[1] <- 3
MonthDays[2] <- 2
MonthDays[3] <- 3
Total <- 0
Max <- 0

INPUT Year
INPUT Month
IF MOD(Year, 4) = 0 THEN
    MonthDays[2] <- 3
ENDIF
Month1 <- LCASE(Month)
CASE OF Month1
    "january" : Days <- MonthDays[1]
    "february" : Days <- MonthDays[2]
    "march" : Days <- MonthDays[3]
ENDCASE

FOR Count <- 1 TO Days
    REPEAT
        INPUT Sun
    UNTIL Sun >= 0 AND Sun <= 1440
    Sunshine[Count] <- Sun
    Total <- Total + Sun
    IF Sun > Max THEN
        Max <- Sun
    ENDIF
NEXT Count

OUTPUT "Total: " & DIV(Total, 60) & " hours " & MOD(Total, 60) & " minutes"
OUTPUT "Highest: " & Max & " minutes"`,
    solutionExplanation: 'The May/June 2026 Paper 21 unseen 15-mark combines a leap-year update of a days-per-month array, CASE OF on the month name, validated daily input, and DIV/MOD to report hours and minutes.',
    testCases: [
      {
        inputs: ['2024', 'February', '60', '120', '180'],
        expectedOutput: 'Total: 6 hours 0 minutes\nHighest: 180 minutes',
        description: 'Leap year February has three days',
        sortOrder: 0,
      },
      {
        inputs: ['2023', 'February', '60', '90'],
        expectedOutput: 'Total: 2 hours 30 minutes\nHighest: 90 minutes',
        description: 'Non-leap February has two days',
        sortOrder: 1,
      },
      {
        inputs: ['2025', 'January', '-5', '1440', '0', '60'],
        expectedOutput: 'Total: 25 hours 0 minutes\nHighest: 1440 minutes',
        description: 'Negative minutes rejected, then a full 1440-minute day',
        sortOrder: 2,
        isHidden: true,
      },
      {
        inputs: ['2026', 'March', '10', '20', '30'],
        expectedOutput: 'Total: 1 hours 0 minutes\nHighest: 30 minutes',
        description: 'March always has three days',
        sortOrder: 3,
        isHidden: true,
      },
    ],
  },

  {
    title: 'River BOD Pollution Report',
    description: `Two rivers are sampled for 4 days. Store names in \`RiverNames\` and readings in \`RiverStats[1:4, 1:2]\` (rows are days, columns are rivers).

A day is moderately polluted when BOD is from 2 to 8 inclusive, and highly polluted when BOD is greater than 8. For each river output the average BOD rounded to 2 d.p., the moderate-day count, and the high-day count. Then output the river with the most highly polluted days (first river wins a tie).

**Input:** Two names, then 8 readings day-by-day (river 1 then river 2, four times).
**Output:** Two river summaries, then the most-polluted name.

**Example:**
\`\`\`
Input:  Nile
        Amazon
        1
        3
        2
        3
        9
        3
        10
        3
Output: Nile average 5.5 moderate 1 high 2
        Amazon average 3 moderate 4 high 0
        Most polluted: Nile
\`\`\``,
    difficulty: 'HARD' as const,
    topic: '2D Arrays',
    tags: ['IGCSE', '0478', 'May/June 2026', 'Paper 23', 'Past Paper', 'Unseen', '15 Marks', '2D Arrays'],
    year: 2026,
    session: 'May/June',
    variant: 3,
    paper: '0478/23',
    questionNumber: 10,
    marks: 15,
    starterCode: `DECLARE RiverNames : ARRAY[1:2] OF STRING
DECLARE RiverStats : ARRAY[1:4, 1:2] OF REAL
DECLARE DaysCount : ARRAY[1:2, 1:2] OF INTEGER
DECLARE Day, River : INTEGER
DECLARE TotalBOD, AverageBOD : REAL
DECLARE MostPollution : INTEGER
DECLARE MostPollRiver : STRING

// Read names and 4 days of BOD, then average, count bands, and find the worst river`,
    hints: [
      'Input order is day-major: for each of 4 days, read river 1 then river 2 into RiverStats[Day, River].',
      'Moderate is >= 2 AND <= 8 stored in DaysCount[River, 1]. High is > 8 stored in DaysCount[River, 2].',
      'The most polluted river is the one with the larger high-day count, not the larger average.',
    ],
    solution: `DECLARE RiverNames : ARRAY[1:2] OF STRING
DECLARE RiverStats : ARRAY[1:4, 1:2] OF REAL
DECLARE DaysCount : ARRAY[1:2, 1:2] OF INTEGER
DECLARE Day, River : INTEGER
DECLARE TotalBOD, AverageBOD : REAL
DECLARE MostPollution : INTEGER
DECLARE MostPollRiver : STRING

FOR River <- 1 TO 2
    INPUT RiverNames[River]
NEXT River
FOR Day <- 1 TO 4
    FOR River <- 1 TO 2
        INPUT RiverStats[Day, River]
    NEXT River
NEXT Day

FOR River <- 1 TO 2
    TotalBOD <- 0
    DaysCount[River, 1] <- 0
    DaysCount[River, 2] <- 0
    FOR Day <- 1 TO 4
        TotalBOD <- TotalBOD + RiverStats[Day, River]
        IF RiverStats[Day, River] >= 2 AND RiverStats[Day, River] <= 8 THEN
            DaysCount[River, 1] <- DaysCount[River, 1] + 1
        ENDIF
        IF RiverStats[Day, River] > 8 THEN
            DaysCount[River, 2] <- DaysCount[River, 2] + 1
        ENDIF
    NEXT Day
    AverageBOD <- ROUND(TotalBOD / 4, 2)
    OUTPUT RiverNames[River] & " average " & AverageBOD & " moderate " & DaysCount[River, 1] & " high " & DaysCount[River, 2]
NEXT River

MostPollRiver <- RiverNames[1]
MostPollution <- DaysCount[1, 2]
IF DaysCount[2, 2] > MostPollution THEN
    MostPollRiver <- RiverNames[2]
    MostPollution <- DaysCount[2, 2]
ENDIF
OUTPUT "Most polluted: " & MostPollRiver`,
    solutionExplanation: 'The May/June 2026 Paper 23 unseen 15-mark stores a day×river grid of BOD readings. Band counts use inclusive moderate bounds and a strict high bound; the worst river is chosen from the high-pollution count, not from the average.',
    testCases: [
      {
        inputs: ['Nile', 'Amazon', '1', '3', '2', '3', '9', '3', '10', '3'],
        expectedOutput: 'Nile average 5.5 moderate 1 high 2\nAmazon average 3 moderate 4 high 0\nMost polluted: Nile',
        description: 'Nile has two high days',
        sortOrder: 0,
      },
      {
        inputs: ['A', 'B', '0', '9', '0', '9', '0', '9', '0', '9'],
        expectedOutput: 'A average 0 moderate 0 high 0\nB average 9 moderate 0 high 4\nMost polluted: B',
        description: 'Readings of 0 are neither moderate nor high',
        sortOrder: 1,
      },
      {
        inputs: ['X', 'Y', '8', '8', '8', '8', '8', '8', '8', '8'],
        expectedOutput: 'X average 8 moderate 4 high 0\nY average 8 moderate 4 high 0\nMost polluted: X',
        description: 'Tie on high days keeps the first river',
        sortOrder: 2,
        isHidden: true,
      },
    ],
  },
];
