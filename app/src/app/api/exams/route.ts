import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { generateShareCode } from '@/shared/lib/shareCode';

interface CreateBody {
  title?: unknown;
  description?: unknown;
  timeLimitMin?: unknown;
  questionIds?: unknown;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as CreateBody;

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' && body.description.trim() ? body.description.trim() : null;
  const timeLimitMin = Math.min(Math.max(Number(body.timeLimitMin) || 60, 10), 180);
  const rawIds = Array.isArray(body.questionIds) ? body.questionIds.filter((id): id is string => typeof id === 'string') : [];
  const questionIds = [...new Set(rawIds)]; // dedupe, preserve order

  if (!title) {
    return NextResponse.json({ error: 'Please give the exam a title.' }, { status: 400 });
  }
  if (questionIds.length === 0) {
    return NextResponse.json({ error: 'Add at least one question.' }, { status: 400 });
  }

  // Verify all referenced questions exist.
  const found = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    select: { id: true },
  });
  const foundIds = new Set(found.map((q) => q.id));
  const validIds = questionIds.filter((id) => foundIds.has(id));
  if (validIds.length === 0) {
    return NextResponse.json({ error: 'None of the selected questions could be found.' }, { status: 400 });
  }

  // Create with a unique share code, retrying on the rare collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const exam = await prisma.exam.create({
        data: {
          ownerId: session.user.id,
          title,
          description,
          timeLimitMin,
          shareCode: generateShareCode(),
          questions: {
            create: validIds.map((questionId, i) => ({ questionId, sortOrder: i })),
          },
        },
        select: { id: true, shareCode: true },
      });
      return NextResponse.json({ examId: exam.id, shareCode: exam.shareCode });
    } catch (err) {
      // Unique constraint on shareCode — regenerate and retry.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        continue;
      }
      throw err;
    }
  }

  return NextResponse.json({ error: 'Could not generate a unique share code. Please try again.' }, { status: 500 });
}
