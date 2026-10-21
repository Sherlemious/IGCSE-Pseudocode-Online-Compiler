import { route } from '@/shared/http/route';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { readJson } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { parseQuestionInput } from '@/modules/questions/parseInput';
import { createOwnedQuestion, listOwnedQuestions } from '@/modules/questions/service';

const AUTHOR_LIMIT = { limit: 20, windowMs: 60_000 } as const;

export const GET = route(async () => {
  const user = await requireUser();
  return { questions: await listOwnedQuestions(user.id) };
});

export const POST = route(async (req) => {
  const user = await requireUser();
  enforceRateLimit(`custom-question:${user.id}`, AUTHOR_LIMIT,
    "You're saving questions too fast. Please wait a moment and try again.");
  const draft = parseQuestionInput(await readJson(req));
  return createOwnedQuestion(user.id, draft);
});
