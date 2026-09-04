import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { normalizeShareCode } from '@/shared/lib/shareCode';
import { resolveTier, limitsFor } from '@/modules/billing/entitlements';
import { GraduationCap, User, AlertCircle, Check } from 'lucide-react';
import JoinClassButton from '@/modules/classes/JoinClassButton';

export const metadata: Metadata = {
  title: 'Join Class',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ code: string }>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 60%)' }}
      />
      <div className="max-w-md mx-auto relative pt-8">{children}</div>
    </div>
  );
}

function NotAvailable({ message }: { message: string }) {
  return (
    <Shell>
      <div className="bg-surface rounded-xl border border-border p-8 text-center animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-5 w-5 text-dark-text" />
        </div>
        <h1 className="display-serif text-xl font-semibold text-light-text mb-2">Class not available</h1>
        <p className="text-sm text-dark-text mb-6">{message}</p>
        <Link
          href="/classes"
          className="inline-flex items-center px-4 py-2.5 rounded-lg border border-border text-sm text-light-text hover:border-primary/40 hover:text-primary transition-colors"
        >
          Go to my classes
        </Link>
      </div>
    </Shell>
  );
}

export default async function JoinClassLandingPage({ params }: Props) {
  const { code } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/c/${code}`)}`);
  }

  const cls = await prisma.class.findFirst({
    where: { joinCode: normalizeShareCode(code), archived: false },
    select: {
      id: true,
      name: true,
      ownerId: true,
      owner: { select: { name: true, plan: true, trialEndsAt: true } },
      _count: { select: { memberships: true } },
      memberships: { where: { userId: session.user.id }, select: { id: true } },
    },
  });

  if (!cls) {
    return <NotAvailable message="We couldn't find a class for this link or code. Double-check it with your teacher." />;
  }

  const isOwner = cls.ownerId === session.user.id;
  const alreadyMember = cls.memberships.length > 0;
  const isFull = cls._count.memberships >= limitsFor(resolveTier(cls.owner)).maxStudentsPerClass;

  return (
    <Shell>
      <div className="bg-surface rounded-xl border border-border p-8 text-center animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-5 animate-glow-pulse">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>

        <p className="mono-label text-dark-text mb-1">You&apos;re joining</p>
        <h1 className="display-serif text-2xl font-semibold text-light-text mb-4">{cls.name}</h1>

        {cls.owner?.name && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-dark-text/70 mb-6">
            <User size={12} />
            Taught by {cls.owner.name}
          </div>
        )}

        {isOwner ? (
          <Link href={`/classes/${cls.id}`} className="block w-full px-4 py-3 rounded-lg border border-border text-sm text-light-text hover:border-primary/40 hover:text-primary transition-colors">
            This is your class — manage it
          </Link>
        ) : alreadyMember ? (
          <Link href="/classes" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-border text-sm text-light-text hover:border-primary/40 transition-colors">
            <Check size={15} className="text-primary" />
            You&apos;re already in this class
          </Link>
        ) : isFull ? (
          <div className="text-xs text-warning bg-warning/8 border border-warning/20 rounded-lg px-3.5 py-2.5">
            This class is full. Ask your teacher to make room.
          </div>
        ) : (
          <JoinClassButton joinCode={normalizeShareCode(code)} />
        )}
      </div>
    </Shell>
  );
}
