import type { BugStatus } from '@prisma/client';
import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { oneOf, readJsonOrEmpty } from '@/shared/http/input';
import { requireAdmin } from '@/modules/auth/guards';
import { setBugStatus } from '@/modules/feedback/repo';

const STATUSES: readonly BugStatus[] = ['OPEN', 'IN_PROGRESS', 'FIXED', 'WONT_FIX'];

export const PATCH = route(async (req, { params }: RouteContext<'/api/admin/bugs/[id]/status'>) => {
  await requireAdmin();
  const { id } = await params;
  const status = oneOf((await readJsonOrEmpty(req)).status, STATUSES);
  if (!status) throw badRequest('Invalid status');
  return { report: await setBugStatus(id, status) };
});
