import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Clock, Trophy, ArrowRight } from 'lucide-react';
import ExamConfigForm from '@/components/exam/ExamConfigForm';

export const metadata: Metadata = { title: 'Exam Simulation' };

export default async function ExamPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const isPremium = session.user.plan === 'PREMIUM';

  // Get available topics
  const topics = await prisma.question.findMany({
    where: isPremium ? {} : { difficulty: 'EASY' },
    select: { topic: true },
    distinct: ['topic'],
  });
  const topicList = topics.map((t) => t.topic).filter(Boolean) as string[];

  // Recent attempts
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
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-light-text">Exam Simulation</h1>
            <p className="text-xs text-dark-text">Timed practice with randomly selected questions</p>
          </div>
        </div>

        {/* Config form */}
        <div className="bg-surface border border-border rounded-lg p-5 mb-6">
          <h2 className="text-sm font-semibold text-light-text mb-4">Configure Exam</h2>
          <ExamConfigForm topics={topicList} isPremium={isPremium} />
        </div>

        {/* Recent attempts */}
        {recentAttempts.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-light-text mb-3">Recent Exams</h2>
            <div className="space-y-2">
              {recentAttempts.map((a) => (
                <Link
                  key={a.id}
                  href={a.status === 'IN_PROGRESS' ? `/exam/${a.id}` : `/exam/${a.id}/results`}
                  className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      a.status === 'IN_PROGRESS' ? 'bg-warning animate-pulse' :
                      a.status === 'COMPLETED' ? 'bg-success' : 'bg-error'
                    }`} />
                    <div>
                      <div className="text-xs font-medium text-light-text">
                        {a.questionCount} questions · {a.timeLimitMin} min
                        {a.topic && ` · ${a.topic}`}
                        {a.difficulty && ` · ${a.difficulty}`}
                      </div>
                      <div className="text-[10px] text-dark-text">
                        {new Date(a.startedAt).toLocaleDateString()} · {a.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.score !== null && (
                      <div className="flex items-center gap-1 text-xs">
                        <Trophy size={12} className="text-warning" />
                        <span className="text-light-text">{a.score}/{a.totalTests}</span>
                      </div>
                    )}
                    <ArrowRight size={14} className="text-dark-text group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
