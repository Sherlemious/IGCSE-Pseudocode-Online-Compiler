import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/shared/db';
import { getResend, FROM_ADDRESS } from '@/modules/auth/resend';
import { welcomeEmailHtml, welcomeEmailText } from '@/modules/auth/emails/welcome';
import { createEmailVerificationUrl } from '@/modules/auth/emailVerification';
import { SITE_NAME } from '@/shared/lib/seo';
import { clientIp, limitRequest } from '@/shared/lib/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// bcrypt only reads the first 72 bytes; anything longer is a mistake or abuse.
const MAX_PASSWORD_LENGTH = 72;

export async function POST(req: Request) {
  // Per IP, and generous: a whole class often signs up from one school address.
  const limited = limitRequest(
    `signup:${clientIp(req)}`,
    { limit: 40, windowMs: 15 * 60_000 },
    'Too many sign-ups from this network. Please wait a few minutes and try again.',
  );
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { name, email, password, role } = (body ?? {}) as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at most ${MAX_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }

  // Only student/teacher are self-selectable at signup — ADMIN is never granted here.
  const chosenRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
  const cleanName = name?.trim() || null;

  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    // Covers a prior email signup as well as an OAuth-first account on this email.
    return NextResponse.json(
      {
        error:
          'An account with this email already exists. Try signing in — with Google if that is how you joined.',
      },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      password: hashed,
      role: chosenRole,
      roleChosen: true, // picked in the signup form; no onboarding step needed
    },
    select: { id: true, email: true, name: true },
  });

  // Welcome email (best-effort). The adapter's `createUser` event only fires for
  // OAuth signups, so credentials signups get their welcome email from here.
  // It also carries the link that verifies the address (see emailVerification.ts).
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

  return NextResponse.json({ ok: true });
}
