import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { notFound } from '@/shared/http/errors';
import { deleteOwnedQuestion, getMyQuestion, updateOwnedQuestion } from '@/modules/questions/service';

type Ctx = RouteContext<'/api/questions/mine/[id]'>;

export const GET = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  const question = await getMyQuestion(user.id, id);
  if (!question) throw notFound('Question not found');
  return { question };
});

export const PUT = route(async (req, { params }: Ctx) => {
  const user = await requireUser();
  enforceRateLimit(
    `questions:write:${user.id}`,
    { limit: 20, windowMs: 60_000 },
    (seconds) => `Please wait ${seconds}s and try again.`,
  );
  const { id } = await params;
  return updateOwnedQuestion(user.id, id, await readJson(req));
});

export const DELETE = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  return deleteOwnedQuestion(user.id, id);
});
