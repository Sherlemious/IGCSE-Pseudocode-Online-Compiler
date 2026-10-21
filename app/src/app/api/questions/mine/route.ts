import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { createOwnedQuestion, listMyQuestions } from '@/modules/questions/service';

const WRITE_LIMIT = { limit: 20, windowMs: 60_000 };

export const GET = route(async () => {
  const user = await requireUser();
  return { questions: await listMyQuestions(user.id) };
});

export const POST = route(async (req) => {
  const user = await requireUser();
  enforceRateLimit(`questions:write:${user.id}`, WRITE_LIMIT, (seconds) => `Please wait ${seconds}s and try again.`);
  return createOwnedQuestion(user.id, await readJson(req));
});
