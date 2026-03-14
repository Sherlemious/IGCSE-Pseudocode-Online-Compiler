import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import type { Difficulty } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty') as Difficulty | null;

  try {
    const questions = await prisma.question.findMany({
      where: {
        ...(topic ? { topic } : {}),
        ...(difficulty ? { difficulty } : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        year: true,
        paper: true,
        topic: true,
        _count: { select: { testCases: { where: { isHidden: false } } } },
      },
      orderBy: [{ difficulty: 'asc' }, { title: 'asc' }],
    });
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
