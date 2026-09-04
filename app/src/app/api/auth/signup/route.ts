import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/shared/db';
import { getResend, FROM_ADDRESS } from '@/modules/auth/resend';
import { welcomeEmailHtml, welcomeEmailText } from '@/modules/auth/emails/welcome';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
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
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
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
  const resend = getResend();
  if (resend && user.email) {
    const displayName = user.name ?? 'Student';
    await resend.emails
      .send({
        from: FROM_ADDRESS,
        to: user.email,
        subject: 'Welcome to the IGCSE Pseudocode Compiler',
        html: welcomeEmailHtml(displayName),
        text: welcomeEmailText(displayName),
      })
      .catch(() => {}); // non-critical — never block signup on email
  }

  return NextResponse.json({ ok: true });
}
