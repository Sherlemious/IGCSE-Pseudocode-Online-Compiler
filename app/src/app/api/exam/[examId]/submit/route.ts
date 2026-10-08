import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { submitExamAttempt } from '@/modules/exams/attempts';

export const POST = route(async (_req, { params }: RouteContext<'/api/exam/[examId]/submit'>) => {
  const user = await requireUser();
  const { examId } = await params;
  // Expiry is determined from the stored start time, never a client flag.
  return submitExamAttempt(examId, user.id);
});
