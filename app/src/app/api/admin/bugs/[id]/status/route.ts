import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { isAdmin } from '@/modules/admin/isAdmin';
import type { BugStatus } from '@prisma/client';

const VALID: BugStatus[] = ['OPEN', 'IN_PROGRESS', 'FIXED', 'WONT_FIX'];
const RESOLVED: BugStatus[] = ['FIXED', 'WONT_FIX'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(session.user.email, session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: unknown };
  const status = body.status;

  if (typeof status !== 'string' || !VALID.includes(status as BugStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await prisma.bugReport.update({
    where: { id },
    data: {
      status: status as BugStatus,
      resolvedAt: RESOLVED.includes(status as BugStatus) ? new Date() : null,
    },
    select: { id: true, status: true },
  });

  return NextResponse.json({ report: updated });
}
