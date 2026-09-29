import type { LearnLevel } from '../../types';

export const alevel8: LearnLevel = {
  number: 8,
  slug: '8',
  name: 'Classes',
  hours: '3',
  leaveWith: 'CLASS, PRIVATE, NEW, INHERITS, SUPER',
  syllabus: '9618 §20.1',
  free: false,
  playable: true,
  lessons: [
    {
      id: 'as8.1',
      slug: 'class',
      title: 'A class has fields and a constructor',
      type: 'run',
      minutes: 6,
      why: 'Paper 4 groups the data and the operations in a CLASS. NEW is the constructor, written as a procedure with that name.',
      docsAnchor: 'alevel-oop',
      body: `\`P <- NEW Pet("Ada")\` calls \`PUBLIC PROCEDURE NEW\`.

A public field can be read from outside: \`P.Name\`.

\`Q <- P\` does **not** copy the object. Both variables refer to the same one, so \`Q.Name <- "Bea"\` changes what \`P.Name\` prints.

Run it.`,
      starterCode: `CLASS Pet
    PUBLIC Name : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING)
        Name <- GivenName
    ENDPROCEDURE
ENDCLASS

P <- NEW Pet("Ada")
Q <- P
Q.Name <- "Bea"
OUTPUT P.Name`,
      solutionCode: `CLASS Pet
    PUBLIC Name : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING)
        Name <- GivenName
    ENDPROCEDURE
ENDCLASS

P <- NEW Pet("Ada")
Q <- P
Q.Name <- "Bea"
OUTPUT P.Name`,
      expectedOutput: 'Bea',
      playable: true,
    },
    {
      id: 'as8.2',
      slug: 'private',
      title: 'PRIVATE is enforced',
      type: 'mutate',
      minutes: 6,
      why: 'A private field cannot be read or written from outside the class. The paper’s getter is a public function that returns it.',
      docsAnchor: 'alevel-oop',
      body: `\`OUTPUT P.Name\` is illegal — Name is PRIVATE.

Use the public function instead. Output must be \`Ada\`.`,
      trap: 'Inside NEW and GetName, the field is just Name. The dot is only for a call from outside.',
      starterCode: `CLASS Pet
    PRIVATE Name : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING)
        Name <- GivenName
    ENDPROCEDURE

    PUBLIC FUNCTION GetName() RETURNS STRING
        RETURN Name
    ENDFUNCTION
ENDCLASS

P <- NEW Pet("Ada")
OUTPUT P.Name`,
      solutionCode: `CLASS Pet
    PRIVATE Name : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING)
        Name <- GivenName
    ENDPROCEDURE

    PUBLIC FUNCTION GetName() RETURNS STRING
        RETURN Name
    ENDFUNCTION
ENDCLASS

P <- NEW Pet("Ada")
OUTPUT P.GetName()`,
      expectedOutput: 'Ada',
      mustNotContain: ['P.Name'],
      playable: true,
    },
    {
      id: 'as8.3',
      slug: 'inherits',
      title: 'INHERITS and SUPER.NEW',
      type: 'run',
      minutes: 6,
      why: 'A subclass reuses the parent. SUPER.NEW(...) runs the parent constructor. The subclass then sets its own fields.',
      docsAnchor: 'alevel-oop',
      body: `\`Cat\` inherits \`Pet\`. The cat constructor calls \`SUPER.NEW(GivenName)\` so the private name is set in the parent, then stores the breed.

\`GetName\` is the parent’s public function. \`Describe\` can call it.

Run it.`,
      starterCode: `CLASS Pet
    PRIVATE Name : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING)
        Name <- GivenName
    ENDPROCEDURE

    PUBLIC FUNCTION GetName() RETURNS STRING
        RETURN Name
    ENDFUNCTION
ENDCLASS

CLASS Cat INHERITS Pet
    PRIVATE Breed : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING, GivenBreed : STRING)
        SUPER.NEW(GivenName)
        Breed <- GivenBreed
    ENDPROCEDURE

    PUBLIC FUNCTION Describe() RETURNS STRING
        RETURN GetName() & " is a " & Breed
    ENDFUNCTION
ENDCLASS

MyCat <- NEW Cat("Kitty", "Shorthaired")
OUTPUT MyCat.Describe()`,
      solutionCode: `CLASS Pet
    PRIVATE Name : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING)
        Name <- GivenName
    ENDPROCEDURE

    PUBLIC FUNCTION GetName() RETURNS STRING
        RETURN Name
    ENDFUNCTION
ENDCLASS

CLASS Cat INHERITS Pet
    PRIVATE Breed : STRING

    PUBLIC PROCEDURE NEW(GivenName : STRING, GivenBreed : STRING)
        SUPER.NEW(GivenName)
        Breed <- GivenBreed
    ENDPROCEDURE

    PUBLIC FUNCTION Describe() RETURNS STRING
        RETURN GetName() & " is a " & Breed
    ENDFUNCTION
ENDCLASS

MyCat <- NEW Cat("Kitty", "Shorthaired")
OUTPUT MyCat.Describe()`,
      expectedOutput: 'Kitty is a Shorthaired',
      playable: true,
    },
    {
      id: 'as8.4',
      slug: 'counter',
      title: 'Call a method in a loop',
      type: 'grade',
      minutes: 7,
      why: 'The method is the operation. The loop outside the class decides how many times it happens — the same split as a procedure, with the data kept private.',
      docsAnchor: 'alevel-oop',
      body: `\`Counter\` starts at 0. \`Increment\` adds 1. \`GetCount\` returns the total.

Read N (at least 1). Call Increment that many times and output the count.

Example: input \`3\` → \`3\`.`,
      starterCode: `CLASS Counter
    PRIVATE Count : INTEGER

    PUBLIC PROCEDURE NEW()
        Count <- 0
    ENDPROCEDURE

    PUBLIC PROCEDURE Increment()
        Count <- Count + 1
    ENDPROCEDURE

    PUBLIC FUNCTION GetCount() RETURNS INTEGER
        RETURN Count
    ENDFUNCTION
ENDCLASS

DECLARE N : INTEGER
DECLARE I : INTEGER
C <- NEW Counter()
INPUT N

// call Increment N times, then OUTPUT the count`,
      solutionCode: `CLASS Counter
    PRIVATE Count : INTEGER

    PUBLIC PROCEDURE NEW()
        Count <- 0
    ENDPROCEDURE

    PUBLIC PROCEDURE Increment()
        Count <- Count + 1
    ENDPROCEDURE

    PUBLIC FUNCTION GetCount() RETURNS INTEGER
        RETURN Count
    ENDFUNCTION
ENDCLASS

DECLARE N : INTEGER
DECLARE I : INTEGER
C <- NEW Counter()
INPUT N

FOR I <- 1 TO N
    CALL C.Increment()
NEXT I
OUTPUT C.GetCount()`,
      tests: [
        { inputs: ['1'], expectedOutput: '1' },
        { inputs: ['3'], expectedOutput: '3' },
        { inputs: ['5'], expectedOutput: '5' },
      ],
      mustContain: ['Increment'],
      playable: true,
    },
    {
      id: 'as8.5',
      slug: 'class-quiz',
      title: 'Object, record, or parent?',
      type: 'quiz',
      minutes: 4,
      why: 'Records are copied. Objects are shared. PRIVATE is a real barrier, and SUPER is how the subclass reaches the parent constructor.',
      docsAnchor: 'alevel-oop',
      body: `CLASS … ENDCLASS. The constructor procedure is named NEW. INHERITS names the parent.`,
      quiz: [
        {
          prompt: 'After Q <- P, where P is an object, Q.Name <- "Bea". P.Name is:',
          options: [
            { id: 'bea', label: 'Bea — both variables refer to the same object' },
            { id: 'old', label: 'The original name — assignment copied the object' },
            { id: 'err', label: 'An error — objects cannot be assigned' },
          ],
          correctId: 'bea',
          explanation: 'Objects stay references. A record would have been copied; a class is not a record.',
        },
        {
          prompt: 'Name is PRIVATE. From outside the class you:',
          options: [
            { id: 'get', label: 'Call a public function that returns Name' },
            { id: 'dot', label: 'Write P.Name anyway — PRIVATE is only a comment' },
            { id: 'super', label: 'Write SUPER.Name' },
          ],
          correctId: 'get',
          explanation: 'Reading or writing a private field from outside is a runtime error. SUPER is for the parent’s methods, from inside a subclass.',
        },
        {
          prompt: 'A Cat constructor that must set the Pet name calls:',
          options: [
            { id: 'super', label: 'SUPER.NEW(...) before it sets the cat’s own fields' },
            { id: 'new', label: 'NEW Pet(...) as an ordinary line inside Cat' },
            { id: 'name', label: 'Name <- GivenName — the private field is visible to the subclass' },
          ],
          correctId: 'super',
          explanation: 'SUPER.NEW runs the parent constructor. The subclass does not assign the parent’s private field itself.',
        },
      ],
      playable: true,
    },
    {
      id: 'as8.6',
      slug: 'account',
      title: 'Boss: an account with a deposit',
      type: 'grade',
      minutes: 8,
      why: 'This is the small Paper 4 class: private state, a constructor, a procedure that changes it, and a function that reports it.',
      docsAnchor: 'alevel-oop',
      body: `Write class \`Account\`.

- \`NEW(Opening)\` stores the opening balance
- \`Deposit(Amount)\` adds the amount
- \`GetBalance()\` returns the balance

Balance is PRIVATE.

Read an opening balance and two deposit amounts. Deposit both, then output the balance.

Example: \`100\`, \`20\`, \`5\` → \`125\`.`,
      starterCode: `// CLASS Account ...

DECLARE Opening : INTEGER
DECLARE First : INTEGER
DECLARE Second : INTEGER
INPUT Opening
INPUT First
INPUT Second

Acc <- NEW Account(Opening)
CALL Acc.Deposit(First)
CALL Acc.Deposit(Second)
OUTPUT Acc.GetBalance()`,
      solutionCode: `CLASS Account
    PRIVATE Balance : INTEGER

    PUBLIC PROCEDURE NEW(Opening : INTEGER)
        Balance <- Opening
    ENDPROCEDURE

    PUBLIC PROCEDURE Deposit(Amount : INTEGER)
        Balance <- Balance + Amount
    ENDPROCEDURE

    PUBLIC FUNCTION GetBalance() RETURNS INTEGER
        RETURN Balance
    ENDFUNCTION
ENDCLASS

DECLARE Opening : INTEGER
DECLARE First : INTEGER
DECLARE Second : INTEGER
INPUT Opening
INPUT First
INPUT Second

Acc <- NEW Account(Opening)
CALL Acc.Deposit(First)
CALL Acc.Deposit(Second)
OUTPUT Acc.GetBalance()`,
      tests: [
        { inputs: ['100', '20', '5'], expectedOutput: '125' },
        { inputs: ['0', '10', '10'], expectedOutput: '20' },
        { inputs: ['50', '0', '1'], expectedOutput: '51' },
        { inputs: ['-5', '5', '5'], expectedOutput: '5' },
      ],
      mustContain: ['PRIVATE', 'NEW', 'Deposit'],
      playable: true,
    },
  ],
};
