import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { normalizeShareCode } from '@/shared/lib/shareCode';
import { resolveTier, limitsFor } from '@/modules/billing/entitlements';

interface JoinBody {
  joinCode?: unknown;
}

/** A signed-in student joins a class by its code. The student limit is checked
 *  against the class OWNER's plan (a free teacher's class caps at 5). */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const body = (await req.json().catch(() => ({}))) as JoinBody;
  const joinCode = typeof body.joinCode === 'string' ? normalizeShareCode(body.joinCode) : '';
  if (!joinCode) {
    return NextResponse.json({ error: 'Enter a class code.' }, { status: 400 });
  }

  const cls = await prisma.class.findFirst({
    where: { joinCode, archived: false },
    select: {
      id: true,
      name: true,
      ownerId: true,
      owner: { select: { plan: true, trialEndsAt: true } },
      _count: { select: { memberships: true } },
    },
  });
  if (!cls) {
    return NextResponse.json({ error: 'No class found for that code.' }, { status: 404 });
  }
  if (cls.ownerId === userId) {
    return NextResponse.json({ error: "That's your own class — you already manage it.", code: 'OWN_CLASS' }, { status: 400 });
  }

  // Already a member? Idempotent success.
  const already = await prisma.classMembership.findUnique({
    where: { classId_userId: { classId: cls.id, userId } },
    select: { id: true },
  });
  if (already) {
    return NextResponse.json({ classId: cls.id, name: cls.name, alreadyMember: true });
  }

  const ownerLimits = limitsFor(resolveTier(cls.owner));
  if (cls._count.memberships >= ownerLimits.maxStudentsPerClass) {
    return NextResponse.json({ error: 'This class is full.', code: 'LIMIT_STUDENTS' }, { status: 403 });
  }

  try {
    await prisma.classMembership.create({ data: { classId: cls.id, userId } });
  } catch (err) {
    // Unique race — someone/something created the membership concurrently.
    if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) {
      throw err;
    }
  }

  return NextResponse.json({ classId: cls.id, name: cls.name });
}
