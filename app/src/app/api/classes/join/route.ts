import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { revalidatePremiumAccess } from '@/modules/billing/entitlements';
import { ClassRequestError, joinClass } from '@/modules/classes/service';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || !('joinCode' in body) || typeof body.joinCode !== 'string' || !body.joinCode.trim() ||
    ('assignmentId' in body && (typeof body.assignmentId !== 'string' || !body.assignmentId.trim()))) {
    return NextResponse.json({ error: 'Enter a class code.' }, { status: 400 });
  }
  try {
    const result = await joinClass(session.user.id, body.joinCode, 'assignmentId' in body ? body.assignmentId as string : undefined);
    // Joining a premium teacher's class grants entitlement; drop the cached
    // answer now rather than letting the student wait out the TTL.
    if (!result.alreadyMember) revalidatePremiumAccess(session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ClassRequestError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    throw error;
  }
}
