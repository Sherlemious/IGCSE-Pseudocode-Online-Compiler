import { gradeSubmission } from '@/modules/practice/autograder';
import type { QuickFix } from '@/modules/interpreter/quickFix';
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
  /** 1-based line to explain under, when the mistake is on a specific line. */
  line?: number;
  /** One-click edit for that line, when the correction is mechanical. */
  fix?: QuickFix;
};

function containsAll(code: string, needles: string[]): string | null {
  for (const needle of needles) {
    if (!code.includes(needle)) return needle;
  }
  return null;
}

/** A line that stores with `=`, which this compiler accepts and the paper does not. */
function equalsAssignment(code: string): { line: number; original: string; corrected: string } | null {
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(\s*)([A-Za-z_]\w*(?:\[[^\]]*\])?)\s*=(?!=)\s*(.*?)\s*$/);
    if (!match) continue;
    return {
      line: i + 1,
      original: lines[i],
      corrected: `${match[1]}${match[2]} <- ${match[3]}`,
    };
  }
  return null;
}

function mustContainMessage(code: string, needle: string): { message: string; line?: number; fix?: QuickFix } {
  if (needle === '<-') {
    const found = equalsAssignment(code);
    if (found) {
      const shown = found.corrected.trim();
      return {
        message: `\`=\` compares two values. \`<-\` stores a value. Change this line to \`${shown}\`.`,
        line: found.line,
        fix: {
          id: 'assign_arrow',
          label: `Change to: ${shown}`,
          line: found.line,
          kind: 'replace',
          text: found.corrected,
          original: found.original,
        },
      };
    }
  }
  const at = code.toLowerCase().indexOf(needle.toLowerCase());
  if (at >= 0) {
    const wrote = code.slice(at, at + needle.length);
    const keyword = /^[A-Z_]+$/.test(needle) ? ' Keywords are written in capitals on the paper.' : '';
    return { message: `Write \`${needle}\` exactly like that — you wrote \`${wrote}\`.${keyword}` };
  }
  return { message: `Your code must include \`${needle}\`.` };
}

function outputLines(text: string): string[] {
  return text
    .replace(/\r\n/g, '\n')
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function joinLines(lines: string[]): string {
  const bits = lines.map((line) => `\`${line}\``);
  if (bits.length <= 1) return bits[0] ?? '';
  if (bits.length === 2) return `${bits[0]}, then ${bits[1]}`;
  return `${bits.slice(0, -1).join(', ')}, then ${bits[bits.length - 1]}`;
}

/** 1-based line of the nth OUTPUT in the program. */
function outputLineNumber(code: string, index: number): number | undefined {
  const nums: number[] = [];
  code.split('\n').forEach((line, i) => {
    if (/^\s*OUTPUT\b/i.test(line.replace(/\/\/.*$/, ''))) nums.push(i + 1);
  });
  return nums[index] ?? nums[0];
}

/**
 * The printed lines are the right words in the wrong order, or the right words
 * with the wrong capitals. Returns null when the output is a different answer.
 */
function explainOutputLines(expectedRaw: string, actualRaw: string, code: string): { message: string; line?: number } | null {
  const expected = outputLines(expectedRaw);
  const actual = outputLines(actualRaw);
  if (expected.length === 0 || expected.length !== actual.length) return null;
  const key = (lines: string[]) => lines.map((line) => line.toLowerCase()).sort().join('\0');
  if (key(expected) !== key(actual)) return null;

  const mismatch = expected.findIndex((line, i) => line !== actual[i]);
  if (mismatch < 0) return null;
  const line = outputLineNumber(code, mismatch);
  const sameOrder = expected.every((line, i) => line.toLowerCase() === actual[i].toLowerCase());
  if (sameOrder) {
    const wrong = expected.flatMap((line, i) => (line === actual[i] ? [] : [{ got: actual[i], want: line }]));
    const message =
      wrong.length === 1
        ? `\`${wrong[0].got}\` should be \`${wrong[0].want}\`.`
        : `These words need capitals. You printed ${joinLines(actual)}. Print ${joinLines(expected)}.`;
    return { message, line };
  }
  const wrongCase = actual.some((got) => {
    const want = expected.find((line) => line.toLowerCase() === got.toLowerCase());
    return want !== undefined && want !== got;
  });
  const message = wrongCase
    ? `Wrong order, and these words need capitals. You printed ${joinLines(actual)}. Print ${joinLines(expected)}.`
    : `Wrong order. You printed ${joinLines(actual)}. Print ${joinLines(expected)}.`;
  return { message, line };
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
    const hint = mustContainMessage(code, missing);
    return { ok: false, reason: 'must_contain', message: hint.message, line: hint.line, fix: hint.fix };
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
        const explained = explainOutputLines(test.expectedOutput, result.actualOutput, code);
        if (explained) {
          return {
            ok: false,
            reason: 'wrong_output',
            message: `${label}${explained.message}`,
            actualOutput: result.actualOutput,
            line: explained.line,
          };
        }
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
