import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/** Trim a value to a string capped at `max` chars, or null if not a usable string. */
function cappedString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
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

    // Prefer the authenticated identity; fall back to what a logged-out user types.
    // We need some way to reply, so an email is required when there's no session.
    const email = session?.user?.email ?? cappedString(body.email, 320);
    if (!email) {
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
