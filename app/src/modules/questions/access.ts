import type { QuestionDraft } from './parseInput';

/** Paid teacher (or admin) tier. A trial counts as paid; `free` does not. */
export function canAuthorQuestions(input: { role: string; tier: string }): boolean {
  if (input.tier === 'free') return false;
  return input.role === 'TEACHER' || input.role === 'ADMIN';
}

/** Owner can edit only while their plan still authors questions. */
export function canEditOwnedQuestion(input: {
  viewerId: string;
  ownerId: string | null;
  role: string;
  tier: string;
}): boolean {
  return input.ownerId != null && input.viewerId === input.ownerId && canAuthorQuestions(input);
}

/**
 * An owned question is visible to its owner, and to anyone else only when it
 * sits on an exam attempt that viewer is allowed to open.
 */
export function canViewOwnedQuestion(input: {
  viewerId: string;
  ownerId: string | null;
  onViewerAttempt: boolean;
}): boolean {
  if (input.ownerId == null) return false;
  if (input.viewerId === input.ownerId) return true;
  return input.onViewerAttempt;
}

/** Catalog ids plus this teacher's own ids, in the order they were asked for. */
export function allowedQuestionIds(
  requested: readonly string[],
  catalogIds: readonly string[],
  ownedIds: readonly string[],
): string[] {
  const allowed = new Set<string>([...catalogIds, ...ownedIds]);
  return requested.filter((id) => allowed.has(id));
}

export interface AttemptTestCase {
  id: string;
  inputs: string[];
  expectedOutput: string;
  description: string | null;
}

export interface AttemptQuestionContent {
  questionId: string;
  title: string;
  description: string;
  difficulty: string;
  starterCode: string;
  flowchart: unknown;
  testCases: AttemptTestCase[];
}

/** Student-facing view. Hidden tests and the solution never leave the server. */
export function toAttemptQuestion(row: {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  starterCode: string | null;
  testCases: {
    id: string;
    inputs: string[];
    expectedOutput: string;
    isHidden: boolean;
    description: string | null;
  }[];
}): AttemptQuestionContent {
  return {
    questionId: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    starterCode: row.starterCode ?? '',
    flowchart: null,
    testCases: row.testCases.flatMap((test) =>
      test.isHidden
        ? []
        : [{
            id: test.id,
            inputs: test.inputs,
            expectedOutput: test.expectedOutput,
            description: test.description,
          }],
    ),
  };
}

/** Fields written for a teacher question. Always CODE, never premium, never a flowchart. */
export function ownedQuestionWriteData(draft: QuestionDraft) {
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
    testCases: {
      create: draft.testCases.map((test, sortOrder) => ({
        inputs: test.inputs,
        expectedOutput: test.expectedOutput,
        isHidden: test.isHidden,
        description: null,
        sortOrder,
        initialFiles: null,
      })),
    },
  };
}
