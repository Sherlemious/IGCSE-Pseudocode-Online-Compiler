import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/modules/auth/auth';
import { isAdmin } from '@/modules/admin/isAdmin';
import { CATALOG_TAGS } from '@/shared/lib/catalogCache';

/**
 * Run after `npm run db:seed` / `db:seed:pricing` without a redeploy: drops cached
 * questions, examples and pricing tiers, and the ISR pages built from them.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(session.user.email, session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  revalidateTag(CATALOG_TAGS.questions, { expire: 0 });
  revalidateTag(CATALOG_TAGS.examples, { expire: 0 });
  revalidateTag('pricing-tiers', { expire: 0 });
  return NextResponse.json({ revalidated: [...Object.values(CATALOG_TAGS), 'pricing-tiers'] });
}
