import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';

interface Context {
  params: Promise<{ classId: string; assignmentId: string }>;
}

/** Remove an assignment from a class. Owner-only. Student attempts survive
 *  (assignmentId is set null) so their work isn't lost. */
export async function DELETE(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { classId, assignmentId } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { classId: true, class: { select: { ownerId: true } } },
  });
  if (!assignment || assignment.classId !== classId || assignment.class.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.assignment.delete({ where: { id: assignmentId } });
  return NextResponse.json({ ok: true });
}
