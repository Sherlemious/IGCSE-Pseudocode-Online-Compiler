import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { ClassRequestError, startAssignment } from '@/modules/classes/service';

export async function POST(_req: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { assignmentId } = await params;
    return NextResponse.json(await startAssignment(session.user.id, assignmentId));
  } catch (error) {
    if (error instanceof ClassRequestError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    throw error;
  }
}
