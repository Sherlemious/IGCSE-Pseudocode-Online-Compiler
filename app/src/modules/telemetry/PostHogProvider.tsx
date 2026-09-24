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
    if (event === 'interpreter_error' && !allowInterpreterError()) return;
    posthog.capture(event, properties);
  });
}

// One typo can cascade into dozens of ANTLR errors, each captured at once. Those
// bursts trip posthog-js's client rate limit (10/s), which then drops code_run /
// hint_shown too. The first error of a run drives the hint, so keep a few per second.
const ERROR_BURST_LIMIT = 3;
const ERROR_BURST_WINDOW_MS = 1000;
let errorWindowStart = 0;
let errorsInWindow = 0;

function allowInterpreterError(): boolean {
  const now = Date.now();
  if (now - errorWindowStart >= ERROR_BURST_WINDOW_MS) {
    errorWindowStart = now;
    errorsInWindow = 0;
  }
  errorsInWindow += 1;
  return errorsInWindow <= ERROR_BURST_LIMIT;
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!ph) return;
    // Absolute URL: heatmap ingestion rejects path-only $current_url (invalid_heatmap_data).
    const url = window.location.origin + pathname + (searchParams.toString() ? `?${searchParams}` : '');
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
