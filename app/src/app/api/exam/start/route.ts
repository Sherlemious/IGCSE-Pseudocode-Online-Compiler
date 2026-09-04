import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import type { Difficulty } from '@prisma/client';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { topic, difficulty, questionCount, timeLimitMin } = await req.json();

  const count = Math.min(Math.max(questionCount || 5, 1), 20);
  const timeLimit = Math.min(Math.max(timeLimitMin || 60, 10), 180);

  // Build where clause for question selection
  const where: Record<string, unknown> = {};
  if (topic) where.topic = topic;
  if (difficulty) where.difficulty = difficulty as Difficulty;

  // Keep premium-flagged questions out of a non-entitled student's exam pool when
  // gating is enabled. Entitlement = own paid plan or a paid teacher's class.
  if (PREMIUM_GATING_ENABLED && !(await getPremiumAccess(session.user.id))) {
    where.isPremium = false;
  }

  // Get random questions
  const allQuestions = await prisma.question.findMany({
    where,
    select: { id: true },
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
