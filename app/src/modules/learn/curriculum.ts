import { COURSE_ID, type LearnCourse } from './types';
import { level4 } from './curriculum/level4';
import { level5 } from './curriculum/level5';
import { level6 } from './curriculum/level6';
import { level7 } from './curriculum/level7';
import { level8 } from './curriculum/level8';
import { level9 } from './curriculum/level9';
import { level10 } from './curriculum/level10';

export const IGCSE_PAPER_2: LearnCourse = {
  id: COURSE_ID,
  title: 'IGCSE & O Level Paper 2 Path',
  subtitle:
    'Ten levels of Cambridge O Level 2210 and IGCSE 0478 / 0984 pseudocode. No videos — you write, run, and check in the compiler.',
  levels: [
    {
      number: 1,
      slug: '1',
      name: 'Run',
      hours: '0.5',
      leaveWith: 'OUTPUT, comments, and <- not =',
      syllabus: '8.1.3',
      free: true,
      playable: true,
      lessons: [
        {
          id: '1.1',
          slug: 'output',
          title: 'OUTPUT a string',
          type: 'run',
          minutes: 4,
          why: 'Paper 2 algorithms are marked by what they print. OUTPUT is how the examiner sees your result.',
          docsAnchor: 'first-program',
          body: `The simplest Cambridge program prints a line. Write **OUTPUT** then a string in double quotes.

Keywords are **UPPERCASE** in the exam. This interpreter also accepts lowercase, but write the Cambridge form.

Press **Run**, then **Check**.`,
          trap: 'Do not write `print()` or `console.log`. Those are Python / JavaScript — use OUTPUT.',
          starterCode: `OUTPUT "Hello, World!"`,
          solutionCode: `OUTPUT "Hello, World!"`,
          expectedOutput: 'Hello, World!',
          playable: true,
        },
        {
          id: '1.2',
          slug: 'comments',
          title: 'Comments and indentation',
          type: 'run',
          minutes: 3,
          why: 'Comments do not score marks, but indentation is how a marker sees which lines sit inside a loop or IF.',
          docsAnchor: 'general',
          body: `Everything after \`//\` is ignored until the end of the line.

Indentation is recommended, not enforced here. On paper, indent the body of every IF and loop so the marker can see the block.`,
          starterCode: `// This line is ignored
OUTPUT "Ready"`,
          solutionCode: `// This line is ignored
OUTPUT "Ready"`,
          expectedOutput: 'Ready',
          playable: true,
        },
        {
          id: '1.3',
          slug: 'assignment',
          title: 'Assignment is <-',
          type: 'mutate',
          minutes: 5,
          why: 'Cambridge assignment is <- . The = sign is comparison. Using the wrong one is a silent mark loss on paper.',
          docsAnchor: 'first-program',
          body: `This program runs, but it uses \`=\` to store 42. That is allowed in this compiler as a convenience. **The paper wants** \`<-\`.

Change the assignment to \`Score <- 42\`. Output must stay the same.`,
          trap: '`Score = 42` looks like Python or maths. In IGCSE pseudocode, `=` means “is equal to” inside an IF.',
          starterCode: `DECLARE Score : INTEGER
Score = 42
OUTPUT "Your score is ", Score`,
          solutionCode: `DECLARE Score : INTEGER
Score <- 42
OUTPUT "Your score is ", Score`,
          expectedOutput: 'Your score is 42',
          mustContain: ['<-'],
          playable: true,
        },
        {
          id: '1.4',
          slug: 'boss',
          title: 'Boss: three OUTPUT lines',
          type: 'mutate',
          minutes: 4,
          why: 'A short algorithm is still a sequence: line 1, then line 2, then line 3.',
          body: `Add a third **OUTPUT** so the program prints exactly:

\`IGCSE\`
\`Computer Science\`
\`Paper 2\``,
          starterCode: `OUTPUT "IGCSE"
OUTPUT "Computer Science"`,
          solutionCode: `OUTPUT "IGCSE"
OUTPUT "Computer Science"
OUTPUT "Paper 2"`,
          expectedOutput: 'IGCSE\nComputer Science\nPaper 2',
          mustContain: ['Paper 2'],
          playable: true,
        },
      ],
    },
    {
      number: 2,
      slug: '2',
      name: 'Values',
      hours: '1.5',
      leaveWith: 'DECLARE, types, CONSTANT, DIV and MOD',
      syllabus: '8.1.1–8.1.2, 8.1.4f',
      free: true,
      playable: true,
      lessons: [
        {
          id: '2.1',
          slug: 'declare',
          title: 'DECLARE a variable',
          type: 'run',
          minutes: 4,
          why: 'Examiners expect identifiers named before they are used. DECLARE Name : TYPE is the Cambridge form.',
          docsAnchor: 'declaring',
          body: `Write **DECLARE**, the name, a colon, and the type. Then assign with \`<-\` and OUTPUT the value.

Variable names are case-sensitive here. Pick clear names — \`Counter\` not \`c\`.`,
          starterCode: `DECLARE Counter : INTEGER
Counter <- 0
OUTPUT Counter`,
          solutionCode: `DECLARE Counter : INTEGER
Counter <- 0
OUTPUT Counter`,
          expectedOutput: '0',
          playable: true,
        },
        {
          id: '2.2',
          slug: 'types',
          title: 'Pick the data type',
          type: 'quiz',
          minutes: 4,
          why: 'The syllabus names five types. Using REAL for a count, or STRING for TRUE/FALSE, is a common Paper 2 slip.',
          docsAnchor: 'data-types',
          body: `Cambridge types:

- **INTEGER** — whole numbers
- **REAL** — decimals
- **CHAR** — one character in single quotes
- **STRING** — text in double quotes
- **BOOLEAN** — TRUE or FALSE`,
          quiz: [
            {
              prompt: 'A student’s full name should be declared as which type?',
              options: [
                { id: 'int', label: 'INTEGER' },
                { id: 'str', label: 'STRING' },
                { id: 'char', label: 'CHAR' },
              ],
              correctId: 'str',
              explanation: 'A name is text of more than one character, so STRING. CHAR is a single letter only.',
            },
            {
              prompt: 'The number of tickets sold (0, 1, 2, …) should be:',
              options: [
                { id: 'int', label: 'INTEGER' },
                { id: 'real', label: 'REAL' },
                { id: 'bool', label: 'BOOLEAN' },
              ],
              correctId: 'int',
              explanation: 'Counts are whole numbers. REAL is for values that may have a decimal part.',
            },
            {
              prompt: 'A flag Found that is either TRUE or FALSE should be:',
              options: [
                { id: 'str', label: 'STRING' },
                { id: 'int', label: 'INTEGER' },
                { id: 'bool', label: 'BOOLEAN' },
              ],
              correctId: 'bool',
              explanation: 'Flags and Found/Swapped markers are BOOLEAN. Do not store "TRUE" as a STRING.',
            },
          ],
          playable: true,
        },
        {
          id: '2.3',
          slug: 'constant',
          title: 'CONSTANT never changes',
          type: 'run',
          minutes: 3,
          why: 'A value that must not change during the run is a CONSTANT, not a variable you happen not to overwrite.',
          docsAnchor: 'constants',
          body: `Declare a constant with **CONSTANT Name <- value**. You cannot assign to it later.`,
          starterCode: `CONSTANT MaxSize <- 100
OUTPUT MaxSize`,
          solutionCode: `CONSTANT MaxSize <- 100
OUTPUT MaxSize`,
          expectedOutput: '100',
          playable: true,
        },
        {
          id: '2.4',
          slug: 'div-mod',
          title: 'DIV and MOD',
          type: 'run',
          minutes: 5,
          why: 'Paper 2 likes integer division. DIV is how many times it fits; MOD is the remainder. / is real division.',
          docsAnchor: 'arithmetic',
          body: `\`10 DIV 3\` is **3**. \`10 MOD 3\` is **1**. \`10 / 3\` is **3.33…** — usually the wrong one for counts and traces.

Run this, then Check.`,
          trap: '`/` is not DIV. If the question says “how many whole groups”, use DIV.',
          starterCode: `OUTPUT 10 DIV 3
OUTPUT 10 MOD 3`,
          solutionCode: `OUTPUT 10 DIV 3
OUTPUT 10 MOD 3`,
          expectedOutput: '3\n1',
          playable: true,
        },
        {
          id: '2.5',
          slug: 'boss',
          title: 'Boss: Celsius to Fahrenheit',
          type: 'grade',
          minutes: 8,
          why: 'A typical Easy arithmetic item: read a value, apply a formula with DIV, output an integer.',
          docsAnchor: 'arithmetic',
          body: `Read a Celsius temperature (integer). Convert with:

**F = C × 9 DIV 5 + 32**

Output the Fahrenheit value as an integer.

Example: input \`100\` → output \`212\`.`,
          trap: 'Use DIV, not /. Parentheses: \`(Celsius * 9) DIV 5 + 32\`.',
          starterCode: `DECLARE Celsius : INTEGER
DECLARE Fahrenheit : INTEGER

INPUT Celsius

// apply the formula, then OUTPUT Fahrenheit`,
          solutionCode: `DECLARE Celsius : INTEGER
DECLARE Fahrenheit : INTEGER

INPUT Celsius

Fahrenheit <- (Celsius * 9) DIV 5 + 32

OUTPUT Fahrenheit`,
          tests: [
            { inputs: ['0'], expectedOutput: '32' },
            { inputs: ['100'], expectedOutput: '212' },
            { inputs: ['20'], expectedOutput: '68' },
            { inputs: ['-10'], expectedOutput: '14' },
            { inputs: ['37'], expectedOutput: '98' },
          ],
          playable: true,
        },
      ],
    },
    {
      number: 3,
      slug: '3',
      name: 'Input',
      hours: '1.5',
      leaveWith: 'IPO: INPUT → process → OUTPUT',
      syllabus: '8.1.3, 7.2',
      free: true,
      playable: true,
      lessons: [
        {
          id: '3.1',
          slug: 'input',
          title: 'INPUT a value',
          type: 'grade',
          minutes: 5,
          why: 'Most Paper 2 algorithms start by reading data. INPUT pauses until a value is provided.',
          docsAnchor: 'first-input',
          body: `**INPUT Name** reads a value into \`Name\`. An optional prompt string after a comma is shown above the field.

Run it and type a name, or press **Check** — hidden tests feed the input for you.`,
          starterCode: `DECLARE Name : STRING
INPUT Name, "What is your name? "
OUTPUT "Hello, ", Name, "!"`,
          solutionCode: `DECLARE Name : STRING
INPUT Name, "What is your name? "
OUTPUT "Hello, ", Name, "!"`,
          tests: [
            { inputs: ['Ada'], expectedOutput: 'Hello, Ada!' },
            { inputs: ['Bob'], expectedOutput: 'Hello, Bob!' },
          ],
          playable: true,
        },
        {
          id: '3.2',
          slug: 'sequence',
          title: 'Sequence matters',
          type: 'mutate',
          minutes: 5,
          why: 'Lines run top to bottom. Swap two lines and the output changes — that is the whole of sequence.',
          docsAnchor: 'io',
          body: `This program outputs \`-3\`. Change **one expression** so it outputs **3** instead.

Do not add extra OUTPUT lines.`,
          starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 2
B <- 5
OUTPUT A - B`,
          solutionCode: `DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 2
B <- 5
OUTPUT B - A`,
          expectedOutput: '3',
          playable: true,
        },
        {
          id: '3.3',
          slug: 'ipo',
          title: 'Label the IPO',
          type: 'quiz',
          minutes: 4,
          why: 'Before writing an algorithm, Cambridge wants the problem decomposed: inputs, processes, outputs.',
          body: `Read this snippet, then label each part:

\`\`\`
INPUT Length
INPUT Width
OUTPUT Length * Width
\`\`\``,
          quiz: [
            {
              prompt: 'What is the INPUT of this algorithm?',
              options: [
                { id: 'area', label: 'The area of a rectangle' },
                { id: 'two', label: 'Two numbers: Length and Width' },
                { id: 'mult', label: 'The * operator' },
              ],
              correctId: 'two',
              explanation: 'INPUT lines are the data that enters. Here that is Length and Width.',
            },
            {
              prompt: 'What is the PROCESS?',
              options: [
                { id: 'print', label: 'Printing a message' },
                { id: 'mult', label: 'Multiplying Length by Width' },
                { id: 'decl', label: 'Declaring the variables' },
              ],
              correctId: 'mult',
              explanation: 'The process is the calculation: Length * Width. OUTPUT is how the result is shown.',
            },
            {
              prompt: 'What is the OUTPUT?',
              options: [
                { id: 'prod', label: 'The product (the area)' },
                { id: 'len', label: 'Length only' },
                { id: 'prompt', label: 'A prompt asking for a name' },
              ],
              correctId: 'prod',
              explanation: 'OUTPUT Length * Width displays the product — the area, if Length and Width are sides of a rectangle.',
            },
          ],
          playable: true,
        },
        {
          id: '3.4',
          slug: 'boss',
          title: 'Boss: sum of two numbers',
          type: 'grade',
          minutes: 8,
          why: 'The 15-mark skeleton starts here: DECLARE, INPUT, process, OUTPUT. You will reuse this every later level.',
          docsAnchor: 'input',
          body: `Read two integers (separate lines) and output their sum.

Example: input \`5\` then \`3\` → output \`8\`.

Finish the starter.`,
          starterCode: `DECLARE A : INTEGER
DECLARE B : INTEGER

INPUT A
INPUT B

// OUTPUT the sum of A and B`,
          solutionCode: `DECLARE A : INTEGER
DECLARE B : INTEGER

INPUT A
INPUT B

OUTPUT A + B`,
          tests: [
            { inputs: ['5', '3'], expectedOutput: '8' },
            { inputs: ['10', '20'], expectedOutput: '30' },
            { inputs: ['-5', '3'], expectedOutput: '-2' },
            { inputs: ['0', '0'], expectedOutput: '0' },
            { inputs: ['999', '1'], expectedOutput: '1000' },
          ],
          playable: true,
        },
      ],
    },
    level4,
    level5,
    level6,
    level7,
    level8,
    level9,
    level10,
  ],
};

