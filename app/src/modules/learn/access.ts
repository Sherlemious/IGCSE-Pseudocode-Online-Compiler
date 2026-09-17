import { isAdmin } from '@/modules/admin/isAdmin';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';

type SessionUser = {
  id?: string;
  email?: string | null;
  role?: string | null;
};

/**
 * Whether this visitor may play paid Paper 2 Path levels (4–10).
 * When `PREMIUM_GATING_ENABLED` is off, everyone is entitled (local/dev).
 * Admins bypass so the path can be playtested without a fake Paddle purchase.
 */
export async function resolveLearnPremiumAccess(
  user: SessionUser | null | undefined,
): Promise<boolean> {
  if (!PREMIUM_GATING_ENABLED) return true;
  if (!user?.id) return false;
  if (isAdmin(user.email, user.role)) return true;
  return getPremiumAccess(user.id);
}
