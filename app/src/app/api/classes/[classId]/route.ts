import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJsonOrEmpty } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { getOwnedClassWithRoster, updateClass } from '@/modules/classes/service';

type Ctx = RouteContext<'/api/classes/[classId]'>;

/** Class detail + roster. Owner-only. */
export const GET = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { classId } = await params;
  return getOwnedClassWithRoster(classId, user.id);
});

/** Rename, archive or restore a class. Owner-only. */
export const PATCH = route(async (req, { params }: Ctx) => {
  const user = await requireUser();
  const { classId } = await params;
  const body = await readJsonOrEmpty(req);

  const data: { name?: string; archived?: boolean } = {};
  if (typeof body.name === 'string') {
    const name = body.name.trim().slice(0, 80);
    if (!name) throw badRequest('Class name cannot be empty.');
    data.name = name;
  }
  if (typeof body.archived === 'boolean') data.archived = body.archived;
  if (Object.keys(data).length === 0) throw badRequest('Nothing to update.');

  await updateClass(classId, user.id, data);
  return { ok: true };
});
