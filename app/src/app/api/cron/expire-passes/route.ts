import { NextResponse } from 'next/server';
import { prisma } from '@/shared/db';

// Reads/writes the DB, so keep it on the Node runtime; never statically optimized.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daily sweep that expires one-time student passes.
 *
 * A pass sets `User.planExpiresAt`; once that's in the past the entitlement must
 * revert to Free. `tierForUser`/`isPlanActive` already treat an expired pass as
 * Free at read time, so this sweep is the *durable* cleanup that also frees the
 * `plan`/`planTier` columns (keeps admin views + analytics honest).
 *
 * Invoked by Vercel Cron (see vercel.json). Vercel sends
 * `Authorization: Bearer $CRON_SECRET`; we reject anything else so the endpoint
 * can't be triggered by the public.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('[cron/expire-passes] CRON_SECRET not configured');
    return NextResponse.json({ error: 'Not configured.' }, { status: 500 });
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const now = new Date();
  const result = await prisma.user.updateMany({
    where: { planExpiresAt: { lt: now }, plan: { not: 'FREE' } },
    data: { plan: 'FREE', planTier: null, planExpiresAt: null, planUpdatedAt: now },
  });

  console.log(`[cron/expire-passes] expired ${result.count} pass(es)`);
  return NextResponse.json({ expired: result.count });
}
