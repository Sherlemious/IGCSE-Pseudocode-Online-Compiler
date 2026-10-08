import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { startAssignment } from '@/modules/classes/service';

export const POST = route(async (_req, { params }: RouteContext<'/api/assignments/[assignmentId]/start'>) => {
  const user = await requireUser();
  const { assignmentId } = await params;
  return startAssignment(user.id, assignmentId);
});
