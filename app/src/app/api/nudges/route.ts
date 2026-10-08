import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJsonOrEmpty } from '@/shared/http/input';
import { optionalUser, requireUser } from '@/modules/auth/guards';
import { addNudgeShown, listNudgesShown } from '@/modules/auth/userRepo';

/** Which nudges have already been shown to this user (none for visitors). */
export const GET = route(async () => {
  const user = await optionalUser();
  return { nudgesShown: user ? await listNudgesShown(user.id) : [] };
});

/** Mark a nudge as shown; idempotent. */
export const POST = route(async (req) => {
  const user = await requireUser();
  const nudge = (await readJsonOrEmpty(req)).nudge;
  if (typeof nudge !== 'string' || !nudge || nudge.length > 64) throw badRequest('nudge is required');
  await addNudgeShown(user.id, nudge);
  return { ok: true };
});
