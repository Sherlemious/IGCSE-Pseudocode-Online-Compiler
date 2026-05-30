export function isAdmin(email: string | null | undefined, role?: string | null): boolean {
  if (role === 'ADMIN') return true;
  if (!email) return false;
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}
