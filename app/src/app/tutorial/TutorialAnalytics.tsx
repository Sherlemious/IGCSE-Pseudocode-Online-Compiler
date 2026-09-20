'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { captureEvent } from '@/modules/interpreter/analytics';

function arrivalSource(): string {
  if (typeof window === 'undefined') return 'direct';
  const from = new URLSearchParams(window.location.search).get('from');
  if (from) return from.slice(0, 80);
  try {
    if (!document.referrer) return 'direct';
    const ref = new URL(document.referrer);
    if (ref.host === window.location.host) {
      return ref.pathname === '/' ? 'compiler' : ref.pathname.slice(0, 80);
    }
    return ref.host.slice(0, 80);
  } catch {
    return 'referrer';
  }
}

export function TutorialTracker() {
  const { status } = useSession();
  const fired = useRef(false);

  useEffect(() => {
    if (status === 'loading' || fired.current) return;
    fired.current = true;
    captureEvent('tutorial_viewed', {
      signed_in: status === 'authenticated',
      from: arrivalSource(),
    });
  }, [status]);

  return null;
}

export function TutorialCtaLink({
  href,
  destination,
  source,
  children,
  className,
}: {
  href: string;
  destination: string;
  source: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => captureEvent('tutorial_cta_clicked', { destination, source })}
    >
      {children}
    </Link>
  );
}
