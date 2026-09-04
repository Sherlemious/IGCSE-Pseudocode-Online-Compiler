'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

/**
 * Slim, site-wide legal + contact bar. Mounted once in the root layout (not
 * per-page) so Terms/Privacy/Refund/Contact stay reachable from every route —
 * including pages that don't render the compiler's own status-bar Footer —
 * which Paddle's checkout domain approval requires.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const ph = usePostHog();

  const trackNav = useCallback(
    (destination: string) => {
      ph?.capture('nav_clicked', { destination, from: pathname });
    },
    [ph, pathname],
  );

  return (
    <footer className="shrink-0 h-6 bg-header-bg border-t border-border flex items-center justify-center select-none">
      <nav
        aria-label="Legal and contact"
        className="flex items-center gap-3 text-[11px] text-header-text/40 font-mono"
      >
        <Link href="/terms" onClick={() => trackNav('terms')} className="hover:text-primary transition-colors">
          Terms
        </Link>
        <Link href="/privacy" onClick={() => trackNav('privacy')} className="hover:text-primary transition-colors">
          Privacy
        </Link>
        <Link href="/refund" onClick={() => trackNav('refund')} className="hover:text-primary transition-colors">
          Refunds
        </Link>
        <Link href="/contact" onClick={() => trackNav('contact')} className="hover:text-primary transition-colors">
          Contact
        </Link>
      </nav>
    </footer>
  );
}
