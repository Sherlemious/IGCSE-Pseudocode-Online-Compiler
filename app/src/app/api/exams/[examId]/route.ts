import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Context {
  params: Promise<{ examId: string }>;
}

interface UpdateBody {
  title?: unknown;
  description?: unknown;
  timeLimitMin?: unknown;
  questionIds?: unknown;
  isPublished?: unknown;
}

export async function PATCH(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { examId } = await params;

  // Owner-only.
  const existing = await prisma.exam.findFirst({
    where: { id: examId, ownerId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as UpdateBody;

  const data: {
    title?: string;
    description?: string | null;
    timeLimitMin?: number;
    isPublished?: boolean;
  } = {};

  if (typeof body.title === 'string') {
    const title = body.title.trim();
    if (!title) return NextResponse.json({ error: 'Please give the exam a title.' }, { status: 400 });
    data.title = title;
  }
  if (typeof body.description === 'string') {
    data.description = body.description.trim() || null;
  }
  if (body.timeLimitMin !== undefined) {
    data.timeLimitMin = Math.min(Math.max(Number(body.timeLimitMin) || 60, 10), 180);
  }
  if (typeof body.isPublished === 'boolean') {
    data.isPublished = body.isPublished;
  }

  // Optional full replacement of the question set.
  let questionIds: string[] | null = null;
  if (Array.isArray(body.questionIds)) {
    const rawIds = body.questionIds.filter((id): id is string => typeof id === 'string');
    questionIds = [...new Set(rawIds)];
    if (questionIds.length === 0) {
      return NextResponse.json({ error: 'Add at least one question.' }, { status: 400 });
    }
    const found = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true },
    });
    const foundIds = new Set(found.map((q) => q.id));
    questionIds = questionIds.filter((id) => foundIds.has(id));
    if (questionIds.length === 0) {
      return NextResponse.json({ error: 'None of the selected questions could be found.' }, { status: 400 });
    }
  }

  await prisma.$transaction(async (tx) => {
    if (Object.keys(data).length > 0) {
      await tx.exam.update({ where: { id: examId }, data });
    }
    if (questionIds) {
      await tx.examQuestion.deleteMany({ where: { examId } });
      await tx.examQuestion.createMany({
        data: questionIds.map((questionId, i) => ({ examId, questionId, sortOrder: i })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { examId } = await params;

  const existing = await prisma.exam.findFirst({
    where: { id: examId, ownerId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  // Cascade removes ExamQuestion links; ExamAttempt.examId is set null (attempts/results survive).
  await prisma.exam.delete({ where: { id: examId } });

  return NextResponse.json({ ok: true });
}
