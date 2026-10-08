import type { ContactStatus } from '@prisma/client';
import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { oneOf, readJsonOrEmpty } from '@/shared/http/input';
import { requireAdmin } from '@/modules/auth/guards';
import { setContactStatus } from '@/modules/feedback/repo';

const STATUSES: readonly ContactStatus[] = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'];

export const PATCH = route(async (req, { params }: RouteContext<'/api/admin/contact/[id]/status'>) => {
  await requireAdmin();
  const { id } = await params;
  const status = oneOf((await readJsonOrEmpty(req)).status, STATUSES);
  if (!status) throw badRequest('Invalid status');
  return { message: await setContactStatus(id, status) };
});
