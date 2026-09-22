'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';

/**
 * Fires the post-checkout landing event once. Rendered on `/welcome`, which
 * Paddle redirects to on a successful checkout (with a `_ptxn` transaction
 * param). Renders nothing.
 */
export default function WelcomeTracker() {
  const ph = usePostHog();
  const { update: updateSession } = useSession();
  const firedRef = useRef(false);
  const refreshedRef = useRef(false);

  useEffect(() => {
    if (!ph || firedRef.current) return;
    firedRef.current = true;
    const transaction =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('_ptxn')
        : null;
    ph.capture('checkout_success_viewed', { transaction: transaction ?? null });
  }, [ph]);

  // The plan the student just paid for lives in the JWT, which otherwise only
  // re-reads the database once an hour. Pull it forward so the new tier shows
  // up on this page rather than whenever the token happens to go stale.
  useEffect(() => {
    if (refreshedRef.current) return;
    refreshedRef.current = true;
    void updateSession({}); // an argument makes this a POST, firing the jwt `update` trigger
  }, [updateSession]);

  return null;
}
