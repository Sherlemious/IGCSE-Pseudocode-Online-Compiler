import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { markAnswer } from '@/modules/practice/examMarking/service';

/** "Mark it like an examiner": AI marking of a 15-mark answer against its scheme. Off unless EXAM_MARKING_ENABLED. */
export const POST = route(async (req, { params }: RouteContext<'/api/questions/[id]/mark'>) => {
  const user = await requireUser('Sign in to get your answer marked.');
  enforceRateLimit(`mark:user:${user.id}`, { limit: 5, windowMs: 60_000 }, (s) => `Please wait ${s}s before marking again.`);
  const { id } = await params;
  const { code } = await readJson(req);
  return markAnswer(user.id, id, code);
});
