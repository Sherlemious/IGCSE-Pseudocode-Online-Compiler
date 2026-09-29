import type { LearnLevel } from '../../types';

export const alevel5: LearnLevel = {
  number: 5,
  slug: '5',
  name: 'Pointers',
  hours: '2',
  leaveWith: '^ for the address, ptr^ for the value, SET OF and DEFINE',
  syllabus: '9618 user-defined types',
  free: false,
  playable: true,
  lessons: [
    {
      id: 'as5.1',
      slug: 'address',
      title: 'A pointer holds an address',
      type: 'run',
      minutes: 6,
      why: 'Paper 4 linked structures are pointers. ^Num is the address of Num. MyPointer^ is the value stored there.',
      docsAnchor: 'alevel-types',
      body: `Declare a pointer type with \`TYPE IntPtr = ^INTEGER\`.

\`MyPointer <- ^Num\` stores the address. \`MyPointer^\` reads the integer Num currently holds.

\`^\` is also the power operator. \`p^ - 1\` means (the value p points at) minus 1, not a negative power.`,
      starterCode: `TYPE IntPtr = ^INTEGER
DECLARE MyPointer : IntPtr
DECLARE Num : INTEGER

Num <- 5
MyPointer <- ^Num
OUTPUT MyPointer^`,
      solutionCode: `TYPE IntPtr = ^INTEGER
DECLARE MyPointer : IntPtr
DECLARE Num : INTEGER

Num <- 5
MyPointer <- ^Num
OUTPUT MyPointer^`,
      expectedOutput: '5',
      playable: true,
    },
    {
      id: 'as5.2',
      slug: 'write',
      title: 'Writing through the pointer',
      type: 'mutate',
      minutes: 5,
      why: 'Assigning to ptr^ changes the variable it points at. Assigning to a different variable does not.',
      docsAnchor: 'alevel-types',
      body: `\`Num\` is 5 and \`P\` points at it. The program still prints 5.

Write **10 through the pointer**, so \`Num\` itself becomes 10. Output must be \`10\`.`,
      trap: 'P <- 10 stores a new address (or fails). The value at the address is P^ <- 10.',
      starterCode: `TYPE IntPtr = ^INTEGER
DECLARE P : IntPtr
DECLARE Num : INTEGER

Num <- 5
P <- ^Num
OUTPUT P^`,
      solutionCode: `TYPE IntPtr = ^INTEGER
DECLARE P : IntPtr
DECLARE Num : INTEGER

Num <- 5
P <- ^Num
P^ <- 10
OUTPUT P^`,
      expectedOutput: '10',
      mustContain: ['P^ <-'],
      playable: true,
    },
    {
      id: 'as5.3',
      slug: 'enum-pointer',
      title: 'A pointer to an enumerated value',
      type: 'run',
      minutes: 5,
      why: 'The guide’s season example is this: take the address, dereference, then add 1 to move along the enum.',
      docsAnchor: 'alevel-types',
      body: `\`MyPointer^\` is the season. \`MyPointer^ + 1\` is the next season. The pointer’s own variable does not change.

Run it. Next season should be Summer.`,
      starterCode: `TYPE Season = (Spring, Summer, Autumn, Winter)
TYPE SeasonPtr = ^Season

DECLARE ThisSeason : Season
DECLARE NextSeason : Season
DECLARE MyPointer : SeasonPtr

ThisSeason <- Spring
MyPointer <- ^ThisSeason
NextSeason <- MyPointer^ + 1
OUTPUT NextSeason`,
      solutionCode: `TYPE Season = (Spring, Summer, Autumn, Winter)
TYPE SeasonPtr = ^Season

DECLARE ThisSeason : Season
DECLARE NextSeason : Season
DECLARE MyPointer : SeasonPtr

ThisSeason <- Spring
MyPointer <- ^ThisSeason
NextSeason <- MyPointer^ + 1
OUTPUT NextSeason`,
      expectedOutput: 'Summer',
      playable: true,
    },
    {
      id: 'as5.4',
      slug: 'set',
      title: 'DEFINE a set',
      type: 'mutate',
      minutes: 5,
      why: 'A set is a user-defined type: SET OF a base type, then DEFINE to give one a value. The paper writes it this way even though you rarely loop over it.',
      docsAnchor: 'alevel-types',
      body: `The program should declare a set of characters and define \`Vowels\` as the five capitals.

It does not do that yet. Add the TYPE and the DEFINE. A set cannot be printed with OUTPUT — leave the existing OUTPUT line as it is.

The DEFINE line is:

\`DEFINE Vowels ('A', 'E', 'I', 'O', 'U') : LetterSet\``,
      starterCode: `OUTPUT "defined"`,
      solutionCode: `TYPE LetterSet = SET OF CHAR
DEFINE Vowels ('A', 'E', 'I', 'O', 'U') : LetterSet
OUTPUT "defined"`,
      expectedOutput: 'defined',
      mustContain: ['SET OF', 'DEFINE'],
      playable: true,
    },
    {
      id: 'as5.5',
      slug: 'pointer-quiz',
      title: 'Address or value?',
      type: 'quiz',
      minutes: 4,
      why: 'The two uses of ^ are the whole of the pointer questions. Mixing them up is a lost mark, not a style point.',
      docsAnchor: 'alevel-types',
      body: `\`^x\` takes an address. \`ptr^\` uses the value at that address.`,
      quiz: [
        {
          prompt: 'Num is 5 and P <- ^Num. What does OUTPUT P^ print?',
          options: [
            { id: 'five', label: '5' },
            { id: 'addr', label: 'The address of Num' },
            { id: 'err', label: 'An error — OUTPUT cannot follow a pointer' },
          ],
          correctId: 'five',
          explanation: 'P^ is the integer stored at that address. The address itself is what P holds, and you do not print it.',
        },
        {
          prompt: 'P^ <- 10 after P <- ^Num. What is Num?',
          options: [
            { id: 'ten', label: '10 — the assignment went through the pointer' },
            { id: 'five', label: '5 — P^ is a copy' },
            { id: 'p', label: 'Unchanged, and P now holds 10 as an address' },
          ],
          correctId: 'ten',
          explanation: 'Writing to P^ writes to Num. P <- 10 would be trying to change the address, which is a different statement.',
        },
        {
          prompt: 'Why is a SET value not sent to OUTPUT?',
          options: [
            { id: 'no', label: 'A set has no display form — OUTPUT rejects it' },
            { id: 'loop', label: 'It prints, but only inside a FOR EACH loop' },
            { id: 'str', label: 'It prints as a STRING of the elements' },
          ],
          correctId: 'no',
          explanation: 'DEFINE creates the set. There is no OUTPUT form for it. Use it as a declared value, and print something else.',
        },
      ],
      playable: true,
    },
    {
      id: 'as5.6',
      slug: 'add-through',
      title: 'Boss: add through a pointer',
      type: 'grade',
      minutes: 7,
      why: 'The operation is on the variable the pointer refers to. The pointer is how Paper 4 reaches a node without copying it.',
      docsAnchor: 'alevel-types',
      body: `Read two integers, A and B. Point P at A. Add B to the value P points at. Output A.

Example: \`3\` then \`4\` → \`7\`.

\`P^ <- P^ + B\` is (the value) plus B. The \`^\` binds tighter than the minus in \`P^ - 1\` as well.`,
      starterCode: `TYPE IntPtr = ^INTEGER
DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE P : IntPtr

INPUT A
INPUT B

// point P at A, add B through P, OUTPUT A`,
      solutionCode: `TYPE IntPtr = ^INTEGER
DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE P : IntPtr

INPUT A
INPUT B
P <- ^A
P^ <- P^ + B
OUTPUT A`,
      tests: [
        { inputs: ['3', '4'], expectedOutput: '7' },
        { inputs: ['10', '-2'], expectedOutput: '8' },
        { inputs: ['0', '5'], expectedOutput: '5' },
        { inputs: ['-4', '-1'], expectedOutput: '-5' },
      ],
      mustContain: ['^'],
      playable: true,
    },
  ],
};
