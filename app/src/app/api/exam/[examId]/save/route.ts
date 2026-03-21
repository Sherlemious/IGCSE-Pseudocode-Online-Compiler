import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Context {
  params: Promise<{ examId: string }>;
}

export async function POST(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { examId } = await params;
  const { questionId, code } = await req.json();

  // Verify ownership
  const exam = await prisma.examAttempt.findFirst({
    where: { id: examId, userId: session.user.id, status: 'IN_PROGRESS' },
    select: { id: true },
  });

  if (!exam) {
    return NextResponse.json({ error: 'Exam not found or already completed' }, { status: 404 });
  }

  await prisma.examAnswer.update({
    where: { examAttemptId_questionId: { examAttemptId: examId, questionId } },
    data: { code },
  });

  return NextResponse.json({ ok: true });
}
