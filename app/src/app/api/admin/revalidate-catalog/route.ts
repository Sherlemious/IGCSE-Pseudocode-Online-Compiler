import { revalidateTag } from 'next/cache';
import { route } from '@/shared/http/route';
import { requireAdmin } from '@/modules/auth/guards';
import { CATALOG_TAGS } from '@/shared/lib/catalogCache';

/**
 * Run after `npm run db:seed` / `db:seed:pricing` without a redeploy: drops cached
 * questions, examples and pricing tiers, and the ISR pages built from them.
 */
export const POST = route(async () => {
  await requireAdmin();
  revalidateTag(CATALOG_TAGS.questions, { expire: 0 });
  revalidateTag(CATALOG_TAGS.examples, { expire: 0 });
  revalidateTag('pricing-tiers', { expire: 0 });
  return { revalidated: [...Object.values(CATALOG_TAGS), 'pricing-tiers'] };
});
