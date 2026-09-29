import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { gradeExamAnswer } from '@/modules/exams/attempts';
import { readAnswerSubmission, examErrorResponse } from '@/modules/exams/requests';
import { limitRequest } from '@/shared/lib/rateLimit';

interface Context {
  params: Promise<{ examId: string }>;
}

export async function POST(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Grading runs student code on the server; same budget as practice grading.
  const limited = limitRequest(
    `exam-grade:${session.user.id}`,
    { limit: 20, windowMs: 60_000 },
    "You're checking answers too fast. Please wait a moment and try again.",
  );
  if (limited) return limited;

  try {
    const { examId } = await params;
    const submission = await readAnswerSubmission(req);
    return NextResponse.json(await gradeExamAnswer(examId, session.user.id, submission));
  } catch (error) {
    return examErrorResponse(error);
  }
}
