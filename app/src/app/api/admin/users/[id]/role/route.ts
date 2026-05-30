import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';
import type { Role } from '@prisma/client';

const VALID_ROLES: Role[] = ['STUDENT', 'TEACHER', 'ADMIN'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(session.user.email, session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as { role?: unknown };
  const newRole = body.role;

  if (!newRole || typeof newRole !== 'string' || !VALID_ROLES.includes(newRole as Role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  if (newRole === 'ADMIN' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only DB admins can promote to ADMIN' }, { status: 403 });
  }

  if (id === session.user.id) {
    return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: newRole as Role },
    select: { id: true, role: true },
  });

  return NextResponse.json({ user: updated });
}
