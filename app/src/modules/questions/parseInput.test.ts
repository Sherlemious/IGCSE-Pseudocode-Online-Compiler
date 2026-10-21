import { describe, expect, it } from 'vitest';
import { HttpError } from '@/shared/http/errors';
import { QUESTION_EXPECTED_MAX, QUESTION_INPUTS_MAX, QUESTION_TEST_MAX, QUESTION_TITLE_MAX } from './limits';
import { parseQuestionInput } from './parseInput';

function valid(overrides: Record<string, unknown> = {}) {
  return {
    title: ' Sum ',
    description: ' Add two numbers ',
    difficulty: 'EASY',
    topic: ' Arithmetic ',
    starterCode: '',
    solution: 'OUTPUT "ok"\n',
    testCases: [{ inputs: ['1'], expectedOutput: 'ok', isHidden: true }],
    ...overrides,
  };
}

function rejected(body: Record<string, unknown>) {
  try {
    parseQuestionInput(body);
  } catch (err) {
    return err;
  }
  throw new Error('expected a 400');
}

describe('parseQuestionInput', () => {
  it('trims text fields and keeps code, hidden flags, and empty starter as null', () => {
    const draft = parseQuestionInput(valid());
    expect(draft.title).toBe('Sum');
    expect(draft.description).toBe('Add two numbers');
    expect(draft.topic).toBe('Arithmetic');
    expect(draft.starterCode).toBeNull();
    expect(draft.solution).toBe('OUTPUT "ok"\n');
    expect(draft.testCases).toEqual([{ inputs: ['1'], expectedOutput: 'ok', isHidden: true }]);
  });

  it('rejects missing, oversized, and malformed fields', () => {
    expect(rejected(valid({ title: '   ' }))).toBeInstanceOf(HttpError);
    expect(rejected(valid({ title: 'x'.repeat(QUESTION_TITLE_MAX + 1) }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ description: '' }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ description: 'd'.repeat(10_001) }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ difficulty: 'BOSS' }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ solution: '   ' }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ solution: 'x'.repeat(20_001) }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ starterCode: 'x'.repeat(20_001) }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ topic: 't'.repeat(81) }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ testCases: [] }))).toMatchObject({ status: 400 });
    expect(rejected(valid({
      testCases: Array.from({ length: QUESTION_TEST_MAX + 1 }, () => ({ inputs: [], expectedOutput: '1', isHidden: false })),
    }))).toMatchObject({ status: 400 });
    expect(rejected(valid({
      testCases: [{ inputs: Array.from({ length: QUESTION_INPUTS_MAX + 1 }, () => '1'), expectedOutput: '1' }],
    }))).toMatchObject({ status: 400 });
    expect(rejected(valid({
      testCases: [{ inputs: ['x'.repeat(2_001)], expectedOutput: '1' }],
    }))).toMatchObject({ status: 400 });
    expect(rejected(valid({
      testCases: [{ inputs: [], expectedOutput: 'y'.repeat(QUESTION_EXPECTED_MAX + 1) }],
    }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ testCases: [{ inputs: 'nope', expectedOutput: '1' }] }))).toMatchObject({ status: 400 });
    expect(rejected(valid({ testCases: [{ inputs: [], expectedOutput: '1', isHidden: 'yes' }] }))).toMatchObject({ status: 400 });
  });
});
