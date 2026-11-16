import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { saveAnswerFeedback } from '@/modules/classes/feedback';

/** Write or clear (empty string) the teacher's feedback on one answer. Class owner only. */
export const PUT = route(async (req, { params }: RouteContext<'/api/classes/[classId]/answers/[answerId]/feedback'>) => {
  const user = await requireUser();
  enforceRateLimit(`class-feedback:${user.id}`, { limit: 60, windowMs: 10 * 60_000 });
  const { classId, answerId } = await params;
  const body = await readJson(req);
  return saveAnswerFeedback(user.id, classId, answerId, body.feedback);
});
