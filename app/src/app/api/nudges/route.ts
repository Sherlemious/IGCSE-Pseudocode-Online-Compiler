import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/nudges — returns which nudges have already been shown for this user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ nudgesShown: [] });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nudgesShown: true },
  });

  return NextResponse.json({ nudgesShown: user?.nudgesShown ?? [] });
}

// POST /api/nudges — mark a nudge as shown; idempotent
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { nudge } = await req.json() as { nudge?: string };
  if (!nudge || typeof nudge !== 'string') {
    return NextResponse.json({ error: 'nudge is required' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { nudgesShown: { push: nudge } },
  });

  return NextResponse.json({ ok: true });
}
