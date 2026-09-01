import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';
import { getEntitlements } from '@/lib/entitlements';
import ClassManager from '@/components/classes/ClassManager';

export const metadata: Metadata = {
  title: 'Class',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ classId: string }>;
}

export default async function ClassDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');
  const { classId } = await params;

  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      ownerId: true,
      name: true,
      joinCode: true,
      archived: true,
      memberships: {
        orderBy: { joinedAt: 'asc' },
        select: { userId: true, joinedAt: true, user: { select: { name: true, email: true } } },
      },
    },
  });

  if (!cls || cls.ownerId !== session.user.id || cls.archived) notFound();

  const { limits } = await getEntitlements(session.user.id);
  const members = cls.memberships.map((m) => ({
    userId: m.userId,
    name: m.user.name,
    email: m.user.email,
    joinedAt: m.joinedAt.toISOString(),
  }));

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)',
        }}
      />
      <div className="max-w-2xl mx-auto relative animate-fade-in-up">
        <Link href="/classes" className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-primary transition-colors mb-6">
          <ArrowLeft size={13} />
          All classes
        </Link>

        <ClassManager
          classId={classId}
          initialName={cls.name}
          joinCode={cls.joinCode}
          joinUrl={`${SITE_URL}/c/${cls.joinCode}`}
          maxStudents={Number.isFinite(limits.maxStudentsPerClass) ? limits.maxStudentsPerClass : null}
          members={members}
        />
      </div>
    </div>
  );
}
