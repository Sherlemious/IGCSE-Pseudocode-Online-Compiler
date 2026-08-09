import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateShareCode } from '@/lib/shareCode';

interface Context {
  params: Promise<{ examId: string }>;
}

export async function POST(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { examId } = await params;

  // Owner-only (you can only reuse an exam you own).
  const source = await prisma.exam.findFirst({
    where: { id: examId, ownerId: session.user.id },
    select: {
      title: true,
      description: true,
      timeLimitMin: true,
      questions: { orderBy: { sortOrder: 'asc' }, select: { questionId: true } },
    },
  });
  if (!source) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const clone = await prisma.exam.create({
        data: {
          ownerId: session.user.id,
          title: `${source.title} (copy)`,
          description: source.description,
          timeLimitMin: source.timeLimitMin,
          shareCode: generateShareCode(),
          questions: {
            create: source.questions.map((q, i) => ({ questionId: q.questionId, sortOrder: i })),
          },
        },
        select: { id: true, shareCode: true },
      });
      return NextResponse.json({ examId: clone.id, shareCode: clone.shareCode });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        continue;
      }
      throw err;
    }
  }

  return NextResponse.json({ error: 'Could not generate a unique share code. Please try again.' }, { status: 500 });
}
