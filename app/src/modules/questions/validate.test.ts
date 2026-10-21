import { describe, expect, it } from 'vitest';
import { inputLines, parseQuestionDraft } from './validate';
import { QUESTION_EXPECTED_MAX, QUESTION_INPUTS_MAX, QUESTION_TEST_MAX, QUESTION_TITLE_MAX } from './limits';

function body(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Double it',
    description: 'Read a number and output twice that number.',
    difficulty: 'EASY',
    topic: 'Arithmetic',
    starterCode: 'INPUT n\n',
    solution: 'INPUT n\nOUTPUT n * 2\n',
    testCases: [{ inputs: ['2'], expectedOutput: '4', isHidden: false }],
    ...overrides,
  };
}

describe('parseQuestionDraft', () => {
  it('accepts a code question and keeps code indentation', () => {
    const draft = parseQuestionDraft(body({ solution: '  INPUT n\n  OUTPUT n\n' }));
    expect(draft.solution.startsWith('  INPUT')).toBe(true);
    expect(draft.topic).toBe('Arithmetic');
    expect(draft.testCases).toEqual([{ inputs: ['2'], expectedOutput: '4', isHidden: false }]);
  });

  it('rejects flowchart answers, blank titles and too-long fields', () => {
    expect(() => parseQuestionDraft(body({ answerFormat: 'FLOWCHART' }))).toThrow(/pseudocode only/);
    expect(() => parseQuestionDraft(body({ title: '   ' }))).toThrow(/title/i);
    expect(() => parseQuestionDraft(body({ title: 'a'.repeat(QUESTION_TITLE_MAX + 1) }))).toThrow(/Title is too long/);
    expect(() => parseQuestionDraft(body({ description: 'd'.repeat(10_001) }))).toThrow(/Description is too long/);
    expect(() => parseQuestionDraft(body({ solution: 's'.repeat(20_001) }))).toThrow(/Solution is too long/);
    expect(() => parseQuestionDraft(body({ starterCode: 's'.repeat(20_001) }))).toThrow(/Starter code is too long/);
    expect(() => parseQuestionDraft(body({ testCases: [] }))).toThrow(/at least one test/i);
    expect(() => parseQuestionDraft(body({
      testCases: Array.from({ length: QUESTION_TEST_MAX + 1 }, () => ({ inputs: [], expectedOutput: '1', isHidden: false })),
    }))).toThrow(/Too many tests/);
  });

  it('caps inputs per test and expected output', () => {
    expect(() => parseQuestionDraft(body({
      testCases: [{ inputs: Array.from({ length: QUESTION_INPUTS_MAX + 1 }, () => '1'), expectedOutput: '1', isHidden: false }],
    }))).toThrow(/too many inputs/);
    expect(() => parseQuestionDraft(body({
      testCases: [{ inputs: ['1'], expectedOutput: 'x'.repeat(QUESTION_EXPECTED_MAX + 1), isHidden: true }],
    }))).toThrow(/expected output/);
    expect(() => parseQuestionDraft(body({
      testCases: [{ inputs: '2', expectedOutput: '4' }],
    }))).toThrow(/list of inputs/);
  });
});

describe('inputLines', () => {
  it('splits one input per line and drops a trailing newline', () => {
    expect(inputLines('')).toEqual([]);
    expect(inputLines('Ada')).toEqual(['Ada']);
    expect(inputLines('Ada\n')).toEqual(['Ada']);
    expect(inputLines('Ada\r\nBo')).toEqual(['Ada', 'Bo']);
    expect(inputLines('Ada\n\nBo')).toEqual(['Ada', '', 'Bo']);
  });
});
