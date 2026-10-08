import { route } from '@/shared/http/route';
import { requireAdmin } from '@/modules/auth/guards';
import { getUserLearning } from '@/modules/admin/userLearning';

export const GET = route(async (_req, { params }: RouteContext<'/api/admin/users/[id]/learning'>) => {
  await requireAdmin();
  const { id } = await params;
  return getUserLearning(id);
});
