import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { listProgress } from '@/modules/practice/repo';

export const GET = route(async () => {
  const user = await requireUser();
  const [progress, premiumAccess] = await Promise.all([
    listProgress(user.id),
    PREMIUM_GATING_ENABLED ? getPremiumAccess(user.id) : Promise.resolve(true),
  ]);
  return {
    premiumAccess,
    progress: progress.map((row) => ({ ...row, updatedAt: row.updatedAt.toISOString() })),
  };
});
