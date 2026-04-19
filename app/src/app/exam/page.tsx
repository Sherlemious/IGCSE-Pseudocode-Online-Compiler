import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PREMIUM_GATING_ENABLED } from '@/lib/featureFlags';
import { Clock, Trophy, ArrowRight, Hourglass } from 'lucide-react';
import ExamConfigForm from '@/components/exam/ExamConfigForm';

export const metadata: Metadata = {
  title: 'IGCSE Pseudocode Exam Simulator — Timed Practice',
  description:
    'Simulate a timed IGCSE Computer Science exam. Choose your topic, difficulty, and duration. Get scored results with per-question pass/fail feedback.',
};

export default async function ExamPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const isPremium = session.user.plan === 'PREMIUM';
  const hasFullAccess = isPremium || !PREMIUM_GATING_ENABLED;

  const topics = await prisma.question.findMany({
    where: hasFullAccess ? {} : { difficulty: 'EASY' },
    select: { topic: true },
    distinct: ['topic'],
  });
  const topicList = topics.map((t) => t.topic).filter(Boolean) as string[];

  const recentAttempts = await prisma.examAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: 'desc' },
    take: 5,
    select: {
      id: true,
      topic: true,
      difficulty: true,
      questionCount: true,
      timeLimitMin: true,
      status: true,
      score: true,
      totalTests: true,
      startedAt: true,
    },
  });

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center animate-glow-pulse">
            <Hourglass className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-light-text tracking-tight">Exam Simulation</h1>
            <p className="text-xs text-dark-text mt-0.5">Timed practice with randomly selected questions</p>
          </div>
        </div>

        {/* Config form */}
        <div
          className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 mb-6 card-glow animate-fade-in-up"
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Clock size={14} className="text-primary" />
            <h2 className="mono-label text-light-text">Configure Exam</h2>
          </div>
          <ExamConfigForm
            topics={topicList}
            hasFullAccess={hasFullAccess}
            premiumGatingEnabled={PREMIUM_GATING_ENABLED}
          />
        </div>

        {/* Recent attempts */}
        {recentAttempts.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <h2 className="mono-label text-dark-text mb-3 px-1">Recent Exams</h2>
            <div className="space-y-2 stagger-children">
              {recentAttempts.map((a) => {
                const pct = a.totalTests && a.totalTests > 0 ? Math.round(((a.score ?? 0) / a.totalTests) * 100) : null;
                return (
                  <Link
                    key={a.id}
                    href={a.status === 'IN_PROGRESS' ? `/exam/${a.id}` : `/exam/${a.id}/results`}
                    className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3
                      hover:border-primary/30 hover:bg-surface/80 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ring-2 ring-offset-1 ring-offset-surface ${
                          a.status === 'IN_PROGRESS'
                            ? 'bg-warning ring-warning/30 animate-pulse'
                            : a.status === 'COMPLETED'
                              ? 'bg-success ring-success/30'
                              : 'bg-error ring-error/30'
                        }`}
                      />
                      <div>
                        <div className="text-xs font-medium text-light-text">
                          {a.questionCount} questions &middot; {a.timeLimitMin} min
                          {a.topic && <span className="text-dark-text"> &middot; {a.topic}</span>}
                        </div>
                        <div className="text-[10px] text-dark-text font-mono">
                          {new Date(a.startedAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          &middot; {a.status.replace('_', ' ').toLowerCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {pct !== null && (
                        <div className="flex items-center gap-1.5">
                          <Trophy size={12} className="text-warning" />
                          <span
                            className={`text-xs font-bold font-mono ${pct >= 70 ? 'text-success' : pct >= 40 ? 'text-warning' : 'text-error'}`}
                          >
                            {pct}%
                          </span>
                        </div>
                      )}
                      <ArrowRight
                        size={14}
                        className="text-dark-text/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
