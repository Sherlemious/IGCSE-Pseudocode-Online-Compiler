import type { LearnLevel } from '../types';

export const level6: LearnLevel = {
  number: 6,
  slug: '6',
  name: 'Text',
  hours: '2.5',
  leaveWith: 'LENGTH / SUBSTRING with 1-based index',
  syllabus: '8.1.4e',
  free: false,
  playable: true,
  lessons: [
    {
      id: '6.1',
      slug: 'string',
      title: 'STRING is 1-based',
      type: 'run',
      minutes: 5,
      why: 'Position 1 is the first character — not 0. Paper 2 traces die on this.',
      docsAnchor: 'string-functions',
      body: `**SUBSTRING(string, start, length)** uses a start position of **1** for the first character.

Output the first character of \`"IGCSE"\`.`,
      trap: 'Python `s[0]` is IGCSE `SUBSTRING(s, 1, 1)`.',
      starterCode: `DECLARE Word : STRING
Word <- "IGCSE"
OUTPUT SUBSTRING(Word, 1, 1)`,
      solutionCode: `DECLARE Word : STRING
Word <- "IGCSE"
OUTPUT SUBSTRING(Word, 1, 1)`,
      expectedOutput: 'I',
      mustContain: ['SUBSTRING'],
      playable: true,
    },
    {
      id: '6.2',
      slug: 'length',
      title: 'LENGTH, UCASE, LCASE',
      type: 'grade',
      minutes: 8,
      why: 'Library string functions. The paper will name them; you must call them with the right arguments.',
      docsAnchor: 'string-functions',
      body: `Read a string. Output three lines:

1. **LENGTH** of the string
2. The string in **UCASE**
3. The string in **LCASE**

Example: input \`Ig\` →

\`2\`
\`IG\`
\`ig\``,
      starterCode: `DECLARE Word : STRING

INPUT Word

// OUTPUT LENGTH, UCASE, LCASE`,
      solutionCode: `DECLARE Word : STRING

INPUT Word

OUTPUT LENGTH(Word)
OUTPUT UCASE(Word)
OUTPUT LCASE(Word)`,
      tests: [
        { inputs: ['Ig'], expectedOutput: '2\nIG\nig' },
        { inputs: ['A'], expectedOutput: '1\nA\na' },
        { inputs: ['Paper'], expectedOutput: '5\nPAPER\npaper' },
        { inputs: ['OK'], expectedOutput: '2\nOK\nok' },
      ],
      mustContain: ['LENGTH', 'UCASE', 'LCASE'],
      playable: true,
    },
    {
      id: '6.3',
      slug: 'substring',
      title: 'SUBSTRING(str, start, length)',
      type: 'grade',
      minutes: 8,
      why: 'Start is 1-based. The third argument is the length, not the end index.',
      docsAnchor: 'string-functions',
      body: `Read a string that is at least 3 characters. Output its **first three** characters.

Example: input \`Cambridge\` → \`Cam\`.`,
      trap: '`SUBSTRING(s, 1, 3)` is characters 1, 2 and 3. Not “from 1 to 3” as an end index in some languages.',
      starterCode: `DECLARE Word : STRING

INPUT Word

// OUTPUT the first three characters`,
      solutionCode: `DECLARE Word : STRING

INPUT Word

OUTPUT SUBSTRING(Word, 1, 3)`,
      tests: [
        { inputs: ['Cambridge'], expectedOutput: 'Cam' },
        { inputs: ['IGCSE'], expectedOutput: 'IGC' },
        { inputs: ['abc'], expectedOutput: 'abc' },
        { inputs: ['Paper2'], expectedOutput: 'Pap' },
      ],
      mustContain: ['SUBSTRING'],
      playable: true,
    },
    {
      id: '6.6',
      slug: 'char-loop',
      title: 'One character at a time',
      type: 'grade',
      minutes: 8,
      why: 'The 15-mark string method: FOR i <- 1 TO LENGTH, SUBSTRING(..., i, 1).',
      docsAnchor: 'string-functions',
      body: `Read a word. Output **each character** on its own line.

Example: input \`CAT\` →

\`C\`
\`A\`
\`T\``,
      trap: 'Start the loop at 1, not 0. The last index is LENGTH(word), not LENGTH − 1.',
      starterCode: `DECLARE Word : STRING
DECLARE i : INTEGER

INPUT Word

// FOR i <- 1 TO LENGTH(Word) — OUTPUT each character`,
      solutionCode: `DECLARE Word : STRING
DECLARE i : INTEGER

INPUT Word

FOR i <- 1 TO LENGTH(Word)
    OUTPUT SUBSTRING(Word, i, 1)
NEXT i`,
      tests: [
        { inputs: ['CAT'], expectedOutput: 'C\nA\nT' },
        { inputs: ['A'], expectedOutput: 'A' },
        { inputs: ['Hi'], expectedOutput: 'H\ni' },
        { inputs: ['IGCSE'], expectedOutput: 'I\nG\nC\nS\nE' },
      ],
      mustContain: ['LENGTH', 'SUBSTRING'],
      playable: true,
    },
    {
      id: '6.4',
      slug: 'concat',
      title: 'Join with &',
      type: 'run',
      minutes: 4,
      why: 'Concatenation is &, not +. + is addition; using it on strings is a type error on paper.',
      docsAnchor: 'concatenation',
      body: `Join strings with **&**. Spaces are your job — include \`" "\` if you want a gap.

Output **Ada Lovelace** from the two names below.`,
      trap: '`+` concatenates in Python. Here `+` adds numbers. Use `&`.',
      starterCode: `DECLARE First : STRING
DECLARE Last : STRING
First <- "Ada"
Last <- "Lovelace"
OUTPUT First & " " & Last`,
      solutionCode: `DECLARE First : STRING
DECLARE Last : STRING
First <- "Ada"
Last <- "Lovelace"
OUTPUT First & " " & Last`,
      expectedOutput: 'Ada Lovelace',
      mustContain: ['&'],
      mustNotContain: ['+'],
      playable: true,
    },
    {
      id: '6.7',
      slug: 'initials',
      title: 'Build initials with &',
      type: 'grade',
      minutes: 6,
      why: 'SUBSTRING one character from each name, then join with &. A tiny Paper 2 string item.',
      docsAnchor: 'concatenation',
      body: `Read **First** then **Last**. Output the two initials joined, no space.

Example: input \`Ada\` then \`Lovelace\` → \`AL\`.`,
      trap: 'First character is position 1: `SUBSTRING(First, 1, 1)`. Join with `&`, not `+`.',
      starterCode: `DECLARE First : STRING
DECLARE Last : STRING

INPUT First
INPUT Last

// OUTPUT the two initials joined`,
      solutionCode: `DECLARE First : STRING
DECLARE Last : STRING

INPUT First
INPUT Last

OUTPUT SUBSTRING(First, 1, 1) & SUBSTRING(Last, 1, 1)`,
      tests: [
        { inputs: ['Ada', 'Lovelace'], expectedOutput: 'AL' },
        { inputs: ['Bob', 'Smith'], expectedOutput: 'BS' },
        { inputs: ['i', 'g'], expectedOutput: 'ig' },
        { inputs: ['Paper', 'Two'], expectedOutput: 'PT' },
      ],
      mustContain: ['SUBSTRING', '&'],
      playable: true,
    },
    {
      id: '6.5',
      slug: 'boss',
      title: 'Boss: Medium String Processing',
      type: 'grade',
      minutes: 12,
      why: 'A typical Medium: walk the string with FOR, SUBSTRING one character at a time, count.',
      docsAnchor: 'string-functions',
      body: `Read a word. Count the vowels **a e i o u** (ignore case). Output the count.

Example: input \`hello\` → \`2\`.`,
      trap: 'Convert each character with LCASE so you only test against lowercase vowels.',
      starterCode: `DECLARE Text : STRING
DECLARE i : INTEGER
DECLARE Ch : STRING
DECLARE VowelCount : INTEGER

INPUT Text

VowelCount <- 0
// loop 1 TO LENGTH(Text), count vowels, OUTPUT VowelCount`,
      solutionCode: `DECLARE Text : STRING
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
      tests: [
        { inputs: ['hello'], expectedOutput: '2' },
        { inputs: ['AEIOU'], expectedOutput: '5' },
        { inputs: ['rhythm'], expectedOutput: '0' },
        { inputs: ['Ig'], expectedOutput: '1' },
        { inputs: ['Paper'], expectedOutput: '2' },
      ],
      playable: true,
    },
  ],
};
