import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { clientIp, enforceRateLimit } from '@/shared/http/rateLimit';
import { signUpWithPassword } from '@/modules/auth/signup';

export const POST = route(async (req) => {
  // Per IP, and generous: a whole class often signs up from one school address.
  enforceRateLimit(`signup:${clientIp(req)}`, { limit: 40, windowMs: 15 * 60_000 },
    'Too many sign-ups from this network. Please wait a few minutes and try again.');
  const body = await readJson(req);
  await signUpWithPassword({ name: body.name, email: body.email, password: body.password, role: body.role });
  return { ok: true };
});
