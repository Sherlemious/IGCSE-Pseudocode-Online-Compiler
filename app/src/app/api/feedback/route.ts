import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { limitRequest, requesterKey } from '@/shared/lib/rateLimit';
import { ADMIN_FEEDBACK_CACHE_TAG } from '@/app/admin/feedback/feedbackQuery';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const limited = limitRequest(
      `feedback:${requesterKey(req, session?.user?.id)}`,
      { limit: 5, windowMs: 10 * 60_000 },
    );
    if (limited) return limited;
    const body = await req.json() as {
      rating?: unknown;
      tier?: unknown;
      tags?: unknown;
      comment?: unknown;
    };

    const rating = typeof body.rating === 'number' ? body.rating : null;
    const tier = typeof body.tier === 'string' ? body.tier : null;

    if (!rating || rating < 1 || rating > 5 || !tier) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const tags = Array.isArray(body.tags) ? (body.tags as unknown[]).filter((t): t is string => typeof t === 'string') : [];
    const comment = typeof body.comment === 'string' ? body.comment : null;

    await prisma.feedbackSubmission.create({
      data: {
        userId: session?.user?.id ?? null,
        email: session?.user?.email ?? null,
        rating,
        tier,
        tags,
        comment,
      },
    });

    revalidateTag(ADMIN_FEEDBACK_CACHE_TAG, { expire: 0 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
