import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Braces } from 'lucide-react';
import RolePicker from './RolePicker';

export const metadata: Metadata = {
  title: 'Welcome',
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roleChosen: true, name: true },
  });
  // Already picked a role (or the account vanished) — nothing to ask here.
  if (!user || user.roleChosen) redirect('/practice');

  const firstName = user.name?.trim().split(/\s+/)[0] ?? null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid p-3 sm:p-4 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(var(--color-primary-rgb), 0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative min-h-full flex items-start sm:items-center justify-center py-4 sm:py-6">
        <div className="w-full max-w-md relative animate-fade-in-up">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-glow-pulse">
              <Braces className="h-5 w-5 sm:h-6 sm:w-6 text-primary" strokeWidth={2} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-light-text tracking-tight">
              {firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
            </h1>
            <p className="text-sm text-dark-text mt-1.5">One quick thing — how will you use this?</p>
          </div>

          <RolePicker />
        </div>
      </div>
    </div>
  );
}
