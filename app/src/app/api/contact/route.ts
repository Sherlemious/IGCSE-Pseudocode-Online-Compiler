import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { optionalText, readJson, requiredText } from '@/shared/http/input';
import { enforceRateLimit, requesterKey } from '@/shared/http/rateLimit';
import { optionalUser } from '@/modules/auth/guards';
import { createContactMessage } from '@/modules/feedback/repo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST = route(async (req) => {
  const user = await optionalUser();
  enforceRateLimit(`contact:${requesterKey(req, user?.id)}`, { limit: 5, windowMs: 10 * 60_000 },
    "You've sent several messages already. Please wait a few minutes before sending another.");
  const body = await readJson(req, 'A message is required');

  const message = requiredText(body.message, 5000, 'A message is required');
  // Always store the address they typed. A signed-in account email is only a
  // prefill in the form — the reply has to go where they asked.
  const email = optionalText(body.email, 320);
  if (!email || !EMAIL_RE.test(email)) throw badRequest('An email is required so we can reply');

  await createContactMessage({
    userId: user?.id ?? null,
    email,
    name: user?.name ?? optionalText(body.name, 120),
    subject: optionalText(body.subject, 200),
    message,
    pageUrl: optionalText(body.pageUrl, 500),
  });
  return { ok: true };
});
