'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';

/**
 * Runs inside both PostHogProvider and SessionWrapper.
 * - Identifies authenticated users so all their events are linked in PostHog.
 * - Fires `user_authenticated` once per browser session (sessionStorage guard)
 *   so the conversion funnel can distinguish sign-in from page reloads.
 * - Calls ph.reset() on sign-out to start a fresh anonymous person.
 */
export default function SessionIdentifier() {
  const { data: session, status } = useSession();
  const ph = usePostHog();
  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!ph || status === 'loading') return;

    const userId = session?.user?.id;

    if (userId && prevUserIdRef.current !== userId) {
      // Identify the person so anonymous pre-auth events merge with the user
      ph.identify(userId, {
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        plan: session.user.plan,
      });

      // Fire conversion event once per browser session (not on every page reload)
      const storageKey = `ph_authed_${userId}`;
      if (!sessionStorage.getItem(storageKey)) {
        ph.capture('user_authenticated', {
          plan: session.user.plan,
        });
        sessionStorage.setItem(storageKey, '1');
      }

      prevUserIdRef.current = userId;
    } else if (!userId && prevUserIdRef.current) {
      // User just signed out — reset to a new anonymous person
      ph.capture('user_signed_out');
      ph.reset();
      prevUserIdRef.current = undefined;
    }
  }, [session, status, ph]);

  return null;
}
