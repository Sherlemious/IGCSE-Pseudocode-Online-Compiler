'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { setInterpreterCapture } from '@/modules/interpreter/telemetry';

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
const isDev = process.env.NODE_ENV === 'development';

if (typeof window !== 'undefined' && key) {
  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: false, // handled manually below
    capture_pageleave: true, // still needed when pageviews are manual (bounce rate / session duration)
    // Frontend errors → PostHog Error Tracking ($exception). Console errors stay
    // off: React dev warnings and handled failures would drown the real crashes.
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    debug: isDev,
    opt_out_capturing_by_default: isDev, // no data collected in dev unless opted in
  });
  setInterpreterCapture((event, properties) => {
    posthog.capture(event, properties);
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!ph) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '');
    ph.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!key) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
