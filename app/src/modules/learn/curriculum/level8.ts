import type { LearnLevel } from '../types';

export const level8: LearnLevel = {
  number: 8,
  slug: '8',
  name: 'Routines',
  hours: '2.5',
  leaveWith: 'PROCEDURE vs FUNCTION, ≤3 params, ROUND/RANDOM',
  syllabus: '8.1 procedures/functions/library',
  free: false,
  playable: true,
  lessons: [
    {
      id: '8.1',
      slug: 'procedure',
      title: 'PROCEDURE and CALL',
      type: 'run',
      minutes: 6,
      why: 'Actions, no return value. CALL is how you run one.',
      docsAnchor: 'procedures',
      body: `A **PROCEDURE** does something. You **CALL** it. It does not return a value to use in an expression.

This one should print **Ready**.`,
      trap: 'You cannot write `OUTPUT Greet()` if Greet is a PROCEDURE. That is a FUNCTION.',
      starterCode: `PROCEDURE Greet()
    OUTPUT "Ready"
ENDPROCEDURE

CALL Greet()`,
      solutionCode: `PROCEDURE Greet()
    OUTPUT "Ready"
ENDPROCEDURE

CALL Greet()`,
      expectedOutput: 'Ready',
      mustContain: ['PROCEDURE', 'CALL'],
      playable: true,
    },
    {
      id: '8.6',
      slug: 'proc-params',
      title: 'PROCEDURE with a parameter',
      type: 'grade',
      minutes: 8,
      why: 'The caller passes a value in. The procedure uses the parameter name — it does not INPUT again.',
      docsAnchor: 'procedures',
      body: `Write **PROCEDURE Square(N : INTEGER)** that outputs **N * N**.

The main program reads an integer and **CALL**s Square.

Example: input \`6\` → \`36\`.`,
      trap: 'CALL Square(X) — the argument is in brackets. Do not INPUT inside the procedure.',
      starterCode: `// PROCEDURE Square(N : INTEGER)
//     ...
// ENDPROCEDURE

DECLARE X : INTEGER
INPUT X
// CALL Square(X)`,
      solutionCode: `PROCEDURE Square(N : INTEGER)
    OUTPUT N * N
ENDPROCEDURE

DECLARE X : INTEGER
INPUT X
CALL Square(X)`,
      tests: [
        { inputs: ['6'], expectedOutput: '36' },
        { inputs: ['0'], expectedOutput: '0' },
        { inputs: ['-3'], expectedOutput: '9' },
        { inputs: ['10'], expectedOutput: '100' },
      ],
      mustContain: ['PROCEDURE', 'CALL'],
      playable: true,
    },
    {
      id: '8.2',
      slug: 'function',
      title: 'FUNCTION and RETURN',
      type: 'run',
      minutes: 6,
      why: 'Use the result in an expression. FUNCTION … RETURNS type, then RETURN value.',
      docsAnchor: 'functions',
      body: `A **FUNCTION** returns a value. Call it by name in an OUTPUT or assignment — not with CALL.

This **Double** function should print **10**.`,
      trap: '`CALL Double(5)` is wrong for a function. `OUTPUT Double(5)` is the Cambridge form.',
      starterCode: `FUNCTION Double(N : INTEGER) RETURNS INTEGER
    RETURN N * 2
ENDFUNCTION

OUTPUT Double(5)`,
      solutionCode: `FUNCTION Double(N : INTEGER) RETURNS INTEGER
    RETURN N * 2
ENDFUNCTION

OUTPUT Double(5)`,
      expectedOutput: '10',
      mustContain: ['FUNCTION', 'RETURN'],
      playable: true,
    },
    {
      id: '8.7',
      slug: 'function-call',
      title: 'Use a FUNCTION in OUTPUT',
      type: 'grade',
      minutes: 8,
      why: 'Functions return a value you use in an expression. No CALL — OUTPUT Triple(X).',
      docsAnchor: 'functions',
      body: `Write **FUNCTION Triple(N : INTEGER) RETURNS INTEGER** that returns **N * 3**.

The main program reads an integer and outputs **Triple(X)**.

Example: input \`5\` → \`15\`.`,
      trap: '`CALL Triple(5)` is for a PROCEDURE. A FUNCTION is `OUTPUT Triple(5)`.',
      starterCode: `// FUNCTION Triple(N : INTEGER) RETURNS INTEGER
//     RETURN ...
// ENDFUNCTION

DECLARE X : INTEGER
INPUT X
// OUTPUT Triple(X)`,
      solutionCode: `FUNCTION Triple(N : INTEGER) RETURNS INTEGER
    RETURN N * 3
ENDFUNCTION

DECLARE X : INTEGER
INPUT X
OUTPUT Triple(X)`,
      tests: [
        { inputs: ['5'], expectedOutput: '15' },
        { inputs: ['0'], expectedOutput: '0' },
        { inputs: ['-2'], expectedOutput: '-6' },
        { inputs: ['10'], expectedOutput: '30' },
      ],
      mustContain: ['FUNCTION', 'RETURN'],
      playable: true,
    },
    {
      id: '8.3',
      slug: 'params',
      title: 'Parameters, local vs global',
      type: 'quiz',
      minutes: 6,
      why: 'The syllabus asks for at most three parameters. Locals die when the routine ends; globals do not.',
      docsAnchor: 'procedures',
      body: `A parameter is a value the caller **passes in**. A local variable is DECLARED inside the routine.`,
      quiz: [
        {
          prompt: 'The syllabus says a student-written procedure or function should have at most how many parameters?',
          options: [
            { id: 'one', label: '1' },
            { id: 'three', label: '3' },
            { id: 'ten', label: '10' },
          ],
          correctId: 'three',
          explanation: 'Cambridge IGCSE limits student-designed routines to a maximum of three parameters.',
        },
        {
          prompt: 'A variable DECLARED inside a FUNCTION is:',
          options: [
            { id: 'global', label: 'Global — the main program can use it after RETURN' },
            { id: 'local', label: 'Local — it only exists while the function runs' },
            { id: 'const', label: 'A CONSTANT by default' },
          ],
          correctId: 'local',
          explanation: 'Locals are created on entry and discarded on RETURN / ENDFUNCTION.',
        },
        {
          prompt: 'Which call is correct for FUNCTION Square(N : INTEGER) RETURNS INTEGER?',
          options: [
            { id: 'call', label: 'CALL Square(4)' },
            { id: 'out', label: 'OUTPUT Square(4)' },
            { id: 'run', label: 'RUN Square 4' },
          ],
          correctId: 'out',
          explanation: 'Functions are used in expressions. CALL is for PROCEDURES.',
        },
      ],
      playable: true,
    },
    {
      id: '8.4',
      slug: 'library',
      title: 'ROUND, RANDOM, DIV, MOD',
      type: 'grade',
      minutes: 8,
      why: 'Library routines you must recognise on sight. RANDOM() is a real in [0, 1).',
      docsAnchor: 'math-functions',
      body: `Output four lines, in this order:

1. **ROUND(3.7)** — nearest integer
2. **10 DIV 3**
3. **10 MOD 3**
4. **TRUE** if \`RANDOM()\` is at least 0 (it always is — this just proves you called it)

You must call **ROUND**, **RANDOM**, **DIV** and **MOD**.`,
      trap: '`/` is real division. DIV is the whole-number quotient. RANDOM() needs the empty brackets.',
      starterCode: `DECLARE X : REAL

// four OUTPUT lines: ROUND, DIV, MOD, then RANDOM() >= 0`,
      solutionCode: `DECLARE X : REAL

OUTPUT ROUND(3.7)
OUTPUT 10 DIV 3
OUTPUT 10 MOD 3
X <- RANDOM()
OUTPUT X >= 0`,
      expectedOutput: '4\n3\n1\nTRUE',
      mustContain: ['ROUND', 'RANDOM', 'DIV', 'MOD'],
      playable: true,
    },
    {
      id: '8.5',
      slug: 'boss',
      title: 'Boss: Easy Procedures',
      type: 'grade',
      minutes: 10,
      why: 'A one-parameter PROCEDURE that the main program CALLs after INPUT.',
      docsAnchor: 'procedures',
      body: `Write **PROCEDURE Banner(Title : STRING)** that outputs:

\`***\`
the Title
\`***\`

The main program reads a string and CALLs Banner.

Example: input \`IGCSE\` →

\`***\`
\`IGCSE\`
\`***\``,
      starterCode: `// PROCEDURE Banner(Title : STRING)
//     ...
// ENDPROCEDURE

DECLARE Name : STRING
INPUT Name
// CALL Banner(Name)`,
      solutionCode: `PROCEDURE Banner(Title : STRING)
    OUTPUT "***"
    OUTPUT Title
    OUTPUT "***"
ENDPROCEDURE

DECLARE Name : STRING
INPUT Name
CALL Banner(Name)`,
      tests: [
        { inputs: ['IGCSE'], expectedOutput: '***\nIGCSE\n***' },
        { inputs: ['Hi'], expectedOutput: '***\nHi\n***' },
        { inputs: ['Paper 2'], expectedOutput: '***\nPaper 2\n***' },
        { inputs: ['A'], expectedOutput: '***\nA\n***' },
        { inputs: ['Ready'], expectedOutput: '***\nReady\n***' },
      ],
      mustContain: ['PROCEDURE', 'CALL'],
      playable: true,
    },
  ],
};
