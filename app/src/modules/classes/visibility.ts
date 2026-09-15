/** Header / command-palette Classes link: teachers, admins, or anyone who owns a class. */
export function sessionShowsClasses(user?: { role?: string | null; ownsClass?: boolean | null } | null) {
  if (!user) return false;
  return user.role === 'TEACHER' || user.role === 'ADMIN' || Boolean(user.ownsClass);
}
