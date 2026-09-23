'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { captureRenderError } from '@/modules/telemetry/captureRenderError';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    captureRenderError(error, 'segment');
  }, [error]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-light-text">Something went wrong on this page</h1>
        <p className="mt-2 text-sm text-dark-text">
          We&apos;ve been notified. Trying again usually fixes it.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => retry()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
          >
            Try again
          </button>
          <Link href="/" className="rounded-md border border-border px-4 py-2 text-sm text-light-text hover:bg-surface">
            Back to the compiler
          </Link>
        </div>
      </div>
    </div>
  );
}
