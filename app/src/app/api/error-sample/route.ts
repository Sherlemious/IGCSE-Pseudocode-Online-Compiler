import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { oneOf, optionalText, readJson } from '@/shared/http/input';
import { clientIp, enforceRateLimit } from '@/shared/http/rateLimit';
import { logger } from '@/shared/lib/logger';
import { sanitizeForSampling } from '@/modules/interpreter/sanitizeSample';
import { createErrorSample, pruneErrorSamples } from '@/modules/telemetry/repo';

// Only the vague parse buckets are worth collecting — see interpreter/errorSampling.ts.
const CATEGORIES = ['no_viable_alternative', 'mismatched_input', 'other_parse'] as const;
const FEATURES = ['playground', 'practice', 'exam', 'docs'] as const;

// Cost guardrails (keep Neon usage negligible):
//  - kill switch: ERROR_SAMPLING_ENABLED=false stops all writes (no redeploy needed).
//  - retention: samples older than this are pruned opportunistically, so the
//    table stays bounded (~a few MB) instead of growing without limit.
const SAMPLING_ENABLED = process.env.ERROR_SAMPLING_ENABLED !== 'false';
const RETENTION_DAYS = 30;
const PRUNE_PROBABILITY = 0.02; // ~1 in 50 requests triggers a cheap cleanup

const intOrNull = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : null;

/**
 * Store an anonymized, sanitized snapshot of code that hit a parse error we
 * can't yet explain. Deliberately anonymous: no user id or email is attached,
 * and the code is re-sanitized here so no student-typed text is persisted even
 * if a client skips its own sanitization.
 */
export const POST = route(async (req) => {
  if (!SAMPLING_ENABLED) return { ok: true, skipped: true };
  // Anonymous by design, so keyed by IP; sampling is already sparse client-side.
  enforceRateLimit(`error-sample:${clientIp(req)}`, { limit: 60, windowMs: 60_000 });
  const body = await readJson(req, 'Invalid payload');

  const category = oneOf(body.category, CATEGORIES);
  const rawCode = optionalText(body.code, 5000);
  if (!category || !rawCode) throw badRequest('Invalid payload');
  const code = sanitizeForSampling(rawCode).slice(0, 5000);
  if (!code.trim()) throw badRequest('Invalid payload');

  await createErrorSample({
    category,
    errorType: body.errorType === 'runtime' ? 'runtime' : 'parse',
    code,
    rawMessage: optionalText(body.rawMessage, 500),
    line: intOrNull(body.line),
    codeLines: intOrNull(body.codeLines),
    feature: oneOf(body.feature, FEATURES),
  });

  if (Math.random() < PRUNE_PROBABILITY) {
    pruneErrorSamples(new Date(Date.now() - RETENTION_DAYS * 86_400_000))
      .catch((e) => logger.warn('Error-sample prune failed', { error: String(e) }));
  }
  return { ok: true };
});
