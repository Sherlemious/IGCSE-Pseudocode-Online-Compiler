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
  const { timedOut } = await req.json().catch(() => ({ timedOut: false }));

  // Verify ownership
  const exam = await prisma.examAttempt.findFirst({
    where: { id: examId, userId: session.user.id, status: 'IN_PROGRESS' },
    include: {
      answers: { select: { passCount: true, totalTests: true } },
    },
  });

  if (!exam) {
    return NextResponse.json({ error: 'Exam not found or already completed' }, { status: 404 });
  }

  // Calculate totals
  const score = exam.answers.reduce((sum, a) => sum + a.passCount, 0);
  const totalTests = exam.answers.reduce((sum, a) => sum + a.totalTests, 0);

  // Mark completed
  await prisma.examAttempt.update({
    where: { id: examId },
    data: {
      status: timedOut ? 'TIMED_OUT' : 'COMPLETED',
      score,
      totalTests,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ score, totalTests });
}
