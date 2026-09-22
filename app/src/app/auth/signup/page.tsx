import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/modules/auth/auth';
import SignupPanel from '@/modules/auth/SignupPanel';
import { authHref, safeCallback } from '@/modules/auth/callback';
import { LogoBadge } from '@/shared/brand';

export const metadata: Metadata = {
  title: 'Sign Up',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignUpPage({ searchParams }: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const callback = safeCallback(callbackUrl, '');
  const redirectTo = callback || '/onboarding';
  const session = await auth();
  if (session?.user?.id) redirect(callback || '/');

  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid p-3 sm:p-4 relative
        scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
        scrollbar-track-background scrollbar-thumb-rounded-full"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
        <div className="w-full max-w-sm relative animate-fade-in-up">
          <div className="text-center mb-6 sm:mb-8">
            <LogoBadge size={64} animate className="mx-auto mb-3 sm:mb-4" />
            <h1 className="text-lg sm:text-xl font-bold text-light-text tracking-tight">Create your account</h1>
          </div>

          <div
            className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-5 sm:p-6 card-glow"
            style={{ animationDelay: '100ms' }}
          >
            <SignupPanel callbackUrl={callback} redirectTo={redirectTo} />

            <p className="text-[10px] sm:text-[11px] leading-relaxed text-dark-text/70 mt-3 sm:mt-4 text-center">
              By creating an account, you agree to our{' '}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="text-xs text-dark-text/60 text-center mt-4 sm:mt-5">
            Already have an account?{' '}
            <Link href={authHref('signin', callback)} className="text-primary hover:text-primary-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
