import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { limitRequest, requesterKey } from '@/shared/lib/rateLimit';

/** Trim a value to a string capped at `max` chars, or null if not a usable string. */
function cappedString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const limited = limitRequest(
      `contact:${requesterKey(req, session?.user?.id)}`,
      { limit: 5, windowMs: 10 * 60_000 },
      "You've sent several messages already. Please wait a few minutes before sending another.",
    );
    if (limited) return limited;
    const body = await req.json() as {
      message?: unknown;
      subject?: unknown;
      name?: unknown;
      email?: unknown;
      pageUrl?: unknown;
    };

    const message = cappedString(body.message, 5000);
    if (!message) {
      return NextResponse.json({ error: 'A message is required' }, { status: 400 });
    }

    // Always store the address they typed. A signed-in account email is only a
    // prefill in the form — the reply has to go where they asked.
    const email = cappedString(body.email, 320);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'An email is required so we can reply' }, { status: 400 });
    }

    const name = session?.user?.name ?? cappedString(body.name, 120);
    const subject = cappedString(body.subject, 200);
    const pageUrl = cappedString(body.pageUrl, 500);

    await prisma.contactMessage.create({
      data: {
        userId: session?.user?.id ?? null,
        email,
        name,
        subject,
        message,
        pageUrl,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
