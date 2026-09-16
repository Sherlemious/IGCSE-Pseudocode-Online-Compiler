import { NextResponse } from 'next/server';
import { prisma } from '@/shared/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daily sweep: student passes whose planExpiresAt has passed drop to Free.
 * Teacher subscriptions are never touched.
 *
 * Auth: Authorization: Bearer $CRON_SECRET (Vercel Cron sends this when the
 * env var is set).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not set.' }, { status: 500 });
  }
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const result = await prisma.user.updateMany({
    where: {
      plan: 'STUDENT',
      planExpiresAt: { lte: now },
    },
    data: {
      plan: 'FREE',
      planTier: null,
      planExpiresAt: null,
    },
  });

  return NextResponse.json({ expired: result.count });
}
