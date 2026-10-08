import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { startSharedExam } from '@/modules/exams/definitions';

/** Start or resume an attempt of a shared exam definition. */
export const POST = route(async (_req, { params }: RouteContext<'/api/exams/[examId]/start'>) => {
  const user = await requireUser();
  const { examId } = await params;
  return startSharedExam(examId, user.id);
});
