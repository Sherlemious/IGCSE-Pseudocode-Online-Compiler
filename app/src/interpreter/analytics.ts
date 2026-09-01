/**
 * Interpreter analytics — a thin, fail-safe wrapper around posthog.capture.
 *
 * Every event carries a consistent context block (which surface the run came
 * from, and the A/B variant of the error-helper experiment) so the data can be
 * sliced by feature and compared across variants. All calls swallow errors:
 * analytics must never break a student's run.
 */
import posthog from 'posthog-js';

/** Which surface the interpreter is running inside. */
export type FeatureContext = 'playground' | 'practice' | 'exam' | 'docs';

/** Passed to useInterpreter so every event knows where it happened. */
export interface RunContext {
  feature: FeatureContext;
  questionId?: string;
  examId?: string;
}

export type ErrorHelpersVariant = 'v1' | 'v2';
export type RunOutcome = 'success' | 'parse_error' | 'runtime_error' | 'aborted';

/** PostHog boolean flag that turns on the v2 error helpers (normalization + new hints). */
export const ERROR_HELPERS_FLAG = 'error-helpers-v2';

/**
 * Resolve the error-helper variant for this session.
 *
 * v2 was rolled out to 100% of students on 2026-09-01: the A/B test showed it
 * eliminates smart-quote parse errors (52 → 0 per week) with no hit to the
 * hint resolve rate, and student feedback flagged the old messages as
 * confusing. So v2 is now the default for everyone — independent of whether
 * PostHog has loaded (during flag load, or in dev with analytics off).
 *
 * The `error-helpers-v2` flag is retained only as an emergency kill switch:
 * explicitly disabling it (0% rollout) reverts a session to the old v1 helpers.
 * The variant is still tagged on every event so the dashboards keep working.
 */
export function getErrorHelpersVariant(): ErrorHelpersVariant {
  try {
    // Only an explicit `false` (flag disabled / 0% rollout) reverts to v1;
    // `undefined` (flags not loaded yet) falls through to the v2 default.
    return posthog.isFeatureEnabled(ERROR_HELPERS_FLAG) === false ? 'v1' : 'v2';
  } catch {
    return 'v2';
  }
}

function baseProps(ctx: RunContext | undefined, variant: ErrorHelpersVariant) {
  return {
    feature_context: ctx?.feature ?? 'playground',
    question_id: ctx?.questionId ?? null,
    exam_id: ctx?.examId ?? null,
    error_helpers_variant: variant,
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
  variant: ErrorHelpersVariant,
) {
  try {
    posthog.capture('code_run', {
      outcome,
      code_lines: data.codeLines,
      char_count: data.charCount,
      duration_ms: Math.round(data.durationMs),
      used_input: data.usedInput,
      mode: data.mode,
      source_normalized: data.normalized,
      ...baseProps(ctx, variant),
    });
  } catch {
    /* non-critical */
  }
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
  variant: ErrorHelpersVariant,
) {
  try {
    posthog.capture('interpreter_error', {
      error_type: errorType,
      error_message: data.message,
      line: data.line ?? null,
      code_lines: data.codeLines,
      error_category: data.category,
      offending_line: data.offendingLine ? data.offendingLine.slice(0, 200) : null,
      ...baseProps(ctx, variant),
    });
  } catch {
    /* non-critical */
  }
}

/** The friendly hint a student was shown (hint_id === the error category). */
export function captureHintShown(hintId: string, ctx: RunContext | undefined, variant: ErrorHelpersVariant) {
  try {
    posthog.capture('hint_shown', { hint_id: hintId, ...baseProps(ctx, variant) });
  } catch {
    /* non-critical */
  }
}

/** A previously-shown hint appears to have helped: the next run succeeded. */
export function captureHintResolved(hintId: string, ctx: RunContext | undefined, variant: ErrorHelpersVariant) {
  try {
    posthog.capture('hint_resolved', { hint_id: hintId, ...baseProps(ctx, variant) });
  } catch {
    /* non-critical */
  }
}

/** Lightweight passthrough for surface-level funnel events (practice_*, exam_*). */
export function captureEvent(event: string, props: Record<string, unknown> = {}) {
  try {
    posthog.capture(event, props);
  } catch {
    /* non-critical */
  }
}
