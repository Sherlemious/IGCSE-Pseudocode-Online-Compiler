import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { optionalDate, optionalText, readJsonOrEmpty } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { ASSIGNMENT_TITLE_MAX } from '@/modules/classes/assignPlan';
import { unassignExam, updateAssignment } from '@/modules/classes/service';

type Ctx = RouteContext<'/api/classes/[classId]/assignments/[assignmentId]'>;

/** Rename an assignment and set or clear its due date. Owner-only. */
export const PATCH = route(async (req, { params }: Ctx) => {
  const user = await requireUser();
  const { classId, assignmentId } = await params;
  const body = await readJsonOrEmpty(req);
  const data: { title?: string; dueDate?: Date | null } = {};
  if ('title' in body) {
    const title = optionalText(body.title, ASSIGNMENT_TITLE_MAX);
    if (!title) throw badRequest('Give the assignment a name.');
    data.title = title;
  }
  if ('dueDate' in body) {
    if (body.dueDate == null || body.dueDate === '') {
      data.dueDate = null;
    } else {
      const due = optionalDate(body.dueDate);
      if (!due) throw badRequest('That due date is not valid.');
      data.dueDate = due;
    }
  }
  await updateAssignment(classId, user.id, assignmentId, data);
  return { ok: true };
});

/** Remove an assignment from a class. Owner-only; student attempts survive. */
export const DELETE = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { classId, assignmentId } = await params;
  await unassignExam(classId, user.id, assignmentId);
  return { ok: true };
});
