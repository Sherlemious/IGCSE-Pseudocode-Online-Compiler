import type { Difficulty } from '@prisma/client';
import { prisma } from '@/shared/db';
import { forStudentView, type OwnedQuestionRecord } from './access';
import type { QuestionDraft } from './validate';

const EDITOR_SELECT = {
  id: true,
  title: true,
  description: true,
  difficulty: true,
  topic: true,
  starterCode: true,
  solution: true,
  testCases: {
    orderBy: { sortOrder: 'asc' as const },
    select: { inputs: true, expectedOutput: true, isHidden: true, sortOrder: true },
  },
};

const ATTEMPT_SELECT = {
  id: true,
  title: true,
  description: true,
  difficulty: true,
  starterCode: true,
  answerFormat: true,
  flowchart: true,
  topic: true,
  testCases: {
    orderBy: { sortOrder: 'asc' as const },
    select: {
      id: true,
      inputs: true,
      expectedOutput: true,
      description: true,
      sortOrder: true,
      initialFiles: true,
      isHidden: true,
    },
  },
};

function testRows(draft: QuestionDraft) {
  return draft.testCases.map((test, sortOrder) => ({
    inputs: test.inputs,
    expectedOutput: test.expectedOutput,
    isHidden: test.isHidden,
    description: null,
    sortOrder,
    initialFiles: null,
  }));
}

function questionData(draft: QuestionDraft) {
  return {
    title: draft.title,
    description: draft.description,
    difficulty: draft.difficulty,
    topic: draft.topic,
    starterCode: draft.starterCode,
    solution: draft.solution,
    answerFormat: 'CODE' as const,
    isPremium: false,
    hints: [] as string[],
    solutionExplanation: null,
    testCases: { create: testRows(draft) },
  };
}

export function listOwnedQuestions(ownerId: string) {
  return prisma.question.findMany({
    where: { ownerId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      difficulty: true,
      topic: true,
      updatedAt: true,
      _count: { select: { testCases: true } },
    },
  });
}

export function findOwnedQuestion(ownerId: string, id: string) {
  return prisma.question.findFirst({ where: { id, ownerId }, select: EDITOR_SELECT });
}

export function createOwnedQuestion(ownerId: string, draft: QuestionDraft) {
  return prisma.question.create({
    data: { ownerId, ...questionData(draft) },
    select: { id: true },
  });
}

/** Replaces the test set. Caller has already confirmed this teacher owns the row. */
export function replaceOwnedQuestion(id: string, draft: QuestionDraft) {
  return prisma.$transaction(async (tx) => {
    await tx.testCase.deleteMany({ where: { questionId: id } });
    await tx.question.update({ where: { id }, data: questionData(draft) });
  });
}

export function countQuestionUse(id: string) {
  return Promise.all([
    prisma.examQuestion.count({ where: { questionId: id } }),
    prisma.examAnswer.count({ where: { questionId: id } }),
  ]);
}

export function deleteOwnedQuestion(id: string) {
  return prisma.question.delete({ where: { id } });
}

/** Ids this teacher owns, code-format only (exams do not take flowchart answers). */
export async function findOwnedQuestionIds(ownerId: string, ids: string[]): Promise<string[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.question.findMany({
    where: { ownerId, id: { in: [...new Set(ids)] }, answerFormat: 'CODE' },
    select: { id: true },
  });
  return rows.map((row) => row.id);
}

/**
 * Test cases for exam grading when the id is not in the catalog cache.
 * Direct read — owned questions must not be written into the shared Data Cache.
 * Call only after the attempt has been shown to contain this question.
 */
export async function loadOwnedTestCases(questionId: string) {
  const row = await prisma.question.findFirst({
    where: { id: questionId, ownerId: { not: null } },
    select: {
      testCases: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          inputs: true,
          expectedOutput: true,
          isHidden: true,
          description: true,
          sortOrder: true,
          initialFiles: true,
        },
      },
    },
  });
  return row?.testCases ?? null;
}

/**
 * Public fields for owned questions on an attempt this student (or the owner)
 * is allowed to open. Hidden tests and the solution are not selected.
 */
export async function findAttemptQuestionViews(userId: string, ids: string[]) {
  if (ids.length === 0) return [];
  const rows = await prisma.question.findMany({
    where: {
      id: { in: ids },
      ownerId: { not: null },
      OR: [
        { ownerId: userId },
        { examAnswers: { some: { examAttempt: { userId } } } },
      ],
    },
    select: ATTEMPT_SELECT,
  });
  return rows.map((row) => forStudentView(row as OwnedQuestionRecord));
}

/** Titles for exam results and the teacher's exam page. Same access gate as the take view. */
export function findOwnedQuestionLabels(userId: string, ids: string[]) {
  if (ids.length === 0) return Promise.resolve([] as { id: string; title: string; difficulty: Difficulty; topic: string | null }[]);
  return prisma.question.findMany({
    where: {
      id: { in: ids },
      ownerId: { not: null },
      OR: [
        { ownerId: userId },
        { examAnswers: { some: { examAttempt: { userId } } } },
      ],
    },
    select: { id: true, title: true, difficulty: true, topic: true },
  });
}
