import { SITE_URL } from '@/shared/lib/seo';

export const TUTORIAL_PATH = '/tutorial';

export const TUTORIAL_TITLE = 'Cambridge O Level Pseudocode Tutorial';

export const TUTORIAL_ABSOLUTE_TITLE =
  'Cambridge O Level Pseudocode Tutorial (2210) | Free Interactive Paper 2';

export const TUTORIAL_DESCRIPTION =
  'Free Cambridge O Level Computer Science 2210 Paper 2 pseudocode tutorial — the same language as IGCSE 0478. Learn DECLARE, INPUT, IF, loops, arrays and procedures, then run every example in the browser.';

export const TUTORIAL_KEYWORDS = [
  'pseudocode tutorial',
  'cambridge o level pseudocode tutorial',
  'pseudocode tutorial for cambridge o level',
  'o level computer science 2210',
  '2210 pseudocode',
  'cambridge o level computer science',
  'igcse 0478 pseudocode tutorial',
  'igcse computer science paper 2',
  'cambridge paper 2 pseudocode',
  'how to write cambridge pseudocode',
];

export type TutorialFaq = {
  id: string;
  question: string;
  paragraphs: string[];
};

export const TUTORIAL_FAQS: TutorialFaq[] = [
  {
    id: 'o-level-vs-igcse',
    question: 'Is Cambridge O Level 2210 the same as IGCSE 0478 for Paper 2?',
    paragraphs: [
      'For algorithms and programming, yes. Cambridge O Level Computer Science 2210 Paper 2 uses the same pseudocode language as IGCSE 0478 and 0984: DECLARE, <-, INPUT/OUTPUT, IF, CASE, FOR, WHILE, REPEAT, arrays, procedures, functions and text files.',
      'This tutorial is written for 2210. IGCSE students can follow it without changing a line. A Level 9618 adds records, pointers, classes and random-access files — those are in the syntax guide, not required for O Level.',
    ],
  },
  {
    id: 'is-this-official',
    question: 'Is this an official Cambridge International tutorial?',
    paragraphs: [
      'No. It is an independent Paper 2 tutorial. The keywords and layout follow the forms in the 2210 / 0478 syllabuses so exam answers look familiar, but this site is not affiliated with or endorsed by Cambridge Assessment International Education.',
    ],
  },
  {
    id: 'where-to-practise',
    question: 'Where do I practise after reading this tutorial?',
    paragraphs: [
      `Open the interactive Paper 2 Path (${SITE_URL}/learn) and start at Level 1 — you write, run and check in the same compiler. Levels 1–3 are free.`,
      `Then attempt autograded questions (${SITE_URL}/practice) and, when you can finish a short algorithm without looking up keywords, sit a timed mock.`,
    ],
  },
  {
    id: 'python-on-paper-2',
    question: 'Can I write Python instead of pseudocode in the 2026 paper?',
    paragraphs: [
      'From 2026, IGCSE 0478 Paper 2 also allows Python, Visual Basic or Java. O Level 2210 still trains the syllabus pseudocode in this tutorial because that is the language the paper prints in questions, trace tables and mark schemes.',
      'If you will sit the paper in Python, learn the Cambridge forms first, then use the Python view in the compiler. Do not paste Python into the pseudocode editor.',
    ],
  },
  {
    id: 'must-i-match-the-guide',
    question: 'Do I lose marks if my pseudocode is not identical to the syllabus guide?',
    paragraphs: [
      'Markers award the logic of a working algorithm. They are not a compiler. Using DECLARE, <-, ENDIF and NEXT still helps: the marker can see the block structure, and you will read the printed questions faster.',
      'This interpreter accepts a few conveniences (omitting THEN, using = for assignment). The paper wants the Cambridge forms. Write those here so the habit sticks.',
    ],
  },
];

export const TUTORIAL_SNIPPETS = {
  firstProgram: {
    code: `OUTPUT "Hello, World!"`,
    output: 'Hello, World!',
  },
  declare: {
    code: `DECLARE Score : INTEGER
Score <- 42
OUTPUT "Your score is ", Score`,
    output: 'Your score is 42',
  },
  input: {
    code: `DECLARE Name : STRING
INPUT Name, "What is your name? "
OUTPUT "Hello, ", Name`,
    output: 'Hello, Ada',
  },
  selection: {
    code: `DECLARE Mark : INTEGER
INPUT Mark
IF Mark >= 50 THEN
    OUTPUT "Pass"
ELSE
    OUTPUT "Fail"
ENDIF`,
    output: 'Pass',
  },
  forLoop: {
    code: `DECLARE Counter : INTEGER
FOR Counter <- 1 TO 5
    OUTPUT Counter
NEXT Counter`,
    output: '1\n2\n3\n4\n5',
  },
  array: {
    code: `DECLARE Names : ARRAY[1:3] OF STRING
Names[1] <- "Ada"
Names[2] <- "Ben"
Names[3] <- "Cara"
OUTPUT Names[1]`,
    output: 'Ada',
  },
  procedure: {
    code: `PROCEDURE Greet(Name : STRING)
    OUTPUT "Hello, ", Name
ENDPROCEDURE

CALL Greet("Ada")`,
    output: 'Hello, Ada',
  },
} as const;

export type PathLevelCard = {
  number: number;
  name: string;
  href: string;
  leaveWith: string;
  syllabus: string;
  free: boolean;
};

export const TUTORIAL_PATH_LEVELS: PathLevelCard[] = [
  {
    number: 1,
    name: 'Run',
    href: '/learn/1/output',
    leaveWith: 'OUTPUT, comments, and <- not =',
    syllabus: '8.1.3',
    free: true,
  },
  {
    number: 2,
    name: 'Values',
    href: '/learn/2/declare',
    leaveWith: 'DECLARE, types, CONSTANT, DIV and MOD',
    syllabus: '8.1.1–8.1.2',
    free: true,
  },
  {
    number: 3,
    name: 'Input',
    href: '/learn/3/input',
    leaveWith: 'INPUT → process → OUTPUT',
    syllabus: '8.1.3, 7.2',
    free: true,
  },
  {
    number: 4,
    name: 'Branch',
    href: '/learn/4/if',
    leaveWith: 'IF / CASE with both branches closed',
    syllabus: '8.1.4b, 8.1.5',
    free: false,
  },
  {
    number: 5,
    name: 'Repeat',
    href: '/learn/5/for',
    leaveWith: 'FOR, WHILE, REPEAT, totalling and counting',
    syllabus: '8.1.4c–d',
    free: false,
  },
  {
    number: 6,
    name: 'Text',
    href: '/learn/6/string',
    leaveWith: 'LENGTH and SUBSTRING (1-based)',
    syllabus: '8.1.4e',
    free: false,
  },
  {
    number: 7,
    name: 'Arrays',
    href: '/learn/7/declare',
    leaveWith: 'ARRAY[1:n], fill loops, linear search',
    syllabus: '8.2, 7.4',
    free: false,
  },
  {
    number: 8,
    name: 'Routines',
    href: '/learn/8/procedure',
    leaveWith: 'PROCEDURE vs FUNCTION, library functions',
    syllabus: '8.1 procedures/functions',
    free: false,
  },
  {
    number: 9,
    name: 'Files',
    href: '/learn/9/why',
    leaveWith: 'OPENFILE, READFILE, WRITEFILE, EOF',
    syllabus: '8.3',
    free: false,
  },
  {
    number: 10,
    name: 'Paper',
    href: '/learn/10/validation',
    leaveWith: 'Validation, trace tables, bubble sort',
    syllabus: '7.4–7.9, 9, 10',
    free: false,
  },
];
