import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CodeDetails from '@/components/classes/CodeDetails';

export const metadata: Metadata = {
  title: 'Assignment results',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ classId: string; assignmentId: string }>;
}

export default async function AssignmentResultsPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');
  const { classId, assignmentId } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      classId: true,
      exam: { select: { title: true } },
      class: {
        select: {
          ownerId: true,
          name: true,
          memberships: {
            orderBy: { joinedAt: 'asc' },
            select: { userId: true, user: { select: { name: true, email: true } } },
          },
        },
      },
    },
  });
  if (!assignment || assignment.classId !== classId || assignment.class.ownerId !== session.user.id) notFound();

  const attempts = await prisma.examAttempt.findMany({
    where: { assignmentId },
    orderBy: { createdAt: 'desc' },
    select: {
      userId: true,
      status: true,
      score: true,
      totalTests: true,
      answers: {
        orderBy: { sortOrder: 'asc' },
        select: { code: true, passCount: true, totalTests: true, question: { select: { title: true } } },
      },
    },
  });
  const latestByUser = new Map<string, (typeof attempts)[number]>();
  for (const at of attempts) {
    if (!latestByUser.has(at.userId)) latestByUser.set(at.userId, at);
  }

  const members = assignment.class.memberships;
  const submitted = members.filter((m) => {
    const at = latestByUser.get(m.userId);
    return at && at.status !== 'IN_PROGRESS';
  }).length;

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)' }} />
      <div className="max-w-2xl mx-auto relative animate-fade-in-up">
        <Link href={`/classes/${classId}`} className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-primary transition-colors mb-6">
          <ArrowLeft size={13} />
          {assignment.class.name}
        </Link>

        <div className="mb-8">
          <h1 className="display-serif text-2xl font-semibold text-light-text">{assignment.exam.title}</h1>
          <p className="text-[11px] text-dark-text/60 mt-1 font-mono">{submitted}/{members.length} submitted</p>
        </div>

        {members.length === 0 ? (
          <p className="text-sm text-dark-text/70 px-1 py-6 text-center">No students have joined this class yet.</p>
        ) : (
          <div className="space-y-2">
            {members.map((m) => {
              const at = latestByUser.get(m.userId);
              const done = at && at.status !== 'IN_PROGRESS';
              return (
                <div key={m.userId} className="bg-surface border border-border rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/classes/${classId}/students/${m.userId}`} className="text-sm font-medium text-light-text truncate hover:text-primary transition-colors">
                      {m.user.name || m.user.email || 'Student'}
                    </Link>
                    <span className="shrink-0 text-xs font-mono flex items-center gap-1.5">
                      {done ? (
                        <><CheckCircle2 size={13} className="text-primary" /><span className="text-primary">{at!.score ?? 0}/{at!.totalTests ?? 0}</span></>
                      ) : at ? (
                        <><Clock size={13} className="text-warning" /><span className="text-warning">In progress</span></>
                      ) : (
                        <><Circle size={13} className="text-dark-text/40" /><span className="text-dark-text/50">Not started</span></>
                      )}
                    </span>
                  </div>
                  {at && at.answers.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 border-t border-border/50 pt-2.5">
                      {at.answers.map((ans, i) => (
                        <CodeDetails key={i} label={`${ans.question.title} — ${ans.passCount}/${ans.totalTests}`} code={ans.code} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
