import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
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
