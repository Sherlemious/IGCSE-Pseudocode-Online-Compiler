'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SKIP_PREFIXES = ['/onboarding', '/auth', '/api'];

/**
 * OAuth (Google) accounts default to student until they pick a role. Email
 * signup already sets roleChosen. Send anyone who skipped the picker to
 * /onboarding once, preserving the page they were heading to.
 */
export default function OnboardingGate() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  // /onboarding trusts the DB and bounces back; if the JWT is ever staler than
  // the DB the two would ping-pong forever, so redirect at most once per tab.
  const sent = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || session?.user?.roleChosen) return;
    if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;
    if (sent.current) return;
    sent.current = true;

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const here = `${pathname}${search}`;
    router.replace(`/onboarding?callbackUrl=${encodeURIComponent(here)}`);
  }, [pathname, router, session?.user?.roleChosen, status]);

  return null;
}
