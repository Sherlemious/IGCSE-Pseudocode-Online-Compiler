import type { LearnLevel } from '../../types';

const STACK = `DECLARE StackData : ARRAY[0:9] OF INTEGER
DECLARE Top : INTEGER

FUNCTION Push(Value : INTEGER) RETURNS BOOLEAN
    IF Top = 9 THEN
        RETURN FALSE
    ENDIF
    Top <- Top + 1
    StackData[Top] <- Value
    RETURN TRUE
ENDFUNCTION

FUNCTION Pop() RETURNS INTEGER
    DECLARE Value : INTEGER
    IF Top = -1 THEN
        RETURN -1
    ENDIF
    Value <- StackData[Top]
    Top <- Top - 1
    RETURN Value
ENDFUNCTION`;

export const alevel6: LearnLevel = {
  number: 6,
  slug: '6',
  name: 'Stack & queue',
  hours: '3',
  leaveWith: 'LIFO stack, FIFO queue, circular wrap with MOD',
  syllabus: '9618 §10.4 and Paper 4',
  free: false,
  playable: true,
  lessons: [
    {
      id: 'as6.1',
      slug: 'stack',
      title: 'A stack is last in, first out',
      type: 'run',
      minutes: 6,
      why: 'Paper 2 asks you to use a stack. Paper 4 asks you to write push and pop on an array, with Top starting at -1.',
      body: `\`Top\` is the index of the last item pushed. An empty stack has Top = -1. Full, on this array, is Top = 4.

Push 10, then 20, then 30. Pop three times. The first pop is 30.

Run it.`,
      starterCode: `DECLARE StackData : ARRAY[0:4] OF INTEGER
DECLARE Top : INTEGER

FUNCTION Push(Value : INTEGER) RETURNS BOOLEAN
    IF Top = 4 THEN
        RETURN FALSE
    ENDIF
    Top <- Top + 1
    StackData[Top] <- Value
    RETURN TRUE
ENDFUNCTION

FUNCTION Pop() RETURNS INTEGER
    DECLARE Value : INTEGER
    IF Top = -1 THEN
        RETURN -1
    ENDIF
    Value <- StackData[Top]
    Top <- Top - 1
    RETURN Value
ENDFUNCTION

Top <- -1
OUTPUT Push(10)
OUTPUT Push(20)
OUTPUT Push(30)
OUTPUT Pop()
OUTPUT Pop()
OUTPUT Pop()`,
      solutionCode: `DECLARE StackData : ARRAY[0:4] OF INTEGER
DECLARE Top : INTEGER

FUNCTION Push(Value : INTEGER) RETURNS BOOLEAN
    IF Top = 4 THEN
        RETURN FALSE
    ENDIF
    Top <- Top + 1
    StackData[Top] <- Value
    RETURN TRUE
ENDFUNCTION

FUNCTION Pop() RETURNS INTEGER
    DECLARE Value : INTEGER
    IF Top = -1 THEN
        RETURN -1
    ENDIF
    Value <- StackData[Top]
    Top <- Top - 1
    RETURN Value
ENDFUNCTION

Top <- -1
OUTPUT Push(10)
OUTPUT Push(20)
OUTPUT Push(30)
OUTPUT Pop()
OUTPUT Pop()
OUTPUT Pop()`,
      expectedOutput: 'TRUE\nTRUE\nTRUE\n30\n20\n10',
      playable: true,
    },
    {
      id: 'as6.2',
      slug: 'pop',
      title: 'Write Pop',
      type: 'grade',
      minutes: 8,
      why: 'Pop returns the value at Top, then moves Top down. Empty is the case Top = -1, before you read the array.',
      body: `Push is written. \`Pop\` currently returns -1 every time.

Write Pop so it returns the top value and removes it. An empty stack returns -1.

The program pushes three inputs and pops them. Output only the three pops.

Example: \`1\`, \`2\`, \`3\` →

\`3\`
\`2\`
\`1\``,
      starterCode: `DECLARE StackData : ARRAY[0:9] OF INTEGER
DECLARE Top : INTEGER

FUNCTION Push(Value : INTEGER) RETURNS BOOLEAN
    IF Top = 9 THEN
        RETURN FALSE
    ENDIF
    Top <- Top + 1
    StackData[Top] <- Value
    RETURN TRUE
ENDFUNCTION

FUNCTION Pop() RETURNS INTEGER
    RETURN -1
ENDFUNCTION

DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
DECLARE Ok : BOOLEAN
Top <- -1
INPUT A
INPUT B
INPUT C
Ok <- Push(A)
Ok <- Push(B)
Ok <- Push(C)
OUTPUT Pop()
OUTPUT Pop()
OUTPUT Pop()`,
      solutionCode: `DECLARE StackData : ARRAY[0:9] OF INTEGER
DECLARE Top : INTEGER

FUNCTION Push(Value : INTEGER) RETURNS BOOLEAN
    IF Top = 9 THEN
        RETURN FALSE
    ENDIF
    Top <- Top + 1
    StackData[Top] <- Value
    RETURN TRUE
ENDFUNCTION

FUNCTION Pop() RETURNS INTEGER
    DECLARE Value : INTEGER
    IF Top = -1 THEN
        RETURN -1
    ENDIF
    Value <- StackData[Top]
    Top <- Top - 1
    RETURN Value
ENDFUNCTION

DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
DECLARE Ok : BOOLEAN
Top <- -1
INPUT A
INPUT B
INPUT C
Ok <- Push(A)
Ok <- Push(B)
Ok <- Push(C)
OUTPUT Pop()
OUTPUT Pop()
OUTPUT Pop()`,
      tests: [
        { inputs: ['1', '2', '3'], expectedOutput: '3\n2\n1' },
        { inputs: ['9', '8', '7'], expectedOutput: '7\n8\n9' },
        { inputs: ['4', '4', '1'], expectedOutput: '1\n4\n4' },
      ],
      mustContain: ['Top <- Top - 1'],
      playable: true,
    },
    {
      id: 'as6.3',
      slug: 'queue',
      title: 'A queue is first in, first out',
      type: 'run',
      minutes: 6,
      why: 'Enqueue at the tail, dequeue at the head. Head and tail both start at -1 on a linear queue.',
      body: `An empty dequeue returns the string \`"false"\` here, because the function’s return type is the item, not a Boolean. A failed enqueue returns FALSE.

Enqueue A, then B. Dequeue twice, then once more on the empty queue.

Run it.`,
      starterCode: `DECLARE QueueData : ARRAY[0:4] OF STRING
DECLARE Head : INTEGER
DECLARE Tail : INTEGER

FUNCTION Enqueue(Value : STRING) RETURNS BOOLEAN
    IF Tail = 4 THEN
        RETURN FALSE
    ENDIF
    IF Head = -1 THEN
        Head <- 0
    ENDIF
    Tail <- Tail + 1
    QueueData[Tail] <- Value
    RETURN TRUE
ENDFUNCTION

FUNCTION Dequeue() RETURNS STRING
    DECLARE Item : STRING
    IF Head = -1 OR Head > Tail THEN
        RETURN "false"
    ENDIF
    Item <- QueueData[Head]
    Head <- Head + 1
    RETURN Item
ENDFUNCTION

Head <- -1
Tail <- -1
OUTPUT Enqueue("A")
OUTPUT Enqueue("B")
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Dequeue()`,
      solutionCode: `DECLARE QueueData : ARRAY[0:4] OF STRING
DECLARE Head : INTEGER
DECLARE Tail : INTEGER

FUNCTION Enqueue(Value : STRING) RETURNS BOOLEAN
    IF Tail = 4 THEN
        RETURN FALSE
    ENDIF
    IF Head = -1 THEN
        Head <- 0
    ENDIF
    Tail <- Tail + 1
    QueueData[Tail] <- Value
    RETURN TRUE
ENDFUNCTION

FUNCTION Dequeue() RETURNS STRING
    DECLARE Item : STRING
    IF Head = -1 OR Head > Tail THEN
        RETURN "false"
    ENDIF
    Item <- QueueData[Head]
    Head <- Head + 1
    RETURN Item
ENDFUNCTION

Head <- -1
Tail <- -1
OUTPUT Enqueue("A")
OUTPUT Enqueue("B")
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Dequeue()`,
      expectedOutput: 'TRUE\nTRUE\nA\nB\nfalse',
      playable: true,
    },
    {
      id: 'as6.4',
      slug: 'circular',
      title: 'A circular queue wraps with MOD',
      type: 'mutate',
      minutes: 8,
      why: 'A linear queue wastes the slots behind the head. A circular queue reuses them. MOD brings the index back to 0, and Count tells full from empty.',
      body: `Head and Tail start at 0. The array has indices 0 to 3.

Both updates are \`+ 1\`, so the fifth successful enqueue walks off the end.

Wrap Head and Tail with \`MOD(... + 1, 4)\`. Count is what distinguishes full from empty when Head = Tail.

After the wrap, the program prints the four dequeues \`C\`, \`D\`, \`E\`, \`F\` at the end.`,
      trap: 'Head = Tail is not enough. Count = 0 means empty. Count = 4 means full.',
      starterCode: `DECLARE QueueData : ARRAY[0:3] OF STRING
DECLARE Head : INTEGER
DECLARE Tail : INTEGER
DECLARE Count : INTEGER

FUNCTION Enqueue(Value : STRING) RETURNS BOOLEAN
    IF Count = 4 THEN
        RETURN FALSE
    ENDIF
    QueueData[Tail] <- Value
    Tail <- Tail + 1
    Count <- Count + 1
    RETURN TRUE
ENDFUNCTION

FUNCTION Dequeue() RETURNS STRING
    DECLARE Item : STRING
    IF Count = 0 THEN
        RETURN "false"
    ENDIF
    Item <- QueueData[Head]
    Head <- Head + 1
    Count <- Count - 1
    RETURN Item
ENDFUNCTION

Head <- 0
Tail <- 0
Count <- 0
OUTPUT Enqueue("A")
OUTPUT Enqueue("B")
OUTPUT Enqueue("C")
OUTPUT Enqueue("D")
OUTPUT Enqueue("X")
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Enqueue("E")
OUTPUT Enqueue("F")
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Dequeue()`,
      solutionCode: `DECLARE QueueData : ARRAY[0:3] OF STRING
DECLARE Head : INTEGER
DECLARE Tail : INTEGER
DECLARE Count : INTEGER

FUNCTION Enqueue(Value : STRING) RETURNS BOOLEAN
    IF Count = 4 THEN
        RETURN FALSE
    ENDIF
    QueueData[Tail] <- Value
    Tail <- MOD(Tail + 1, 4)
    Count <- Count + 1
    RETURN TRUE
ENDFUNCTION

FUNCTION Dequeue() RETURNS STRING
    DECLARE Item : STRING
    IF Count = 0 THEN
        RETURN "false"
    ENDIF
    Item <- QueueData[Head]
    Head <- MOD(Head + 1, 4)
    Count <- Count - 1
    RETURN Item
ENDFUNCTION

Head <- 0
Tail <- 0
Count <- 0
OUTPUT Enqueue("A")
OUTPUT Enqueue("B")
OUTPUT Enqueue("C")
OUTPUT Enqueue("D")
OUTPUT Enqueue("X")
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Enqueue("E")
OUTPUT Enqueue("F")
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Dequeue()
OUTPUT Dequeue()`,
      expectedOutput: 'TRUE\nTRUE\nTRUE\nTRUE\nFALSE\nA\nB\nTRUE\nTRUE\nC\nD\nE\nF',
      mustContain: ['MOD'],
      playable: true,
    },
    {
      id: 'as6.5',
      slug: 'adt-quiz',
      title: 'Stack, queue, or either?',
      type: 'quiz',
      minutes: 4,
      why: 'Section 10.4 asks which ADT fits the situation. Paper 4 then asks for the algorithm. The choice comes first.',
      body: `A stack is LIFO. A queue is FIFO. Both can be built from a fixed array, so both can overflow.`,
      quiz: [
        {
          prompt: 'Undo in an editor, where the last action is the first one reversed, is a:',
          options: [
            { id: 'stack', label: 'Stack' },
            { id: 'queue', label: 'Queue' },
            { id: 'either', label: 'Either — the order does not matter' },
          ],
          correctId: 'stack',
          explanation: 'Last in, first out. A queue would undo the oldest action first.',
        },
        {
          prompt: 'Print jobs leave in the order they arrived. That is a:',
          options: [
            { id: 'queue', label: 'Queue' },
            { id: 'stack', label: 'Stack' },
            { id: 'list', label: 'Stack, but only if Top starts at 0' },
          ],
          correctId: 'queue',
          explanation: 'First in, first out. Enqueue at the rear, dequeue at the front.',
        },
        {
          prompt: 'On a circular queue, Head = Tail. It is empty when:',
          options: [
            { id: 'count', label: 'Count is 0 — Head = Tail is also true when it is full' },
            { id: 'always', label: 'Head = Tail always means empty' },
            { id: 'top', label: 'Top is -1' },
          ],
          correctId: 'count',
          explanation: 'After wrapping, Head and Tail meet both when the queue is empty and when it is full. Count (or a spare slot) is how you tell them apart.',
        },
      ],
      playable: true,
    },
    {
      id: 'as6.6',
      slug: 'reverse',
      title: 'Boss: reverse four integers',
      type: 'grade',
      minutes: 8,
      why: 'Reversing a sequence is the standard reason to reach for a stack. Push everything, then pop until it is empty.',
      body: `Push and Pop are written. \`Top\` starts at -1.

Read four integers, push each one, then pop four times and output each popped value.

Example: \`1\`, \`2\`, \`3\`, \`4\` →

\`4\`
\`3\`
\`2\`
\`1\``,
      starterCode: `${STACK}

DECLARE N : INTEGER
Top <- -1

// read 4 integers, push each, then output 4 pops`,
      solutionCode: `${STACK}

DECLARE N : INTEGER
DECLARE I : INTEGER
DECLARE Ok : BOOLEAN
Top <- -1

FOR I <- 1 TO 4
    INPUT N
    Ok <- Push(N)
NEXT I

FOR I <- 1 TO 4
    OUTPUT Pop()
NEXT I`,
      tests: [
        { inputs: ['1', '2', '3', '4'], expectedOutput: '4\n3\n2\n1' },
        { inputs: ['9', '8', '7', '6'], expectedOutput: '6\n7\n8\n9' },
        { inputs: ['5', '5', '1', '2'], expectedOutput: '2\n1\n5\n5' },
      ],
      mustContain: ['Push', 'Pop'],
      playable: true,
    },
  ],
};
