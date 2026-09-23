'use client';

import { useEffect } from 'react';
import { captureRenderError } from '@/modules/telemetry/captureRenderError';

// Replaces the root layout, so globals.css and the theme aren't loaded: inline the One Dark colours.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    captureRenderError(error, 'global');
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          background: '#282C34',
          color: '#ABB2BF',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <title>Something went wrong</title>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 20, margin: 0 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#828997' }}>We&apos;ve been notified. Please try again.</p>
          <button
            onClick={() => retry()}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              border: 0,
              borderRadius: 6,
              background: '#61AFEF',
              color: '#111318',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
