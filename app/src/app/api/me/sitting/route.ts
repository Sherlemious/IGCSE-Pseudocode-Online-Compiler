import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { oneOf, readJson } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { findExamSitting, setExamSitting } from '@/modules/auth/userRepo';
import { SITTING_VALUES } from '@/modules/onboarding/sittings';

/** The sitting the signed-in student said they are preparing for, or null. */
export const GET = route(async () => {
  const user = await requireUser('Not signed in.');
  return { sitting: await findExamSitting(user.id) };
});

/** Save the sitting; the latest answer wins so a student can correct it. */
export const POST = route(async (req) => {
  const user = await requireUser('Not signed in.');
  const sitting = oneOf((await readJson(req)).sitting, SITTING_VALUES);
  if (!sitting) throw badRequest('Pick one of the listed sittings.');
  await setExamSitting(user.id, sitting);
  return { ok: true, sitting };
});
