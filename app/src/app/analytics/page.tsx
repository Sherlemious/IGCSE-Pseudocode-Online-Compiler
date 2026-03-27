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

export const metadata: Metadata = { title: 'Analytics' };

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

  const recentActivity = progressData.slice(0, 10).map((p) => ({
    questionTitle: p.question.title,
    difficulty: p.question.difficulty,
    status: p.status,
    bestScore: p.bestScore,
    totalTests: p.totalTests,
    attempts: p.attempts,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center animate-glow-pulse">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-light-text tracking-tight">Analytics</h1>
            <p className="text-xs text-dark-text mt-0.5">Your practice and exam performance</p>
          </div>
        </div>

        {totalAttempted === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-primary/60" />
            </div>
            <h2 className="text-lg font-semibold text-light-text mb-2">No activity yet</h2>
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
