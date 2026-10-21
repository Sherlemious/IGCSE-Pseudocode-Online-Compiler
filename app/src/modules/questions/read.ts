import { getPublicQuestion, getQuestionCatalog } from '@/shared/lib/catalogCache';
import { toAttemptQuestion, type AttemptQuestionContent } from './access';
import * as repo from './repo';

export type { AttemptQuestionContent };

/**
 * Question text for an attempt the caller has already authorised (their own
 * attempt, or an exam they own). Owned rows are read straight from Postgres
 * and are not stored in the shared catalog cache. Hidden tests are omitted.
 */
export async function loadAttemptQuestionContent(ids: string[]): Promise<Map<string, AttemptQuestionContent>> {
  const map = new Map<string, AttemptQuestionContent>();
  const missing: string[] = [];
  for (const id of [...new Set(ids)]) {
    const question = await getPublicQuestion(id);
    if (!question) {
      missing.push(id);
      continue;
    }
    map.set(id, {
      questionId: question.id,
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      starterCode: question.starterCode ?? '',
      flowchart: question.answerFormat === 'CODE' ? (question.flowchart ?? null) : null,
      testCases: question.testCases.map((test) => ({
        id: test.id,
        inputs: test.inputs,
        expectedOutput: test.expectedOutput,
        description: test.description,
      })),
    });
  }
  if (missing.length > 0) {
    const owned = await repo.findOwnedAttemptQuestions(missing);
    for (const row of owned) map.set(row.id, toAttemptQuestion(row));
  }
  return map;
}

export interface QuestionLabel {
  id: string;
  title: string;
  difficulty: string;
  topic: string | null;
}

/** Titles for ids the caller already holds (an exam they own, or their attempt). */
export async function loadQuestionLabels(ids: string[]): Promise<Map<string, QuestionLabel>> {
  const catalog = new Map((await getQuestionCatalog()).map((question) => [question.id, question]));
  const missing = [...new Set(ids)].filter((id) => !catalog.has(id));
  const owned = await repo.findOwnedLabels(missing);
  const ownedById = new Map(owned.map((row) => [row.id, row]));
  const map = new Map<string, QuestionLabel>();
  for (const id of ids) {
    const fromCatalog = catalog.get(id);
    if (fromCatalog) {
      map.set(id, {
        id: fromCatalog.id,
        title: fromCatalog.title,
        difficulty: fromCatalog.difficulty,
        topic: fromCatalog.topic,
      });
      continue;
    }
    const fromOwner = ownedById.get(id);
    if (fromOwner) map.set(id, fromOwner);
  }
  return map;
}
