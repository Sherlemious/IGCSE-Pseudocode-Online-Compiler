'use client';

import { useEffect } from 'react';
import { BEACON_URL, hostToReport } from './officialHost';

const SESSION_KEY = 'deployment-notice';

/** Asks the official site to record this hostname when the app is served from anywhere else. */
export default function DeploymentNotice() {
  useEffect(() => {
    const host = hostToReport(window.location.hostname, window.location.origin);
    if (!host) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === host) return;
      sessionStorage.setItem(SESSION_KEY, host);
    } catch {
      /* Private mode can block storage. Still send the one ping. */
    }
    const body = new Blob([JSON.stringify({ host })], { type: 'text/plain' });
    if (typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(BEACON_URL, body)) return;
    void fetch(BEACON_URL, { method: 'POST', body, keepalive: true, mode: 'no-cors' }).catch(() => undefined);
  }, []);

  return null;
}
