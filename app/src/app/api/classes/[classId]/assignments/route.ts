import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';

interface Context {
  params: Promise<{ classId: string }>;
}

interface Body {
  examId?: unknown;
  dueDate?: unknown;
}

/** Assign one of the teacher's own exams to a class they own. Owner-only. */
export async function POST(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const { classId } = await params;

  const cls = await prisma.class.findUnique({ where: { id: classId }, select: { ownerId: true } });
  if (!cls || cls.ownerId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const examId = typeof body.examId === 'string' ? body.examId : '';
  if (!examId) {
    return NextResponse.json({ error: 'Pick an exam to assign.' }, { status: 400 });
  }

  // Teachers can only assign exams they own.
  const exam = await prisma.exam.findUnique({ where: { id: examId }, select: { ownerId: true } });
  if (!exam || exam.ownerId !== userId) {
    return NextResponse.json({ error: 'That exam could not be found.' }, { status: 404 });
  }

  let dueDate: Date | null = null;
  if (typeof body.dueDate === 'string' && body.dueDate.trim()) {
    const d = new Date(body.dueDate);
    if (!Number.isNaN(d.getTime())) dueDate = d;
  }

  try {
    const created = await prisma.assignment.create({
      data: { classId, examId, dueDate },
      select: { id: true },
    });
    return NextResponse.json({ id: created.id });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'That exam is already assigned to this class.', code: 'ALREADY_ASSIGNED' }, { status: 409 });
    }
    throw err;
  }
}
