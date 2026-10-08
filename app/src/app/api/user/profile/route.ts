import { badRequest, unprocessable } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { setName } from '@/modules/auth/userRepo';

export const PATCH = route(async (req) => {
  const user = await requireUser();
  const body = await readJson(req);
  if (typeof body.name !== 'string') throw badRequest('Nothing to update');
  const name = body.name.trim();
  if (name.length === 0 || name.length > 60) throw unprocessable('Name must be 1–60 characters');
  return { user: await setName(user.id, name) };
});
