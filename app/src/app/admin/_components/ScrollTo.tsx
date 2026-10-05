'use client';

import { useEffect } from 'react';

/** Scroll the admin `<main>` so a newly opened detail isn't left below the fold. */
export default function ScrollTo({ id, token }: { id: string; token: string }) {
  useEffect(() => {
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }, [id, token]);
  return null;
}
