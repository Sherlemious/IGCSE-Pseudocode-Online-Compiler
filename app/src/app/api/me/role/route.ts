import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { oneOf, readJson } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { findUserRole, setRole } from '@/modules/auth/userRepo';

/**
 * Set the signed-in user's role (student/teacher), from onboarding or the
 * profile's "change role". Marks roleChosen so onboarding never re-prompts.
 */
export const POST = route(async (req) => {
  const user = await requireUser('Not signed in.');
  const role = oneOf((await readJson(req)).role, ['STUDENT', 'TEACHER'] as const);
  if (!role) throw badRequest('Pick student or teacher.');
  // Never let this endpoint change an ADMIN's role — just mark them as chosen.
  const current = await findUserRole(user.id);
  const nextRole = current?.role === 'ADMIN' ? 'ADMIN' : role;
  await setRole(user.id, nextRole, { markChosen: true });
  return { ok: true, role: nextRole };
});
