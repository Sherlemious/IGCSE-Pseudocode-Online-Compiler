import type { Difficulty } from '@prisma/client';
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

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;

export interface DraftTestCase {
  inputs: string[];
  expectedOutput: string;
  isHidden: boolean;
}

export interface QuestionDraft {
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string | null;
  starterCode: string | null;
  solution: string;
  testCases: DraftTestCase[];
}

/** One input per line. A trailing newline is not an extra blank input. */
export function inputLines(text: string): string[] {
  if (text.length === 0) return [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function tooLong(label: string, max: number): string {
  return `${label} is too long (max ${max.toLocaleString('en')} characters).`;
}

function bounded(value: unknown, max: number, label: string): string {
  if (typeof value !== 'string') throw badRequest(`${label} must be text.`);
  if (value.length > max) throw badRequest(tooLong(label, max));
  return value;
}

function parseTest(value: unknown, index: number): DraftTestCase {
  const label = `Test ${index + 1}`;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw badRequest(`${label} is invalid.`);
  const row = value as JsonObject;
  if (!Array.isArray(row.inputs)) throw badRequest(`${label} needs a list of inputs.`);
  if (row.inputs.length > QUESTION_INPUTS_MAX) {
    throw badRequest(`${label} has too many inputs (max ${QUESTION_INPUTS_MAX}).`);
  }
  const inputs = row.inputs.map((input, inputIndex) => {
    if (typeof input !== 'string') throw badRequest(`${label} input ${inputIndex + 1} must be text.`);
    if (input.length > QUESTION_INPUT_LINE_MAX) throw badRequest(tooLong(`${label} input ${inputIndex + 1}`, QUESTION_INPUT_LINE_MAX));
    return input;
  });
  if (typeof row.expectedOutput !== 'string') throw badRequest(`${label} needs an expected output.`);
  if (row.expectedOutput.length > QUESTION_EXPECTED_MAX) throw badRequest(tooLong(`${label} expected output`, QUESTION_EXPECTED_MAX));
  if (row.isHidden !== undefined && typeof row.isHidden !== 'boolean') {
    throw badRequest(`${label} hidden flag must be true or false.`);
  }
  return { inputs, expectedOutput: row.expectedOutput, isHidden: row.isHidden === true };
}

/** CODE questions only. FLOWCHART authoring is out of scope. */
export function parseQuestionDraft(body: JsonObject): QuestionDraft {
  if (body.answerFormat !== undefined && body.answerFormat !== 'CODE') {
    throw badRequest('Custom questions are pseudocode only.');
  }
  const title = bounded(body.title, QUESTION_TITLE_MAX, 'Title').trim();
  if (!title) throw badRequest('Please give the question a title.');

  const description = bounded(body.description, QUESTION_DESCRIPTION_MAX, 'Description').trim();
  if (!description) throw badRequest('Please write the question.');

  if (typeof body.difficulty !== 'string' || !(DIFFICULTIES as readonly string[]).includes(body.difficulty)) {
    throw badRequest('Choose a difficulty: Easy, Medium or Hard.');
  }

  let topic: string | null = null;
  if (body.topic !== undefined && body.topic !== null && body.topic !== '') {
    topic = bounded(body.topic, QUESTION_TOPIC_MAX, 'Topic').trim() || null;
  }

  let starterCode: string | null = null;
  if (typeof body.starterCode === 'string' && body.starterCode.length > 0) {
    if (body.starterCode.length > QUESTION_CODE_MAX) throw badRequest(tooLong('Starter code', QUESTION_CODE_MAX));
    starterCode = body.starterCode;
  } else if (body.starterCode !== undefined && body.starterCode !== null && typeof body.starterCode !== 'string') {
    throw badRequest('Starter code must be text.');
  }

  if (typeof body.solution !== 'string') throw badRequest('Add a solution.');
  if (body.solution.length > QUESTION_CODE_MAX) throw badRequest(tooLong('Solution', QUESTION_CODE_MAX));
  if (!body.solution.trim()) throw badRequest('Add a solution.');

  if (!Array.isArray(body.testCases)) throw badRequest('Add at least one test.');
  if (body.testCases.length === 0) throw badRequest('Add at least one test.');
  if (body.testCases.length > QUESTION_TEST_MAX) {
    throw badRequest(`Too many tests (max ${QUESTION_TEST_MAX}).`);
  }

  return {
    title,
    description,
    difficulty: body.difficulty as Difficulty,
    topic,
    starterCode,
    solution: body.solution,
    testCases: body.testCases.map(parseTest),
  };
}
