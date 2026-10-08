import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { getPremiumAccess } from '@/modules/billing/entitlements';
import { findProgress } from '@/modules/practice/repo';

export const GET = route(async (_req, { params }: RouteContext<'/api/questions/[id]/progress'>) => {
  const user = await requireUser();
  const { id } = await params;
  const [row, premiumAccess] = await Promise.all([
    findProgress(user.id, id),
    PREMIUM_GATING_ENABLED ? getPremiumAccess(user.id) : Promise.resolve(true),
  ]);
  return {
    lastCode: row?.lastCode ?? null,
    lastFlowchart: row?.lastFlowchart ?? null,
    status: row?.status ?? null,
    attempts: row?.attempts ?? 0,
    premiumAccess,
  };
});
