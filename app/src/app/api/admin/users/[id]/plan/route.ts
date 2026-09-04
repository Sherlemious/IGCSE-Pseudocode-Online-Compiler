import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { isAdmin } from '@/modules/admin/isAdmin';
import type { Plan } from '@prisma/client';

const VALID_PLANS: Plan[] = ['FREE', 'STUDENT', 'STARTER', 'PRO', 'SCHOOL'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(session.user.email, session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as { plan?: unknown };
  const newPlan = body.plan;

  if (!newPlan || typeof newPlan !== 'string' || !VALID_PLANS.includes(newPlan as Plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  // Dropping to FREE clears any recorded subscription tier / trial so the
  // displayed plan stays consistent with the entitlement.
  const clearBilling = newPlan === 'FREE';

  const updated = await prisma.user.update({
    where: { id },
    data: {
      plan: newPlan as Plan,
      planUpdatedAt: new Date(),
      ...(clearBilling ? { planTier: null, trialEndsAt: null } : {}),
    },
    select: { id: true, plan: true, planTier: true, trialEndsAt: true, planUpdatedAt: true },
  });

  return NextResponse.json({ user: updated });
}
