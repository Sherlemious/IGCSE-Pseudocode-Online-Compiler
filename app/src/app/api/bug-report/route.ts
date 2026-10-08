import { route } from '@/shared/http/route';
import { oneOf, optionalText, readJson, requiredText } from '@/shared/http/input';
import { enforceRateLimit, requesterKey } from '@/shared/http/rateLimit';
import { optionalUser } from '@/modules/auth/guards';
import { createBugReport } from '@/modules/feedback/repo';

const CATEGORIES = ['bug', 'suggestion', 'other'] as const;

export const POST = route(async (req) => {
  const user = await optionalUser();
  enforceRateLimit(`bug-report:${requesterKey(req, user?.id)}`, { limit: 5, windowMs: 10 * 60_000 },
    "You've sent several reports already. Please wait a few minutes before sending another.");
  const body = await readJson(req, 'Invalid payload');

  await createBugReport({
    userId: user?.id ?? null,
    // Prefer the account email; fall back to one typed by a signed-out visitor.
    email: user?.email ?? optionalText(body.email, 320),
    category: oneOf(body.category, CATEGORIES) ?? 'bug',
    description: requiredText(body.description, 5000, 'Invalid payload'),
    code: optionalText(body.code, 20000),
    output: optionalText(body.output, 20000),
    pageUrl: optionalText(body.pageUrl, 500),
    userAgent: optionalText(body.userAgent, 500),
  });
  return { ok: true };
});
