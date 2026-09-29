import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '@/shared/db';
import { SITE_URL } from './resend';

/**
 * Proof that a password signup owns its email address. Until a user has
 * `emailVerified`, their password is treated as unproven: linking Google to
 * that email clears it (see `hardenOAuthLink`), which stops someone from
 * pre-registering a victim's email and keeping a password into the account.
 *
 * Tokens reuse NextAuth's VerificationToken table under a `verify-email:`
 * identifier and are stored hashed, so a leaked row can't be replayed.
 */

const IDENTIFIER_PREFIX = 'verify-email:';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/** Create a single-use link that marks `email` as verified. */
export async function createEmailVerificationUrl(email: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  await prisma.verificationToken.create({
    data: {
      identifier: IDENTIFIER_PREFIX + email,
      token: hashToken(token),
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  const params = new URLSearchParams({ email, token });
  return `${SITE_URL}/api/auth/verify-email?${params}`;
}

/** Redeem a verification link. Returns false when it is unknown or expired. */
export async function consumeEmailVerificationToken(email: string, token: string): Promise<boolean> {
  const where = {
    identifier_token: { identifier: IDENTIFIER_PREFIX + email, token: hashToken(token) },
  };
  const row = await prisma.verificationToken.findUnique({ where });
  if (!row) return false;
  await prisma.verificationToken.delete({ where });
  if (row.expires.getTime() < Date.now()) return false;
  await prisma.user.updateMany({
    where: { email, emailVerified: null },
    data: { emailVerified: new Date() },
  });
  return true;
}

/**
 * Runs whenever an OAuth account is linked to a user (new or existing). The
 * provider has proven the email, so mark it verified; if the user also has a
 * password that was never verified, drop it, because whoever chose it may not
 * own this mailbox. Returns true when a password was cleared.
 */
export async function hardenOAuthLink(userId: string, providerVerifiedEmail: boolean): Promise<boolean> {
  if (!providerVerifiedEmail) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true, password: true },
  });
  if (!user || user.emailVerified) return false;
  const hadPassword = Boolean(user.password);
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date(), ...(hadPassword ? { password: null } : {}) },
  });
  return hadPassword;
}
