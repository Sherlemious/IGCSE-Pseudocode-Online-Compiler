import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Lock, CheckCircle, Crown, FileText, ArrowRight } from 'lucide-react';
import { prisma } from '../../lib/prisma';
import { auth } from '../../lib/auth';
import { PREMIUM_GATING_ENABLED } from '../../lib/featureFlags';
import { PracticeFilters } from './PracticeFilters';

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
  searchParams: Promise<{ topic?: string; year?: string; session?: string; tag?: string; q?: string }>;
}

export default async function PracticePage({ searchParams }: PageProps) {
  const { topic: activeTopic, year: yearParam, session: activeSession, tag: activeTag, q: activeQ } = await searchParams;
  const activeYear = yearParam ? parseInt(yearParam, 10) : undefined;

  const session = await auth();
  const isPremium = session?.user?.plan === 'PREMIUM';
  const hasFullAccess = isPremium || !PREMIUM_GATING_ENABLED;

  let questions: Awaited<ReturnType<typeof fetchQuestions>> = [];
  let progressMap: Map<string, { status: string; bestScore: number; totalTests: number; updatedAt: Date }> = new Map();

  try {
    questions = await fetchQuestions();

    if (session?.user?.id) {
      const progress = await prisma.progress.findMany({
        where: { userId: session.user.id },
        select: { questionId: true, status: true, bestScore: true, totalTests: true, updatedAt: true },
      });
      progressMap = new Map(progress.map((p) => [p.questionId, p]));
    }
  } catch {
    // DB not yet configured — show placeholder
  }

  // ── Derived filter data ────────────────────────────────────────────────────
  const topics = Array.from(new Set(questions.map((q) => q.topic).filter(Boolean) as string[])).sort();

  // Year groups: sorted descending, each with its unique sessions sorted
  const yearSessionMap = new Map<number, Set<string>>();
  for (const q of questions) {
    if (q.year) {
      if (!yearSessionMap.has(q.year)) yearSessionMap.set(q.year, new Set());
      if (q.session) yearSessionMap.get(q.year)!.add(q.session);
    }
  }
  const SESSION_ORDER = ['May/June', 'Oct/Nov', 'Feb/Mar'];
  const yearGroups = Array.from(yearSessionMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, sessionsSet]) => ({
      year,
      sessions: Array.from(sessionsSet).sort(
        (a, b) => SESSION_ORDER.indexOf(b) - SESSION_ORDER.indexOf(a)
      ),
    }));

  // All unique tags (sorted)
  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags))).sort();

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = questions.filter((q) => {
    if (activeTopic && q.topic !== activeTopic) return false;
    if (activeYear && q.year !== activeYear) return false;
    if (activeSession && q.session !== activeSession) return false;
    if (activeTag && !q.tags.includes(activeTag)) return false;
    if (activeQ && !q.title.toLowerCase().includes(activeQ.toLowerCase())) return false;
    return true;
  });

  // Group by difficulty
  const grouped = DIFFICULTIES.reduce(
    (acc, d) => {
      acc[d] = filtered.filter((q) => q.difficulty === d);
      return acc;
    },
    {} as Record<string, typeof filtered>
  );

  // Stats
  const totalSolved = Array.from(progressMap.values()).filter((p) => p.status === 'SOLVED').length;
  const totalQuestions = questions.length;

  // "Continue where you left off"
  const resumeQuestion = (() => {
    if (!session?.user?.id) return null;
    const inProgress = Array.from(progressMap.entries())
      .filter(([, p]) => p.status === 'IN_PROGRESS')
      .sort(([, a], [, b]) => new Date((b as { updatedAt: Date }).updatedAt).getTime() - new Date((a as { updatedAt: Date }).updatedAt).getTime());
    if (!inProgress.length) return null;
    const [qId] = inProgress[0];
    return questions.find((q) => q.id === qId) ?? null;
  })();

  return (
    // On desktop: flex-col container that does NOT scroll — sidebar and content each scroll independently.
    // On mobile: single overflow-y-auto container so page header + filters + questions scroll together.
    <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden lg:flex lg:flex-col bg-background bg-dot-grid text-light-text relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 50%)',
        }}
      />
      <div className="max-w-7xl w-full mx-auto relative px-4 sm:px-6 lg:px-8 lg:flex lg:flex-col lg:flex-1 lg:min-h-0">

        {/* ── Page header — shrinks to its natural height on desktop ── */}
        <div className="pt-8 mb-6 lg:shrink-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-xl font-bold">Practice Questions</h1>
              <p className="text-sm text-dark-text mt-1">
                Solve autograded pseudocode questions. Each submission is checked against hidden test cases.
              </p>
            </div>

            {session && totalQuestions > 0 && (
              <div className="shrink-0 text-right">
                <div className="text-2xl font-bold text-light-text">
                  {totalSolved}
                  <span className="text-dark-text text-base font-normal">/{totalQuestions}</span>
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

          {/* Notices */}
          <div className="space-y-2">
            {!PREMIUM_GATING_ENABLED && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary">
                <Crown size={13} className="shrink-0" />
                <span>Premium is coming soon. For now, all question difficulties are available to everyone.</span>
              </div>
            )}
            {PREMIUM_GATING_ENABLED && session && !isPremium && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warning/20 bg-warning/5 text-xs text-warning">
                <Crown size={13} className="shrink-0" />
                <span>
                  Free plan — easy questions are fully available. <strong>Upgrade to Premium</strong> to unlock medium and hard questions.
                </span>
              </div>
            )}
            {!session && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary">
                <Link href="/auth/signin" className="underline font-medium hover:text-light-text transition-colors">Sign in</Link>
                <span className="text-dark-text">to track your progress.</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        {/* On desktop: grid fills the remaining height; each column scrolls independently. */}
        {/* On mobile: normal block flow inside the outer scroll container.             */}
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:flex-1 lg:min-h-0">

          {/* Sidebar — desktop only, independently scrollable */}
          <aside className="hidden lg:block lg:overflow-y-auto lg:pb-8 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background pr-1">
            <Suspense fallback={null}>
              <PracticeFilters
                topics={topics}
                yearGroups={yearGroups}
                allTags={allTags}
                activeTopic={activeTopic}
                activeYear={activeYear}
                activeSession={activeSession}
                activeTag={activeTag}
                activeQ={activeQ}
              />
            </Suspense>
          </aside>

          {/* Main content */}
          <div className="min-w-0 lg:overflow-y-auto lg:pb-8 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
            {/* Mobile filters — hidden on desktop (sidebar handles it there) */}
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <PracticeFilters
                  topics={topics}
                  yearGroups={yearGroups}
                  allTags={allTags}
                  activeTopic={activeTopic}
                  activeYear={activeYear}
                  activeSession={activeSession}
                  activeTag={activeTag}
                  activeQ={activeQ}
                />
              </Suspense>
            </div>

            {/* Resume banner */}
            {resumeQuestion && (
              <Link
                href={`/practice/${resumeQuestion.id}`}
                className="flex items-center justify-between gap-3 mb-5 px-4 py-3 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 group animate-fade-in-up"
              >
                <div className="min-w-0">
                  <div className="text-[10px] text-primary/60 font-semibold uppercase tracking-wider mb-0.5">Continue where you left off</div>
                  <div className="text-sm font-medium text-light-text truncate">{resumeQuestion.title}</div>
                </div>
                <ArrowRight size={15} className="text-primary/50 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

            {/* Question list */}
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
                  const isLocked = d !== 'EASY' && !hasFullAccess;

                  return (
                    <div key={d}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold tracking-wider ${DIFFICULTY_COLOR[d]}`}>{d}</span>
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
                          const paperRef = q.year
                            ? [
                                q.year,
                                q.session,
                                q.variant ? `V${q.variant}` : null,
                                q.questionNumber ? `Q${q.questionNumber}${q.part ? `(${q.part})` : ''}` : null,
                              ].filter(Boolean).join(' ')
                            : q.paper ?? null;
                          const progress = progressMap.get(q.id);
                          const solved = progress?.status === 'SOLVED';

                          const cardContent = (
                            <>
                              <div className="flex items-center gap-3 min-w-0">
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
                                  {(q.topic || paperRef || q.tags.length > 0) && (
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                      {q.topic && (
                                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                                          q.topic === 'File Handling'
                                            ? 'bg-info/10 border-info/30 text-info'
                                            : 'bg-surface border-border text-dark-text'
                                        }`}>
                                          {q.topic === 'File Handling' && <FileText size={9} />}
                                          {q.topic}
                                        </span>
                                      )}
                                      {paperRef && (
                                        <span className="text-[10px] text-dark-text/60 font-mono">{paperRef}</span>
                                      )}
                                      {q.marks && (
                                        <span className="text-[10px] text-warning/70 font-mono">{q.marks}m</span>
                                      )}
                                      {q.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full border border-border/60 text-dark-text/50">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 ml-4 shrink-0">
                                {progress && !isLocked && (
                                  <span className="text-[10px] text-dark-text">
                                    {progress.bestScore}/{progress.totalTests}
                                  </span>
                                )}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFFICULTY_BADGE[q.difficulty] ?? 'border-border text-dark-text'}`}>
                                  {q.difficulty}
                                </span>
                              </div>
                            </>
                          );

                          return isLocked ? (
                            <div
                              key={q.id}
                              className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface/50 opacity-60 cursor-not-allowed"
                              aria-disabled="true"
                            >
                              {cardContent}
                            </div>
                          ) : (
                            <Link
                              key={q.id}
                              href={`/practice/${q.id}`}
                              className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface transition-colors hover:border-primary/50 hover:bg-surface/80"
                            >
                              {cardContent}
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
      </div>
    </div>
  );
}

async function fetchQuestions() {
  return prisma.question.findMany({
    select: {
      id: true, title: true, difficulty: true, topic: true, tags: true,
      year: true, session: true, variant: true, paper: true,
      questionNumber: true, part: true, marks: true,
    },
    orderBy: [{ year: 'desc' }, { title: 'asc' }],
  });
}
