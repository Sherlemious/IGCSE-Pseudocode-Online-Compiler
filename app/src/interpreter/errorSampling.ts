/**
 * Error-code sampling (client side).
 *
 * When a run fails with a parse error we *can't* explain — the vague ANTLR
 * buckets (`no_viable_alternative`, `mismatched_input`, `other_parse`) — we keep
 * a sanitized copy of the code so common mistake shapes and grammar gaps can be
 * studied later. Categories we already understand (smart_quotes, missing_endif,
 * assign_with_equals, …) are skipped: their fix is known, the code adds nothing.
 *
 * Only a fraction of eligible runs is stored (SAMPLE_RATE) to keep volume sane.
 * The whole thing is best-effort and must never disturb a student's run: it is
 * fire-and-forget and swallows every error. Text is stripped here before it ever
 * leaves the browser (`sanitizeForSampling`); the server re-sanitizes as well.
 */
import { sanitizeForSampling } from './sanitizeSample';
import type { FeatureContext } from './analytics';

/** The "we don't yet know what went wrong" buckets — the ones worth collecting. */
const SAMPLE_CATEGORIES = new Set(['no_viable_alternative', 'mismatched_input', 'other_parse']);

/** Store roughly 1 in 5 eligible submissions. */
const SAMPLE_RATE = 0.2;

/** Hard cap so a pathological paste can't bloat a row. */
const MAX_CODE_CHARS = 5000;

export interface ErrorSampleInput {
  category: string;
  errorType: 'parse' | 'runtime';
  code: string;
  rawMessage?: string;
  line?: number | null;
  codeLines?: number;
  feature?: FeatureContext;
}

export function maybeSampleErrorCode(input: ErrorSampleInput): void {
  try {
    if (input.errorType !== 'parse') return;
    if (!SAMPLE_CATEGORIES.has(input.category)) return;
    if (Math.random() >= SAMPLE_RATE) return;

    const code = sanitizeForSampling(input.code).slice(0, MAX_CODE_CHARS);
    if (!code.trim()) return;

    const body = JSON.stringify({
      category: input.category,
      errorType: input.errorType,
      code,
      rawMessage: input.rawMessage?.slice(0, 500),
      line: input.line ?? null,
      codeLines: input.codeLines ?? null,
      feature: input.feature ?? null,
    });

    void fetch('/api/error-sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      /* best-effort — never surface a sampling failure */
    });
  } catch {
    /* never let sampling break a run */
  }
}
