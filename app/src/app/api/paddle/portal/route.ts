import { NextResponse } from 'next/server';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { getPaddleServer } from '@/modules/billing/paddle/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Redirects the signed-in customer to their Paddle customer portal — where they
 * can update their payment method, view invoices, and cancel. Requires a linked
 * paddleCustomerId (set by the subscription webhook); otherwise sends them to /pricing.
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

  try {
    let url: string | null = null;

    // Prefer a session with a per-subscription deep link. Paddle currently
    // rejects this with a generic "Invalid request." even for valid, active,
    // correctly-owned subscriptions, so treat it as best-effort and fall back to
    // a plain overview session (which reliably works) rather than erroring out.
    if (subscriptionId) {
      try {
        url = await overviewUrl([subscriptionId]);
      } catch (err) {
        console.warn(
          '[paddle/portal] subscription deep-link session failed, falling back to overview',
          err,
        );
      }
    }
    if (!url) url = await overviewUrl([]);
    if (url) return NextResponse.redirect(url);
  } catch (err) {
    console.error('[paddle/portal] failed to create portal session', err);
  }
  return NextResponse.redirect(new URL('/pricing?portal=error', req.url));
}
