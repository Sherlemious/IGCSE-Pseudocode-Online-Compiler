import type { LearnLevel } from '../../types';

const RECORD = `TYPE Student
    DECLARE Name : STRING
    DECLARE Mark : INTEGER
ENDTYPE`;

const GROUP = `${RECORD}

DECLARE Group : ARRAY[1:4] OF Student
Group[1].Name <- "Ada"
Group[1].Mark <- 80
Group[2].Name <- "Bob"
Group[2].Mark <- 54
Group[3].Name <- "Cy"
Group[3].Mark <- 91
Group[4].Name <- "Di"
Group[4].Mark <- 70`;

export const alevel1: LearnLevel = {
  number: 1,
  slug: '1',
  name: 'Records',
  hours: '2',
  leaveWith: 'TYPE … ENDTYPE, dot fields, copy by value, array of records',
  syllabus: '9618 §10.1',
  free: true,
  playable: true,
  lessons: [
    {
      id: 'as1.1',
      slug: 'record',
      title: 'A record groups different types',
      type: 'run',
      minutes: 5,
      why: 'Paper 2 stops using parallel arrays once the data belongs together. A record is one identifier with named fields.',
      docsAnchor: 'alevel-types',
      body: `**TYPE** names the shape. **ENDTYPE** closes it. Declare a variable of that type, then use a dot for each field.

Field names are not case-sensitive. \`FirstName\` and \`Firstname\` are the same field.

Run it, then Check.`,
      trap: 'The type name after DECLARE is an identifier, not a keyword. `DECLARE Pupil : Student` — Student is the TYPE you just wrote.',
      starterCode: `TYPE Student
    DECLARE Name : STRING
    DECLARE YearGroup : INTEGER
ENDTYPE

DECLARE Pupil : Student
Pupil.Name <- "Johnson"
Pupil.YearGroup <- 6

OUTPUT Pupil.Name
OUTPUT Pupil.YearGroup`,
      solutionCode: `TYPE Student
    DECLARE Name : STRING
    DECLARE YearGroup : INTEGER
ENDTYPE

DECLARE Pupil : Student
Pupil.Name <- "Johnson"
Pupil.YearGroup <- 6

OUTPUT Pupil.Name
OUTPUT Pupil.YearGroup`,
      expectedOutput: 'Johnson\n6',
      playable: true,
    },
    {
      id: 'as1.2',
      slug: 'copy',
      title: 'Assigning a record copies it',
      type: 'mutate',
      minutes: 5,
      why: 'Pupil2 <- Pupil1 copies the fields. Changing one record afterwards does not change the other. Objects do not work this way — records do.',
      docsAnchor: 'alevel-types',
      body: `This program copies \`Pupil1\` into \`Pupil2\`, then changes \`Pupil1.Name\` to Smith.

It prints the wrong name. Output the **copy**, which must still be Johnson.`,
      trap: 'If you wanted both variables to see the change, a record is the wrong tool. That is what a class object does later.',
      starterCode: `TYPE Student
    DECLARE Name : STRING
    DECLARE YearGroup : INTEGER
ENDTYPE

DECLARE Pupil1 : Student
DECLARE Pupil2 : Student
Pupil1.Name <- "Johnson"
Pupil1.YearGroup <- 6
Pupil2 <- Pupil1
Pupil1.Name <- "Smith"

OUTPUT Pupil1.Name`,
      solutionCode: `TYPE Student
    DECLARE Name : STRING
    DECLARE YearGroup : INTEGER
ENDTYPE

DECLARE Pupil1 : Student
DECLARE Pupil2 : Student
Pupil1.Name <- "Johnson"
Pupil1.YearGroup <- 6
Pupil2 <- Pupil1
Pupil1.Name <- "Smith"

OUTPUT Pupil2.Name`,
      expectedOutput: 'Johnson',
      playable: true,
    },
    {
      id: 'as1.3',
      slug: 'lookup',
      title: 'Look up one field',
      type: 'grade',
      minutes: 8,
      why: 'A typical Paper 2 task is an array of records plus a search for one field, instead of two parallel arrays.',
      docsAnchor: 'alevel-types',
      body: `The array is already filled. Read a name. Output that student's mark, or \`Not found\` if the name is not there.

Example: input \`Ada\` → \`80\`. Input \`Zed\` → \`Not found\`.`,
      starterCode: `${RECORD}

DECLARE Group : ARRAY[1:3] OF Student
Group[1].Name <- "Ada"
Group[1].Mark <- 80
Group[2].Name <- "Bob"
Group[2].Mark <- 54
Group[3].Name <- "Cy"
Group[3].Mark <- 91

DECLARE Target : STRING
INPUT Target

// OUTPUT the matching Mark, or "Not found"`,
      solutionCode: `${RECORD}

DECLARE Group : ARRAY[1:3] OF Student
Group[1].Name <- "Ada"
Group[1].Mark <- 80
Group[2].Name <- "Bob"
Group[2].Mark <- 54
Group[3].Name <- "Cy"
Group[3].Mark <- 91

DECLARE Target : STRING
DECLARE Found : BOOLEAN
Found <- FALSE
INPUT Target

FOR Index <- 1 TO 3
    IF Group[Index].Name = Target THEN
        OUTPUT Group[Index].Mark
        Found <- TRUE
    ENDIF
NEXT Index

IF Found = FALSE THEN
    OUTPUT "Not found"
ENDIF`,
      tests: [
        { inputs: ['Ada'], expectedOutput: '80' },
        { inputs: ['Bob'], expectedOutput: '54' },
        { inputs: ['Cy'], expectedOutput: '91' },
        { inputs: ['Zed'], expectedOutput: 'Not found' },
      ],
      playable: true,
    },
    {
      id: 'as1.4',
      slug: 'fields',
      title: 'Record or parallel arrays?',
      type: 'quiz',
      minutes: 4,
      why: 'The mark scheme wants the structure that keeps one student\'s data together, and it wants you to know assignment copies a record.',
      docsAnchor: 'alevel-types',
      body: `A record is one value with several fields. An array of records is how a class list is stored in 9618 pseudocode.`,
      quiz: [
        {
          prompt: 'A student has a name (STRING) and a mark (INTEGER). The Cambridge way to store one student is:',
          options: [
            { id: 'two', label: 'Two variables that you promise to keep in step' },
            { id: 'rec', label: 'A record with a Name field and a Mark field' },
            { id: 'str', label: 'One STRING such as "Ada,80"' },
          ],
          correctId: 'rec',
          explanation: 'A record holds different types under one identifier. Splitting them, or packing them into a string, is what the record replaces.',
        },
        {
          prompt: 'After Pupil2 <- Pupil1 and then Pupil1.Name <- "Smith", what is Pupil2.Name?',
          options: [
            { id: 'smith', label: 'Smith — both names refer to the same record' },
            { id: 'old', label: 'The name Pupil1 had at the moment of the copy' },
            { id: 'blank', label: 'An empty string — assignment clears the source' },
          ],
          correctId: 'old',
          explanation: 'Record assignment copies every field. Later changes to Pupil1 do not appear in Pupil2.',
        },
        {
          prompt: 'Form is ARRAY[1:30] OF StudentRecord. The year group of student 15 is:',
          options: [
            { id: 'dot', label: 'Form[15].YearGroup' },
            { id: 'two', label: 'Form[15, YearGroup]' },
            { id: 'call', label: 'YearGroup(Form, 15)' },
          ],
          correctId: 'dot',
          explanation: 'Index the array, then dot the field. The comma form is a 2D array, not a record.',
        },
      ],
      playable: true,
    },
    {
      id: 'as1.5',
      slug: 'input-record',
      title: 'INPUT a field',
      type: 'grade',
      minutes: 6,
      why: 'INPUT can target a field directly. The paper writes INPUT Pupil.Name, not a temporary variable and a copy.',
      docsAnchor: 'alevel-types',
      body: `Read a name and a mark straight into the record. Output one line:

\`Name scored Mark\`

Example: input \`Ada\` then \`80\` → \`Ada scored 80\`.`,
      trap: 'The comma in OUTPUT does not insert a space. Put the spaces inside the string: \`" scored "\`.',
      starterCode: `${RECORD}

DECLARE Pupil : Student

// INPUT the name and the mark into Pupil's fields
// OUTPUT "Name scored Mark"`,
      solutionCode: `${RECORD}

DECLARE Pupil : Student

INPUT Pupil.Name
INPUT Pupil.Mark

OUTPUT Pupil.Name, " scored ", Pupil.Mark`,
      tests: [
        { inputs: ['Ada', '80'], expectedOutput: 'Ada scored 80' },
        { inputs: ['Bob', '0'], expectedOutput: 'Bob scored 0' },
        { inputs: ['Cy', '100'], expectedOutput: 'Cy scored 100' },
      ],
      playable: true,
    },
    {
      id: 'as1.6',
      slug: 'threshold',
      title: 'Boss: names at or above a mark',
      type: 'grade',
      minutes: 8,
      why: 'This is the array-of-records loop Paper 2 actually marks: walk every record, test one field, output another.',
      docsAnchor: 'alevel-types',
      body: `The four students are filled in. Read an integer threshold. Output the name of every student whose mark is **greater than or equal to** it, one name per line, in array order.

Input \`70\` prints:

\`Ada\`
\`Cy\`
\`Di\`

Input \`100\` prints nothing.`,
      starterCode: `${GROUP}

DECLARE Threshold : INTEGER
INPUT Threshold

// OUTPUT each Name whose Mark >= Threshold`,
      solutionCode: `${GROUP}

DECLARE Threshold : INTEGER
INPUT Threshold

FOR Index <- 1 TO 4
    IF Group[Index].Mark >= Threshold THEN
        OUTPUT Group[Index].Name
    ENDIF
NEXT Index`,
      tests: [
        { inputs: ['70'], expectedOutput: 'Ada\nCy\nDi' },
        { inputs: ['90'], expectedOutput: 'Cy' },
        { inputs: ['54'], expectedOutput: 'Ada\nBob\nCy\nDi' },
        { inputs: ['100'], expectedOutput: '' },
      ],
      playable: true,
    },
  ],
};
