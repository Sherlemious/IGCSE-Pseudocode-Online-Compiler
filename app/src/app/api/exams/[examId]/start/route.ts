import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';

interface Context {
  params: Promise<{ examId: string }>;
}

// Materialize an ExamAttempt from a shared Exam definition for the signed-in
// user. Resumes an in-progress attempt if one already exists (idempotent start).
export async function POST(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const { examId } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    select: {
      id: true,
      isPublished: true,
      timeLimitMin: true,
      questions: { orderBy: { sortOrder: 'asc' }, select: { questionId: true } },
    },
  });

  if (!exam || !exam.isPublished) {
    return NextResponse.json({ error: 'This exam is not available.' }, { status: 404 });
  }
  if (exam.questions.length === 0) {
    return NextResponse.json({ error: 'This exam has no questions yet.' }, { status: 400 });
  }

  // Resume an existing in-progress attempt of this exam rather than duplicating.
  const inProgress = await prisma.examAttempt.findFirst({
    where: { userId, examId: exam.id, status: 'IN_PROGRESS' },
    select: { id: true },
  });
  if (inProgress) {
    return NextResponse.json({ attemptId: inProgress.id });
  }

  const attempt = await prisma.examAttempt.create({
    data: {
      userId,
      examId: exam.id,
      questionCount: exam.questions.length,
      timeLimitMin: exam.timeLimitMin,
      answers: {
        create: exam.questions.map((q, i) => ({ questionId: q.questionId, sortOrder: i })),
      },
    },
    select: { id: true },
  });

  return NextResponse.json({ attemptId: attempt.id });
}
