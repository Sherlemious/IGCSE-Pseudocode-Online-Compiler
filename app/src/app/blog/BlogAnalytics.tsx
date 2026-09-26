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

/** `blog_viewed` once per page view. `slug` is the post, or `index` (+ `page`) for the list. */
export function BlogTracker({ slug, page }: { slug: string; page?: number }) {
  const { status } = useSession();
  const fired = useRef(false);

  useEffect(() => {
    if (status === 'loading' || fired.current) return;
    fired.current = true;
    captureEvent('blog_viewed', {
      slug,
      ...(page ? { page } : {}),
      signed_in: status === 'authenticated',
      from: arrivalSource(),
    });
  }, [status, slug, page]);

  return null;
}

/** A tracked link out of a post (`blog_cta_clicked`). */
export function BlogLink({
  href,
  slug,
  source,
  children,
  className,
}: {
  href: string;
  slug: string;
  source: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => captureEvent('blog_cta_clicked', { slug, destination: href.slice(0, 80), source })}
    >
      {children}
    </Link>
  );
}
