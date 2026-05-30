import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { name?: unknown };
  const name = typeof body.name === 'string' ? body.name.trim() : undefined;

  if (name === undefined) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }
  if (name.length === 0 || name.length > 60) {
    return NextResponse.json({ error: 'Name must be 1–60 characters' }, { status: 422 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
    select: { id: true, name: true },
  });

  return NextResponse.json({ user: updated });
}
