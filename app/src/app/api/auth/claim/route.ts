import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { clientIp, enforceRateLimit } from '@/shared/http/rateLimit';
import { claimAccount, resendClaimEmail } from '@/modules/auth/accountClaim';

/**
 * Set the password on an account a purchase created (`/auth/claim` form), or,
 * with `{ resend: true, email }`, email a fresh link. The client signs in with
 * the new password right after.
 */
export const POST = route(async (req) => {
  enforceRateLimit(`claim:${clientIp(req)}`, { limit: 20, windowMs: 15 * 60_000 },
    'Too many attempts from this network. Please wait a few minutes and try again.');
  const body = await readJson(req);
  if (body.resend === true) {
    await resendClaimEmail(body.email);
    return { ok: true };
  }
  return claimAccount({ email: body.email, token: body.token, password: body.password });
});
