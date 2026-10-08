import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { cloneExam } from '@/modules/exams/definitions';

/** Copy an exam you own. */
export const POST = route(async (_req, { params }: RouteContext<'/api/exams/[examId]/clone'>) => {
  const user = await requireUser();
  const { examId } = await params;
  return cloneExam(examId, user.id);
});
