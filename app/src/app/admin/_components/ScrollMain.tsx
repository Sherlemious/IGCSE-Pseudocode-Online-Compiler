'use client';

import { useEffect } from 'react';

/**
 * Admin pages scroll inside `<main>`, so a new page of results would otherwise
 * stay wherever the previous view had been scrolled.
 */
export default function ScrollMain({ token }: { token: string }) {
  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0 });
  }, [token]);
  return null;
}
