import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { submitExamAttempt } from '@/modules/exams/attempts';
import { examErrorResponse } from '@/modules/exams/requests';

interface Context {
  params: Promise<{ examId: string }>;
}

export async function POST(_req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { examId } = await params;
    // Expiry is determined from the stored start time, never a client flag.
    return NextResponse.json(await submitExamAttempt(examId, session.user.id));
  } catch (error) {
    return examErrorResponse(error);
  }
}
