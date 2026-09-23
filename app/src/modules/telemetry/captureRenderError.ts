'use client';

import posthog from 'posthog-js';

/**
 * Reports an error caught by a Next.js error boundary. React swallows these, so
 * PostHog's unhandled-error autocapture never sees them.
 */
export function captureRenderError(error: Error & { digest?: string }, boundary: 'segment' | 'global') {
  if (!posthog.__loaded) return;
  posthog.captureException(error, {
    boundary,
    digest: error.digest,
    path: window.location.pathname,
  });
}
