import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoBadge } from '@/shared/brand';
import ClaimForm from '@/modules/auth/ClaimForm';

export const metadata: Metadata = {
  title: 'Set your password',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ email?: string; token?: string }>;
}

/** Landing point of the "your plan is ready, set your password" email. */
export default async function ClaimPage({ searchParams }: Props) {
  const { email = '', token = '' } = await searchParams;
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid p-4">
      <div className="flex min-h-full items-start justify-center py-6 sm:items-center">
        <div className="w-full max-w-sm text-center">
          <LogoBadge size={64} animate className="mx-auto mb-4" />
          <h1 className="text-xl font-bold tracking-tight text-light-text">Your plan is ready</h1>
          <p className="mt-1.5 mb-6 text-sm text-dark-text">
            Set a password for the account we made with the email you paid with.
          </p>
          <div className="rounded-2xl border border-border bg-surface/80 p-5 shadow-intense">
            <ClaimForm email={email.trim().toLowerCase()} token={token} />
          </div>
          <p className="mt-4 text-xs text-dark-text">
            Paid with a Google address?{' '}
            <Link href="/auth/signin?callbackUrl=%2Fwelcome" className="text-primary hover:text-primary-hover">
              Continue with Google
            </Link>{' '}
            instead.
          </p>
        </div>
      </div>
    </div>
  );
}
