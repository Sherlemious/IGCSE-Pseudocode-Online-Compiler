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
  /** Error category slug when the code failed to parse or run (`reason: 'runtime'`). */
  errorCategory?: string;
};

function containsAll(code: string, needles: string[]): string | null {
  for (const needle of needles) {
    if (!code.includes(needle)) return needle;
  }
  return null;
}

/**
 * Why a required snippet is "missing". The grammar accepts `=` for assignment
 * and lowercase keywords, so code that runs fine can still miss the exact
 * Cambridge form — say which form, instead of claiming it isn't there at all.
 */
function mustContainMessage(code: string, needle: string): string {
  if (needle === '<-' && /[A-Za-z_]\w*(?:\[[^\]]*\])?\s*=(?!=)/.test(code))
    return 'Assign with `<-`, not `=` — for example `Score <- 42`. In Cambridge pseudocode `=` means "is equal to".';
  const at = code.toLowerCase().indexOf(needle.toLowerCase());
  if (at >= 0) {
    const wrote = code.slice(at, at + needle.length);
    const keyword = /^[A-Z_]+$/.test(needle) ? ' Keywords are written in capitals on the paper.' : '';
    return `Write \`${needle}\` exactly like that — you wrote \`${wrote}\`.${keyword}`;
  }
  return `Your code must include \`${needle}\`.`;
}

const oneLine = (text: string) => text.replace(/\n/g, ' / ');
const sameOutput = (a: string, b: string) => a.trim().replace(/\s+/g, ' ') === b.trim().replace(/\s+/g, ' ');

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
    return { ok: false, reason: 'must_contain', message: mustContainMessage(code, missing) };
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
    const initialFiles = test.initialFiles ? JSON.stringify(test.initialFiles) : undefined;
    const result = await gradeSubmission(code, test.inputs, test.expectedOutput, initialFiles);
    if (result.error) {
      const where = result.error.line ? ` (line ${result.error.line})` : '';
      return {
        ok: false,
        reason: 'runtime',
        message: (result.error.hint ?? result.error.message) + where,
        errorCategory: result.error.category ?? result.error.kind,
        actualOutput: result.actualOutput,
      };
    }
    if (!result.passed) {
      const inputs = test.inputs.map((v) => `\`${v}\``).join(', ');
      const label =
        cases.length > 1 ? `Test ${i + 1}${inputs ? ` (input ${inputs})` : ''} failed. ` : inputs ? `With input ${inputs}: ` : '';
      const expected = `Expected \`${oneLine(test.expectedOutput)}\``;
      let message: string;
      if (!result.actualOutput.trim()) {
        message = `${label}Your program printed nothing — add an OUTPUT for the answer. ${expected}.`;
      } else if (cases.slice(0, i).some((earlier) => sameOutput(earlier.expectedOutput, result.actualOutput))) {
        // Passed an earlier test, then printed that same answer again: the
        // result is fixed in the code instead of worked out from INPUT.
        message =
          `${label}${expected}, got \`${oneLine(result.actualOutput)}\` — the same answer as an earlier test. ` +
          'Work it out from the value you INPUT, not a fixed number.';
      } else {
        message = `${label}${expected}, got \`${oneLine(result.actualOutput)}\`.`;
      }
      return { ok: false, reason: 'wrong_output', message, actualOutput: result.actualOutput };
    }
  }

  return {
    ok: true,
    reason: 'passed',
    message: cases.length > 1 ? `All ${cases.length} tests passed.` : 'Output matches.',
  };
}
