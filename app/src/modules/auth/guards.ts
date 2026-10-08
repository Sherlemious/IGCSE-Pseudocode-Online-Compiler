import type { Session } from 'next-auth';
import { auth } from './auth';
import { isAdmin } from '@/modules/admin/isAdmin';
import { forbidden, unauthorized } from '@/shared/http/errors';

/**
 * The auth layer for route handlers and server code. Each guard reads the
 * session once and throws an `HttpError` that `route()` turns into a 401/403,
 * so a handler can't forget the check or return a half-built response.
 */
export type SessionUser = Session['user'];

/** The signed-in user, or null for a visitor. */
export async function optionalUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user?.id ? session.user : null;
}

/** The signed-in user; a 401 otherwise. */
export async function requireUser(message = 'Unauthorized'): Promise<SessionUser> {
  const user = await optionalUser();
  if (!user) throw unauthorized(message);
  return user;
}

/** A signed-in admin (ADMIN role, or a proven ADMIN_EMAILS address); 401/403 otherwise. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!isAdmin(user.email, user.role, user.emailTrusted)) throw forbidden();
  return user;
}
