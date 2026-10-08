import { revalidateTag } from 'next/cache';
import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { optionalText, readJson, stringList } from '@/shared/http/input';
import { enforceRateLimit, requesterKey } from '@/shared/http/rateLimit';
import { optionalUser } from '@/modules/auth/guards';
import { createFeedback } from '@/modules/feedback/repo';
import { ADMIN_FEEDBACK_CACHE_TAG } from '@/app/admin/feedback/feedbackQuery';

export const POST = route(async (req) => {
  const user = await optionalUser();
  enforceRateLimit(`feedback:${requesterKey(req, user?.id)}`, { limit: 5, windowMs: 10 * 60_000 });
  const body = await readJson(req, 'Invalid payload');

  const rating = typeof body.rating === 'number' && Number.isInteger(body.rating) ? body.rating : 0;
  const tier = optionalText(body.tier, 40);
  if (rating < 1 || rating > 5 || !tier) throw badRequest('Invalid payload');

  await createFeedback({
    userId: user?.id ?? null,
    email: user?.email ?? null,
    rating,
    tier,
    tags: stringList(body.tags).slice(0, 20).map((t) => t.slice(0, 60)),
    comment: typeof body.comment === 'string' ? body.comment.slice(0, 5000) : null,
  });
  revalidateTag(ADMIN_FEEDBACK_CACHE_TAG, { expire: 0 });
  return { ok: true };
});
