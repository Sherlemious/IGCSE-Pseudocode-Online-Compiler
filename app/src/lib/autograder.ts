import { Interpreter, parse, PseudocodeError } from '../interpreter';
import { ServerVirtualFileSystem } from '../interpreter/core/serverFilesystem';

export interface GradeResult {
  passed: boolean;
  actualOutput: string;
  error?: {
    kind: 'timeout' | 'parse' | 'runtime' | 'unknown';
    message: string;
    line?: number;
  };
  executionMs: number;
}

/**
 * Runs pseudocode with a queue of pre-supplied inputs and compares the output
 * against expectedOutput (whitespace-normalised).
 */
export async function gradeSubmission(
  code: string,
  inputs: string[],
  expectedOutput: string,
  timeoutMs = 10_000,
): Promise<GradeResult> {
  const start = Date.now();

  // 1. Parse
  const { tree, errors } = parse(code);
  if (errors.length > 0) {
    const e = errors[0];
    return {
      passed: false,
      actualOutput: '',
      error: { kind: 'parse', message: e.message, line: e.line ?? undefined },
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

  // 2. Set up abort controller for timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const outputLines: string[] = [];
  let inputIndex = 0;
  let inputOverflow = false;
  let interpreterRef: Interpreter | null = null;

  const fs = new ServerVirtualFileSystem();

  const interpreter = new Interpreter(
    {
      onOutput(text: string) {
        outputLines.push(text);
      },
      onInputRequest(_varName: string) {
        if (inputIndex >= inputs.length) {
          inputOverflow = true;
        }
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
  try {
    await interpreter.execute(tree);
  } catch (e) {
    clearTimeout(timer);
    const executionMs = Date.now() - start;

    if (controller.signal.aborted) {
      return {
        passed: false,
        actualOutput: outputLines.join('\n'),
        error: { kind: 'timeout', message: `Execution timed out after ${timeoutMs}ms` },
        executionMs,
      };
    }

    if (e instanceof PseudocodeError) {
      return {
        passed: false,
        actualOutput: outputLines.join('\n'),
        error: { kind: 'runtime', message: e.message, line: e.line ?? undefined },
        executionMs,
      };
    }

    return {
      passed: false,
      actualOutput: outputLines.join('\n'),
      error: { kind: 'unknown', message: e instanceof Error ? e.message : String(e) },
      executionMs,
    };
  }

  clearTimeout(timer);
  const executionMs = Date.now() - start;
  const actualOutput = outputLines.join('\n');

  // 4. Warn if code requested more inputs than provided
  if (inputOverflow) {
    return {
      passed: false,
      actualOutput,
      error: {
        kind: 'runtime',
        message: `Your code requested more inputs than the test provides (expected ${inputs.length}). Check your INPUT statements.`,
      },
      executionMs,
    };
  }

  // 5. Compare (trim + normalize whitespace)
  const normalize = (s: string) => s.trim().replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
  const passed = normalize(actualOutput) === normalize(expectedOutput);

  return { passed, actualOutput, executionMs };
}
