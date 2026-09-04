import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ClipboardList, Dumbbell, CheckCircle2, Circle, Clock } from 'lucide-react';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import CodeDetails from '@/modules/classes/CodeDetails';

export const metadata: Metadata = {
  title: 'Student progress',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ classId: string; studentId: string }>;
}

export default async function StudentProgressPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');
  const { classId, studentId } = await params;

  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      ownerId: true,
      name: true,
      assignments: { orderBy: { createdAt: 'desc' }, select: { id: true, exam: { select: { title: true } } } },
      memberships: { where: { userId: studentId }, select: { userId: true } },
    },
  });
  if (!cls || cls.ownerId !== session.user.id || cls.memberships.length === 0) notFound();

  const student = await prisma.user.findUnique({ where: { id: studentId }, select: { name: true, email: true } });
  if (!student) notFound();

  const assignmentIds = cls.assignments.map((a) => a.id);

  const [attempts, progress] = await Promise.all([
    assignmentIds.length
      ? prisma.examAttempt.findMany({
          where: { userId: studentId, assignmentId: { in: assignmentIds } },
          orderBy: { createdAt: 'desc' },
          select: {
            assignmentId: true,
            status: true,
            score: true,
            totalTests: true,
            answers: {
              orderBy: { sortOrder: 'asc' },
              select: { code: true, passCount: true, totalTests: true, question: { select: { title: true } } },
            },
          },
        })
      : Promise.resolve([]),
    prisma.progress.findMany({
      where: { userId: studentId },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        status: true,
        bestScore: true,
        totalTests: true,
        attempts: true,
        lastCode: true,
        question: { select: { title: true } },
      },
    }),
  ]);

  const latestByAssignment = new Map<string, (typeof attempts)[number]>();
  for (const at of attempts) {
    if (at.assignmentId && !latestByAssignment.has(at.assignmentId)) latestByAssignment.set(at.assignmentId, at);
  }

  const solvedCount = progress.filter((p) => p.status === 'SOLVED').length;

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)' }} />
      <div className="max-w-2xl mx-auto relative animate-fade-in-up">
        <Link href={`/classes/${classId}`} className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-primary transition-colors mb-6">
          <ArrowLeft size={13} />
          {cls.name}
        </Link>

        <div className="mb-8">
          <h1 className="display-serif text-2xl font-semibold text-light-text">{student.name || student.email || 'Student'}</h1>
          {student.name && student.email && <p className="text-xs text-dark-text mt-0.5">{student.email}</p>}
          <p className="text-[11px] text-dark-text/60 mt-1 font-mono">{solvedCount} practice question{solvedCount === 1 ? '' : 's'} solved</p>
        </div>

        {/* Assignment results */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <ClipboardList size={14} className="text-dark-text" />
            <h2 className="mono-label text-dark-text">Assigned work</h2>
          </div>
          {cls.assignments.length === 0 ? (
            <p className="text-sm text-dark-text/70 px-1 py-3">No work assigned to this class yet.</p>
          ) : (
            <div className="space-y-2">
              {cls.assignments.map((a) => {
                const at = latestByAssignment.get(a.id);
                const done = at && at.status !== 'IN_PROGRESS';
                return (
                  <div key={a.id} className="bg-surface border border-border rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-light-text truncate">{a.exam.title}</span>
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

        {/* Practice progress */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Dumbbell size={14} className="text-dark-text" />
            <h2 className="mono-label text-dark-text">Practice{progress.length > 0 && ` · ${progress.length}`}</h2>
          </div>
          {progress.length === 0 ? (
            <p className="text-sm text-dark-text/70 px-1 py-3">No practice attempts yet.</p>
          ) : (
            <div className="space-y-2">
              {progress.map((p, i) => (
                <div key={i} className="bg-surface border border-border rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-light-text truncate">{p.question.title}</span>
                    <span className="shrink-0 text-xs font-mono flex items-center gap-1.5">
                      {p.status === 'SOLVED' ? (
                        <><CheckCircle2 size={13} className="text-primary" /><span className="text-primary">Solved</span></>
                      ) : (
                        <span className="text-dark-text/70">{p.bestScore}/{p.totalTests}</span>
                      )}
                      <span className="text-dark-text/40">· {p.attempts} tries</span>
                    </span>
                  </div>
                  <div className="mt-2.5 border-t border-border/50 pt-2.5">
                    <CodeDetails label="Latest submission" code={p.lastCode} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
