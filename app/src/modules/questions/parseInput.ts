import { badRequest } from '@/shared/http/errors';
import type { JsonObject } from '@/shared/http/input';
import {
  QUESTION_CODE_MAX,
  QUESTION_DESCRIPTION_MAX,
  QUESTION_EXPECTED_MAX,
  QUESTION_INPUT_LINE_MAX,
  QUESTION_INPUTS_MAX,
  QUESTION_TEST_MAX,
  QUESTION_TITLE_MAX,
  QUESTION_TOPIC_MAX,
} from './limits';

export interface DraftTestCase {
  inputs: string[];
  expectedOutput: string;
  isHidden: boolean;
}

export interface QuestionDraft {
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string | null;
  starterCode: string | null;
  solution: string;
  testCases: DraftTestCase[];
}

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;

function tooLong(label: string, max: number): string {
  return `${label} is too long (max ${max} characters).`;
}

function requiredBounded(value: unknown, max: number, missing: string, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw badRequest(missing);
  const trimmed = value.trim();
  if (trimmed.length > max) throw badRequest(tooLong(label, max));
  return trimmed;
}

function optionalCode(value: unknown, label: string): string | null {
  if (value == null || value === '') return null;
  if (typeof value !== 'string') throw badRequest(`${label} must be text.`);
  if (value.length > QUESTION_CODE_MAX) throw badRequest(tooLong(label, QUESTION_CODE_MAX));
  return value.trim() ? value : null;
}

function readTopic(value: unknown): string | null {
  if (value == null || value === '') return null;
  if (typeof value !== 'string') throw badRequest('Topic must be text.');
  const topic = value.trim();
  if (!topic) return null;
  if (topic.length > QUESTION_TOPIC_MAX) throw badRequest(tooLong('Topic', QUESTION_TOPIC_MAX));
  return topic;
}

function readInputs(value: unknown, testNumber: number): string[] {
  if (!Array.isArray(value)) throw badRequest(`Test ${testNumber} inputs must be a list, one value per line.`);
  if (value.length > QUESTION_INPUTS_MAX) {
    throw badRequest(`Test ${testNumber} has too many inputs (max ${QUESTION_INPUTS_MAX}).`);
  }
  return value.map((item, index) => {
    if (typeof item !== 'string') throw badRequest(`Test ${testNumber} input ${index + 1} must be text.`);
    if (item.length > QUESTION_INPUT_LINE_MAX) {
      throw badRequest(`Test ${testNumber} input ${index + 1} is too long (max ${QUESTION_INPUT_LINE_MAX} characters).`);
    }
    return item;
  });
}

function readTest(value: unknown, testNumber: number): DraftTestCase {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw badRequest(`Test ${testNumber} is invalid.`);
  }
  const row = value as JsonObject;
  if (typeof row.expectedOutput !== 'string') throw badRequest(`Test ${testNumber} needs an expected output.`);
  if (row.expectedOutput.length > QUESTION_EXPECTED_MAX) {
    throw badRequest(`Test ${testNumber} expected output is too long (max ${QUESTION_EXPECTED_MAX} characters).`);
  }
  if (row.isHidden !== undefined && typeof row.isHidden !== 'boolean') {
    throw badRequest(`Test ${testNumber} hidden flag must be true or false.`);
  }
  return {
    inputs: readInputs(row.inputs, testNumber),
    expectedOutput: row.expectedOutput,
    isHidden: row.isHidden === true,
  };
}

/** Parse a create/update/check body. Throws a 400 `HttpError` when a cap is missed. */
export function parseQuestionInput(body: JsonObject): QuestionDraft {
  const title = requiredBounded(body.title, QUESTION_TITLE_MAX, 'Please give the question a title.', 'Title');
  const description = requiredBounded(
    body.description,
    QUESTION_DESCRIPTION_MAX,
    'Please describe the question.',
    'Description',
  );
  if (typeof body.difficulty !== 'string' || !(DIFFICULTIES as readonly string[]).includes(body.difficulty)) {
    throw badRequest('Choose a difficulty: Easy, Medium, or Hard.');
  }
  const solution = optionalCode(body.solution, 'Solution');
  if (!solution) throw badRequest('Add a solution that passes every test.');
  if (!Array.isArray(body.testCases) || body.testCases.length === 0) {
    throw badRequest('Add at least one test.');
  }
  if (body.testCases.length > QUESTION_TEST_MAX) {
    throw badRequest(`A question can have at most ${QUESTION_TEST_MAX} tests.`);
  }
  return {
    title,
    description,
    difficulty: body.difficulty as QuestionDraft['difficulty'],
    topic: readTopic(body.topic),
    starterCode: optionalCode(body.starterCode, 'Starter code'),
    solution,
    testCases: body.testCases.map((test, index) => readTest(test, index + 1)),
  };
}
