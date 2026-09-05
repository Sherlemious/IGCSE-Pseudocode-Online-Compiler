import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      // Allowlist public fields: solutions belong to the authenticated solution endpoint.
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        year: true,
        session: true,
        variant: true,
        paper: true,
        questionNumber: true,
        part: true,
        marks: true,
        topic: true,
        tags: true,
        isPremium: true,
        starterCode: true,
        hints: true,
        createdAt: true,
        updatedAt: true,
        testCases: {
          where: { isHidden: false },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            inputs: true,
            expectedOutput: true,
            description: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Failed to fetch question:', error);
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}
