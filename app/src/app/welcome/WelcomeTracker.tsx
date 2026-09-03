'use client';

import { useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';

/**
 * Fires the post-checkout landing event once. Rendered on `/welcome`, which
 * Paddle redirects to on a successful checkout (with a `_ptxn` transaction
 * param). Renders nothing.
 */
export default function WelcomeTracker() {
  const ph = usePostHog();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!ph || firedRef.current) return;
    firedRef.current = true;
    const transaction =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('_ptxn')
        : null;
    ph.capture('checkout_success_viewed', { transaction: transaction ?? null });
  }, [ph]);

  return null;
}
