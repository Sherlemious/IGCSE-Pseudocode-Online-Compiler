import { forbidden } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { createPayForToken } from '@/modules/billing/parentPay';
import { SITE_URL } from '@/shared/lib/seo';

/** A link the signed-in student sends to whoever pays for their pass (`/pay/<token>`). */
export const POST = route(async () => {
  const user = await requireUser('Sign in first.');
  if (user.role === 'TEACHER') throw forbidden('Parent links are for student accounts.');
  return { url: `${SITE_URL}/pay/${createPayForToken(user.id)}` };
});
