import { route } from '@/shared/http/route';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { gradeExamAnswer } from '@/modules/exams/attempts';
import { readAnswerSubmission } from '@/modules/exams/requests';

export const POST = route(async (req, { params }: RouteContext<'/api/exam/[examId]/grade'>) => {
  const user = await requireUser();
  // Grading runs student code on the server; same budget as practice grading.
  enforceRateLimit(`exam-grade:${user.id}`, { limit: 20, windowMs: 60_000 },
    "You're checking answers too fast. Please wait a moment and try again.");
  const { examId } = await params;
  return gradeExamAnswer(examId, user.id, await readAnswerSubmission(req));
});
