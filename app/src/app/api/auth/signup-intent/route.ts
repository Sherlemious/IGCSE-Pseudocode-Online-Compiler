import { NextResponse } from 'next/server';
import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { parseSignupRole, SIGNUP_ROLE_COOKIE, signupRoleCookieOptions } from '@/modules/auth/signupRole';

/** Stash the signup role so Google OAuth createUser can apply it. */
export const POST = route(async (req) => {
  const role = parseSignupRole((await readJson(req)).role);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(SIGNUP_ROLE_COOKIE, role, signupRoleCookieOptions());
  return res;
});
