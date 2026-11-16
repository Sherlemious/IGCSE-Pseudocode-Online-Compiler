import type { LearnLevel } from '../types';

export const level9: LearnLevel = {
  number: 9,
  slug: '9',
  name: 'Files',
  hours: '2.5',
  leaveWith: 'OPEN → USE → CLOSE, read until EOF',
  syllabus: '8.3',
  free: false,
  playable: true,
  lessons: [
    {
      id: '9.1',
      slug: 'why',
      title: 'Why a file beats variables',
      type: 'quiz',
      minutes: 4,
      why: 'Data in a variable dies when the program ends. A file is how the next run (or another program) sees it.',
      docsAnchor: 'file-ops',
      body: `Variables live in RAM for one run. Files persist after **CLOSEFILE**.`,
      quiz: [
        {
          prompt: 'A list of student names must still be there tomorrow. Store it in:',
          options: [
            { id: 'arr', label: 'An ARRAY in the program' },
            { id: 'file', label: 'A file, opened, written, then closed' },
            { id: 'const', label: 'A CONSTANT' },
          ],
          correctId: 'file',
          explanation: 'Arrays and constants vanish when the run ends. A closed file is still on the store.',
        },
        {
          prompt: 'The usual order of file operations is:',
          options: [
            { id: 'use', label: 'USE → OPEN → CLOSE' },
            { id: 'open', label: 'OPEN → USE (read or write) → CLOSE' },
            { id: 'close', label: 'CLOSE → OPEN → USE' },
          ],
          correctId: 'open',
          explanation: 'OPENFILE, then READFILE or WRITEFILE, then CLOSEFILE. Missing CLOSEFILE is a named exam error.',
        },
        {
          prompt: 'EOF is checked when the file is open for:',
          options: [
            { id: 'read', label: 'READ' },
            { id: 'write', label: 'WRITE' },
            { id: 'either', label: 'Either READ or WRITE' },
          ],
          correctId: 'read',
          explanation: 'EOF means “no more lines to read”. It is a READ-mode test.',
        },
      ],
      playable: true,
    },
    {
      id: '9.2',
      slug: 'write',
      title: 'WRITEFILE and CLOSEFILE',
      type: 'grade',
      minutes: 8,
      why: 'Missing CLOSEFILE is a top examiner error. OPEN → WRITE → CLOSE, then prove it by reading back.',
      docsAnchor: 'file-write',
      body: `Write the line **IGCSE** to \`"note.txt"\`, close it, open it for READ, output the line, close it again.

Check looks at what you **OUTPUT**, so the read-back is part of the task.`,
      trap: 'WRITEFILE needs the filename and the value: `WRITEFILE "note.txt", Line`. Forgetting CLOSEFILE still sometimes saves here — the paper will still penalise it.',
      starterCode: `DECLARE Line : STRING

// OPENFILE "note.txt" FOR WRITE
// write "IGCSE", close, read back, OUTPUT, close`,
      solutionCode: `DECLARE Line : STRING

OPENFILE "note.txt" FOR WRITE
WRITEFILE "note.txt", "IGCSE"
CLOSEFILE "note.txt"

OPENFILE "note.txt" FOR READ
READFILE "note.txt", Line
OUTPUT Line
CLOSEFILE "note.txt"`,
      expectedOutput: 'IGCSE',
      mustContain: ['WRITEFILE', 'CLOSEFILE'],
      playable: true,
    },
    {
      id: '9.3',
      slug: 'read',
      title: 'READFILE until EOF',
      type: 'grade',
      minutes: 8,
      why: 'Do not hard-code the number of lines. WHILE NOT EOF(filename) is the Cambridge loop.',
      docsAnchor: 'file-read',
      body: `\`names.txt\` is already there (Check seeds it). Open it for READ. Output every line until **EOF**, then close the file.

Do not assume there are three lines — the file length can change between tests.`,
      trap: '`FOR i <- 1 TO 3` will pass one test and fail the next. EOF is the point of this lesson.',
      starterCode: `DECLARE Line : STRING

OPENFILE "names.txt" FOR READ
// WHILE NOT EOF("names.txt") DO
//     READFILE ...
//     OUTPUT Line
// ENDWHILE
CLOSEFILE "names.txt"`,
      solutionCode: `DECLARE Line : STRING

OPENFILE "names.txt" FOR READ
WHILE NOT EOF("names.txt") DO
    READFILE "names.txt", Line
    OUTPUT Line
ENDWHILE
CLOSEFILE "names.txt"`,
      tests: [
        {
          inputs: [],
          expectedOutput: 'Ada\nBob\nCyd',
          initialFiles: { 'names.txt': 'Ada\nBob\nCyd' },
        },
        {
          inputs: [],
          expectedOutput: 'Sam',
          initialFiles: { 'names.txt': 'Sam' },
        },
        {
          inputs: [],
          expectedOutput: 'Ann\nBea\nCal\nDee',
          initialFiles: { 'names.txt': 'Ann\nBea\nCal\nDee' },
        },
        {
          inputs: [],
          expectedOutput: 'Pat\nQ\nR\nS\nT',
          initialFiles: { 'names.txt': 'Pat\nQ\nR\nS\nT' },
        },
      ],
      mustContain: ['EOF'],
      playable: true,
    },
    {
      id: '9.5',
      slug: 'count-lines',
      title: 'Count records until EOF',
      type: 'grade',
      minutes: 8,
      why: 'A totaller over a file: Count <- 0, then Count <- Count + 1 on every READFILE until EOF.',
      docsAnchor: 'file-read',
      body: `\`names.txt\` is already there. Open it for READ. Count the lines (do not assume how many). Output the count, then close.

Example: a file with Ada, Bob, Cyd → \`3\`.`,
      trap: 'Increment after each READFILE, not before. An empty-looking FOR TO 3 will fail the next test.',
      starterCode: `DECLARE Line : STRING
DECLARE Count : INTEGER

Count <- 0
OPENFILE "names.txt" FOR READ
// WHILE NOT EOF("names.txt") — count lines
CLOSEFILE "names.txt"
// OUTPUT Count`,
      solutionCode: `DECLARE Line : STRING
DECLARE Count : INTEGER

Count <- 0
OPENFILE "names.txt" FOR READ
WHILE NOT EOF("names.txt") DO
    READFILE "names.txt", Line
    Count <- Count + 1
ENDWHILE
CLOSEFILE "names.txt"
OUTPUT Count`,
      tests: [
        {
          inputs: [],
          expectedOutput: '3',
          initialFiles: { 'names.txt': 'Ada\nBob\nCyd' },
        },
        {
          inputs: [],
          expectedOutput: '1',
          initialFiles: { 'names.txt': 'Sam' },
        },
        {
          inputs: [],
          expectedOutput: '4',
          initialFiles: { 'names.txt': 'Ann\nBea\nCal\nDee' },
        },
        {
          inputs: [],
          expectedOutput: '2',
          initialFiles: { 'names.txt': 'Pat\nQ' },
        },
      ],
      mustContain: ['EOF', 'Count'],
      playable: true,
    },
    {
      id: '9.6',
      slug: 'filter-file',
      title: 'Output matching lines',
      type: 'grade',
      minutes: 8,
      why: 'Read every record, OUTPUT only those that match a target — a file plus a counter/filter.',
      docsAnchor: 'file-read',
      body: `\`names.txt\` is seeded. Read a **Target** string. Open the file for READ and output every line that **equals** Target, then close.

Example: file Ada / Bob / Ada, input \`Ada\` →

\`Ada\`
\`Ada\``,
      starterCode: `DECLARE Line : STRING
DECLARE Target : STRING

INPUT Target
OPENFILE "names.txt" FOR READ
// output lines that equal Target
CLOSEFILE "names.txt"`,
      solutionCode: `DECLARE Line : STRING
DECLARE Target : STRING

INPUT Target
OPENFILE "names.txt" FOR READ
WHILE NOT EOF("names.txt") DO
    READFILE "names.txt", Line
    IF Line = Target THEN
        OUTPUT Line
    ENDIF
ENDWHILE
CLOSEFILE "names.txt"`,
      tests: [
        {
          inputs: ['Ada'],
          expectedOutput: 'Ada\nAda',
          initialFiles: { 'names.txt': 'Ada\nBob\nAda' },
        },
        {
          inputs: ['Bob'],
          expectedOutput: 'Bob',
          initialFiles: { 'names.txt': 'Ada\nBob\nAda' },
        },
        {
          inputs: ['Zed'],
          expectedOutput: 'Zed',
          initialFiles: { 'names.txt': 'Zed' },
        },
        {
          inputs: ['Cal'],
          expectedOutput: 'Cal\nCal\nCal',
          initialFiles: { 'names.txt': 'Cal\nCal\nCal' },
        },
      ],
      mustContain: ['EOF'],
      playable: true,
    },
    {
      id: '9.7',
      slug: 'append',
      title: 'OPENFILE FOR APPEND',
      type: 'grade',
      minutes: 8,
      why: 'WRITE truncates. APPEND adds to the end. Missing CLOSEFILE is still an exam error.',
      docsAnchor: 'file-write',
      body: `\`log.txt\` already contains **Start**. Open it **FOR APPEND**, write **Go**, close, then open for READ and output every line.

The two lines should be:

\`Start\`
\`Go\``,
      trap: '`FOR WRITE` would wipe Start. This task needs **APPEND**.',
      starterCode: `DECLARE Line : STRING

// OPENFILE "log.txt" FOR APPEND, write "Go", close, read back`,
      solutionCode: `DECLARE Line : STRING

OPENFILE "log.txt" FOR APPEND
WRITEFILE "log.txt", "Go"
CLOSEFILE "log.txt"

OPENFILE "log.txt" FOR READ
WHILE NOT EOF("log.txt") DO
    READFILE "log.txt", Line
    OUTPUT Line
ENDWHILE
CLOSEFILE "log.txt"`,
      tests: [
        {
          inputs: [],
          expectedOutput: 'Start\nGo',
          initialFiles: { 'log.txt': 'Start' },
        },
        {
          inputs: [],
          expectedOutput: 'A\nB\nGo',
          initialFiles: { 'log.txt': 'A\nB' },
        },
        {
          inputs: [],
          expectedOutput: 'Hi\nGo',
          initialFiles: { 'log.txt': 'Hi' },
        },
      ],
      mustContain: ['APPEND', 'WRITEFILE', 'CLOSEFILE'],
      playable: true,
    },
    {
      id: '9.4',
      slug: 'boss',
      title: 'Boss: Easy File Handling',
      type: 'grade',
      minutes: 10,
      why: 'Read N, write N names, close, read them all back until EOF.',
      docsAnchor: 'file-ops',
      body: `Read an integer **N**, then **N** names. Write each name to \`"class.txt"\`. Close. Open for READ and output every name until EOF.

Example: input \`2\` then \`Ada\`, \`Bob\` →

\`Ada\`
\`Bob\``,
      starterCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Name : STRING

INPUT N
// write N names to "class.txt", then read them all back`,
      solutionCode: `DECLARE N : INTEGER
DECLARE i : INTEGER
DECLARE Name : STRING

INPUT N
OPENFILE "class.txt" FOR WRITE
FOR i <- 1 TO N
    INPUT Name
    WRITEFILE "class.txt", Name
NEXT i
CLOSEFILE "class.txt"

OPENFILE "class.txt" FOR READ
WHILE NOT EOF("class.txt") DO
    READFILE "class.txt", Name
    OUTPUT Name
ENDWHILE
CLOSEFILE "class.txt"`,
      tests: [
        { inputs: ['2', 'Ada', 'Bob'], expectedOutput: 'Ada\nBob' },
        { inputs: ['1', 'Zed'], expectedOutput: 'Zed' },
        { inputs: ['3', 'Ann', 'Bea', 'Cal'], expectedOutput: 'Ann\nBea\nCal' },
        { inputs: ['4', 'A', 'B', 'C', 'D'], expectedOutput: 'A\nB\nC\nD' },
        { inputs: ['5', 'V', 'W', 'X', 'Y', 'Z'], expectedOutput: 'V\nW\nX\nY\nZ' },
      ],
      mustContain: ['WRITEFILE', 'EOF', 'CLOSEFILE'],
      playable: true,
    },
  ],
};
