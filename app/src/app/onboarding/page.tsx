import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import RolePicker from './RolePicker';
import { safeCallback } from '@/modules/auth/callback';
import { LogoBadge } from '@/shared/brand';

export const metadata: Metadata = {
  title: 'Welcome',
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roleChosen: true, name: true, role: true },
  });
  if (!user) redirect('/auth/signin');
  if (user.roleChosen || user.role === 'TEACHER' || user.role === 'ADMIN') {
    const teacherHome = user.role === 'TEACHER' || user.role === 'ADMIN' ? '/classes' : '/practice';
    redirect(safeCallback(callbackUrl, teacherHome));
  }

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
            <LogoBadge size={64} animate className="mx-auto mb-3 sm:mb-4" />
            <h1 className="text-lg sm:text-xl font-bold text-light-text tracking-tight">
              {firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
            </h1>
            <p className="text-sm text-dark-text mt-1.5">One quick thing — how will you use this?</p>
          </div>

          <RolePicker callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
