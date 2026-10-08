import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { unassignExam } from '@/modules/classes/service';

/** Remove an assignment from a class. Owner-only; student attempts survive. */
export const DELETE = route(async (_req, { params }: RouteContext<'/api/classes/[classId]/assignments/[assignmentId]'>) => {
  const user = await requireUser();
  const { classId, assignmentId } = await params;
  await unassignExam(classId, user.id, assignmentId);
  return { ok: true };
});
