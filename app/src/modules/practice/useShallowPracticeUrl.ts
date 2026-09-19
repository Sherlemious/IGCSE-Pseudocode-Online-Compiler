'use client';

import { useCallback, useEffect, useState } from 'react';
import { buildPracticeUrl, type PracticeNavigate } from './filterUtils';

/**
 * Keep filter query strings in the URL for sharing, but use history.pushState
 * so changing facets does not trigger a Next.js RSC refetch / Vercel invocation.
 */
export function useShallowPracticeUrl() {
  const [queryString, setQueryString] = useState('');

  useEffect(() => {
    const sync = () => setQueryString(window.location.search.replace(/^\?/, ''));
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const navigate: PracticeNavigate = useCallback((overrides, mode = 'push') => {
    const next = buildPracticeUrl(
      window.location.search.replace(/^\?/, ''),
      overrides,
    );
    if (mode === 'replace') window.history.replaceState(window.history.state, '', next);
    else window.history.pushState(window.history.state, '', next);
    setQueryString(next.includes('?') ? next.slice(next.indexOf('?') + 1) : '');
  }, []);

  const clearAll = useCallback(() => {
    window.history.pushState(window.history.state, '', '/practice');
    setQueryString('');
  }, []);

  return { queryString, navigate, clearAll };
}
