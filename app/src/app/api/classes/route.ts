import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateShareCode } from '@/lib/shareCode';
import { getEntitlements } from '@/lib/entitlements';

interface CreateBody {
  name?: unknown;
}

/** Create a class. Enforces the caller's plan class-limit and, on their first
 *  class, promotes a STUDENT to TEACHER (self-serve teacher path). */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const body = (await req.json().catch(() => ({}))) as CreateBody;
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  if (!name) {
    return NextResponse.json({ error: 'Please give the class a name.' }, { status: 400 });
  }

  const { limits } = await getEntitlements(userId);
  const existing = await prisma.class.count({ where: { ownerId: userId, archived: false } });
  if (existing >= limits.maxClasses) {
    return NextResponse.json(
      {
        error: `Your plan allows ${limits.maxClasses} class${limits.maxClasses === 1 ? '' : 'es'}. Upgrade to add more.`,
        code: 'LIMIT_CLASSES',
      },
      { status: 403 },
    );
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const created = await prisma.class.create({
        data: { ownerId: userId, name, joinCode: generateShareCode() },
        select: { id: true, joinCode: true },
      });
      // First class turns a student into a teacher.
      if (session.user.role === 'STUDENT') {
        await prisma.user.update({ where: { id: userId }, data: { role: 'TEACHER' } });
      }
      return NextResponse.json({ id: created.id, joinCode: created.joinCode });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        continue; // joinCode collision — regenerate
      }
      throw err;
    }
  }

  return NextResponse.json({ error: 'Could not generate a unique join code. Please try again.' }, { status: 500 });
}

/** List the classes the caller owns (teaching) and the ones they've joined (enrolled). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const [owned, enrolled] = await Promise.all([
    prisma.class.findMany({
      where: { ownerId: userId, archived: false },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, joinCode: true, createdAt: true, _count: { select: { memberships: true } } },
    }),
    prisma.classMembership.findMany({
      where: { userId, class: { archived: false } },
      orderBy: { joinedAt: 'desc' },
      select: {
        joinedAt: true,
        class: { select: { id: true, name: true, owner: { select: { name: true } } } },
      },
    }),
  ]);

  return NextResponse.json({ owned, enrolled });
}
