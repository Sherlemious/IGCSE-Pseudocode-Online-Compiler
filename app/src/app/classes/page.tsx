import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getEntitlements } from '@/lib/entitlements';
import { GraduationCap, Users, ArrowRight, School } from 'lucide-react';
import CreateClassForm from '@/components/classes/CreateClassForm';

export const metadata: Metadata = {
  title: 'My Classes',
  description: 'Create a class, invite your students by link, and track their pseudocode practice.',
  robots: { index: false, follow: false },
};

export default async function ClassesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/classes');
  const userId = session.user.id;

  const [owned, enrolled, entitlements] = await Promise.all([
    prisma.class.findMany({
      where: { ownerId: userId, archived: false },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, joinCode: true, _count: { select: { memberships: true } } },
    }),
    prisma.classMembership.findMany({
      where: { userId, class: { archived: false } },
      orderBy: { joinedAt: 'desc' },
      select: { class: { select: { id: true, name: true, owner: { select: { name: true } } } } },
    }),
    getEntitlements(userId),
  ]);

  const canCreate = owned.length < entitlements.limits.maxClasses;

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center animate-glow-pulse">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="display-serif text-2xl font-semibold text-light-text">My Classes</h1>
            <p className="text-xs text-dark-text mt-0.5">Invite students by link and keep your class in one place</p>
          </div>
        </div>

        {/* Create a class */}
        <div className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-5 mb-8 card-glow animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <h2 className="mono-label text-light-text mb-3">Create a class</h2>
          <CreateClassForm canCreate={canCreate} maxClasses={entitlements.limits.maxClasses} />
        </div>

        {/* Teaching */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <h2 className="mono-label text-dark-text mb-3 px-1">
            Teaching{owned.length > 0 && ` · ${owned.length}`}
          </h2>
          {owned.length === 0 ? (
            <p className="text-sm text-dark-text/70 px-1 py-4">You&apos;re not teaching any classes yet. Create one above.</p>
          ) : (
            <div className="space-y-2 stagger-children">
              {owned.map((c) => (
                <Link
                  key={c.id}
                  href={`/classes/${c.id}`}
                  className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3.5
                    hover:border-primary/30 hover:bg-surface/80 transition-all duration-200 group"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-light-text truncate">{c.name}</span>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-dark-text font-mono">
                      <span className="flex items-center gap-1"><Users size={11} />{c._count.memberships} student{c._count.memberships === 1 ? '' : 's'}</span>
                      <span className="text-dark-text/50">code {c.joinCode}</span>
                    </div>
                  </div>
                  <ArrowRight size={15} className="shrink-0 text-dark-text/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Enrolled */}
        {enrolled.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <h2 className="mono-label text-dark-text mb-3 px-1">Enrolled · {enrolled.length}</h2>
            <div className="space-y-2 stagger-children">
              {enrolled.map(({ class: c }) => (
                <Link
                  key={c.id}
                  href={`/classes/${c.id}`}
                  className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3.5
                    hover:border-primary/30 hover:bg-surface/80 transition-all duration-200 group"
                >
                  <School size={15} className="text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-light-text truncate">{c.name}</span>
                    {c.owner?.name && <p className="text-[11px] text-dark-text/60 mt-0.5">Taught by {c.owner.name}</p>}
                  </div>
                  <ArrowRight size={15} className="shrink-0 text-dark-text/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
