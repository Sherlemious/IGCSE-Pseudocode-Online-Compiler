import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, CheckCircle, Crown } from 'lucide-react';
import { prisma } from '../../lib/prisma';
import { auth } from '../../lib/auth';

export const metadata: Metadata = {
  title: 'Practice Questions',
  description: 'Practice IGCSE pseudocode with autograded questions.',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: 'text-success',
  MEDIUM: 'text-warning',
  HARD: 'text-error',
};

const DIFFICULTY_BADGE: Record<string, string> = {
  EASY: 'bg-success/10 border-success/30 text-success',
  MEDIUM: 'bg-warning/10 border-warning/30 text-warning',
  HARD: 'bg-error/10 border-error/30 text-error',
};

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;

interface PageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function PracticePage({ searchParams }: PageProps) {
  const { topic: activeTopic } = await searchParams;
  const session = await auth();
  const isPremium = session?.user?.plan === 'PREMIUM';

  let questions: Awaited<ReturnType<typeof fetchQuestions>> = [];
  let progressMap: Map<string, { status: string; bestScore: number; totalTests: number }> = new Map();

  try {
    questions = await fetchQuestions();

    if (session?.user?.id) {
      const progress = await prisma.progress.findMany({
        where: { userId: session.user.id },
        select: { questionId: true, status: true, bestScore: true, totalTests: true },
      });
      progressMap = new Map(progress.map((p) => [p.questionId, p]));
    }
  } catch {
    // DB not yet configured — show placeholder
  }

  // Distinct topics (sorted)
  const topics = Array.from(
    new Set(questions.map((q) => q.topic).filter(Boolean) as string[]),
  ).sort();

  // Filter by topic
  const filtered = activeTopic
    ? questions.filter((q) => q.topic === activeTopic)
    : questions;

  // Group by difficulty
  const grouped = DIFFICULTIES.reduce(
    (acc, d) => {
      acc[d] = filtered.filter((q) => q.difficulty === d);
      return acc;
    },
    {} as Record<string, typeof filtered>,
  );

  // Stats
  const totalSolved = Array.from(progressMap.values()).filter((p) => p.status === 'SOLVED').length;
  const totalQuestions = questions.length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 bg-background text-light-text">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-xl font-bold">Practice Questions</h1>
            <p className="text-sm text-dark-text mt-1">
              Solve autograded pseudocode questions. Each submission is checked against hidden test cases.
            </p>
          </div>

          {/* Progress summary */}
          {session && totalQuestions > 0 && (
            <div className="shrink-0 text-right">
              <div className="text-2xl font-bold text-light-text">
                {totalSolved}<span className="text-dark-text text-base font-normal">/{totalQuestions}</span>
              </div>
              <div className="text-[10px] text-dark-text uppercase tracking-wider">solved</div>
              {totalSolved > 0 && (
                <div className="mt-1 w-24 h-1.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success transition-all"
                    style={{ width: `${(totalSolved / totalQuestions) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plan notice for free users */}
        {session && !isPremium && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warning/20 bg-warning/5 text-xs text-warning mb-4">
            <Crown size={13} className="shrink-0" />
            <span>
              Free plan — easy questions are fully available.{' '}
              <strong>Upgrade to Premium</strong> to unlock medium and hard questions.
            </span>
          </div>
        )}

        {/* Sign-in prompt */}
        {!session && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary mb-4">
            <Link href="/auth/signin" className="underline font-medium hover:text-light-text transition-colors">
              Sign in
            </Link>
            <span className="text-dark-text">to track your progress and unlock all questions.</span>
          </div>
        )}

        {/* Topic filter chips */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/practice"
              className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                !activeTopic
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'border-border text-dark-text hover:border-primary/40 hover:text-light-text'
              }`}
            >
              All
            </Link>
            {topics.map((t) => (
              <Link
                key={t}
                href={`/practice?topic=${encodeURIComponent(t)}`}
                className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                  activeTopic === t
                    ? 'bg-primary/20 border-primary/50 text-primary'
                    : 'border-border text-dark-text hover:border-primary/40 hover:text-light-text'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {questions.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center text-dark-text">
            <p className="text-sm">No questions yet. Add questions via the database.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center text-dark-text">
            <p className="text-sm">No questions match the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {DIFFICULTIES.map((d) => {
              const qs = grouped[d];
              if (qs.length === 0) return null;

              const isLocked = d !== 'EASY' && !isPremium;

              return (
                <div key={d}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold tracking-wider ${DIFFICULTY_COLOR[d]}`}>
                      {d}
                    </span>
                    <span className="text-xs text-dark-text">({qs.length})</span>
                    {isLocked && (
                      <span className="flex items-center gap-1 text-[10px] text-warning/70">
                        <Crown size={10} />
                        Premium
                      </span>
                    )}
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="space-y-2">
                    {qs.map((q) => {
                      const meta = [q.topic, q.year, q.paper].filter(Boolean).join(' \u00b7 ');
                      const progress = progressMap.get(q.id);
                      const solved = progress?.status === 'SOLVED';

                      return (
                        <Link
                          key={q.id}
                          href={isLocked ? '#' : `/practice/${q.id}`}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                            isLocked
                              ? 'border-border bg-surface/50 opacity-60 cursor-not-allowed'
                              : 'border-border bg-surface hover:border-primary/50 hover:bg-surface/80'
                          }`}
                          onClick={isLocked ? (e) => e.preventDefault() : undefined}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Progress indicator */}
                            {isLocked ? (
                              <Lock className="h-4 w-4 text-dark-text/40 shrink-0" />
                            ) : solved ? (
                              <CheckCircle className="h-4 w-4 text-success shrink-0" />
                            ) : progress ? (
                              <div className="h-4 w-4 rounded-full border-2 border-warning shrink-0" title="Attempted" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-border shrink-0" />
                            )}

                            <div className="min-w-0">
                              <div className="font-medium text-light-text truncate">{q.title}</div>
                              {meta && (
                                <div className="text-xs text-dark-text mt-0.5">{meta}</div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4 shrink-0">
                            {progress && !isLocked && (
                              <span className="text-[10px] text-dark-text">
                                {progress.bestScore}/{progress.totalTests}
                              </span>
                            )}
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFFICULTY_BADGE[q.difficulty] ?? 'border-border text-dark-text'}`}
                            >
                              {q.difficulty}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchQuestions() {
  return prisma.question.findMany({
    select: { id: true, title: true, difficulty: true, topic: true, year: true, paper: true },
    orderBy: { title: 'asc' },
  });
}
