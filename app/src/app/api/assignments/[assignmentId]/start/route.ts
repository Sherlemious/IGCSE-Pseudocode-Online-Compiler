import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';

interface Context {
  params: Promise<{ assignmentId: string }>;
}

/** Start (or resume) a student's attempt of an assigned exam. The student must
 *  be enrolled in the assignment's class. The resulting ExamAttempt is tagged
 *  with assignmentId so the teacher dashboard can find it. */
export async function POST(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const { assignmentId } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      classId: true,
      exam: {
        select: {
          id: true,
          isPublished: true,
          timeLimitMin: true,
          questions: { orderBy: { sortOrder: 'asc' }, select: { questionId: true } },
        },
      },
    },
  });

  if (!assignment) {
    return NextResponse.json({ error: 'This assignment is no longer available.' }, { status: 404 });
  }

  // Must be a member of the class the assignment belongs to.
  const membership = await prisma.classMembership.findUnique({
    where: { classId_userId: { classId: assignment.classId, userId } },
    select: { id: true },
  });
  if (!membership) {
    return NextResponse.json({ error: "You're not a member of this class." }, { status: 403 });
  }

  const exam = assignment.exam;
  if (!exam.isPublished) {
    return NextResponse.json({ error: 'This exam is not available.' }, { status: 404 });
  }
  if (exam.questions.length === 0) {
    return NextResponse.json({ error: 'This exam has no questions yet.' }, { status: 400 });
  }

  // Resume an in-progress attempt of this assignment rather than duplicating.
  const inProgress = await prisma.examAttempt.findFirst({
    where: { userId, assignmentId, status: 'IN_PROGRESS' },
    select: { id: true },
  });
  if (inProgress) {
    return NextResponse.json({ attemptId: inProgress.id });
  }

  const attempt = await prisma.examAttempt.create({
    data: {
      userId,
      examId: exam.id,
      assignmentId,
      questionCount: exam.questions.length,
      timeLimitMin: exam.timeLimitMin,
      answers: { create: exam.questions.map((q, i) => ({ questionId: q.questionId, sortOrder: i })) },
    },
    select: { id: true },
  });

  return NextResponse.json({ attemptId: attempt.id });
}
