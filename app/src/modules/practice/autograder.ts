import { Interpreter, parse, PseudocodeError } from '@/modules/interpreter';
import { ServerVirtualFileSystem } from '@/modules/interpreter/core/serverFilesystem';
import {
  categorizeParseError,
  categorizeRuntimeError,
  humanizeParseError,
  humanizeRuntimeError,
  resolveOffendingLine,
} from '@/modules/interpreter/errorMessages';

export interface GradeResult {
  passed: boolean;
  actualOutput: string;
  error?: {
    kind: 'timeout' | 'parse' | 'runtime' | 'unknown';
    message: string;
    /** Student-facing explanation (same wording as the Run button); `message` stays raw for logs. */
    hint?: string;
    /** Error category slug (the Run button's `hint_id`), for analytics. */
    category?: string;
    line?: number;
  };
  executionMs: number;
}

/** Output beyond this is a runaway loop, not an answer; the run is stopped. */
export const MAX_OUTPUT_LINES = 5_000;
export const MAX_OUTPUT_CHARS = 200_000;

const TIMEOUT_HINT =
  'Your program ran for too long. Check for a loop that never ends — a WHILE whose condition never becomes FALSE, or a REPEAT whose UNTIL is never TRUE.';
const OUTPUT_LIMIT_HINT =
  `Your program printed more than ${MAX_OUTPUT_LINES} lines. Check for a loop that never ends around your OUTPUT.`;

/**
 * Runs pseudocode with a queue of pre-supplied inputs and compares the output
 * against expectedOutput (whitespace-normalised).
 *
 * `initialFiles` is the same JSON-encoded `{ filename: content }` string
 * stored in `TestCase.initialFiles` — it pre-populates the virtual file
 * system for questions that read from a file the student didn't create
 * (e.g. "names.txt"). Malformed JSON is ignored rather than thrown.
 */
export async function gradeSubmission(
  code: string,
  inputs: string[],
  expectedOutput: string,
  initialFiles?: string | null,
  timeoutMs = 10_000,
): Promise<GradeResult> {
  const start = Date.now();

  // 1. Parse
  const { tree, errors } = parse(code);
  if (errors.length > 0) {
    const e = errors[0];
    const lines = code.split('\n');
    const at = resolveOffendingLine(lines, e.line);
    return {
      passed: false,
      actualOutput: '',
      error: {
        kind: 'parse',
        message: e.message,
        hint: humanizeParseError(e.message, at.text, { lines, line: at.line }),
        category: categorizeParseError(e.message, at.text, { lines, line: at.line }),
        line: at.line ?? e.line ?? undefined,
      },
      executionMs: Date.now() - start,
    };
  }
  if (!tree) {
    return {
      passed: false,
      actualOutput: '',
      error: { kind: 'parse', message: 'Failed to parse pseudocode' },
      executionMs: Date.now() - start,
    };
  }

  // 2. Set up abort controller for timeout. The interpreter treats an abort as a
  // normal stop, so why the run stopped is tracked here.
  const controller = new AbortController();
  let stopReason: 'timeout' | 'input_overflow' | 'output_limit' | null = null;
  const stop = (reason: NonNullable<typeof stopReason>) => {
    stopReason ??= reason;
    controller.abort();
  };
  const timer = setTimeout(() => stop('timeout'), timeoutMs);

  const outputLines: string[] = [];
  let outputChars = 0;
  let inputIndex = 0;
  let interpreterRef: Interpreter | null = null;

  const fs = new ServerVirtualFileSystem();
  if (initialFiles) {
    try {
      const files = JSON.parse(initialFiles) as Record<string, string>;
      for (const [filename, content] of Object.entries(files)) {
        fs.seedFile(filename, content);
      }
    } catch {
      // Malformed initialFiles shouldn't block grading — the program will
      // surface its own "file does not exist" error if it tries to read one.
    }
  }

  const interpreter = new Interpreter(
    {
      onOutput(text: string) {
        if (stopReason) return;
        outputLines.push(text);
        outputChars += text.length + 1;
        if (outputLines.length > MAX_OUTPUT_LINES || outputChars > MAX_OUTPUT_CHARS) {
          stop('output_limit');
        }
      },
      onInputRequest() {
        // Out of test inputs: stop now instead of feeding '' until the timeout.
        if (inputIndex >= inputs.length) stop('input_overflow');
        const value = inputs[inputIndex++] ?? '';
        // Schedule for next microtask so inputResolver is set before we call it
        Promise.resolve().then(() => interpreterRef?.provideInput(value));
      },
      onInputComplete() {},
      onComplete() {},
      onError(error: PseudocodeError) {
        // Error is thrown, caught below
        void error;
      },
    },
    controller.signal,
    fs,
  );

  interpreterRef = interpreter;

  // 3. Execute
  let failure: { error: unknown } | null = null;
  try {
    await interpreter.execute(tree);
  } catch (error) {
    failure = { error };
  }
  clearTimeout(timer);
  const executionMs = Date.now() - start;
  const actualOutput = outputLines.join('\n');

  // 4. A stopped run fails, whatever it printed before being stopped.
  if (stopReason === 'timeout') {
    return {
      passed: false,
      actualOutput,
      error: {
        kind: 'timeout',
        message: `Execution timed out after ${timeoutMs}ms`,
        hint: TIMEOUT_HINT,
        category: 'timeout',
      },
      executionMs,
    };
  }
  if (stopReason === 'input_overflow') {
    return {
      passed: false,
      actualOutput,
      error: {
        kind: 'runtime',
        message: `Your code requested more inputs than the test provides (expected ${inputs.length}). Check your INPUT statements.`,
        category: 'input_overflow',
      },
      executionMs,
    };
  }
  if (stopReason === 'output_limit') {
    return {
      passed: false,
      actualOutput,
      error: {
        kind: 'runtime',
        message: `Output limit exceeded (${MAX_OUTPUT_LINES} lines / ${MAX_OUTPUT_CHARS} characters)`,
        hint: OUTPUT_LIMIT_HINT,
        category: 'output_limit',
      },
      executionMs,
    };
  }

  if (failure) {
    const e = failure.error;
    if (e instanceof PseudocodeError) {
      return {
        passed: false,
        actualOutput,
        error: {
          kind: 'runtime',
          message: e.message,
          hint: humanizeRuntimeError(e.message),
          category: categorizeRuntimeError(e.message),
          line: e.line ?? undefined,
        },
        executionMs,
      };
    }

    return {
      passed: false,
      actualOutput,
      error: { kind: 'unknown', message: e instanceof Error ? e.message : String(e) },
      executionMs,
    };
  }

  // 5. Compare (trim + normalize whitespace)
  const normalize = (s: string) => s.trim().replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
  const passed = normalize(actualOutput) === normalize(expectedOutput);

  return { passed, actualOutput, executionMs };
}

