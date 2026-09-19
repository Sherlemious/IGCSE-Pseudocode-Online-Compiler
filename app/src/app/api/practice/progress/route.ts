import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { prisma } from '@/shared/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [progress, premiumAccess] = await Promise.all([
    prisma.progress.findMany({
      where: { userId: session.user.id },
      select: { questionId: true, status: true, bestScore: true, totalTests: true, updatedAt: true },
    }),
    PREMIUM_GATING_ENABLED ? getPremiumAccess(session.user.id) : Promise.resolve(true),
  ]);

  return NextResponse.json({
    premiumAccess,
    progress: progress.map((row) => ({
      questionId: row.questionId,
      status: row.status,
      bestScore: row.bestScore,
      totalTests: row.totalTests,
      updatedAt: row.updatedAt.toISOString(),
    })),
  });
}
