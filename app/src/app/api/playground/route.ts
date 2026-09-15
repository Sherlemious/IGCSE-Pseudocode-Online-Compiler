import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { rateLimit } from '@/shared/lib/rateLimit';
import { MAX_PLAYGROUND_CODE_CHARS, parsePlaygroundCode } from '@/modules/compiler/playgroundSnapshot';

const PUT_RATE_LIMIT = 40;
const PUT_RATE_WINDOW_MS = 60_000;

// GET /api/playground — the signed-in user's latest playground snapshot
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const row = await prisma.playgroundSnapshot.findUnique({
    where: { userId: session.user.id },
    select: { code: true, updatedAt: true },
  });

  return NextResponse.json({
    code: row?.code ?? null,
    updatedAt: row?.updatedAt ?? null,
  });
}

// PUT /api/playground — upsert the signed-in user's playground snapshot
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const limit = rateLimit(`playground:${session.user.id}`, {
    limit: PUT_RATE_LIMIT,
    windowMs: PUT_RATE_WINDOW_MS,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Saving too fast. Please wait ${limit.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const code = parsePlaygroundCode(
    body && typeof body === 'object' && 'code' in body ? (body as { code: unknown }).code : undefined,
  );
  if (code === null) {
    return NextResponse.json(
      { error: `Code must be a string of at most ${MAX_PLAYGROUND_CODE_CHARS} characters` },
      { status: 422 },
    );
  }

  const row = await prisma.playgroundSnapshot.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, code },
    update: { code },
    select: { updatedAt: true },
  });

  return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
}
