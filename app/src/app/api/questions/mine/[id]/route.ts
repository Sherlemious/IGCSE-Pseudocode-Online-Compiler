import { route } from '@/shared/http/route';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { readJson } from '@/shared/http/input';
import { notFound } from '@/shared/http/errors';
import { requireUser } from '@/modules/auth/guards';
import { parseQuestionInput } from '@/modules/questions/parseInput';
import { deleteOwnedQuestion, getOwnedQuestion, updateOwnedQuestion } from '@/modules/questions/service';

type Ctx = RouteContext<'/api/questions/mine/[id]'>;

export const GET = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  const question = await getOwnedQuestion(user.id, id);
  if (!question) throw notFound('Question not found');
  return question;
});

export const PATCH = route(async (req, { params }: Ctx) => {
  const user = await requireUser();
  enforceRateLimit(`custom-question:${user.id}`, { limit: 20, windowMs: 60_000 },
    "You're saving questions too fast. Please wait a moment and try again.");
  const { id } = await params;
  return updateOwnedQuestion(user.id, id, parseQuestionInput(await readJson(req)));
});

export const DELETE = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  return deleteOwnedQuestion(user.id, id);
});
