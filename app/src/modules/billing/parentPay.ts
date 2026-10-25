import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * "Ask a parent to pay": a signed-in student gets a link (`/pay/<token>`) that
 * someone else opens on their own device and pays from. The pass must land on
 * the student, but the payer's email is the parent's, so the webhook can't use
 * the usual app_user_id-must-match-payer-email check. Instead the checkout
 * carries this token as custom data `pay_for`, and the webhook trusts the
 * student id only when the signature checks out.
 *
 * Token: `<userId>.<expiry, base36 ms>.<HMAC-SHA256, base64url, 22 chars>`.
 */

export const PAY_LINK_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function secret(): string {
  const value =
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== 'production' ? 'local-dev-auth-secret-change-me' : undefined);
  if (!value) throw new Error('AUTH_SECRET is not set');
  return value;
}

function sign(payload: string): string {
  return createHmac('sha256', `parent-pay:${secret()}`).update(payload).digest('base64url').slice(0, 22);
}

export function createPayForToken(userId: string, now: Date = new Date()): string {
  const payload = `${userId}.${(now.getTime() + PAY_LINK_TTL_MS).toString(36)}`;
  return `${payload}.${sign(payload)}`;
}

/** The student id the token was made for, or null if it is forged, malformed or expired. */
export function verifyPayForToken(token: unknown, now: Date = new Date()): string | null {
  if (typeof token !== 'string' || token.length > 200) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expiry, signature] = parts;
  if (!userId || !/^[a-z0-9]+$/i.test(userId) || !/^[a-z0-9]+$/.test(expiry)) return null;
  const expected = Buffer.from(sign(`${userId}.${expiry}`));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  if (parseInt(expiry, 36) < now.getTime()) return null;
  return userId;
}
