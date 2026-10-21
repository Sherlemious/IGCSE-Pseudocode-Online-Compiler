import type { Tier } from '@/modules/billing/limits';

export type OwnedAccess = 'owner' | 'attempt' | 'none';

/**
 * Who may see a teacher-authored question.
 * The owner always can. A student can only when one of their exam attempts
 * contains it. Anyone else cannot — including other teachers.
 */
export function ownedQuestionAccess(input: {
  userId: string | null;
  ownerId: string;
  attemptContains: boolean;
}): OwnedAccess {
  if (input.userId && input.userId === input.ownerId) return 'owner';
  if (input.userId && input.attemptContains) return 'attempt';
  return 'none';
}

export function canViewOwnedQuestion(access: OwnedAccess): boolean {
  return access !== 'none';
}

/** Grading uses the same gate. Students grade only through their exam attempt. */
export function canGradeOwnedQuestion(access: OwnedAccess): boolean {
  return access !== 'none';
}

/** Free, student passes, and lapsed plans cannot create or edit. */
export function mayWriteQuestions(tier: Tier): boolean {
  return tier !== 'free';
}

export interface OwnedQuestionRecord {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  starterCode: string | null;
  answerFormat: string;
  flowchart: unknown;
  topic: string | null;
  solution?: string | null;
  solutionExplanation?: string | null;
  hints?: string[];
  testCases: {
    id: string;
    inputs: string[];
    expectedOutput: string;
    description: string | null;
    sortOrder: number;
    initialFiles: string | null;
    isHidden: boolean;
  }[];
}

/**
 * What a student is allowed to receive. The solution and hidden tests stay
 * on the server; visible tests drop the hidden flag because they are all visible.
 */
export function forStudentView(question: OwnedQuestionRecord) {
  const testCases = question.testCases
    .filter((test) => !test.isHidden)
    .map(({ isHidden: _hidden, ...test }) => test);
  return {
    id: question.id,
    title: question.title,
    description: question.description,
    difficulty: question.difficulty,
    starterCode: question.starterCode,
    answerFormat: question.answerFormat,
    flowchart: question.flowchart,
    topic: question.topic,
    testCases,
  };
}

/** Catalog ids plus this teacher's own ids, in the order the exam asked for. */
export function acceptedExamQuestionIds(
  requested: string[],
  catalogIds: Iterable<string>,
  ownedIds: Iterable<string>,
): string[] {
  const allowed = new Set<string>([...catalogIds, ...ownedIds]);
  return requested.filter((id) => allowed.has(id));
}
