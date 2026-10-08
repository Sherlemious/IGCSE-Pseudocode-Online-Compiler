import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJsonOrEmpty } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { joinClass } from '@/modules/classes/service';

export const POST = route(async (req) => {
  const user = await requireUser();
  // Join codes are short; slow anyone trying to guess them.
  enforceRateLimit(`class-join:${user.id}`, { limit: 20, windowMs: 10 * 60_000 });
  const body = await readJsonOrEmpty(req);
  const { joinCode, assignmentId } = body;
  if (typeof joinCode !== 'string' || !joinCode.trim() ||
      (assignmentId !== undefined && (typeof assignmentId !== 'string' || !assignmentId.trim()))) {
    throw badRequest('Enter a class code.');
  }
  return joinClass(user.id, joinCode, assignmentId);
});