/** Per-test and whole-submission limits for server-side grading. */
export const GRADE_TEST_TIMEOUT_MS = 5_000;
export const GRADE_TOTAL_BUDGET_MS = 20_000;
/** Longest submission accepted for grading (characters). */
export const MAX_GRADE_CODE_CHARS = 20_000;

export interface GradeTestCase {
  inputs: string[];
  expectedOutput: string;
  initialFiles?: string | null;
}

/**
 * Grade `code` against each test case in turn. The interpreter shares one
 * thread, so running tests one after another gives each its own timeout;
 * once a test times out or the total budget runs out, the rest are skipped.
 */
export async function gradeTestCases(
  code: string,
  testCases: GradeTestCase[],
  { testTimeoutMs = GRADE_TEST_TIMEOUT_MS, totalBudgetMs = GRADE_TOTAL_BUDGET_MS } = {},
): Promise<GradeResult[]> {
  const results: GradeResult[] = [];
  const deadline = Date.now() + totalBudgetMs;
  let skipReason: string | null = null;
  for (const test of testCases) {
    const remaining = deadline - Date.now();
    if (!skipReason && remaining <= 0) skipReason = 'Not run: the time limit for this check was used up.';
    if (skipReason) {
      results.push({
        passed: false,
        actualOutput: '',
        error: { kind: 'timeout', message: skipReason, hint: TIMEOUT_HINT, category: 'timeout' },
        executionMs: 0,
      });
      continue;
    }
    let result: GradeResult;
    try {
      result = await gradeSubmission(
        code,
        test.inputs,
        test.expectedOutput,
        test.initialFiles,
        Math.min(testTimeoutMs, remaining),
      );
    } catch (e) {
      result = {
        passed: false,
        actualOutput: '',
        error: { kind: 'unknown', message: `Grading failed: ${e instanceof Error ? e.message : String(e)}` },
        executionMs: 0,
      };
    }
    results.push(result);
    if (result.error?.kind === 'timeout') skipReason = 'Not run: an earlier test timed out.';
  }
  return results;
}
