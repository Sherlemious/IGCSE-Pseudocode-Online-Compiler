import type { LearnLevel } from '../../types';

const LIST_CORE = `DECLARE LinkedList : ARRAY[0:5, 0:1] OF INTEGER
DECLARE StartLinkedList : INTEGER
DECLARE StartEmptyList : INTEGER

PROCEDURE AddItem(Value : INTEGER)
    DECLARE NewNode : INTEGER
    DECLARE Current : INTEGER
    IF StartEmptyList = -1 THEN
        OUTPUT "full"
    ELSE
        NewNode <- StartEmptyList
        StartEmptyList <- LinkedList[StartEmptyList, 1]
        LinkedList[NewNode, 0] <- Value
        LinkedList[NewNode, 1] <- -1
        IF StartLinkedList = -1 THEN
            StartLinkedList <- NewNode
        ELSE
            Current <- StartLinkedList
            WHILE LinkedList[Current, 1] <> -1 DO
                Current <- LinkedList[Current, 1]
            ENDWHILE
            LinkedList[Current, 1] <- NewNode
        ENDIF
    ENDIF
ENDPROCEDURE

PROCEDURE InitList()
    DECLARE Index : INTEGER
    FOR Index <- 0 TO 4
        LinkedList[Index, 1] <- Index + 1
    NEXT Index
    LinkedList[5, 1] <- -1
    StartLinkedList <- -1
    StartEmptyList <- 0
ENDPROCEDURE`;

const TREE_CORE = `DECLARE Tree : ARRAY[0:9, 0:2] OF INTEGER
DECLARE RootPointer : INTEGER
DECLARE FirstFree : INTEGER

PROCEDURE AddNode(Value : INTEGER)
    DECLARE NewIndex : INTEGER
    DECLARE Current : INTEGER
    DECLARE Parent : INTEGER
    NewIndex <- FirstFree
    Tree[NewIndex, 0] <- -1
    Tree[NewIndex, 1] <- Value
    Tree[NewIndex, 2] <- -1
    FirstFree <- FirstFree + 1
    IF RootPointer = -1 THEN
        RootPointer <- NewIndex
    ELSE
        Current <- RootPointer
        WHILE Current <> -1 DO
            Parent <- Current
            IF Value < Tree[Current, 1] THEN
                Current <- Tree[Current, 0]
            ELSE
                Current <- Tree[Current, 2]
            ENDIF
        ENDWHILE
        IF Value < Tree[Parent, 1] THEN
            Tree[Parent, 0] <- NewIndex
        ELSE
            Tree[Parent, 2] <- NewIndex
        ENDIF
    ENDIF
ENDPROCEDURE

PROCEDURE InitTree()
    DECLARE Index : INTEGER
    FOR Index <- 0 TO 9
        Tree[Index, 0] <- -1
        Tree[Index, 1] <- -1
        Tree[Index, 2] <- -1
    NEXT Index
    RootPointer <- -1
    FirstFree <- 0
ENDPROCEDURE`;

