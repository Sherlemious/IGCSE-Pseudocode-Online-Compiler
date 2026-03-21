import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      select: { hints: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ hints: question.hints });
  } catch (error) {
    console.error('Failed to fetch hints:', error);
    return NextResponse.json({ error: 'Failed to fetch hints' }, { status: 500 });
  }
}
