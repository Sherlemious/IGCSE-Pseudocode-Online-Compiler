import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Set the signed-in user's role (student/teacher). Used both by the one-time
 * onboarding step (OAuth signups) and the "change role" control in the profile.
 * Marks roleChosen so onboarding never re-prompts.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { role } = (body ?? {}) as { role?: string };
  if (role !== 'STUDENT' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Pick student or teacher.' }, { status: 400 });
  }

  // Never let this endpoint change an ADMIN's role — just mark them as chosen.
  const current = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  const nextRole = current?.role === 'ADMIN' ? 'ADMIN' : role;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: nextRole, roleChosen: true },
  });

  return NextResponse.json({ ok: true, role: nextRole });
}
