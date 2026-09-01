import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Context {
  params: Promise<{ classId: string; userId: string }>;
}

/** Remove a student from a class. Owner-only. */
export async function DELETE(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { classId, userId } = await params;

  const cls = await prisma.class.findUnique({ where: { id: classId }, select: { ownerId: true } });
  if (!cls || cls.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.classMembership.deleteMany({ where: { classId, userId } });
  return NextResponse.json({ ok: true });
}
