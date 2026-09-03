import type { Metadata } from 'next';
import Link from 'next/link';
import WelcomeTracker from './WelcomeTracker';

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Your subscription is confirmed.',
  // Post-checkout landing — not a page we want indexed.
  robots: { index: false, follow: false },
  alternates: { canonical: '/welcome' },
};

export default function WelcomePage() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <WelcomeTracker />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-8 shadow-intense">
          <p className="mono-label text-primary mb-3">Subscription confirmed</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">
            You&apos;re all set
          </h1>
          <p className="mt-3 text-sm text-dark-text leading-relaxed">
            Thanks for subscribing. Your plan is active — a receipt is on its way to your email.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/classes"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Go to my classes
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              Open the editor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
