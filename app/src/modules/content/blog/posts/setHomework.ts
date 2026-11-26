import type { BlogPost } from '../types';

export const setHomework: BlogPost = {
  slug: 'set-homework-that-marks-itself',
  title: 'Set homework that marks itself',
  description:
    'Set a class a practice assignment that marks itself: the join link, no timer unless you want one, and where the marks land.',
  eyebrow: 'For teachers · Classes',
  audience: 'teacher',
  published: '2026-11-27',
  readingMinutes: 5,
  keywords: [
    'IGCSE pseudocode homework',
    'class assignment pseudocode',
    'autograded pseudocode',
    'Cambridge Paper 2 homework',
  ],
  summary:
    'Open Classes, share the join link, and assign practice questions. Students get a mark as they submit. The timer stays off unless you turn it on.',
  blocks: [
    {
      kind: 'p',
      text: 'A class assignment is a fixed set of practice questions with a due date. Each student runs their answer against the tests, so the mark is there when they submit. You do not collect printouts.',
    },
    {
      kind: 'h2',
      id: 'class',
      text: 'One class, one join link',
    },
    {
      kind: 'p',
      text: 'Open [Classes](/classes). The first time, if you have never made a class, you get one called **My class** and land on its join link. Share that link, the join code, or the printed slip (the slip has the class name, the URL, the code and a QR code). Students open the link and join. You can rename the class.',
    },
    {
      kind: 'p',
      text: 'The free plan is one class and five students. A paid plan is what lifts that.',
    },
    {
      kind: 'h2',
      id: 'assign',
      text: 'Assign from the question, not from a blank form',
    },
    {
      kind: 'p',
      text: 'On a practice question, or from the practice list, choose **Assign to class**. Pick the class, name the homework, and set the due date. The date is read in the timezone your browser sends, so “Friday” means Friday where you are.',
    },
    {
      kind: 'p',
      text: 'Homework starts with **no time limit**. Students can leave and come back, and the work closes at the end of the due date, or when they submit. Turn the timer on only when you want an exam-style sitting. A change to the timer applies to attempts started after the change.',
    },
    {
      kind: 'h2',
      id: 'marks',
      text: 'Where the marks are',
    },
    {
      kind: 'list',
      items: [
        'The class page shows who has joined and how many assignments each student has submitted.',
        'Open an assignment to see each answer. You can write feedback on an answer on any plan. The student sees it on their results, with a “New feedback” mark until they open it.',
        'The mark book is the grid of every assignment. On the free plan you see the latest assignment. The full grid and the CSV download are on a paid plan.',
      ],
    },
    {
      kind: 'p',
      text: 'This is the sort of program worth assigning while a class is still on selection. The tests accept 50 and above as a pass. Run it, then assign that question rather than pasting this into an email.',
    },
    {
      kind: 'code',
      variant: 'right',
      caption: 'Input 60. A mark under 50 prints Fail.',
      code: 'DECLARE Score : INTEGER\nINPUT Score\nIF Score >= 50 THEN\n    OUTPUT "Pass"\nELSE\n    OUTPUT "Fail"\nENDIF',
      output: 'Pass',
    },
    {
      kind: 'code',
      variant: 'wrong',
      caption: 'What a student often pastes. The tests fail before any output is compared.',
      code: 'score = int(input("Score: "))\nif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")',
    },
    {
      kind: 'p',
      text: 'The next post is [writing a question the autograder can mark](/blog/write-a-question-students-can-be-marked-on), for when the practice bank does not have the item you want. Students who need the syntax first can start from [the common mistakes](/blog/common-igcse-pseudocode-mistakes).',
    },
  ],
};
