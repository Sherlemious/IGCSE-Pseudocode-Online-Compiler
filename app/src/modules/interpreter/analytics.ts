/**
 * Interpreter analytics — event names and payloads for a run.
 *
 * Capture is injected by the app (`setInterpreterCapture`) so this package
 * never depends on PostHog. All calls swallow errors: analytics must never
 * break a student's run.
 */
import { captureRaw } from './telemetry';

/** Which surface the interpreter is running inside. */
export type FeatureContext = 'playground' | 'practice' | 'exam' | 'docs';

/** Passed to useInterpreter so every event knows where it happened. */
export interface RunContext {
  feature: FeatureContext;
  questionId?: string;
  examId?: string;
}

export type RunOutcome = 'success' | 'parse_error' | 'runtime_error' | 'aborted';

// The v2 error helpers (paste normalization + `=`→`<-` and smart-quote hints)
// were rolled out to 100% of students on 2026-09-01 after the A/B test, so the
// old v1 path and its `error-helpers-v2` flag gate are gone — v2 is just how
// the interpreter behaves now.

function baseProps(ctx: RunContext | undefined) {
  return {
    feature_context: ctx?.feature ?? 'playground',
    question_id: ctx?.questionId ?? null,
    exam_id: ctx?.examId ?? null,
  };
}

/** Fired once per execution, at whatever terminal state the run reaches. */
export function captureRun(
  outcome: RunOutcome,
  data: {
    codeLines: number;
    charCount: number;
    durationMs: number;
    usedInput: boolean;
    mode: 'run' | 'debug';
    normalized: boolean;
  },
  ctx: RunContext | undefined,
) {
  captureRaw('code_run', {
    outcome,
    code_lines: data.codeLines,
    char_count: data.charCount,
    duration_ms: Math.round(data.durationMs),
    used_input: data.usedInput,
    mode: data.mode,
    source_normalized: data.normalized,
    ...baseProps(ctx),
  });
}

/** Enriched replacement for the old bare interpreter_error capture. */
export function captureInterpreterError(
  errorType: 'parse' | 'runtime',
  data: {
    message: string;
    line: number | null | undefined;
    codeLines: number;
    category: string;
    offendingLine?: string;
  },
  ctx: RunContext | undefined,
) {
  captureRaw('interpreter_error', {
    error_type: errorType,
    error_message: data.message,
    line: data.line ?? null,
    code_lines: data.codeLines,
    error_category: data.category,
    offending_line: data.offendingLine ? data.offendingLine.slice(0, 200) : null,
    ...baseProps(ctx),
  });
}

/** The friendly hint a student was shown (hint_id === the error category). */
export function captureHintShown(hintId: string, ctx: RunContext | undefined) {
  captureRaw('hint_shown', { hint_id: hintId, ...baseProps(ctx) });
}

/** A previously-shown hint appears to have helped: the next run succeeded. */
export function captureHintResolved(hintId: string, ctx: RunContext | undefined) {
  captureRaw('hint_resolved', { hint_id: hintId, ...baseProps(ctx) });
}

/** Lightweight passthrough for surface-level funnel events (practice_*, exam_*). */
export function captureEvent(event: string, props: Record<string, unknown> = {}) {
  captureRaw(event, props);
}
