import { route } from '@/shared/http/route';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { markFeedbackSeen } from '@/modules/classes/feedback';

/** The student opened their results, so their teacher's feedback is no longer new. */
export const POST = route(async (_req, { params }: RouteContext<'/api/exam/[examId]/feedback-seen'>) => {
  const user = await requireUser();
  enforceRateLimit(`feedback-seen:${user.id}`, { limit: 60, windowMs: 10 * 60_000 });
  const { examId } = await params;
  return markFeedbackSeen(user.id, examId);
});
