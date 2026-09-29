import type { LearnLevel } from '../../types';

const PUPIL = `TYPE Pupil
    DECLARE Name : STRING
    DECLARE Year : INTEGER
ENDTYPE`;

export const alevel4: LearnLevel = {
  number: 4,
  slug: '4',
  name: 'Random files',
  hours: '2',
  leaveWith: 'OPENFILE FOR RANDOM, SEEK, PUTRECORD, GETRECORD',
  syllabus: '9618 §10.3',
  free: false,
  playable: true,
  lessons: [
    {
      id: 'as4.1',
      slug: 'roundtrip',
      title: 'Write a record, read it back',
      type: 'run',
      minutes: 6,
      why: 'A random file stores each record at a numbered position. SEEK moves there; PUTRECORD writes; GETRECORD reads.',
      docsAnchor: 'alevel-random-files',
      body: `Text files are read from the start to EOF. A random file can jump.

Positions start at **1**. SEEK, then PUTRECORD, then SEEK to the same place before GETRECORD.

Run it and Check.`,
      trap: 'GETRECORD on a position you never wrote is an error. CLOSEFILE before you leave the file.',
      starterCode: `${PUPIL}

DECLARE One : Pupil
DECLARE Found : Pupil
One.Name <- "Leroy"
One.Year <- 6

OPENFILE "pupils.dat" FOR RANDOM
SEEK "pupils.dat", 1
PUTRECORD "pupils.dat", One
CLOSEFILE "pupils.dat"

OPENFILE "pupils.dat" FOR RANDOM
SEEK "pupils.dat", 1
GETRECORD "pupils.dat", Found
CLOSEFILE "pupils.dat"

OUTPUT Found.Name
OUTPUT Found.Year`,
      solutionCode: `${PUPIL}

DECLARE One : Pupil
DECLARE Found : Pupil
One.Name <- "Leroy"
One.Year <- 6

OPENFILE "pupils.dat" FOR RANDOM
SEEK "pupils.dat", 1
PUTRECORD "pupils.dat", One
CLOSEFILE "pupils.dat"

OPENFILE "pupils.dat" FOR RANDOM
SEEK "pupils.dat", 1
GETRECORD "pupils.dat", Found
CLOSEFILE "pupils.dat"

OUTPUT Found.Name
OUTPUT Found.Year`,
      expectedOutput: 'Leroy\n6',
      playable: true,
    },
    {
      id: 'as4.2',
      slug: 'seek',
      title: 'Store a name at a position',
      type: 'grade',
      minutes: 7,
      why: 'The position is data, not a constant. SEEK uses the integer you read, the same way an array uses an index.',
      docsAnchor: 'alevel-random-files',
      body: `Read a position (1 or more), then a name. Write that name into \`pupils.dat\` at that position and read it back. Output the name you read.

Example: \`3\` then \`Bob\` → \`Bob\`.`,
      starterCode: `TYPE Pupil
    DECLARE Name : STRING
ENDTYPE

DECLARE One : Pupil
DECLARE Found : Pupil
DECLARE Pos : INTEGER

INPUT Pos
INPUT One.Name

// SEEK, PUTRECORD, SEEK, GETRECORD, then OUTPUT Found.Name`,
      solutionCode: `TYPE Pupil
    DECLARE Name : STRING
ENDTYPE

DECLARE One : Pupil
DECLARE Found : Pupil
DECLARE Pos : INTEGER

INPUT Pos
INPUT One.Name

OPENFILE "pupils.dat" FOR RANDOM
SEEK "pupils.dat", Pos
PUTRECORD "pupils.dat", One
SEEK "pupils.dat", Pos
GETRECORD "pupils.dat", Found
CLOSEFILE "pupils.dat"

OUTPUT Found.Name`,
      tests: [
        { inputs: ['1', 'Ada'], expectedOutput: 'Ada' },
        { inputs: ['3', 'Bob'], expectedOutput: 'Bob' },
        { inputs: ['10', 'Cy'], expectedOutput: 'Cy' },
      ],
      mustContain: ['SEEK', 'PUTRECORD', 'GETRECORD'],
      playable: true,
    },
    {
      id: 'as4.3',
      slug: 'update',
      title: 'Update a record in place',
      type: 'grade',
      minutes: 8,
      why: 'Changing one field means GETRECORD, edit the field, PUTRECORD back at the same position. There is no “update field” command.',
      docsAnchor: 'alevel-random-files',
      body: `Read a year group. Store it at position 1, read the record back, add 1 to the year, write it back, read it again, and output the year.

Example: input \`6\` → \`7\`.`,
      starterCode: `TYPE Pupil
    DECLARE Year : INTEGER
ENDTYPE

DECLARE One : Pupil
DECLARE Found : Pupil
INPUT One.Year

// write, add 1, write back, output the stored year`,
      solutionCode: `TYPE Pupil
    DECLARE Year : INTEGER
ENDTYPE

DECLARE One : Pupil
DECLARE Found : Pupil
INPUT One.Year

OPENFILE "pupils.dat" FOR RANDOM
SEEK "pupils.dat", 1
PUTRECORD "pupils.dat", One
SEEK "pupils.dat", 1
GETRECORD "pupils.dat", Found
Found.Year <- Found.Year + 1
SEEK "pupils.dat", 1
PUTRECORD "pupils.dat", Found
SEEK "pupils.dat", 1
GETRECORD "pupils.dat", One
CLOSEFILE "pupils.dat"

OUTPUT One.Year`,
      tests: [
        { inputs: ['6'], expectedOutput: '7' },
        { inputs: ['12'], expectedOutput: '13' },
        { inputs: ['0'], expectedOutput: '1' },
      ],
      mustContain: ['PUTRECORD', 'GETRECORD'],
      playable: true,
    },
    {
      id: 'as4.4',
      slug: 'files-quiz',
      title: 'Random file or text file?',
      type: 'quiz',
      minutes: 4,
      why: 'Paper 2 uses both. EOF and READFILE are the text file. SEEK and GETRECORD are the random file.',
      docsAnchor: 'alevel-random-files',
      body: `A random file is opened \`FOR RANDOM\`. Each record lives at a position you choose.`,
      quiz: [
        {
          prompt: 'You need the record stored at position 10, and you do not want to read the nine before it. You:',
          options: [
            { id: 'seek', label: 'OPENFILE FOR RANDOM, SEEK to 10, GETRECORD' },
            { id: 'loop', label: 'OPENFILE FOR READ and READFILE ten times' },
            { id: 'eof', label: 'Loop until EOF() and count the lines' },
          ],
          correctId: 'seek',
          explanation: 'That jump is what random access is for. A text file has no SEEK.',
        },
        {
          prompt: 'SEEK "pupils.dat", 0 is:',
          options: [
            { id: 'bad', label: 'Invalid — positions start at 1' },
            { id: 'first', label: 'The first record' },
            { id: 'end', label: 'The end of the file' },
          ],
          correctId: 'bad',
          explanation: 'A SEEK address is a whole number of 1 or more. 0 is rejected.',
        },
        {
          prompt: 'To change the year stored at position 4 you:',
          options: [
            { id: 'get', label: 'SEEK 4, GETRECORD, change the field, SEEK 4, PUTRECORD' },
            { id: 'put', label: 'PUTRECORD the new year without reading, at whatever position the file is on' },
            { id: 'append', label: 'OPENFILE FOR APPEND and WRITEFILE the new year' },
          ],
          correctId: 'get',
          explanation: 'PUTRECORD replaces the whole record at the current position. Read it, edit the field, seek back, write it.',
        },
      ],
      playable: true,
    },
    {
      id: 'as4.5',
      slug: 'which',
      title: 'Boss: two records, then pick one',
      type: 'grade',
      minutes: 8,
      why: 'The file is the store. After writing two positions, a later SEEK is how you answer “output the pupil at this position”.',
      docsAnchor: 'alevel-random-files',
      body: `Read two names and then a position (1 or 2).

Write the first name at position 1 and the second at position 2. SEEK to the requested position and output that name.

Example: \`Ada\`, \`Bob\`, \`2\` → \`Bob\`.`,
      starterCode: `TYPE Pupil
    DECLARE Name : STRING
ENDTYPE

DECLARE First : Pupil
DECLARE Second : Pupil
DECLARE Found : Pupil
DECLARE Which : INTEGER

INPUT First.Name
INPUT Second.Name
INPUT Which

// store both, then output the name at Which`,
      solutionCode: `TYPE Pupil
    DECLARE Name : STRING
ENDTYPE

DECLARE First : Pupil
DECLARE Second : Pupil
DECLARE Found : Pupil
DECLARE Which : INTEGER

INPUT First.Name
INPUT Second.Name
INPUT Which

OPENFILE "pupils.dat" FOR RANDOM
SEEK "pupils.dat", 1
PUTRECORD "pupils.dat", First
SEEK "pupils.dat", 2
PUTRECORD "pupils.dat", Second
SEEK "pupils.dat", Which
GETRECORD "pupils.dat", Found
CLOSEFILE "pupils.dat"

OUTPUT Found.Name`,
      tests: [
        { inputs: ['Ada', 'Bob', '2'], expectedOutput: 'Bob' },
        { inputs: ['Ada', 'Bob', '1'], expectedOutput: 'Ada' },
        { inputs: ['Cy', 'Di', '2'], expectedOutput: 'Di' },
        { inputs: ['Cy', 'Di', '1'], expectedOutput: 'Cy' },
      ],
      mustContain: ['SEEK', 'GETRECORD'],
      playable: true,
    },
  ],
};
