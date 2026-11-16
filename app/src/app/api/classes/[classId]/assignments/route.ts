import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { optionalDate, optionalTimeZone, readJsonOrEmpty } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { assignExam } from '@/modules/classes/service';

/** Assign one of the teacher's own exams to a class they own. */
export const POST = route(async (req, { params }: RouteContext<'/api/classes/[classId]/assignments'>) => {
  const user = await requireUser();
  const { classId } = await params;
  const body = await readJsonOrEmpty(req);
  const examId = typeof body.examId === 'string' ? body.examId : '';
  if (!examId) throw badRequest('Pick an exam to assign.');
  // An exam keeps its timer unless the teacher picks "no time limit".
  return assignExam(classId, user.id, examId, optionalDate(body.dueDate), body.timed !== false, optionalTimeZone(body.timeZone));
});
