import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';

interface Context {
  params: Promise<{ classId: string }>;
}

/** Class detail + roster. Owner-only. */
export async function GET(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { classId } = await params;

  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      ownerId: true,
      name: true,
      joinCode: true,
      archived: true,
      createdAt: true,
      memberships: {
        orderBy: { joinedAt: 'asc' },
        select: {
          userId: true,
          joinedAt: true,
          user: { select: { name: true, email: true, image: true } },
        },
      },
    },
  });

  if (!cls || cls.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(cls);
}

interface PatchBody {
  name?: unknown;
  archived?: unknown;
}

/** Rename or archive a class. Owner-only. */
export async function PATCH(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { classId } = await params;

  const cls = await prisma.class.findUnique({ where: { id: classId }, select: { ownerId: true } });
  if (!cls || cls.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as PatchBody;
  const data: { name?: string; archived?: boolean } = {};
  if (typeof body.name === 'string') {
    const name = body.name.trim().slice(0, 80);
    if (!name) return NextResponse.json({ error: 'Class name cannot be empty.' }, { status: 400 });
    data.name = name;
  }
  if (typeof body.archived === 'boolean') {
    data.archived = body.archived;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  await prisma.class.update({ where: { id: classId }, data });
  return NextResponse.json({ ok: true });
}
