import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BarChart3, BookOpen, ArrowRight } from 'lucide-react';
import SummaryCards from '@/components/analytics/SummaryCards';
import DifficultyBreakdown from '@/components/analytics/DifficultyBreakdown';
import TopicBreakdown from '@/components/analytics/TopicBreakdown';
import RecentActivity from '@/components/analytics/RecentActivity';
import ExamHistory from '@/components/analytics/ExamHistory';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';

export const metadata: Metadata = {
  title: 'Analytics',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');
  const userId = session.user.id;

  const [progressData, examData, totalQuestions] = await Promise.all([
    prisma.progress.findMany({
      where: { userId },
      include: {
        question: { select: { difficulty: true, topic: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
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
        completedAt: true,
      },
    }),
    prisma.question.count(),
  ]);

  const totalAttempted = progressData.length;
  const totalSolved = progressData.filter((p) => p.status === 'SOLVED').length;
  const totalAttempts = progressData.reduce((s, p) => s + p.attempts, 0);
  const examsCompleted = examData.filter((e) => e.status !== 'IN_PROGRESS').length;

  const difficultyMap: Record<string, { attempted: number; solved: number }> = {
    EASY: { attempted: 0, solved: 0 },
    MEDIUM: { attempted: 0, solved: 0 },
    HARD: { attempted: 0, solved: 0 },
  };
  progressData.forEach((p) => {
    const d = p.question.difficulty;
    difficultyMap[d].attempted++;
    if (p.status === 'SOLVED') difficultyMap[d].solved++;
  });

  const topicMap: Record<string, { attempted: number; solved: number }> = {};
  progressData.forEach((p) => {
    const t = p.question.topic || 'Uncategorized';
    if (!topicMap[t]) topicMap[t] = { attempted: 0, solved: 0 };
    topicMap[t].attempted++;
    if (p.status === 'SOLVED') topicMap[t].solved++;
  });

  const activityByDate: Record<string, number> = {};
  progressData.forEach((p) => {
    const date = p.updatedAt.toISOString().split('T')[0];
    activityByDate[date] = (activityByDate[date] ?? 0) + 1;
  });
  examData.forEach((e) => {
    const date = e.startedAt.toISOString().split('T')[0];
    activityByDate[date] = (activityByDate[date] ?? 0) + 1;
  });

  const recentActivity = progressData.slice(0, 10).map((p) => ({
    questionTitle: p.question.title,
    difficulty: p.question.difficulty,
    status: p.status,
    bestScore: p.bestScore,
    totalTests: p.totalTests,
    attempts: p.attempts,
    updatedAt: p.updatedAt.toISOString(),
  }));

  // ── Report-card framing ──────────────────────────────────────────────────
  const solveRate = totalAttempted > 0 ? totalSolved / totalAttempted : 0;
  const overallPct = Math.round(solveRate * 100);
  const studentName = session.user.name ?? null;
  const remark =
    solveRate >= 0.85 ? 'Excellent — consistently strong, accurate work across your attempts.'
    : solveRate >= 0.65 ? 'Good progress. Keep the momentum and push into the harder questions.'
    : solveRate >= 0.4 ? 'Steady work. Revisit the weaker topics below to lift your solve rate.'
    : 'A start has been made — keep practising, and lean on the hints when you get stuck.';

  // Overall-mark ring geometry
  const RING = 76;
  const RING_STROKE = 6;
  const RING_R = (RING - RING_STROKE) / 2;
  const RING_C = 2 * Math.PI * RING_R;
  const RING_OFFSET = RING_C * (1 - overallPct / 100);
  const ringColor =
    overallPct >= 70 ? 'var(--color-success)' : overallPct >= 40 ? 'var(--color-warning)' : 'var(--color-error)';

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Report-card masthead */}
        <div className="relative mb-6 rounded-2xl border border-border bg-surface/60 p-6 overflow-hidden animate-fade-in-up">
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgba(var(--color-primary-rgb), 0.07), transparent 55%)' }}
          />
          <div className="relative flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="mono-label text-primary/70 mb-1.5 flex items-center gap-1.5">
                <BarChart3 size={11} className="shrink-0" />
                Progress report
              </div>
              <h1 className="display-serif text-[1.9rem] leading-tight font-semibold text-light-text">Report Card</h1>
              <p className="text-sm text-dark-text mt-1">
                Computer Science — Pseudocode
                {studentName && <> · <span className="text-light-text/80">{studentName}</span></>}
              </p>
            </div>

            {totalAttempted > 0 && (
              <div className="relative shrink-0 animate-scale-in" style={{ width: RING, height: RING }}>
                <svg width={RING} height={RING} className="-rotate-90">
                  <circle cx={RING / 2} cy={RING / 2} r={RING_R} fill="none" stroke="var(--color-border)" strokeWidth={RING_STROKE} />
                  <circle
                    cx={RING / 2}
                    cy={RING / 2}
                    r={RING_R}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_OFFSET}
                    style={{ animation: 'draw-progress 1s ease-out forwards' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="display-serif text-xl font-semibold leading-none" style={{ color: ringColor }}>{overallPct}%</span>
                  <span className="mono-label text-dark-text/60 mt-1">solved</span>
                </div>
              </div>
            )}
          </div>

          {totalAttempted > 0 && (
            <div className="relative mt-5 pt-4 border-t border-border/60">
              <div className="mono-label text-dark-text/55 mb-1">Remarks</div>
              <p className="display-serif italic text-base leading-snug text-light-text/85">{remark}</p>
            </div>
          )}
        </div>

        {totalAttempted === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-primary/60" />
            </div>
            <h2 className="display-serif text-xl font-semibold text-light-text mb-2">No activity yet</h2>
            <p className="text-sm text-dark-text max-w-xs mb-6">
              Attempt your first practice question to start tracking your progress here.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 text-primary font-medium text-sm hover:bg-primary/25 transition-colors group"
            >
              Try your first question
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ) : (
          <>
        <ActivityHeatmap activityByDate={activityByDate} />
        <SummaryCards
          totalQuestions={totalQuestions}
          totalAttempted={totalAttempted}
          totalSolved={totalSolved}
          totalAttempts={totalAttempts}
          examsCompleted={examsCompleted}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <DifficultyBreakdown data={difficultyMap} />
          <TopicBreakdown data={topicMap} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentActivity items={recentActivity} />
          <ExamHistory exams={examData.slice(0, 10).map((e) => ({
            ...e,
            startedAt: e.startedAt.toISOString(),
            completedAt: e.completedAt?.toISOString() ?? null,
          }))} />
        </div>
          </>
        )}
      </div>
    </div>
  );
}
