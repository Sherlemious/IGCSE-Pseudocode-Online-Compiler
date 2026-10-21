import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { checkSolution } from '@/modules/questions/service';

export const POST = route(async (req) => {
  const user = await requireUser();
  enforceRateLimit(
    `questions:write:${user.id}`,
    { limit: 20, windowMs: 60_000 },
    (seconds) => `Please wait ${seconds}s and try again.`,
  );
  return checkSolution(user.id, await readJson(req));
});
