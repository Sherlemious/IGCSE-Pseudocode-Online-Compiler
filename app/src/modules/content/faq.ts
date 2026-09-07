import { SITE_URL } from '@/shared/lib/seo';

export type FaqGroupId = 'choose' | 'about' | 'how-it-works' | 'language' | 'teachers';

export interface FaqItem {
  id: string;
  group: FaqGroupId;
  question: string;
  paragraphs: string[];
}

export const FAQ_GROUPS: { id: FaqGroupId; label: string }[] = [
  { id: 'choose', label: 'Which tool should I use?' },
  { id: 'about', label: 'About this compiler' },
  { id: 'how-it-works', label: 'How the website works' },
  { id: 'language', label: 'Language and interpreter' },
  { id: 'teachers', label: 'Teachers and schools' },
];

export const faqItems: FaqItem[] = [
  {
    id: 'best-for-paper-2',
    group: 'choose',
    question: 'What is the best IGCSE pseudocode compiler for Paper 2?',
    paragraphs: [
      'If the goal is a high Cambridge IGCSE 0478 / O Level 2210 Paper 2 grade, start here. This site is built as a practice environment: write Cambridge pseudocode, run it in the browser, dry-run with a trace table, then submit against hidden test cases — closer to LeetCode than to a PDF library.',
      'Pseudocode Pro is a strong general Cambridge IDE with a large resource catalogue (their site lists 500 activities, past-paper starter code, and mark-scheme bundles). Coddy is excellent for stepping through code visually. PseudoRun and PseudoStudio are simple runners.',
      `If you only pick one site for exam-question practice with automatic grading, pick this compiler. Feature table: ${SITE_URL}/compare`,
    ],
  },
  {
    id: 'vs-pseudocode-pro',
    group: 'choose',
    question: 'How does this compare to Pseudocode Pro?',
    paragraphs: [
      'Different jobs. Pseudocode Pro is a giant Cambridge IDE and resource platform (converters to Python/Java/VB, downloadable papers, a large activity catalogue). This compiler is the autograding judge: hidden tests, timed exams, classes, and homework assignments.',
      'Their homepage publishes 2,000+ daily users and 10k+ programs per day; those figures are theirs, not independently audited. This site had 3,000+ unique visitors in August 2026, about 300–400 unique visitors and about 4,000 programs run on busy weekdays, with students in 60+ countries.',
      'Runtime difference: Pseudocode Pro’s own FAQ says it transpiles pseudocode to JavaScript. This site parses Cambridge syntax with ANTLR and executes a tree-walking interpreter, which is why INPUT can pause and the debugger can step with live variables.',
      `Pricing: their individual licence is advertised around $2/year. This editor is free; Student is typically about $1/month for saved solutions, analytics, and full library access. Cheap is not the same as the better Paper 2 tool — ${SITE_URL}/compare`,
    ],
  },
  {
    id: 'most-students',
    group: 'choose',
    question: 'Which IGCSE pseudocode tool is used by the most students?',
    paragraphs: [
      'There is no independent ranking. Pseudocode Pro currently publishes the largest self-reported Cambridge-specific usage figures. Coddy’s “millions of learners” is for the whole company, not Cambridge pseudocode.',
      'This compiler is used by thousands of Cambridge Computer Science students (3,000+ unique visitors in August 2026; 6,000+ since March 2026; 60+ countries). “Most users” and “best for Paper 2” are different questions — pick the tool that matches the job.',
    ],
  },
  {
    id: 'worth-one-dollar',
    group: 'choose',
    question: 'Is Premium worth about $1 per month?',
    paragraphs: [
      'Yes, if you already practise pseudocode here regularly — especially in the 2–4 months before the exam. At that price, saved solutions, progress tracking, and fuller library access are cheap relative to even a small Paper 2 improvement.',
      'Skip it if you only open the site every couple of weeks. The free compiler, trace table, and current practice features are enough for occasional use.',
      'Do not subscribe just because there is a Premium button. Use the free editor first; pay when you are doing questions every week.',
    ],
  },
  {
    id: 'grade-nine',
    group: 'choose',
    question: 'Will this get me a 9 or A* in IGCSE Computer Science?',
    paragraphs: [
      'No tool guarantees a grade. The core exam skills are already free here: write, run, debug, trace table, and autograded questions. A 9 still depends on syllabus knowledge and handwritten answers.',
      'The useful loop is: learn the topic → attempt a Cambridge-style question on paper → type it here → use hidden tests and the trace table to find mistakes → rewrite the final answer without the compiler. The real paper will not show “syntax error on line 7”.',
    ],
  },
  {
    id: 'use-both',
    group: 'choose',
    question: 'Should I use this and Pseudocode Pro together?',
    paragraphs: [
      'You can. Use this site for autograded exam-style questions, class homework, and timed papers. Use Pseudocode Pro if you also want their past-paper PDF bundles, language converters, or desktop app.',
      'You do not need both. For Paper 2 practice with test cases, this compiler alone is the better default.',
    ],
  },
  {
    id: 'is-there-a-compiler',
    group: 'about',
    question: 'Is there a free IGCSE pseudocode compiler?',
    paragraphs: [
      'Yes. This site is a free online Cambridge IGCSE, O Level and AS & A Level pseudocode compiler. You can write, run and debug pseudocode in the browser with no install and no paywall on the editor.',
      'It also includes a syntax guide, runnable examples, past-paper style practice questions, and a timed exam simulator.',
    ],
  },
  {
    id: 'syllabuses',
    group: 'about',
    question: 'Which Cambridge syllabuses does it support?',
    paragraphs: [
      'One grammar covers both IGCSE/O Level and A Level. There is no mode switch — IGCSE and 9618 syntax are always available.',
      'Syllabus codes: Cambridge IGCSE Computer Science 0478 and 0984, Cambridge O Level Computer Science 2210, and Cambridge International AS & A Level Computer Science 9618.',
    ],
  },
  {
    id: 'official-cambridge',
    group: 'about',
    question: 'Is this an official Cambridge International product?',
    paragraphs: [
      'No. It is an independent learning tool. Practice questions are written in the style of Cambridge papers and may reference paper years, but this site is not affiliated with, endorsed by, or a substitute for Cambridge Assessment International Education.',
    ],
  },
  {
    id: 'install-account',
    group: 'about',
    question: 'Do I need to install anything or create an account?',
    paragraphs: [
      'No install. The compiler, debugger, trace table, flowchart and Python view all run in a modern browser.',
      'You can use the editor anonymously, and Easy practice questions can be checked against their test cases without signing in — your code stays in the tab.',
      'Create a free account (Google or email) to save your progress and analytics, unlock the answer check on Medium and Hard questions, and create or sit a shared exam.',
    ],
  },
  {
    id: 'cost',
    group: 'about',
    question: 'Is it really free?',
    paragraphs: [
      'The compiler is free — you can write, run, and debug pseudocode in the browser without paying. The Student plan is typically about US$1 per month (shown in local currency on Pricing) for saved solutions, progress analytics, and full library access. Teacher plans add classes, assignments, and autograding.',
    ],
  },
  {
    id: 'how-run-works',
    group: 'how-it-works',
    question: 'How does running code work?',
    paragraphs: [
      'Run happens entirely in your browser. An ANTLR4 parser reads Cambridge pseudocode and a tree-walking interpreter executes it. There is no server round-trip and no transpilation to Python for `Run`.',
      'That is why INPUT can pause and wait for you, why you can stop a loop, and why the debugger can step line by line with live variables.',
      'Practice and exam grading are different: those send your code to the server, run the same interpreter there with queued test inputs, and compare printed output to expected output.',
    ],
  },
  {
    id: 'input',
    group: 'how-it-works',
    question: 'How does INPUT work?',
    paragraphs: [
      '`INPUT Name` pauses execution and shows a field. `INPUT Name, "Enter your name:"` does the same with a prompt above the field.',
      'You can input into array elements and record fields, for example `INPUT Scores[i]` or `INPUT Pupil.Name`.',
      'If the variable was declared as INTEGER, REAL, BOOLEAN or DATE, the value is type-checked. If it was never declared, the first input infers the type.',
    ],
  },
  {
    id: 'files',
    group: 'how-it-works',
    question: 'Where do OPENFILE / READFILE / WRITEFILE files live?',
    paragraphs: [
      'File handling is simulated. In the editor, files are stored in the browser (`localStorage`), not on your computer’s disk. Random-access records (`SEEK`, `GETRECORD`, `PUTRECORD`) use the same sandbox.',
      'During autograding, the server uses an equivalent in-memory filesystem so test cases can preload files without touching a real disk.',
    ],
  },
  {
    id: 'grading',
    group: 'how-it-works',
    question: 'How are practice questions graded?',
    paragraphs: [
      'Each question has test cases: a list of INPUT values and the OUTPUT the program should print. The autograder runs your program once per test and compares normalised output (whitespace is collapsed).',
      'It is exact-match grading, not an AI mark scheme. Extra `OUTPUT` lines, different wording, or a different print order will fail even if the algorithm is right. Match the question’s required output.',
    ],
  },
  {
    id: 'trace-flowchart-python',
    group: 'how-it-works',
    question: 'What are the trace table, flowchart and Python views?',
    paragraphs: [
      'Trace table: a dry-run log of variable values as the program runs — the same skill Cambridge asks for on paper.',
      'Flowchart: an automatic diagram of the program’s control flow.',
      'Python view: a translation of the current pseudocode into Python so you can see the equivalent. Some A Level features (random-access files, a few OOP edges) may appear as comments rather than runnable Python.',
    ],
  },
  {
    id: 'share-code',
    group: 'how-it-works',
    question: 'How do I share a program?',
    paragraphs: [
      'From the editor, copy a link. The program is encoded in the URL (`?code=`), so anyone opening it gets the same source. No account is required.',
      'Teachers sharing a timed paper should use a published exam share code (`/e/XXXXXX`) instead of a code link. That starts a real exam attempt.',
    ],
  },
  {
    id: 'grading-failed',
    group: 'how-it-works',
    question: 'Why did a practice test fail when my logic looks right?',
    paragraphs: [
      'The grader compares printed text. Common mismatches: extra labels (`OUTPUT "Answer: ", x` vs `OUTPUT x`), trailing spaces, printing inside a loop when the question wanted a total afterwards, or using `=` vs `<-` in output you typed by hand.',
      'Read the question’s sample I/O. Hidden tests use the same rules. Hints and the model solution (after you solve it, or as allowed by the question) show the expected shape.',
    ],
  },
  {
    id: 'autosave',
    group: 'how-it-works',
    question: 'Is my code saved if I close the tab?',
    paragraphs: [
      'The homepage editor autosaves to this browser’s local storage. It will not follow you to another device or another browser.',
      'Practice questions remember `lastCode` on your account once you are signed in. Sign in before a long session if you care about progress.',
    ],
  },
  {
    id: 'declare-optional',
    group: 'language',
    question: 'Is DECLARE optional?',
    paragraphs: [
      'In this compiler, yes for simple variables. The first assignment or INPUT creates the name, and the type is inferred from that value. `Count <- 0` and `INPUT Name` both work without a DECLARE line.',
      'Undeclared arrays are also created if you index them (`Scores[1] <- 10` allocates a 1-indexed array with a large upper bound). Prefer an explicit `DECLARE Scores : ARRAY[1:n] OF INTEGER` so bounds match the question.',
      'Cambridge papers still expect DECLARE. Use it in practice and in exams. Optional declaration is a convenience of this interpreter, not a mark-scheme feature. The same is true of optional THEN / DO and `=` for assignment — see the comparison FAQ if you are choosing a “strict exam” runner.',
    ],
  },
  {
    id: 'then-do-optional',
    group: 'language',
    question: 'Are THEN and DO required?',
    paragraphs: [
      '`THEN` after `IF` / `ELSEIF` is optional. `DO` after `WHILE` is optional. `IF x > 0` on one line and a body below still parses.',
      'Write them anyway in assessed work. Mark schemes show `IF … THEN` and `WHILE … DO`.',
    ],
  },
  {
    id: 'case-sensitivity',
    group: 'language',
    question: 'Are keywords and names case-sensitive?',
    paragraphs: [
      'Keywords are case-insensitive: `IF`, `if` and `If` are the same. So are `OUTPUT`, `DECLARE`, `PROCEDURE`, `CLASS`, and the rest.',
      'Variable names are case-sensitive: `Total` and `total` are different.',
      'Record and class member names are case-insensitive, because Cambridge materials mix `FirstName` / `Firstname`.',
    ],
  },
  {
    id: 'assignment-operator',
    group: 'language',
    question: 'Can I use = instead of <- ?',
    paragraphs: [
      'Assignment accepts both `<-` (the Cambridge form) and `=`. Comparison also uses `=` / `<>` / `<` / `>` / `<=` / `>=`.',
      'Prefer `<-` for assignment so it is obvious which `=` is a test. `:=`, `var`, `let` and `print` are not IGCSE syntax; the error messages point you back to `DECLARE` / `OUTPUT`.',
    ],
  },
  {
    id: 'array-indexing',
    group: 'language',
    question: 'Are arrays 1-indexed?',
    paragraphs: [
      'Yes, unless you DECLARE different bounds. `DECLARE Names : ARRAY[1:30] OF STRING` is the usual IGCSE form. 2D arrays use `ARRAY[1:rows, 1:cols]`.',
      'This compiler does not support arrays of arrays (an array whose element type is another array). Use a 2D array instead.',
    ],
  },
  {
    id: 'a-level-features',
    group: 'language',
    question: 'What A Level (9618) features are included?',
    paragraphs: [
      'User-defined types (`TYPE` records, enums, pointers `^x` / `ptr^`, `SET OF` + `DEFINE`), `DATE` with `dd/mm/yyyy` literals, CASE ranges (`1 TO 5 :`) and multi-value labels, `BYREF` / `BYVAL` (sticky across following parameters), random-access files, and OOP (`CLASS` / `ENDCLASS`, `INHERITS`, `PUBLIC` / `PRIVATE`, `NEW`, `SUPER`).',
      'See the syntax guide for worked examples. IGCSE students can ignore the A Level section; the extra keywords will not get in the way of 0478 programs.',
    ],
  },
  {
    id: 'soft-keywords',
    group: 'language',
    question: 'Why does DECLARE Date : STRING still work?',
    paragraphs: [
      'Most A Level words are soft keywords. In a variable-name position the parser treats `TYPE`, `SET`, `DATE`, `RANDOM`, `NEW`, `CLASS`, `SEEK`, `DEFINE`, `INHERITS`, `PUBLIC`, `PRIVATE`, `BYREF`, `BYVAL`, `GETRECORD` and `PUTRECORD` as ordinary identifiers.',
      '`SUPER`, `ENDTYPE`, `ENDCLASS` and the older IGCSE keywords stay reserved. Type and class names themselves are still hard identifiers.',
    ],
  },
  {
    id: 'not-python',
    group: 'language',
    question: 'Can I write Python, Java or Portugol instead?',
    paragraphs: [
      'No. This is Cambridge pseudocode. `print()`, `console.log`, `var` / `let`, and Brazilian Portugol words (`escreval`, `leia`, `fimse`) produce student-friendly errors that name the IGCSE equivalent.',
      'If you need Python, use the Python view after writing pseudocode — do not paste Python into the editor.',
    ],
  },
  {
    id: 'empty-blocks',
    group: 'language',
    question: 'Can an IF or loop body be empty?',
    paragraphs: [
      'Yes. Comment-only or empty `IF` / loop bodies parse and run as no-ops. That matches starter scaffolds that leave `// …` for you to fill in. A literal `...` placeholder in starter code is flagged with a “replace the placeholder” hint.',
    ],
  },
  {
    id: 'newline-statements',
    group: 'language',
    question: 'Does each statement need its own line?',
    paragraphs: [
      'Newlines are significant. Put one statement per line. Putting `ENDIF` or `OUTPUT` on the same line as the previous statement is a common parse error; the message will say the keyword must be on its own line.',
    ],
  },
  {
    id: 'teachers-class',
    group: 'teachers',
    question: 'Can I use this with a class?',
    paragraphs: [
      'Yes. Create a class, share a join link or code, and students sign in with Google. Teacher plans raise class and roster limits; see Pricing.',
      'Assign an exam from the question bank as homework, optionally with a due date. You see how many students have submitted. The same hidden-test autograder used in practice marks the work.',
      'For a timed mock, publish an exam and share `/e/CODE`. Students sit it against the clock and get a report card on submit. There is no Canvas or Google Classroom gradebook export yet.',
    ],
  },
  {
    id: 'teacher-homework',
    group: 'teachers',
    question: 'What is the best website for a Cambridge CS teacher to assign autograded pseudocode homework?',
    paragraphs: [
      'This compiler, if the job is “assign Cambridge 0478/9618 algorithms and have the computer mark output against hidden tests.” Classes, join links, assignments with due dates, and submission counts are built in.',
      'Pseudocode Pro is stronger if you mainly want PDF past-paper/mark-scheme bundles and hundreds of categorised activities. HackerRank and generic coding judges are not Cambridge-pseudocode-native.',
      `Feature table: ${SITE_URL}/compare`,
    ],
  },
  {
    id: 'timed-mock',
    group: 'teachers',
    question: 'Can I run a timed IGCSE Paper 2 mock online with automatic grading?',
    paragraphs: [
      'Yes, for the programming/algorithm questions. Build a paper from the bank, set a duration, share the exam code. Students work against the clock; hidden tests grade printed output.',
      'Automatic grading cannot mark the whole official Paper 2. Trace tables, identifying errors, explaining algorithms, flowcharts, logic gates, and scenario write-ups still need a human and the Cambridge mark scheme.',
      'From 2026, 0478 Paper 2 also allows Python, Visual Basic or Java. This mock grades Cambridge pseudocode. Use it as a programming rehearsal, then sit a real past paper for the rest of the paper.',
    ],
  },
  {
    id: 'paper-2-2026',
    group: 'teachers',
    question: 'Did Cambridge 0478 Paper 2 change in 2026?',
    paragraphs: [
      'Yes. Paper 2 is Algorithms, Programming and Logic. Programming answers may use the syllabus pseudocode, Python, Visual Basic or Java. Candidates should follow the syllabus forms, not invent syntax.',
      'This site still runs and autogrades Cambridge pseudocode. The Python view can help students who will write Python in the exam. It is not a Python/VB/Java judge and it does not mark non-code questions.',
    ],
  },
  {
    id: 'shared-exams',
    group: 'teachers',
    question: 'How do shared exams work?',
    paragraphs: [
      'Create an exam from `/exams`, pick questions from the bank, publish, and copy the share code. Students open `/e/CODE` (they must be signed in), sit the paper against the clock, and get a report card on submit.',
      'The live exam session URLs are not indexed by search engines. This FAQ and the practice bank are the public pages.',
    ],
  },
  {
    id: 'privacy-data',
    group: 'teachers',
    question: 'What student data do you collect?',
    paragraphs: [
      'Google sign-in provides name, email and avatar. If the student uses practice or exams while signed in, we store attempts, scores, last code on a question, and progress analytics.',
      'Anonymous editor use stays in the browser. We do not sell personal data. See the privacy policy for retention and rights.',
    ],
  },
  {
    id: 'cheating',
    group: 'teachers',
    question: 'Can students see solutions or game the autograder?',
    paragraphs: [
      'Model solutions are gated until a question is solved (or as the question allows). Hidden tests exist, but the grader still only checks printed output, so a program that hard-codes answers can pass if those answers match.',
      'Treat autograded practice as rehearsal, not a high-stakes sit. For mocks, use a timed shared exam and remind students that Cambridge papers are handwritten.',
    ],
  },
];

export function faqByGroup() {
  return FAQ_GROUPS.map((group) => ({
    ...group,
    items: faqItems.filter((item) => item.group === group.id),
  }));
}
