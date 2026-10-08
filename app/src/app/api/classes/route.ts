import { route } from '@/shared/http/route';
import { readJsonOrEmpty, requiredText } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { createClass, listClasses } from '@/modules/classes/service';

/** Create a class (plan class-limit applies; a student's first class makes them a teacher). */
export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await readJsonOrEmpty(req);
  const name = requiredText(body.name, 80, 'Please give the class a name.');
  return createClass(user, name);
});

/** The classes the caller owns (teaching) and the ones they've joined (enrolled). */
export const GET = route(async () => {
  const user = await requireUser();
  return listClasses(user.id);
});
