import type { Role } from '@prisma/client';
import { badRequest, forbidden } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { oneOf, readJson } from '@/shared/http/input';
import { requireAdmin } from '@/modules/auth/guards';
import { setRole } from '@/modules/auth/userRepo';

const ROLES: readonly Role[] = ['STUDENT', 'TEACHER', 'ADMIN'];

export const PATCH = route(async (req, { params }: RouteContext<'/api/admin/users/[id]/role'>) => {
  const admin = await requireAdmin();
  const { id } = await params;
  const role = oneOf((await readJson(req)).role, ROLES);
  if (!role) throw badRequest('Invalid role');
  // An ADMIN_EMAILS admin can manage roles but can't mint new admins.
  if (role === 'ADMIN' && admin.role !== 'ADMIN') throw forbidden('Only DB admins can promote to ADMIN');
  if (id === admin.id) throw badRequest('Cannot change your own role');
  return { user: await setRole(id, role) };
});
