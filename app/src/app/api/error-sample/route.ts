import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { sanitizeForSampling } from '@/interpreter/sanitizeSample';

// Only the vague parse buckets are worth collecting — see interpreter/errorSampling.ts.
const CATEGORIES = new Set(['no_viable_alternative', 'mismatched_input', 'other_parse']);
const FEATURES = new Set(['playground', 'practice', 'exam', 'docs']);

// Cost guardrails (keep Neon usage negligible):
//  - kill switch: set ERROR_SAMPLING_ENABLED=false to stop all writes instantly
//    (no redeploy needed — just change the env var).
//  - retention: samples older than this are pruned opportunistically, so the
//    table stays bounded (~a few MB) forever instead of growing without limit.
const SAMPLING_ENABLED = process.env.ERROR_SAMPLING_ENABLED !== 'false';
const RETENTION_DAYS = 30;
const PRUNE_PROBABILITY = 0.02; // ~1 in 50 requests triggers a cheap cleanup

/** Trim a value to a string capped at `max` chars, or null if not usable. */
function cappedString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function intOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : null;
}

/**
 * Store an anonymized, sanitized snapshot of code that hit a parse error we
 * can't yet explain. Deliberately anonymous: no user id or email is attached,
 * and the code is re-sanitized here (defence-in-depth) so no student-typed text
 * is ever persisted even if a client skips its own sanitization.
 */
export async function POST(req: Request) {
  try {
    if (!SAMPLING_ENABLED) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = (await req.json()) as {
      category?: unknown;
      errorType?: unknown;
      code?: unknown;
      rawMessage?: unknown;
      line?: unknown;
      codeLines?: unknown;
      feature?: unknown;
    };

    const category = typeof body.category === 'string' && CATEGORIES.has(body.category) ? body.category : null;
    const rawCode = cappedString(body.code, 5000);
    if (!category || !rawCode) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Re-sanitize server-side; never trust the client to have stripped text.
    const code = sanitizeForSampling(rawCode).slice(0, 5000);
    if (!code.trim()) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const errorType = body.errorType === 'runtime' ? 'runtime' : 'parse';
    const feature = typeof body.feature === 'string' && FEATURES.has(body.feature) ? body.feature : null;

    await prisma.errorSample.create({
      data: {
        category,
        errorType,
        code,
        rawMessage: cappedString(body.rawMessage, 500),
        line: intOrNull(body.line),
        codeLines: intOrNull(body.codeLines),
        feature,
      },
    });

    // Opportunistically prune old rows so the table stays bounded without a cron.
    if (Math.random() < PRUNE_PROBABILITY) {
      const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
      prisma.errorSample
        .deleteMany({ where: { createdAt: { lt: cutoff } } })
        .catch((e) => logger.warn('Error-sample prune failed', { error: String(e) }));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    logger.error('Error-sample store failed', { error: String(e) });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
