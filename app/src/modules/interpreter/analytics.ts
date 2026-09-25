/**
 * Interpreter analytics — event names and payloads for a run.
 *
 * Capture is injected by the app (`setInterpreterCapture`) so this package
 * never depends on PostHog. All calls swallow errors: analytics must never
 * break a student's run.
 */
import { captureRaw } from './telemetry';

/** Which surface the interpreter is running inside. */
export type FeatureContext = 'playground' | 'practice' | 'exam' | 'docs' | 'learn';

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

/** Where this run sits relative to the previous one — for error-recovery funnels. */
export interface RerunInfo {
  /** The previous run in this editor ended in a parse/runtime error. */
  afterError: boolean;
  /** Code differs from the previous run (null on the first run). */
  codeChanged: boolean | null;
  /** Consecutive errored runs right before this one. */
  errorStreak: number;
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
  } & RerunInfo,
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
    after_error: data.afterError,
    code_changed: data.codeChanged,
    error_streak: data.errorStreak,
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
export function captureHintShown(
  hintId: string,
  data: {
    errorType: 'parse' | 'runtime';
    line: number | null | undefined;
    fixId: string | null;
    /** Same error category on the same line as the previous errored run. */
    repeat: boolean;
    /** The code is unchanged since that previous errored run. */
    unchanged: boolean;
    errorStreak: number;
  },
  ctx: RunContext | undefined,
) {
  captureRaw('hint_shown', {
    hint_id: hintId,
    error_type: data.errorType,
    line: data.line ?? null,
    has_fix: data.fixId != null,
    fix_id: data.fixId,
    repeat: data.repeat,
    unchanged: data.unchanged,
    error_streak: data.errorStreak,
    ...baseProps(ctx),
  });
}

/**
 * The student got back to a successful run after an error. `hint_id` is the
 * error on the run just before; the rest describe the whole error episode.
 */
export function captureHintResolved(
  hintId: string,
  data: { runsToFix: number; secsToFix: number; usedFix: boolean },
  ctx: RunContext | undefined,
) {
  captureRaw('hint_resolved', {
    hint_id: hintId,
    runs_to_fix: data.runsToFix,
    secs_to_fix: Math.round(data.secsToFix),
    used_fix: data.usedFix,
    ...baseProps(ctx),
  });
}

/** A one-click quick fix was applied to the student's code. */
export function captureFixApplied(
  data: { hintId: string; fixId: string; errorType: 'parse' | 'runtime'; surface: 'editor' | 'terminal' },
  ctx: RunContext | undefined,
) {
  captureRaw('error_fix_applied', {
    hint_id: data.hintId,
    fix_id: data.fixId,
    error_type: data.errorType,
    surface: data.surface,
    ...baseProps(ctx),
  });
}

/** The student reached for help on an error (opened its example, jumped to its line). */
export function captureErrorHelp(
  data: { hintId: string | null; action: 'show_example' | 'jump_to_line' },
  ctx: RunContext | undefined,
) {
  captureRaw('error_help_clicked', { hint_id: data.hintId, action: data.action, ...baseProps(ctx) });
}

/** Lightweight passthrough for surface-level funnel events (practice_*, exam_*). */
export function captureEvent(event: string, props: Record<string, unknown> = {}) {
  captureRaw(event, props);
}
