import { route } from '@/shared/http/route';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { readJson } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { parseQuestionInput } from '@/modules/questions/parseInput';
import { previewOwnedQuestion } from '@/modules/questions/service';

export const POST = route(async (req) => {
  const user = await requireUser();
  enforceRateLimit(`custom-question:${user.id}`, { limit: 20, windowMs: 60_000 },
    "You're running tests too fast. Please wait a moment and try again.");
  return previewOwnedQuestion(user.id, parseQuestionInput(await readJson(req)));
});
