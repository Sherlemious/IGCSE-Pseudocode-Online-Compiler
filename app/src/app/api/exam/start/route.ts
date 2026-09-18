import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { getExamQuestionPool } from '@/shared/lib/catalogCache';
import type { Difficulty } from '@prisma/client';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { topic, difficulty, questionCount, timeLimitMin } = await req.json();

  const count = Math.min(Math.max(questionCount || 5, 1), 20);
  const timeLimit = Math.min(Math.max(timeLimitMin || 60, 10), 180);

  const includePremium =
    !PREMIUM_GATING_ENABLED || (await getPremiumAccess(session.user.id));

  const allQuestions = await getExamQuestionPool({
    topic: topic || null,
    difficulty: difficulty || null,
    includePremium,
  });

  if (allQuestions.length === 0) {
    return NextResponse.json({ error: 'No questions match your criteria' }, { status: 404 });
  }

  // Shuffle and pick
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Create exam attempt with answers
  const exam = await prisma.examAttempt.create({
    data: {
      userId: session.user.id,
      topic: topic || null,
      difficulty: (difficulty as Difficulty) || null,
      questionCount: selected.length,
      timeLimitMin: timeLimit,
      answers: {
        create: selected.map((q, i) => ({
          questionId: q.id,
          sortOrder: i,
        })),
      },
    },
    include: {
      answers: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, questionId: true, sortOrder: true },
      },
    },
  });

  return NextResponse.json({ examId: exam.id });
}
