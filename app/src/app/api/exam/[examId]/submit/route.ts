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

  // Score = questions where every test case passed; totalTests = total questions
  const score = exam.answers.filter((a) => a.totalTests > 0 && a.passCount === a.totalTests).length;
  const totalTests = exam.answers.length;

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
