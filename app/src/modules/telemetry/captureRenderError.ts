'use client';

import posthog from 'posthog-js';

const CHUNK_RELOAD_PREFIX = 'chunk_reload_';

function isChunkLoadError(error: Error): boolean {
  if (error.name === 'ChunkLoadError') return true;
  return /Loading chunk [^\s]+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    error.message || '',
  );
}

/**
 * Reports an error caught by a Next.js error boundary. React swallows these, so
 * PostHog's unhandled-error autocapture never sees them.
 *
 * When the failure is a stale-deploy ChunkLoadError, reload the page once per
 * path so the browser fetches the fresh manifest instead of stranding the user.
 */
export function captureRenderError(error: Error & { digest?: string }, boundary: 'segment' | 'global') {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  if (typeof window !== 'undefined' && isChunkLoadError(error)) {
    const key = `${CHUNK_RELOAD_PREFIX}${path}`;
    let alreadyReloaded = false;
    try {
      alreadyReloaded = sessionStorage.getItem(key) === '1';
      if (!alreadyReloaded) sessionStorage.setItem(key, '1');
    } catch {
      /* storage unavailable — don't loop */
      alreadyReloaded = true;
    }
    if (!alreadyReloaded) {
      if (posthog.__loaded) {
        posthog.capture('chunk_load_recovered', {
          boundary,
          path,
          error_name: error.name,
        });
      }
      window.location.reload();
      return;
    }
  }

  if (!posthog.__loaded) return;
  posthog.captureException(error, {
    boundary,
    digest: error.digest,
    path,
  });
}