export const alevel7: LearnLevel = {
  number: 7,
  slug: '7',
  name: 'Lists & trees',
  hours: '3',
  leaveWith: 'Array linked list, binary tree insert, in-order walk',
  syllabus: '9618 Paper 4',
  free: false,
  playable: true,
  lessons: [
    {
      id: 'as7.1',
      slug: 'traverse',
      title: 'Follow a linked list',
      type: 'run',
      minutes: 6,
      why: 'Paper 4 stores a linked list in a 2D array: column 0 is the data, column 1 is the next index. -1 means the end.',
      body: `The list is already built: index 0 holds 10 and points at 1, 1 holds 20 and points at 2, 2 holds 30 and points at -1.

The walk starts at \`StartLinkedList\` and stops when the current index is -1.

Run it. The data comes out in link order, not index order.`,
      starterCode: `DECLARE LinkedList : ARRAY[0:4, 0:1] OF INTEGER
DECLARE StartLinkedList : INTEGER
DECLARE Current : INTEGER

LinkedList[0, 0] <- 10
LinkedList[0, 1] <- 1
LinkedList[1, 0] <- 20
LinkedList[1, 1] <- 2
LinkedList[2, 0] <- 30
LinkedList[2, 1] <- -1
StartLinkedList <- 0

Current <- StartLinkedList
WHILE Current <> -1 DO
    OUTPUT LinkedList[Current, 0]
    Current <- LinkedList[Current, 1]
ENDWHILE`,
      solutionCode: `DECLARE LinkedList : ARRAY[0:4, 0:1] OF INTEGER
DECLARE StartLinkedList : INTEGER
DECLARE Current : INTEGER

LinkedList[0, 0] <- 10
LinkedList[0, 1] <- 1
LinkedList[1, 0] <- 20
LinkedList[1, 1] <- 2
LinkedList[2, 0] <- 30
LinkedList[2, 1] <- -1
StartLinkedList <- 0

Current <- StartLinkedList
WHILE Current <> -1 DO
    OUTPUT LinkedList[Current, 0]
    Current <- LinkedList[Current, 1]
ENDWHILE`,
      expectedOutput: '10\n20\n30',
      playable: true,
    },
    {
      id: 'as7.2',
      slug: 'build',
      title: 'Add items, then print them',
      type: 'grade',
      minutes: 8,
      why: 'Inserting uses the free list. StartEmptyList is the next spare node; its link is the node after that. You only walk the data list when you print.',
      body: `\`InitList\` and \`AddItem\` are written. Read how many values, then that many integers, and add each one.

Then walk the list from \`StartLinkedList\` and output each value.

Example: \`3\`, \`4\`, \`5\`, \`6\` →

\`4\`
\`5\`
\`6\``,
      starterCode: `${LIST_CORE}

DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE I : INTEGER
CALL InitList()
INPUT N
FOR I <- 1 TO N
    INPUT Value
    CALL AddItem(Value)
NEXT I

// OUTPUT each value in the list`,
      solutionCode: `${LIST_CORE}

DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE I : INTEGER
DECLARE Current : INTEGER
CALL InitList()
INPUT N
FOR I <- 1 TO N
    INPUT Value
    CALL AddItem(Value)
NEXT I

Current <- StartLinkedList
WHILE Current <> -1 DO
    OUTPUT LinkedList[Current, 0]
    Current <- LinkedList[Current, 1]
ENDWHILE`,
      tests: [
        { inputs: ['1', '10'], expectedOutput: '10' },
        { inputs: ['3', '4', '5', '6'], expectedOutput: '4\n5\n6' },
        { inputs: ['2', '8', '1'], expectedOutput: '8\n1' },
      ],
      mustContain: ['StartLinkedList'],
      playable: true,
    },
    {
      id: 'as7.3',
      slug: 'tree',
      title: 'In-order walks a tree sorted',
      type: 'run',
      minutes: 6,
      why: 'A binary tree in this paper is the same 2D array: column 0 left, column 1 data, column 2 right. In-order (left, node, right) prints the values in ascending order.',
      body: `The inserts are 20, then 10, then 30. 10 goes left of 20. 30 goes right.

In-order visits the left subtree, then the node, then the right subtree. The output is 10, 20, 30 — not the order they were inserted.

Run it.`,
      starterCode: `${TREE_CORE}

PROCEDURE InOrder(NodeIndex : INTEGER)
    IF NodeIndex <> -1 THEN
        CALL InOrder(Tree[NodeIndex, 0])
        OUTPUT Tree[NodeIndex, 1]
        CALL InOrder(Tree[NodeIndex, 2])
    ENDIF
ENDPROCEDURE

CALL InitTree()
CALL AddNode(20)
CALL AddNode(10)
CALL AddNode(30)
CALL InOrder(RootPointer)`,
      solutionCode: `${TREE_CORE}

PROCEDURE InOrder(NodeIndex : INTEGER)
    IF NodeIndex <> -1 THEN
        CALL InOrder(Tree[NodeIndex, 0])
        OUTPUT Tree[NodeIndex, 1]
        CALL InOrder(Tree[NodeIndex, 2])
    ENDIF
ENDPROCEDURE

CALL InitTree()
CALL AddNode(20)
CALL AddNode(10)
CALL AddNode(30)
CALL InOrder(RootPointer)`,
      expectedOutput: '10\n20\n30',
      playable: true,
    },
    {
      id: 'as7.4',
      slug: 'inorder',
      title: 'Write the in-order walk',
      type: 'grade',
      minutes: 8,
      why: 'The recursive case is the whole algorithm. The base case is the null pointer, -1, and it must come first or the walk never stops.',
      body: `\`AddNode\` is written. \`InOrder\` is empty.

Fill it in: if the index is not -1, walk the left child, output this node’s data, walk the right child.

Read three integers, insert them, then call \`InOrder(RootPointer)\`.

Example: \`20\`, \`10\`, \`30\` →

\`10\`
\`20\`
\`30\`

A value equal to the current node goes to the **right**.`,
      starterCode: `${TREE_CORE}

PROCEDURE InOrder(NodeIndex : INTEGER)
ENDPROCEDURE

DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
CALL InitTree()
INPUT A
INPUT B
INPUT C
CALL AddNode(A)
CALL AddNode(B)
CALL AddNode(C)
CALL InOrder(RootPointer)`,
      solutionCode: `${TREE_CORE}

PROCEDURE InOrder(NodeIndex : INTEGER)
    IF NodeIndex <> -1 THEN
        CALL InOrder(Tree[NodeIndex, 0])
        OUTPUT Tree[NodeIndex, 1]
        CALL InOrder(Tree[NodeIndex, 2])
    ENDIF
ENDPROCEDURE

DECLARE A : INTEGER
DECLARE B : INTEGER
DECLARE C : INTEGER
CALL InitTree()
INPUT A
INPUT B
INPUT C
CALL AddNode(A)
CALL AddNode(B)
CALL AddNode(C)
CALL InOrder(RootPointer)`,
      tests: [
        { inputs: ['20', '10', '30'], expectedOutput: '10\n20\n30' },
        { inputs: ['5', '9', '1'], expectedOutput: '1\n5\n9' },
        { inputs: ['8', '8', '3'], expectedOutput: '3\n8\n8' },
      ],
      mustContain: ['InOrder'],
      playable: true,
    },
    {
      id: 'as7.5',
      slug: 'list-quiz',
      title: 'Null pointer, free list, in-order',
      type: 'quiz',
      minutes: 4,
      why: 'The array layout is fixed in the mark scheme. Column numbers and the null value -1 are not yours to invent.',
      body: `Null is -1. The free list is a second chain of unused slots, headed by StartEmptyList.`,
      quiz: [
        {
          prompt: 'In the Paper 4 linked list, LinkedList[i, 1] stores:',
          options: [
            { id: 'next', label: 'The index of the next node, or -1' },
            { id: 'data', label: 'The data value' },
            { id: 'free', label: 'Always the free-list head' },
          ],
          correctId: 'next',
          explanation: 'Column 0 is the data. Column 1 is the next index. -1 ends the chain.',
        },
        {
          prompt: 'A new node is taken from:',
          options: [
            { id: 'free', label: 'StartEmptyList, and that head then moves to the next free node' },
            { id: 'zero', label: 'Index 0 every time' },
            { id: 'end', label: 'Whatever index is one past the last data value' },
          ],
          correctId: 'free',
          explanation: 'The free list is a chain of spare slots. Taking one means reading StartEmptyList and then following its link.',
        },
        {
          prompt: 'In-order on a binary search tree prints:',
          options: [
            { id: 'sorted', label: 'The values in ascending order' },
            { id: 'insert', label: 'The values in the order they were inserted' },
            { id: 'left', label: 'Only the left subtree' },
          ],
          correctId: 'sorted',
          explanation: 'Left, then node, then right. Because smaller values were inserted on the left, that order is sorted.',
        },
      ],
      playable: true,
    },
    {
      id: 'as7.6',
      slug: 'find',
      title: 'Boss: find a value in the list',
      type: 'grade',
      minutes: 8,
      why: 'Paper 4 asks for a search on the linked list you just built. Stop at the first match, or at -1 if it is not there.',
      body: `Read how many values, then the values, and add them. Then read a target.

Output \`found\` if the target is in the list, otherwise \`missing\`.

Example: \`2\`, \`10\`, \`20\`, \`5\` → \`missing\`.`,
      starterCode: `${LIST_CORE}

DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE I : INTEGER
DECLARE Target : INTEGER
CALL InitList()
INPUT N
FOR I <- 1 TO N
    INPUT Value
    CALL AddItem(Value)
NEXT I
INPUT Target

// OUTPUT "found" or "missing"`,
      solutionCode: `${LIST_CORE}

DECLARE N : INTEGER
DECLARE Value : INTEGER
DECLARE I : INTEGER
DECLARE Target : INTEGER
DECLARE Current : INTEGER
DECLARE Found : BOOLEAN
CALL InitList()
INPUT N
FOR I <- 1 TO N
    INPUT Value
    CALL AddItem(Value)
NEXT I
INPUT Target

Found <- FALSE
Current <- StartLinkedList
WHILE Current <> -1 AND Found = FALSE DO
    IF LinkedList[Current, 0] = Target THEN
        Found <- TRUE
    ELSE
        Current <- LinkedList[Current, 1]
    ENDIF
ENDWHILE

IF Found = TRUE THEN
    OUTPUT "found"
ELSE
    OUTPUT "missing"
ENDIF`,
      tests: [
        { inputs: ['2', '10', '20', '20'], expectedOutput: 'found' },
        { inputs: ['2', '10', '20', '5'], expectedOutput: 'missing' },
        { inputs: ['1', '7', '7'], expectedOutput: 'found' },
        { inputs: ['3', '4', '5', '6', '4'], expectedOutput: 'found' },
      ],
      mustContain: ['-1'],
      playable: true,
    },
  ],
};
