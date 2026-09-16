import { gradeSubmission } from '@/modules/practice/autograder';
import type { LearnLesson } from './types';

export type CheckReason =
  | 'passed'
  | 'quiz'
  | 'must_contain'
  | 'forbidden'
  | 'no_tests'
  | 'runtime'
  | 'wrong_output';

export type LessonCheckResult = {
  ok: boolean;
  message: string;
  reason: CheckReason;
  actualOutput?: string;
};

function containsAll(code: string, needles: string[]): string | null {
  for (const needle of needles) {
    if (!code.includes(needle)) return needle;
  }
  return null;
}

function containsAny(code: string, needles: string[]): string | null {
  for (const needle of needles) {
    if (code.includes(needle)) return needle;
  }
  return null;
}

/**
 * Deterministic check used by the player and by curriculum tests.
 * Interactive Run is separate — this always feeds `tests` / `expectedOutput`
 * through the same autograder as practice questions.
 */
export async function checkLessonCode(lesson: LearnLesson, code: string): Promise<LessonCheckResult> {
  if (lesson.type === 'quiz') {
    return { ok: false, reason: 'quiz', message: 'This lesson is a quiz — pick the answers on the left.' };
  }

  const missing = lesson.mustContain ? containsAll(code, lesson.mustContain) : null;
  if (missing !== null) {
    return { ok: false, reason: 'must_contain', message: `Your code must include \`${missing}\`.` };
  }

  const forbidden = lesson.mustNotContain ? containsAny(code, lesson.mustNotContain) : null;
  if (forbidden !== null) {
    return { ok: false, reason: 'forbidden', message: `Remove \`${forbidden}\` from your code.` };
  }

  const cases = lesson.tests?.length
    ? lesson.tests
    : lesson.expectedOutput !== undefined
      ? [{ inputs: [] as string[], expectedOutput: lesson.expectedOutput }]
      : [];

  if (cases.length === 0) {
    return { ok: false, reason: 'no_tests', message: 'This lesson has nothing to check yet.' };
  }

  for (let i = 0; i < cases.length; i++) {
    const test = cases[i];
    const result = await gradeSubmission(code, test.inputs, test.expectedOutput);
    if (result.error) {
      const where = result.error.line ? ` (line ${result.error.line})` : '';
      return {
        ok: false,
        reason: 'runtime',
        message: result.error.message + where,
        actualOutput: result.actualOutput,
      };
    }
    if (!result.passed) {
      const label = cases.length > 1 ? `Test ${i + 1} failed. ` : '';
      return {
        ok: false,
        reason: 'wrong_output',
        message: `${label}Expected \`${test.expectedOutput.replace(/\n/g, ' / ')}\`, got \`${result.actualOutput.replace(/\n/g, ' / ') || '(empty)'}\`.`,
        actualOutput: result.actualOutput,
      };
    }
  }

  return {
    ok: true,
    reason: 'passed',
    message: cases.length > 1 ? `All ${cases.length} tests passed.` : 'Output matches.',
  };
}
