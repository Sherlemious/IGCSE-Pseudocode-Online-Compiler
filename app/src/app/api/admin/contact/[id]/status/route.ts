import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { isAdmin } from '@/modules/admin/isAdmin';
import type { ContactStatus } from '@prisma/client';

const VALID: ContactStatus[] = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'];
const RESOLVED: ContactStatus[] = ['RESOLVED', 'ARCHIVED'];

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

  if (typeof status !== 'string' || !VALID.includes(status as ContactStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      status: status as ContactStatus,
      resolvedAt: RESOLVED.includes(status as ContactStatus) ? new Date() : null,
    },
    select: { id: true, status: true },
  });

  return NextResponse.json({ message: updated });
}
