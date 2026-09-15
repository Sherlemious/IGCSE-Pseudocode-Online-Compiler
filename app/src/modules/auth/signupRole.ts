export const SIGNUP_ROLE_COOKIE = 'pending_signup_role';

export type SignupRole = 'STUDENT' | 'TEACHER';

export function parseSignupRole(value: unknown): SignupRole {
  return value === 'TEACHER' ? 'TEACHER' : 'STUDENT';
}

export function signupRoleCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 10 * 60,
    secure: process.env.NODE_ENV === 'production',
  };
}

export async function rememberSignupRole(role: SignupRole) {
  await fetch('/api/auth/signup-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
}
