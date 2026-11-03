import { NextResponse } from 'next/server';
import { route } from '@/shared/http/route';
import { optionalUser } from '@/modules/auth/guards';
import { isPartner, isPartnerSurface, partnerDestination } from '@/modules/partners/partners';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';

/**
 * Tracked outbound hop for partner placements: records `partner_referral_sent`
 * server-side (counts even when the browser blocks PostHog), then 302s to the
 * partner's UTM-tagged URL. Unknown partners go home.
 */
export const GET = route(async (req, { params }: RouteContext<'/api/out/[partner]'>) => {
  const { partner } = await params;
  const url = new URL(req.url);
  if (!isPartner(partner)) return NextResponse.redirect(new URL('/', url), 303);

  const raw = url.searchParams.get('s');
  const surface = isPartnerSurface(raw) ? raw : null;
  const user = await optionalUser();
  if (user) {
    await captureServerEvent(user.id, 'partner_referral_sent', {
      partner,
      surface,
      role: user.role,
      $set_once: { [`referred_to_${partner}_at`]: new Date().toISOString() },
    });
  }
  return NextResponse.redirect(partnerDestination(partner, surface), 302);
});
