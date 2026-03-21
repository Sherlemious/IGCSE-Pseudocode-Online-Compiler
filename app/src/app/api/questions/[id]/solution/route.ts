import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { auth } from '../../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to view solutions' }, { status: 401 });
  }

  const giveUp = request.nextUrl.searchParams.get('giveUp') === 'true';

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      select: { solution: true, solutionExplanation: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const progress = await prisma.progress.findUnique({
      where: { userId_questionId: { userId: session.user.id, questionId: id } },
      select: { status: true, attempts: true },
    });

    const isSolved = progress?.status === 'SOLVED';
    const attempts = progress?.attempts ?? 0;
    const canView = isSolved || attempts >= 3 || giveUp;

    if (!canView) {
      return NextResponse.json({
        locked: true,
        attemptsNeeded: Math.max(0, 3 - attempts),
      });
    }

    return NextResponse.json({
      locked: false,
      solution: question.solution,
      explanation: question.solutionExplanation,
    });
  } catch (error) {
    console.error('Failed to fetch solution:', error);
    return NextResponse.json({ error: 'Failed to fetch solution' }, { status: 500 });
  }
}
