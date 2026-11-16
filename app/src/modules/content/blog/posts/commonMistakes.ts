import type { BlogPost } from '../types';

/**
 * Figures: share of students who hit at least one error in the compiler over
 * the 30 days to 2026-09-26 (percentages only — no counts). Examples are
 * written for the post, never copied from student code.
 */
export const commonMistakes: BlogPost = {
  slug: 'common-igcse-pseudocode-mistakes',
  title: 'The 10 most common IGCSE pseudocode mistakes (from real student code)',
  description:
    'The pseudocode mistakes IGCSE 0478 and O Level 2210 students make most, ranked from real compiler errors — with the fix for each one.',
  eyebrow: 'Paper 2 · Common mistakes',
  published: '2026-09-26',
  readingMinutes: 9,
  keywords: [
    'IGCSE pseudocode common mistakes',
    'Cambridge pseudocode errors',
    '0478 Paper 2 pseudocode',
    'O Level 2210 pseudocode',
    'ENDIF or END IF',
    'pseudocode INPUT prompt',
    'pseudocode syntax error',
  ],
  summary:
    'We ranked the errors students hit while writing Cambridge pseudocode in the compiler. Ten mistakes cause most of them — here is each one, with the fix.',
  blocks: [
    {
      kind: 'p',
      text: 'Every time a student presses **Run** in this compiler and the program fails, we record which kind of mistake it was — never the code itself. We looked at the last 30 days of those errors from students writing Cambridge IGCSE (0478) and O Level (2210) pseudocode.',
    },
    {
      kind: 'stats',
      items: [
        { value: '8 in 10', label: 'students hit at least one error' },
        { value: '49%', label: 'of runs ended in an error' },
        { value: '83%', label: 'of those were syntax errors' },
      ],
    },
    {
      kind: 'p',
      text: 'Most errors stop the program before it starts: the pseudocode is not written the way Cambridge writes it. The good news is that the same handful of slips cause most of them. Below they are ranked by the share of students (who hit any error) that made each one at least once. A student can appear in several.',
    },
    {
      kind: 'callout',
      title: 'Try the broken examples',
      text: 'Every example marked **Wrong** opens in the compiler with **Try it** — you will see the exact message students see, often with a one-click fix.',
    },

    // 1
    { kind: 'h2', id: 'undeclared', text: '1. Using a variable that was never declared — 37%' },
    {
      kind: 'p',
      text: 'The most common mistake by a distance. Either the variable was never declared, or it was declared with one spelling and used with another. `Total` and `Totl` are different names, and so are `Score` and `score` in this compiler.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      failsAtRuntime: true,
      code: 'DECLARE Total : INTEGER\nDECLARE Count : INTEGER\nTotal <- 0\nFOR Count <- 1 TO 5\n  Total <- Totl + Count\nNEXT Count\nOUTPUT Total',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Total : INTEGER\nDECLARE Count : INTEGER\nTotal <- 0\nFOR Count <- 1 TO 5\n  Total <- Total + Count\nNEXT Count\nOUTPUT Total',
      output: '15',
    },
    {
      kind: 'p',
      text: 'Declare every variable at the top with its type, then copy the name from the DECLARE line rather than retyping it. Pick one capitalisation and keep it. See [DECLARE and data types](/docs#declaring).',
    },

    // 2
    { kind: 'h2', id: 'unclosed', text: '2. Leaving an IF or a loop open — 31%' },
    {
      kind: 'p',
      text: 'Every block needs its own closing keyword: `IF` → `ENDIF`, `FOR` → `NEXT` with the counter, `WHILE` → `ENDWHILE`, `REPEAT` → `UNTIL`, `CASE` → `ENDCASE`. Forget one and the error often appears at the very end of the program, far from the real problem.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark >= 50 THEN\n  OUTPUT "Pass"\nELSE\n  OUTPUT "Fail"',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark >= 50 THEN\n  OUTPUT "Pass"\nELSE\n  OUTPUT "Fail"\nENDIF',
    },
    {
      kind: 'p',
      text: 'Write the closer the moment you write the opener, then fill in the middle. Indenting the body makes a missing `ENDIF` easy to spot — on paper as well as on screen.',
    },

    // 3
    { kind: 'h2', id: 'input-type', text: '3. Typing the wrong kind of value into INPUT — 24%' },
    {
      kind: 'p',
      text: 'This one happens while the program runs. `INPUT` checks the answer against the variable\'s declared type, so typing `sixteen` or `16.5` into an `INTEGER` stops the program.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      failsAtRuntime: true,
      caption: 'Run it and type 16.5 when it asks.',
      code: 'DECLARE Age : INTEGER\nOUTPUT "How old are you?"\nINPUT Age\nOUTPUT "Next year you will be ", Age + 1',
    },
    {
      kind: 'p',
      text: 'Choose the type for the data you expect: `INTEGER` for whole numbers, `REAL` for decimals, `STRING` for text, `CHAR` for one character, `BOOLEAN` for TRUE/FALSE. In the exam this is exactly what **validation** questions are about — see [data types](/docs#data-types) and the [INTEGER vs REAL lesson](/learn/2/real-integer).',
    },

    // 4
    { kind: 'h2', id: 'incomplete', text: '4. Lines left half-written — 23%' },
    {
      kind: 'p',
      text: 'An assignment with nothing after the arrow, a comparison with one side missing, a sum that stops at the operator. Usually the student meant to come back to it.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      code: 'DECLARE Total : INTEGER\nDECLARE Average : REAL\nTotal <- 240\nAverage <- Total /\nOUTPUT Average',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Total : INTEGER\nDECLARE Average : REAL\nTotal <- 240\nAverage <- Total / 3\nOUTPUT Average',
      output: '80',
    },
    {
      kind: 'p',
      text: 'Every operator needs a value on both sides, and every condition needs something to compare: `IF Mark > 50 THEN`, not `IF Mark > THEN`.',
    },

    // 5
    { kind: 'h2', id: 'quotes', text: '5. The wrong quotes and symbols — 21%' },
    {
      kind: 'p',
      text: 'Text copied from Word or Google Docs brings curly quotes (“like this”), which pseudocode does not accept. Strings go in straight double quotes; single quotes are only for one `CHAR`. A string that is never closed, or a stray `;` or `{` from another language, causes the same kind of error.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      code: "DECLARE Greeting : STRING\nGreeting <- 'Hello there'\nOUTPUT Greeting;",
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Greeting : STRING\nDECLARE Initial : CHAR\nGreeting <- "Hello there"\nInitial <- \'H\'\nOUTPUT Greeting',
      output: 'Hello there',
    },

    // 6
    { kind: 'h2', id: 'stray-closer', text: '6. An ENDIF, NEXT or ELSE with nothing to close — 18%' },
    {
      kind: 'p',
      text: 'The mirror image of mistake 2: a closing keyword with no matching opener. It usually comes from an extra `ENDIF` after a nested IF, or an `ELSE` placed after the `ENDIF` that already finished the block.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark >= 50 THEN\n  OUTPUT "Pass"\nENDIF\nELSE\n  OUTPUT "Fail"\nENDIF',
    },
    {
      kind: 'p',
      text: 'Count your openers and closers: each `IF` has exactly one `ENDIF`, and `ELSE` sits inside the block, before it. The fixed version is the one in mistake 2.',
    },

    // 7
    { kind: 'h2', id: 'closers', text: '7. Closing keywords written the BASIC way — 13%' },
    {
      kind: 'p',
      text: 'Other languages write `END IF` or `ENDFOR`, and flowcharts start with START and finish with STOP. Cambridge pseudocode does neither: closers are one word, a FOR loop closes with `NEXT` and its counter, and a program has no START/END wrapper — it simply begins at its first statement.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      code: 'START\nDECLARE i : INTEGER\nFOR i <- 1 TO 3\n  IF i = 2 THEN\n    OUTPUT "two"\n  END IF\nENDFOR\nEND',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE i : INTEGER\nFOR i <- 1 TO 3\n  IF i = 2 THEN\n    OUTPUT "two"\n  ENDIF\nNEXT i',
      output: 'two',
    },

    // 8
    { kind: 'h2', id: 'other-languages', text: '8. Habits from Python and other languages — 11%' },
    {
      kind: 'p',
      text: 'Students who already code in Python, JavaScript or Java carry the syntax over. The logic is usually right — only the words are wrong.',
    },
    {
      kind: 'table',
      head: ['You wrote', 'Cambridge pseudocode'],
      rows: [
        ['`print("Hi")`', '`OUTPUT "Hi"`'],
        ['`name = input()`', '`INPUT Name`'],
        ['`if x > 5:`', '`IF X > 5 THEN` … `ENDIF`'],
        ['`for i in range(1, 11):`', '`FOR i <- 1 TO 10` … `NEXT i`'],
        ['`x != y`', '`X <> Y`'],
        ['`x = x + 1`', '`X <- X + 1`'],
        ['`# comment`', '`// comment`'],
      ],
    },

    // 9
    { kind: 'h2', id: 'arrays', text: '9. Array mistakes — 9%' },
    {
      kind: 'p',
      text: 'Three versions of the same confusion: reading past the end of the array, using the whole array where one element is needed, and declaring it the wrong way. Cambridge arrays are declared with their bounds, and usually start at 1.',
    },
    {
      kind: 'code',
      variant: 'wrong',
      failsAtRuntime: true,
      code: 'DECLARE Scores : ARRAY[1:3] OF INTEGER\nDECLARE i : INTEGER\nScores[1] <- 12\nScores[2] <- 15\nScores[3] <- 9\nFOR i <- 1 TO 4\n  OUTPUT Scores[i]\nNEXT i',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Scores : ARRAY[1:3] OF INTEGER\nDECLARE i : INTEGER\nScores[1] <- 12\nScores[2] <- 15\nScores[3] <- 9\nFOR i <- 1 TO 3\n  OUTPUT Scores[i]\nNEXT i',
      output: '12\n15\n9',
    },
    {
      kind: 'p',
      text: 'Make the loop run over exactly the bounds you declared, and always pick an element with an index: `OUTPUT Scores[i]`, not `OUTPUT Scores`. See [1D arrays](/docs#arrays-1d) and the [arrays lesson](/learn/7/declare).',
    },

    // 10
    { kind: 'h2', id: 'if-conditions', text: '10. IF lines missing THEN, or with a broken condition — 8%' },
    {
      kind: 'p',
      text: '`THEN` belongs at the end of the IF line, and each side of `AND` / `OR` must be a complete comparison. Two versions come up again and again: leaving out the variable after `OR`, and writing a range with `TO` (which only `CASE` allows).',
    },
    {
      kind: 'code',
      variant: 'wrong',
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark = 70 TO 79 THEN\n  OUTPUT "Grade B"\nENDIF',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark >= 70 AND Mark <= 79 THEN\n  OUTPUT "Grade B"\nENDIF',
    },
    {
      kind: 'p',
      text: 'The same goes for `IF Password = "cat" OR "dog"`: write `IF Password = "cat" OR Password = "dog" THEN`. See [IF statements](/docs#if) and the [IF lesson](/learn/4/if).',
    },

    // Bonus
    { kind: 'h2', id: 'bonus', text: 'Bonus: the one the compiler lets you get away with' },
    {
      kind: 'p',
      text: 'Many students assign with `=`: `Count = 0`. This compiler runs it as a convenience, so it never shows up as an error above — but on the paper `=` means **is equal to**, and assignment is always `<-`. It costs marks precisely because nothing stops you. The [assignment lesson](/learn/1/assignment) drills it.',
    },
    {
      kind: 'code',
      variant: 'right',
      code: 'DECLARE Count : INTEGER\nCount <- 0\nIF Count = 0 THEN\n  OUTPUT "Starting from zero"\nENDIF',
      output: 'Starting from zero',
    },

    { kind: 'h2', id: 'next', text: 'What to do next' },
    {
      kind: 'list',
      items: [
        'Paste your own program into the [compiler](/) — the error message names the mistake and shows the fix.',
        'Work through the [Paper 2 Path](/learn): short lessons that check your code the way an examiner reads it. Levels 1–3 are free.',
        'Try exam-style [practice questions](/practice) with automatic marking.',
      ],
    },
  ],
};
