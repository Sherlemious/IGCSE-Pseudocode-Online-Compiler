/**
 * Browser-side record that this account has picked a role.
 *
 * The session's `roleChosen` comes from the JWT, which is refreshed from the
 * DB. A read through a caching pool (Hyperdrive caches SELECTs and never
 * invalidates them on write) can hand the refresh the pre-pick row, so the
 * JWT keeps saying "not chosen" for up to an hour and the gate bounced every
 * page through /onboarding. Once the role POST succeeds, the browser knows
 * better than that token, so the gate trusts this mark.
 */
const key = (userId: string) => `role_chosen:${userId}`;

export function markRoleChosen(userId: string | undefined): void {
  if (!userId) return;
  try {
    localStorage.setItem(key(userId), '1');
  } catch {
    /* storage blocked: the gate still redirects at most once per tab */
  }
}

export function hasMarkedRoleChosen(userId: string | undefined): boolean {
  if (!userId) return false;
  try {
    return localStorage.getItem(key(userId)) === '1';
  } catch {
    return false;
  }
}
