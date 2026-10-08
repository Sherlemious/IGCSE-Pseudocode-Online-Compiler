import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { saveExamAnswer } from '@/modules/exams/attempts';
import { readAnswerSubmission } from '@/modules/exams/requests';

export const POST = route(async (req, { params }: RouteContext<'/api/exam/[examId]/save'>) => {
  const user = await requireUser();
  const { examId } = await params;
  return saveExamAnswer(examId, user.id, await readAnswerSubmission(req));
});
