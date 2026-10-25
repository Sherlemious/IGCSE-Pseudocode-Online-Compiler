import { NextResponse } from 'next/server';
import { route } from '@/shared/http/route';
import { optionalUser } from '@/modules/auth/guards';
import { setExamSitting } from '@/modules/auth/userRepo';
import { isSitting } from '@/modules/onboarding/sittings';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';

/**
 * One-tap answer from the "which exam are you sitting?" email: each button
 * links here. Signed out → sign in first and come back. Signed in → save the
 * sitting, send the same `exam_sitting_set` the in-app card sends (the May/June
 * pass workflow triggers on it), and land on /sitting. A link scanner without
 * the session cookie only ever reaches the sign-in redirect, so it changes nothing.
 */
export const GET = route(async (req, { params }: RouteContext<'/api/me/sitting/[choice]'>) => {
  const { choice } = await params;
  const url = new URL(req.url);
  if (!isSitting(choice)) return NextResponse.redirect(new URL('/', url), 303);

  const user = await optionalUser();
  if (!user) {
    const back = `${url.pathname}${url.search}`;
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${encodeURIComponent(back)}`, url), 303);
  }

  await setExamSitting(user.id, choice);
  await captureServerEvent(user.id, 'exam_sitting_set', {
    sitting: choice,
    source: url.searchParams.get('from') === 'sitting_email' ? 'email' : 'link',
    $set: { exam_sitting: choice },
  });
  return NextResponse.redirect(new URL(`/sitting?s=${choice}`, url), 303);
});
