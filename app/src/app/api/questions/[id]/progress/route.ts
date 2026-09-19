import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { prisma } from '@/shared/db';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const [row, premiumAccess] = await Promise.all([
    prisma.progress.findUnique({
      where: { userId_questionId: { userId: session.user.id, questionId: id } },
      select: { lastCode: true, status: true, attempts: true },
    }),
    PREMIUM_GATING_ENABLED ? getPremiumAccess(session.user.id) : Promise.resolve(true),
  ]);

  return NextResponse.json({
    lastCode: row?.lastCode ?? null,
    status: row?.status ?? null,
    attempts: row?.attempts ?? 0,
    premiumAccess,
  });
}
