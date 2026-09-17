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

/** Fires `compare_viewed` once the session status is known. */
export function CompareTracker({ questionCount }: { questionCount: number | null }) {
  const { status } = useSession();
  const fired = useRef(false);

  useEffect(() => {
    if (status === 'loading' || fired.current) return;
    fired.current = true;
    captureEvent('compare_viewed', {
      signed_in: status === 'authenticated',
      from: arrivalSource(),
      question_count: questionCount,
    });
  }, [status, questionCount]);

  return null;
}

export function CompareCtaLink({
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
      onClick={() => captureEvent('compare_cta_clicked', { destination, source })}
    >
      {children}
    </Link>
  );
}

export function CompareSectionLink({
  href,
  section,
  children,
  className,
}: {
  href: string;
  section: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => captureEvent('compare_section_clicked', { section })}
    >
      {children}
    </a>
  );
}
