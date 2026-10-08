/**
 * `emailTrusted` must be true for an ADMIN_EMAILS match to count: anyone can
 * register an unused address with a password, so an unproven email never
 * grants admin (see `emailTrusted` in auth.ts).
 */
export function isAdmin(
  email: string | null | undefined,
  role?: string | null,
  emailTrusted?: boolean,
): boolean {
  if (role === 'ADMIN') return true;
  if (!email || !emailTrusted) return false;
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}
