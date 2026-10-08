import { timingSafeEqual } from 'node:crypto';
import { HttpError, unauthorized } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { expirePlans } from '@/modules/billing/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sameSecret(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Daily sweep: paid plans whose planExpiresAt has passed drop to Free.
 * Covers student session passes and subscriptions scheduled to cancel at
 * period end (Paddle keeps status `active` until then). Live cancels still
 * go through the subscription.canceled webhook; this is the safety net.
 *
 * Auth: Authorization: Bearer $CRON_SECRET (Vercel Cron sends this when the
 * env var is set).
 */
export const GET = route(async (req) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new HttpError(500, 'CRON_SECRET is not set.');
  if (!sameSecret(req.headers.get('authorization') ?? '', `Bearer ${secret}`)) throw unauthorized();
  return { expired: await expirePlans(new Date()) };
});
