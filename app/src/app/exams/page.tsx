import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { FileStack, Plus, ArrowRight, Clock, ListChecks, Users, KeyRound } from 'lucide-react';
import JoinExamForm from '@/modules/exams/JoinExamForm';

export const metadata: Metadata = {
  title: 'My Exams — Create & Share Pseudocode Exams',
  description: 'Create reusable Cambridge pseudocode exams and share them with your students via a link or join code.',
  robots: { index: false, follow: false },
};

export default async function MyExamsPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const exams = await prisma.exam.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      timeLimitMin: true,
      shareCode: true,
      isPublished: true,
      updatedAt: true,
      _count: { select: { questions: true, attempts: true } },
    },
  });

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center animate-glow-pulse">
              <FileStack className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="display-serif text-2xl font-semibold text-light-text">My Exams</h1>
              <p className="text-xs text-dark-text mt-0.5">Create reusable exams and share them with your students</p>
            </div>
          </div>
          <Link
            href="/exams/new"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary
              text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all
              shadow-[0_0_20px_-4px_rgba(var(--color-primary-rgb),0.4)]"
          >
            <Plus size={15} />
            New exam
          </Link>
        </div>

        {/* Join an exam */}
        <div
          className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-5 mb-8 card-glow animate-fade-in-up"
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <KeyRound size={14} className="text-primary" />
            <h2 className="mono-label text-light-text">Have a code? Join an exam</h2>
          </div>
          <JoinExamForm />
        </div>

        {/* Exam list */}
        {exams.length === 0 ? (
          <div className="text-center py-14 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <p className="text-sm text-dark-text mb-1">You haven&apos;t created any exams yet.</p>
            <p className="text-xs text-dark-text/60 mb-5">Build one from the question bank and share it in seconds.</p>
            <Link
              href="/exams/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm
                text-light-text hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Plus size={15} />
              Create your first exam
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <h2 className="mono-label text-dark-text mb-3 px-1">{exams.length} exam{exams.length === 1 ? '' : 's'}</h2>
            <div className="space-y-2 stagger-children">
              {exams.map((e) => (
                <Link
                  key={e.id}
                  href={`/exams/${e.id}`}
                  className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3.5
                    hover:border-primary/30 hover:bg-surface/80 transition-all duration-200 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-light-text truncate">{e.title}</span>
                      {!e.isPublished && (
                        <span className="shrink-0 text-[9px] font-mono uppercase tracking-wide text-dark-text bg-background border border-border rounded px-1.5 py-0.5">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-dark-text font-mono">
                      <span className="flex items-center gap-1"><ListChecks size={11} />{e._count.questions} q</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{e.timeLimitMin}m</span>
                      <span className="flex items-center gap-1"><Users size={11} />{e._count.attempts} taken</span>
                      <span className="text-dark-text/50">code {e.shareCode}</span>
                    </div>
                  </div>
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-dark-text/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
