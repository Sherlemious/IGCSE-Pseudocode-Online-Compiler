import { NextResponse } from 'next/server';
import { parseSignupRole, SIGNUP_ROLE_COOKIE, signupRoleCookieOptions } from '@/modules/auth/signupRole';

/** Stash the signup role so Google OAuth createUser can apply it. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const role = parseSignupRole((body as { role?: unknown } | null)?.role);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(SIGNUP_ROLE_COOKIE, role, signupRoleCookieOptions());
  return res;
}
