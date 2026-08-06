import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const CATEGORIES = ['bug', 'suggestion', 'other'] as const;

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
      description?: unknown;
      category?: unknown;
      code?: unknown;
      output?: unknown;
      pageUrl?: unknown;
      userAgent?: unknown;
      email?: unknown;
    };

    const description = cappedString(body.description, 5000);
    if (!description) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const category = typeof body.category === 'string' && (CATEGORIES as readonly string[]).includes(body.category)
      ? body.category
      : 'bug';
    const code = cappedString(body.code, 20000);
    const output = cappedString(body.output, 20000);
    const pageUrl = cappedString(body.pageUrl, 500);
    const userAgent = cappedString(body.userAgent, 500);

    // Prefer the authenticated email; fall back to an email typed by a logged-out user.
    const email = session?.user?.email ?? cappedString(body.email, 320);

    await prisma.bugReport.create({
      data: {
        userId: session?.user?.id ?? null,
        email,
        category,
        description,
        code,
        output,
        pageUrl,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
