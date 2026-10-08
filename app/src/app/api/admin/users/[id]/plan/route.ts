import type { Plan } from '@prisma/client';
import { badRequest } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { oneOf, readJson } from '@/shared/http/input';
import { requireAdmin } from '@/modules/auth/guards';
import { setPlanByAdmin } from '@/modules/auth/userRepo';
import { revalidatePremiumAccess } from '@/modules/billing/entitlements';

const PLANS: readonly Plan[] = ['FREE', 'STUDENT', 'STARTER', 'PRO', 'SCHOOL'];

export const PATCH = route(async (req, { params }: RouteContext<'/api/admin/users/[id]/plan'>) => {
  await requireAdmin();
  const { id } = await params;
  const plan = oneOf((await readJson(req)).plan, PLANS);
  if (!plan) throw badRequest('Invalid plan');
  const user = await setPlanByAdmin(id, plan);
  revalidatePremiumAccess(id);
  return { user };
});
