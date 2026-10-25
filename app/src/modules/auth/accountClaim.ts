import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/shared/db';
import { badRequest } from '@/shared/http/errors';
import { logger } from '@/shared/lib/logger';
import { FROM_ADDRESS, getResend, SITE_URL } from './resend';
import { claimEmailHtml, claimEmailText } from './emails/claim';

/**
 * Accounts made by a purchase. A buyer who paid without signing in gets an
 * account on the email they paid with (the Paddle webhook creates it) and an
 * email with a one-time link to set a password. Opening that link proves they
 * own the address, so it also marks the email verified. Google sign-in on the
 * same address works too: Google links to an existing account by email.
 *
 * Tokens reuse NextAuth's VerificationToken table under a `claim-account:`
 * identifier and are stored hashed, like the email-verification links.
 */

const IDENTIFIER_PREFIX = 'claim-account:';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_PASSWORD_LENGTH = 72;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function createClaimUrl(email: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  await prisma.verificationToken.create({
    data: {
      identifier: IDENTIFIER_PREFIX + email,
      token: hashToken(token),
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return `${SITE_URL}/auth/claim?${new URLSearchParams({ email, token })}`;
}

/** Email the set-password link. Best-effort: the purchase stands either way. */
export async function sendClaimEmail(email: string, planLabel: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  try {
    const claimUrl = await createClaimUrl(email);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your ${planLabel} is ready: set your password`,
      html: claimEmailHtml({ planLabel, claimUrl, email }),
      text: claimEmailText({ planLabel, claimUrl, email }),
    });
    return true;
  } catch (err) {
    logger.error('Claim email failed', { error: String(err) });
    return false;
  }
}

/**
 * A new link for an account that still has no password and no Google login.
 * Always resolves the same way, so the form can't be used to probe which
 * emails have accounts.
 */
export async function resendClaimEmail(rawEmail: unknown): Promise<void> {
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  if (!email) return;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true, plan: true, _count: { select: { accounts: true } } },
  });
  if (!user || user.password || user._count.accounts > 0) return;
  await sendClaimEmail(email, user.plan === 'STUDENT' ? 'Student plan' : 'plan');
}

/** Redeem a claim link: set the password and mark the email verified. */
export async function claimAccount(input: { email: unknown; token: unknown; password: unknown }) {
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const token = typeof input.token === 'string' ? input.token : '';
  const password = input.password;
  if (typeof password !== 'string' || password.length < 8) throw badRequest('Password must be at least 8 characters.');
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw badRequest(`Password must be at most ${MAX_PASSWORD_LENGTH} characters.`);
  }
  if (!email || !token) throw badRequest('This link is not complete. Open it from the email again.');

  const where = { identifier_token: { identifier: IDENTIFIER_PREFIX + email, token: hashToken(token) } };
  const row = await prisma.verificationToken.findUnique({ where });
  if (!row || row.expires.getTime() < Date.now()) {
    if (row) await prisma.verificationToken.delete({ where });
    throw badRequest('This link has expired or was already used. Ask for a new one below.', 'CLAIM_EXPIRED');
  }
  await prisma.verificationToken.delete({ where });

  const updated = await prisma.user.updateMany({
    where: { email },
    data: { password: await bcrypt.hash(password, 12), emailVerified: new Date() },
  });
  if (updated.count === 0) throw badRequest('There is no account for this email.');
  return { ok: true, email };
}
