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

  try {
    const portal = await paddle.customerPortalSessions.create(
      user.paddleCustomerId,
      user.paddleSubscriptionId ? [user.paddleSubscriptionId] : [],
    );
    const url = portal?.urls?.general?.overview;
    if (url) return NextResponse.redirect(url);
  } catch (err) {
    console.error('[paddle/portal] failed to create portal session', err);
  }
  return NextResponse.redirect(new URL('/pricing?portal=error', req.url));
}
