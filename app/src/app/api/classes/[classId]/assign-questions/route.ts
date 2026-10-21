import { route } from '@/shared/http/route';
import { optionalDate, optionalText, readJsonOrEmpty, stringList } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { ASSIGNMENT_TITLE_MAX } from '@/modules/classes/assignPlan';
import { assignQuestions } from '@/modules/classes/service';

/** Create a small published exam from practice questions and assign it to this class. */
export const POST = route(async (req, { params }: RouteContext<'/api/classes/[classId]/assign-questions'>) => {
  const user = await requireUser();
  const { classId } = await params;
  const body = await readJsonOrEmpty(req);
  return assignQuestions(
    classId,
    user.id,
    stringList(body.questionIds),
    optionalDate(body.dueDate),
    optionalText(body.title, ASSIGNMENT_TITLE_MAX),
  );
});
