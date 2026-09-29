import type { LearnLevel } from '../../types';

export const alevel2: LearnLevel = {
  number: 2,
  slug: '2',
  name: 'Types',
  hours: '2',
  leaveWith: 'CASE ranges, DATE, enumerated types',
  syllabus: '9618 §10.1',
  free: true,
  playable: true,
  lessons: [
    {
      id: 'as2.1',
      slug: 'case-range',
      title: 'CASE labels can be ranges',
      type: 'grade',
      minutes: 7,
      why: 'IGCSE CASE matches one value. 9618 adds inclusive ranges, which is how grade boundaries are written.',
      docsAnchor: 'alevel-case-ranges',
      body: `Read an integer mark from 0 to 100. Output the grade:

- 80 TO 100 → \`A\`
- 60 TO 79 → \`B\`
- 40 TO 59 → \`C\`
- anything else → \`U\`

\`80 TO 100\` includes both ends.`,
      trap: 'Write `80 TO 100 :` with the colon. A chain of IF is not what this question is practising.',
      starterCode: `DECLARE Mark : INTEGER
INPUT Mark

// CASE OF Mark, with TO ranges`,
      solutionCode: `DECLARE Mark : INTEGER
INPUT Mark

CASE OF Mark
    80 TO 100 : OUTPUT "A"
    60 TO 79 : OUTPUT "B"
    40 TO 59 : OUTPUT "C"
    OTHERWISE : OUTPUT "U"
ENDCASE`,
      tests: [
        { inputs: ['80'], expectedOutput: 'A' },
        { inputs: ['100'], expectedOutput: 'A' },
        { inputs: ['79'], expectedOutput: 'B' },
        { inputs: ['40'], expectedOutput: 'C' },
        { inputs: ['39'], expectedOutput: 'U' },
        { inputs: ['0'], expectedOutput: 'U' },
      ],
      mustContain: ['TO', 'ENDCASE'],
      playable: true,
    },
    {
      id: 'as2.2',
      slug: 'case-list',
      title: 'Several values, one branch',
      type: 'grade',
      minutes: 6,
      why: 'A label can list values separated by commas. Weekday and weekend are that pattern, not five copied lines.',
      docsAnchor: 'alevel-case-ranges',
      body: `Read an integer day number. Output:

- 1, 2, 3, 4 or 5 → \`weekday\`
- 6 or 7 → \`weekend\`
- anything else → \`invalid\``,
      starterCode: `DECLARE Day : INTEGER
INPUT Day

// CASE OF Day with comma-separated labels`,
      solutionCode: `DECLARE Day : INTEGER
INPUT Day

CASE OF Day
    1, 2, 3, 4, 5 : OUTPUT "weekday"
    6, 7 : OUTPUT "weekend"
    OTHERWISE : OUTPUT "invalid"
ENDCASE`,
      tests: [
        { inputs: ['1'], expectedOutput: 'weekday' },
        { inputs: ['5'], expectedOutput: 'weekday' },
        { inputs: ['6'], expectedOutput: 'weekend' },
        { inputs: ['7'], expectedOutput: 'weekend' },
        { inputs: ['0'], expectedOutput: 'invalid' },
        { inputs: ['8'], expectedOutput: 'invalid' },
      ],
      mustContain: ['ENDCASE'],
      playable: true,
    },
    {
      id: 'as2.3',
      slug: 'date',
      title: 'DATE compares in calendar order',
      type: 'grade',
      minutes: 6,
      why: 'DATE is a real type in 9618, written dd/mm/yyyy. < means earlier, not a smaller string.',
      docsAnchor: 'alevel-date',
      body: `Read a DATE (the input looks like \`02/01/2005\`). If it is earlier than **01/09/2010**, output \`before\`. Otherwise output \`on or after\`.

\`02/01/2005 < 01/09/2010\` is TRUE. A date written without spaces is a date; \`10 / 02 / 2005\` with spaces is division.`,
      trap: 'Declare the variable as DATE before INPUT, or the text will not be read as a date.',
      starterCode: `DECLARE Birthday : DATE
INPUT Birthday

// OUTPUT "before" or "on or after"`,
      solutionCode: `DECLARE Birthday : DATE
INPUT Birthday

IF Birthday < 01/09/2010 THEN
    OUTPUT "before"
ELSE
    OUTPUT "on or after"
ENDIF`,
      tests: [
        { inputs: ['02/01/2005'], expectedOutput: 'before' },
        { inputs: ['31/08/2010'], expectedOutput: 'before' },
        { inputs: ['01/09/2010'], expectedOutput: 'on or after' },
        { inputs: ['15/06/2012'], expectedOutput: 'on or after' },
      ],
      mustContain: ['DATE'],
      playable: true,
    },
    {
      id: 'as2.4',
      slug: 'enum',
      title: 'An enumerated type has an order',
      type: 'mutate',
      minutes: 5,
      why: 'Spring, Summer, Autumn, Winter is a TYPE, not four strings. Adding 1 moves to the next value in the list.',
      docsAnchor: 'alevel-types',
      body: `\`ThisSeason\` is Spring. The program prints Spring.

Change the OUTPUT so it prints the **next** season. Adding 1 walks the list in the order it was written. Do not write the string \`"Summer"\`.`,
      trap: 'Stepping past the last value is an error. Winter + 1 does not wrap round to Spring.',
      starterCode: `TYPE Season = (Spring, Summer, Autumn, Winter)
DECLARE ThisSeason : Season
ThisSeason <- Spring
OUTPUT ThisSeason`,
      solutionCode: `TYPE Season = (Spring, Summer, Autumn, Winter)
DECLARE ThisSeason : Season
ThisSeason <- Spring
OUTPUT ThisSeason + 1`,
      expectedOutput: 'Summer',
      mustContain: ['+ 1'],
      playable: true,
    },
    {
      id: 'as2.5',
      slug: 'types-quiz',
      title: 'Which type is it?',
      type: 'quiz',
      minutes: 4,
      why: 'These three are the 9618 additions students miss by writing a STRING or a long IF.',
      body: `DATE, enumerated types and CASE ranges are in the pseudocode guide. They are not IGCSE syntax with a new name.`,
      quiz: [
        {
          prompt: 'A birthday stored for comparison should be:',
          options: [
            { id: 'str', label: 'A STRING "02/01/2005", compared with <' },
            { id: 'date', label: 'A DATE literal 02/01/2005' },
            { id: 'int', label: 'Three INTEGERs and no DATE' },
          ],
          correctId: 'date',
          explanation: 'DATE values compare chronologically. A string compare is alphabetical, and 10/02/2005 without spaces is already a date — spaced division is 10 / 02 / 2005.',
        },
        {
          prompt: 'TYPE Season = (Spring, Summer, Autumn, Winter). Summer + 1 is:',
          options: [
            { id: 'aut', label: 'Autumn' },
            { id: 'num', label: 'The integer 2' },
            { id: 'str', label: 'The string "Summer1"' },
          ],
          correctId: 'aut',
          explanation: 'Enum values have positions. Adding 1 moves one step along the list written in the TYPE.',
        },
        {
          prompt: 'A mark from 80 to 100 inclusive is written in CASE as:',
          options: [
            { id: 'range', label: '80 TO 100 :' },
            { id: 'if', label: 'IF 80 TO 100 THEN' },
            { id: 'dots', label: '80...100 :' },
          ],
          correctId: 'range',
          explanation: 'TO is inclusive on both ends, and the colon closes the label. IF does not use TO.',
        },
      ],
      playable: true,
    },
    {
      id: 'as2.6',
      slug: 'weekday',
      title: 'Boss: earlier date, then a grade',
      type: 'grade',
      minutes: 8,
      why: 'Paper 2 mixes the new types in one algorithm. This one uses a DATE comparison and a CASE range.',
      docsAnchor: 'alevel-date',
      body: `Read a DATE, then an integer mark.

First output \`early\` if the date is before 01/01/2010, otherwise \`later\`.

Then output the grade for the mark: 75 TO 100 → \`merit\`, 40 TO 74 → \`pass\`, otherwise \`fail\`.

Example: \`15/06/2008\` then \`80\` prints:

\`early\`
\`merit\``,
      starterCode: `DECLARE When : DATE
DECLARE Mark : INTEGER
INPUT When
INPUT Mark

// two OUTPUT lines: early/later, then merit/pass/fail`,
      solutionCode: `DECLARE When : DATE
DECLARE Mark : INTEGER
INPUT When
INPUT Mark

IF When < 01/01/2010 THEN
    OUTPUT "early"
ELSE
    OUTPUT "later"
ENDIF

CASE OF Mark
    75 TO 100 : OUTPUT "merit"
    40 TO 74 : OUTPUT "pass"
    OTHERWISE : OUTPUT "fail"
ENDCASE`,
      tests: [
        { inputs: ['15/06/2008', '80'], expectedOutput: 'early\nmerit' },
        { inputs: ['01/01/2010', '75'], expectedOutput: 'later\nmerit' },
        { inputs: ['02/03/2015', '40'], expectedOutput: 'later\npass' },
        { inputs: ['31/12/2009', '10'], expectedOutput: 'early\nfail' },
        { inputs: ['01/01/2010', '74'], expectedOutput: 'later\npass' },
      ],
      mustContain: ['DATE', 'TO'],
      playable: true,
    },
  ],
};
