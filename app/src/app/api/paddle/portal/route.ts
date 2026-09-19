import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { getPaddleServer } from '@/modules/billing/paddle/server';
import {
  isPaddleForbidden,
  paddleErrorAttrs,
  safeCustomerPortalFallbackUrl,
} from '@/modules/billing/paddle/portal';
import { logger } from '@/shared/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Redirects the signed-in customer to their Paddle customer portal — where they
 * can update their payment method, view invoices, and cancel. Requires a linked
 * paddleCustomerId (set by the subscription webhook); otherwise sends them to /pricing.
 *
 * Creating a session needs `customer_portal_session.write` on PADDLE_API_KEY.
 * If Paddle forbids that, we fall back to PADDLE_CUSTOMER_PORTAL_URL (magic-link
 * sign-in) when set, otherwise /pricing?portal=error.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { paddleCustomerId: true, paddleSubscriptionId: true },
  });

  const paddle = getPaddleServer();
  if (!paddle || !user?.paddleCustomerId) {
    return NextResponse.redirect(new URL('/pricing', req.url));
  }
  const customerId = user.paddleCustomerId;
  const subscriptionId = user.paddleSubscriptionId;

  // Open a portal session and return its general overview URL. From the overview
  // page the customer can update payment methods, view invoices, and
  // cancel/update their subscription — its auth token carries those scopes.
  const overviewUrl = async (subscriptionIds: string[]) => {
    const portal = await paddle.customerPortalSessions.create(customerId, subscriptionIds);
    return portal?.urls?.general?.overview ?? null;
  };

  const fail = (err?: unknown) => {
    if (err) {
      logger.error('[paddle/portal] failed to create portal session', paddleErrorAttrs(err));
    }
    const fallback = safeCustomerPortalFallbackUrl(process.env.PADDLE_CUSTOMER_PORTAL_URL);
    if (fallback) return NextResponse.redirect(fallback);
    const dest = new URL('/pricing', req.url);
    dest.searchParams.set('portal', 'error');
    return NextResponse.redirect(dest);
  };

  try {
    let url: string | null = null;

    // Prefer a session with a per-subscription deep link. Paddle currently
    // rejects this with a generic "Invalid request." even for valid, active,
    // correctly-owned subscriptions, so treat it as best-effort and fall back to
    // a plain overview session (which reliably works) rather than erroring out.
    // Skip the retry when the key is missing customer_portal_session.write —
    // the empty-array call fails the same way.
    if (subscriptionId) {
      try {
        url = await overviewUrl([subscriptionId]);
      } catch (err) {
        if (isPaddleForbidden(err)) return fail(err);
        logger.warn('[paddle/portal] subscription deep-link session failed, falling back to overview', {
          ...paddleErrorAttrs(err),
        });
      }
    }
    if (!url) url = await overviewUrl([]);
    if (url) return NextResponse.redirect(url);
    logger.error('[paddle/portal] session created but returned no overview URL');
    return fail();
  } catch (err) {
    return fail(err);
  }
}
