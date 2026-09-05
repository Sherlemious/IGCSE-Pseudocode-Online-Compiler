import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { gradeExamAnswer } from '@/modules/exams/attempts';
import { readAnswerSubmission, examErrorResponse } from '@/modules/exams/requests';

interface Context {
  params: Promise<{ examId: string }>;
}

export async function POST(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { examId } = await params;
    const submission = await readAnswerSubmission(req);
    return NextResponse.json(await gradeExamAnswer(examId, session.user.id, submission));
  } catch (error) {
    return examErrorResponse(error);
  }
}
