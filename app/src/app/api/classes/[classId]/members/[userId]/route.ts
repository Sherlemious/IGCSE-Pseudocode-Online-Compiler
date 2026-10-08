import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { removeStudent } from '@/modules/classes/service';

/** Remove a student from a class. Owner-only. */
export const DELETE = route(async (_req, { params }: RouteContext<'/api/classes/[classId]/members/[userId]'>) => {
  const user = await requireUser();
  const { classId, userId } = await params;
  await removeStudent(classId, user.id, userId);
  return { ok: true };
});
