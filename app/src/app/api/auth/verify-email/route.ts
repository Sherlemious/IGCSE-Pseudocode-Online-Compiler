import { NextResponse, type NextRequest } from 'next/server';
import { consumeEmailVerificationToken } from '@/modules/auth/emailVerification';
import { clientIp, limitRequest } from '@/shared/lib/rateLimit';
import { logger } from '@/shared/lib/logger';

/** Landing point of the "confirm this is your email" link in the welcome email. */
export async function GET(req: NextRequest) {
  const limited = limitRequest(`verify-email:${clientIp(req)}`, { limit: 20, windowMs: 10 * 60_000 });
  if (limited) return limited;

  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase();
  const token = req.nextUrl.searchParams.get('token');
  let ok = false;
  if (email && token) {
    try {
      ok = await consumeEmailVerificationToken(email, token);
    } catch (e) {
      logger.error('Email verification failed', { error: String(e) });
    }
  }
  const target = ok ? '/?email_verified=1' : '/auth/signin?error=EmailVerifyInvalid';
  return NextResponse.redirect(new URL(target, req.nextUrl.origin));
}
