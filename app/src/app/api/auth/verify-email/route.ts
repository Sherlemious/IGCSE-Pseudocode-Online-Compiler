import { NextResponse } from 'next/server';
import { route } from '@/shared/http/route';
import { clientIp, enforceRateLimit } from '@/shared/http/rateLimit';
import { consumeEmailVerificationToken } from '@/modules/auth/emailVerification';
import { logger } from '@/shared/lib/logger';

/** Landing point of the "confirm this is your email" link in the welcome email. */
export const GET = route(async (req) => {
  enforceRateLimit(`verify-email:${clientIp(req)}`, { limit: 20, windowMs: 10 * 60_000 });
  const url = new URL(req.url);
  const email = url.searchParams.get('email')?.trim().toLowerCase();
  const token = url.searchParams.get('token');
  let ok = false;
  if (email && token) {
    try {
      ok = await consumeEmailVerificationToken(email, token);
    } catch (e) {
      logger.error('Email verification failed', { error: String(e) });
    }
  }
  const target = ok ? '/?email_verified=1' : '/auth/signin?error=EmailVerifyInvalid';
  return NextResponse.redirect(new URL(target, url.origin));
});
