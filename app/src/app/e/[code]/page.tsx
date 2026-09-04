import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { normalizeShareCode } from '@/shared/lib/shareCode';
import { Hourglass, Clock, ListChecks, User, AlertCircle } from 'lucide-react';
import StartSharedExam from '@/modules/exams/StartSharedExam';

export const metadata: Metadata = {
  title: 'Join Exam',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ code: string }>;
}

function NotAvailable({ message }: { message: string }) {
  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <div className="max-w-md mx-auto pt-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-5 w-5 text-dark-text" />
        </div>
        <h1 className="display-serif text-xl font-semibold text-light-text mb-2">Exam not available</h1>
        <p className="text-sm text-dark-text mb-6">{message}</p>
        <Link
          href="/exams"
          className="inline-flex items-center px-4 py-2.5 rounded-lg border border-border text-sm text-light-text
            hover:border-primary/40 hover:text-primary transition-colors"
        >
          Go to exams
        </Link>
      </div>
    </div>
  );
}

export default async function JoinExamLandingPage({ params }: Props) {
  const { code } = await params;
  const session = await auth();
  if (!session) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/e/${code}`)}`);
  }

  const exam = await prisma.exam.findUnique({
    where: { shareCode: normalizeShareCode(code) },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimitMin: true,
      isPublished: true,
      owner: { select: { name: true } },
      _count: { select: { questions: true } },
    },
  });

  if (!exam) {
    return <NotAvailable message="We couldn't find an exam for this link or code. Double-check it with your instructor." />;
  }
  if (!exam.isPublished) {
    return <NotAvailable message="This exam has been closed by its owner and can no longer be started." />;
  }
  if (exam._count.questions === 0) {
    return <NotAvailable message="This exam doesn't have any questions yet." />;
  }

  const inProgress = await prisma.examAttempt.findFirst({
    where: { userId: session.user.id, examId: exam.id, status: 'IN_PROGRESS' },
    select: { id: true },
  });

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-md mx-auto relative pt-8">
        <div className="bg-surface rounded-xl border border-border p-8 text-center animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-5 animate-glow-pulse">
            <Hourglass className="h-5 w-5 text-primary" />
          </div>

          <h1 className="display-serif text-2xl font-semibold text-light-text mb-2">{exam.title}</h1>
          {exam.description && <p className="text-sm text-dark-text mb-4">{exam.description}</p>}

          <div className="flex items-center justify-center gap-5 text-xs text-dark-text font-mono mb-6">
            <span className="flex items-center gap-1.5"><ListChecks size={13} />{exam._count.questions} questions</span>
            <span className="flex items-center gap-1.5"><Clock size={13} />{exam.timeLimitMin} min</span>
          </div>

          {exam.owner?.name && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-dark-text/70 mb-6">
              <User size={12} />
              Shared by {exam.owner.name}
            </div>
          )}

          {inProgress && (
            <div className="text-xs text-warning bg-warning/8 border border-warning/20 rounded-lg px-3.5 py-2.5 mb-4">
              You have an attempt in progress — starting will take you back to it.
            </div>
          )}

          <StartSharedExam examId={exam.id} hasInProgress={!!inProgress} />

          <p className="text-[11px] text-dark-text/60 mt-4">
            The timer starts as soon as you begin. Make sure you&apos;re ready.
          </p>
        </div>
      </div>
    </div>
  );
}
