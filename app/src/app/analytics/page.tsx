import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BarChart3 } from 'lucide-react';
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

  // Fetch all data in parallel
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

  // Summary stats
  const totalAttempted = progressData.length;
  const totalSolved = progressData.filter((p) => p.status === 'SOLVED').length;
  const totalAttempts = progressData.reduce((s, p) => s + p.attempts, 0);
  const examsCompleted = examData.filter((e) => e.status !== 'IN_PROGRESS').length;

  // Difficulty breakdown
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

  // Topic breakdown
  const topicMap: Record<string, { attempted: number; solved: number }> = {};
  progressData.forEach((p) => {
    const t = p.question.topic || 'Uncategorized';
    if (!topicMap[t]) topicMap[t] = { attempted: 0, solved: 0 };
    topicMap[t].attempted++;
    if (p.status === 'SOLVED') topicMap[t].solved++;
  });

  // Recent activity (last 10)
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
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-light-text">Analytics</h1>
            <p className="text-xs text-dark-text">Your practice and exam performance</p>
          </div>
        </div>

        <SummaryCards
          totalQuestions={totalQuestions}
          totalAttempted={totalAttempted}
          totalSolved={totalSolved}
          totalAttempts={totalAttempts}
          examsCompleted={examsCompleted}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
      </div>
    </div>
  );
}
