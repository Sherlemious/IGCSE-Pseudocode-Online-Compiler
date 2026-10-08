import bcrypt from 'bcryptjs';
import { badRequest, conflict } from '@/shared/http/errors';
import { SITE_NAME } from '@/shared/lib/seo';
import { getResend, FROM_ADDRESS } from './resend';
import { welcomeEmailHtml, welcomeEmailText } from './emails/welcome';
import { createEmailVerificationUrl } from './emailVerification';
import { createPasswordUser, findUserByEmail } from './userRepo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// bcrypt only reads the first 72 bytes; anything longer is a mistake or abuse.
const MAX_PASSWORD_LENGTH = 72;
const MAX_NAME_LENGTH = 60;

/** Email/password signup: validate, create the account, send the welcome + verify email. */
export async function signUpWithPassword(input: { name: unknown; email: unknown; password: unknown; role: unknown }) {
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) throw badRequest('Enter a valid email address.');
  const password = input.password;
  if (typeof password !== 'string' || password.length < 8) throw badRequest('Password must be at least 8 characters.');
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw badRequest(`Password must be at most ${MAX_PASSWORD_LENGTH} characters.`);
  }
  // Only student/teacher are self-selectable at signup — ADMIN is never granted here.
  const role = input.role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
  const name = typeof input.name === 'string' ? input.name.trim().slice(0, MAX_NAME_LENGTH) || null : null;

  if (await findUserByEmail(email)) {
    // Covers a prior email signup as well as an OAuth-first account on this email.
    throw conflict('An account with this email already exists. Try signing in — with Google if that is how you joined.');
  }

  const user = await createPasswordUser({ name, email, passwordHash: await bcrypt.hash(password, 12), role });

  // Welcome email (best-effort). The adapter's `createUser` event only fires for
  // OAuth signups, so credentials signups get theirs here, with the verify link.
  const resend = getResend();
  if (resend && user.email) {
    const displayName = user.name ?? 'Student';
    try {
      const verifyUrl = await createEmailVerificationUrl(user.email);
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: user.email,
        subject: `Welcome to the ${SITE_NAME}`,
        html: welcomeEmailHtml(displayName, { verifyUrl }),
        text: welcomeEmailText(displayName, { verifyUrl }),
      });
    } catch {
      // non-critical — never block signup on email
    }
  }
  return user;
}
