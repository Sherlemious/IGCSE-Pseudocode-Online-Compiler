import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Lock, CheckCircle, Crown, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { prisma } from '../../lib/prisma';
import { auth } from '../../lib/auth';
import { PREMIUM_GATING_ENABLED } from '../../lib/featureFlags';
import { PracticeFilters } from './PracticeFilters';
import { PracticeToolbar } from './PracticeToolbar';
import {
  DIFFICULTIES,
  DIFF_META,
  STATUS_KEYS,
  type ActiveFilters,
  type Difficulty,
  type DiffFacet,
  type NamedFacet,
  type SortKey,
  type StatusFacet,
  type StatusKey,
  type YearFacet,
} from './filterUtils';

export const metadata: Metadata = {
  title: 'Cambridge Pseudocode Practice Questions - Past Papers',
  description:
    'Solve Cambridge IGCSE, O Level and AS & A Level pseudocode past-paper questions. Practice trace tables, classes/OOP and algorithms with instant autograding, hints and analytics.',
  alternates: {
    canonical: '/practice',
  },
};

const SESSION_ORDER = ['May/June', 'Oct/Nov', 'Feb/Mar'];

interface PageProps {
  searchParams: Promise<{
    topic?: string;
    year?: string;
    session?: string;
    tag?: string;
    q?: string;
    diff?: string;
    status?: string;
    sort?: string;
  }>;
}

export default async function PracticePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeTopic = params.topic;
  const activeSession = params.session;
  const activeTag = params.tag;
  const activeQ = params.q;
  const activeYear = params.year ? parseInt(params.year, 10) : undefined;
  const activeDiff = (() => {
    const v = params.diff?.toUpperCase();
    return v && (DIFFICULTIES as readonly string[]).includes(v) ? (v as Difficulty) : undefined;
  })();
  const validStatus = (() => {
    const v = params.status?.toLowerCase();
    return v && (STATUS_KEYS as readonly string[]).includes(v) ? (v as StatusKey) : undefined;
  })();
  const activeSort: SortKey =
    params.sort === 'marks' || params.sort === 'az' ? params.sort : 'year';

  const session = await auth();
  const isPremium = session?.user?.plan === 'PREMIUM';
  const hasFullAccess = isPremium || !PREMIUM_GATING_ENABLED;
  const showStatus = !!session;

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

  const statusOf = (id: string): StatusKey => {
    const p = progressMap.get(id);
    if (!p) return 'todo';
    return p.status === 'SOLVED' ? 'solved' : 'started';
  };

  // ── Faceted matching ────────────────────────────────────────────────────────
  // `except` lists the dimensions to ignore — used so each facet's counts reflect
  // every OTHER active filter (proper cross-filtering) rather than itself.
  type Question = (typeof questions)[number];
  const matchExcept = (q: Question, except: string[]): boolean => {
    if (!except.includes('topic') && activeTopic && q.topic !== activeTopic) return false;
    if (!except.includes('year')) {
      if (activeYear && q.year !== activeYear) return false;
      if (activeSession && q.session !== activeSession) return false;
    }
    if (!except.includes('tag') && activeTag && !q.tags.includes(activeTag)) return false;
    if (!except.includes('q') && activeQ && !q.title.toLowerCase().includes(activeQ.toLowerCase())) return false;
    if (!except.includes('diff') && activeDiff && q.difficulty !== activeDiff) return false;
    if (!except.includes('status') && validStatus && statusOf(q.id) !== validStatus) return false;
    return true;
  };

  const filtered = questions.filter((q) => matchExcept(q, []));

  // ── Facet counts ──────────────────────────────────────────────────────────
  // Topics
  const allTopics = Array.from(new Set(questions.map((q) => q.topic).filter(Boolean) as string[]));
  const topicCount = new Map<string, number>(allTopics.map((t) => [t, 0]));
  for (const q of questions) {
    if (q.topic && matchExcept(q, ['topic'])) topicCount.set(q.topic, (topicCount.get(q.topic) ?? 0) + 1);
  }
  const topics: NamedFacet[] = allTopics
    .map((name) => ({ name, count: topicCount.get(name) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // Years + sessions
  const yearSessions = new Map<number, Set<string>>();
  for (const q of questions) {
    if (!q.year) continue;
    if (!yearSessions.has(q.year)) yearSessions.set(q.year, new Set());
    if (q.session) yearSessions.get(q.year)!.add(q.session);
  }
  const yearCount = new Map<number, number>();
  const sessionCount = new Map<string, number>();
  for (const q of questions) {
    if (!matchExcept(q, ['year']) || !q.year) continue;
    yearCount.set(q.year, (yearCount.get(q.year) ?? 0) + 1);
    if (q.session) {
      const key = `${q.year}|${q.session}`;
      sessionCount.set(key, (sessionCount.get(key) ?? 0) + 1);
    }
  }
  const years: YearFacet[] = Array.from(yearSessions.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, set]) => ({
      year,
      count: yearCount.get(year) ?? 0,
      sessions: Array.from(set)
        .sort((a, b) => SESSION_ORDER.indexOf(b) - SESSION_ORDER.indexOf(a))
        .map((name) => ({ name, count: sessionCount.get(`${year}|${name}`) ?? 0 })),
    }));

  // Tags
  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags)));
  const tagCount = new Map<string, number>(allTags.map((t) => [t, 0]));
  for (const q of questions) {
    if (!matchExcept(q, ['tag'])) continue;
    for (const tg of q.tags) if (tagCount.has(tg)) tagCount.set(tg, (tagCount.get(tg) ?? 0) + 1);
  }
  const tags: NamedFacet[] = allTags
    .map((name) => ({ name, count: tagCount.get(name) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // Difficulty
  const diffCount: Record<Difficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const q of questions) {
    if (matchExcept(q, ['diff']) && q.difficulty in diffCount) diffCount[q.difficulty as Difficulty]++;
  }
  const difficulties: DiffFacet[] = DIFFICULTIES.map((value) => ({ value, count: diffCount[value] }));

  // Status
  const statusCount: Record<StatusKey, number> = { todo: 0, started: 0, solved: 0 };
  let statusAllCount = 0;
  for (const q of questions) {
    if (!matchExcept(q, ['status'])) continue;
    statusAllCount++;
    statusCount[statusOf(q.id)]++;
  }
  const statuses: StatusFacet[] = STATUS_KEYS.map((value) => ({ value, count: statusCount[value] }));

  // ── Sort within difficulty groups ───────────────────────────────────────────
  const sortQuestions = (arr: Question[]): Question[] => {
    const copy = [...arr];
    if (activeSort === 'az') copy.sort((a, b) => a.title.localeCompare(b.title));
    else if (activeSort === 'marks')
      copy.sort((a, b) => (b.marks ?? -1) - (a.marks ?? -1) || a.title.localeCompare(b.title));
    else copy.sort((a, b) => (b.year ?? -1) - (a.year ?? -1) || a.title.localeCompare(b.title));
    return copy;
  };

  const grouped = DIFFICULTIES.reduce(
    (acc, d) => {
      acc[d] = sortQuestions(filtered.filter((q) => q.difficulty === d));
      return acc;
    },
    {} as Record<Difficulty, Question[]>
  );

  // ── Header stats (overall, not filtered) ────────────────────────────────────
  const totalSolved = Array.from(progressMap.values()).filter((p) => p.status === 'SOLVED').length;
  const totalQuestions = questions.length;
  const overallPct = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  const solvedByDiff: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const totalByDiff: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const q of questions) {
    if (totalByDiff[q.difficulty] === undefined) continue;
    totalByDiff[q.difficulty]++;
    if (progressMap.get(q.id)?.status === 'SOLVED') solvedByDiff[q.difficulty]++;
  }

  const RING = 64;
  const RING_STROKE = 5;
  const RING_R = (RING - RING_STROKE) / 2;
  const RING_C = 2 * Math.PI * RING_R;
  const RING_OFFSET = RING_C * (1 - overallPct / 100);

  // "Continue where you left off" — most recently touched, not-yet-solved attempt
  const resumeQuestion = (() => {
    if (!session?.user?.id) return null;
    const inProgress = Array.from(progressMap.entries())
      .filter(([, p]) => p.status === 'ATTEMPTED')
      .sort(
        ([, a], [, b]) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    if (!inProgress.length) return null;
    const [qId] = inProgress[0];
    return questions.find((q) => q.id === qId) ?? null;
  })();

  const active: ActiveFilters = {
    topic: activeTopic,
    year: activeYear,
    session: activeSession,
    tag: activeTag,
    q: activeQ,
    diff: activeDiff,
    status: validStatus,
    sort: activeSort,
  };

  const filterProps = {
    topics,
    years,
    tags,
    difficulties,
    statuses,
    statusAllCount,
    active,
    showStatus,
  };

  // Running index so cards cascade in continuously across difficulty groups.
  let revealIndex = 0;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden lg:flex lg:flex-col bg-background bg-dot-grid text-light-text relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 50%)',
        }}
      />
      <div className="max-w-7xl w-full mx-auto relative px-4 sm:px-6 lg:px-8 lg:flex lg:flex-col lg:flex-1 lg:min-h-0">

        {/* ── Page header ── */}
        <div className="pt-8 mb-6 lg:shrink-0">
          <div className="flex items-start justify-between gap-5 mb-3">
            <div className="min-w-0">
              <div className="mono-label text-primary/70 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={11} className="shrink-0" />
                Past-paper practice
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Practice Questions</h1>
              <p className="text-sm text-dark-text mt-1 max-w-md">
                Solve autograded pseudocode questions. Every submission is checked against hidden test cases.
              </p>
            </div>

            {session && totalQuestions > 0 && (
              <div className="shrink-0 flex items-center gap-4 sm:gap-5 animate-fade-in-up">
                <div className="hidden sm:flex flex-col gap-1.5">
                  {DIFFICULTIES.map((d) => {
                    const meta = DIFF_META[d];
                    const total = totalByDiff[d];
                    if (!total) return null;
                    const solved = solvedByDiff[d];
                    const pct = Math.round((solved / total) * 100);
                    return (
                      <div key={d} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                        <span className="text-[10px] text-dark-text w-9">{meta.label}</span>
                        <span className="w-12 h-1 rounded-full bg-border overflow-hidden">
                          <span
                            className="block h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${pct}%`, backgroundColor: meta.color }}
                          />
                        </span>
                        <span className="text-[10px] font-mono tabular-nums text-dark-text w-9 text-right">
                          {solved}/{total}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="relative shrink-0 animate-scale-in" style={{ width: RING, height: RING }}>
                  <svg width={RING} height={RING} className="-rotate-90">
                    <circle cx={RING / 2} cy={RING / 2} r={RING_R} fill="none" stroke="var(--color-border)" strokeWidth={RING_STROKE} />
                    <circle
                      cx={RING / 2}
                      cy={RING / 2}
                      r={RING_R}
                      fill="none"
                      stroke="var(--color-success)"
                      strokeWidth={RING_STROKE}
                      strokeLinecap="round"
                      strokeDasharray={RING_C}
                      strokeDashoffset={RING_OFFSET}
                      style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold font-mono text-light-text leading-none tabular-nums">{overallPct}%</span>
                    <span className="text-[8px] uppercase tracking-wider text-dark-text mt-0.5">
                      {totalSolved}/{totalQuestions}
                    </span>
                  </div>
                </div>
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
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:flex-1 lg:min-h-0 lg:[grid-template-rows:1fr]">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block lg:overflow-y-auto lg:pb-8 lg:min-h-0 scrollbar-pretty pr-1">
            <Suspense fallback={null}>
              <PracticeFilters variant="desktop" {...filterProps} />
            </Suspense>
          </aside>

          {/* Main content */}
          <div className="min-w-0 lg:overflow-y-auto lg:pb-8 lg:min-h-0 scrollbar-pretty">
            {/* Mobile filters */}
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <PracticeFilters variant="mobile" {...filterProps} />
              </Suspense>
            </div>

            {questions.length === 0 ? (
              <EmptyState
                title="No questions yet"
                body="Questions are added through the database. Check back soon — new past-paper sets land regularly."
              />
            ) : (
              <>
                <Suspense fallback={null}>
                  <PracticeToolbar filteredCount={filtered.length} totalCount={totalQuestions} active={active} />
                </Suspense>

                {/* Resume banner */}
                {resumeQuestion && (
                  <Link
                    href={`/practice/${resumeQuestion.id}`}
                    className="group relative flex items-center gap-3 mb-5 pl-3.5 pr-4 py-3 rounded-xl border border-primary/25 bg-primary/[0.06] hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 overflow-hidden animate-fade-in-up"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 pointer-events-none opacity-60"
                      style={{ background: 'radial-gradient(120% 140% at 0% 50%, rgba(var(--color-primary-rgb), 0.10) 0%, transparent 55%)' }}
                    />
                    <span className="relative shrink-0 w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                      <ArrowRight size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <div className="relative min-w-0 flex-1">
                      <div className="mono-label text-primary/70 mb-0.5">Continue where you left off</div>
                      <div className="text-sm font-medium text-light-text truncate">{resumeQuestion.title}</div>
                    </div>
                  </Link>
                )}

                {filtered.length === 0 ? (
                  <EmptyState
                    title="Nothing matches those filters"
                    body="Try removing a filter or clearing your search to see more questions."
                  />
                ) : (
                  <div className="space-y-7">
                    {DIFFICULTIES.map((d) => {
                      const qs = grouped[d];
                      if (qs.length === 0) return null;
                      const meta = DIFF_META[d];
                      const isLocked = d !== 'EASY' && !hasFullAccess;
                      const groupSolved = qs.filter((q) => progressMap.get(q.id)?.status === 'SOLVED').length;
                      const groupPct = qs.length ? Math.round((groupSolved / qs.length) * 100) : 0;

                      return (
                        <div key={d}>
                          {/* Group header */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`flex items-center gap-1.5 text-xs font-bold tracking-wider ${meta.text}`}>
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                              {d}
                            </span>
                            <span className="text-xs text-dark-text font-mono tabular-nums">{qs.length}</span>
                            {isLocked && (
                              <span className="flex items-center gap-1 text-[10px] text-warning/80 px-1.5 py-0.5 rounded border border-warning/25 bg-warning/5">
                                <Crown size={10} />
                                Premium
                              </span>
                            )}
                            <div
                              className="flex-1 h-px"
                              style={{ background: `linear-gradient(90deg, color-mix(in srgb, ${meta.color} 22%, transparent), var(--color-border) 60%)` }}
                            />
                            {session && !isLocked && groupSolved > 0 && (
                              <span className="flex items-center gap-2 shrink-0">
                                <span className="hidden sm:block w-16 h-1 rounded-full bg-border overflow-hidden">
                                  <span
                                    className="block h-full rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${groupPct}%`, backgroundColor: meta.color }}
                                  />
                                </span>
                                <span className="text-[10px] text-dark-text font-mono tabular-nums">
                                  {groupSolved}/{qs.length} solved
                                </span>
                              </span>
                            )}
                          </div>

                          {/* Cards */}
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
                              const attemptPct =
                                progress && progress.totalTests > 0
                                  ? Math.round((progress.bestScore / progress.totalTests) * 100)
                                  : 0;
                              const revealDelay = Math.min(revealIndex++, 14) * 35;

                              const cardContent = (
                                <>
                                  <span
                                    aria-hidden
                                    className="absolute left-0 inset-y-0 w-[3px] transition-all duration-200 group-hover:w-[5px]"
                                    style={{ backgroundColor: meta.color, opacity: isLocked ? 0.3 : solved ? 0.9 : 0.5 }}
                                  />
                                  {solved && (
                                    <span
                                      aria-hidden
                                      className="absolute inset-0 pointer-events-none"
                                      style={{ background: `linear-gradient(90deg, color-mix(in srgb, var(--color-success) 7%, transparent), transparent 55%)` }}
                                    />
                                  )}

                                  <div className="relative flex items-center gap-3 min-w-0">
                                    {isLocked ? (
                                      <Lock className="h-[18px] w-[18px] text-dark-text/40 shrink-0" />
                                    ) : solved ? (
                                      <CheckCircle className="h-[18px] w-[18px] text-success shrink-0" />
                                    ) : progress ? (
                                      <span
                                        className="relative h-[18px] w-[18px] shrink-0 rounded-full"
                                        style={{
                                          background: `conic-gradient(var(--color-warning) ${attemptPct * 3.6}deg, color-mix(in srgb, var(--color-warning) 20%, transparent) ${attemptPct * 3.6}deg)`,
                                        }}
                                        title={`Best ${progress.bestScore}/${progress.totalTests}`}
                                      >
                                        <span className="absolute inset-[3px] rounded-full bg-surface" />
                                      </span>
                                    ) : (
                                      <span className="h-[18px] w-[18px] rounded-full border-2 border-border shrink-0 transition-colors group-hover:border-primary/40" />
                                    )}

                                    <div className="min-w-0">
                                      <div className="font-medium text-sm text-light-text truncate transition-colors group-hover:text-primary">
                                        {q.title}
                                      </div>
                                      {(q.topic || paperRef || q.tags.length > 0) && (
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                          {q.topic && (
                                            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                                              q.topic === 'File Handling'
                                                ? 'bg-info/10 border-info/30 text-info'
                                                : 'bg-background border-border text-dark-text'
                                            }`}>
                                              {q.topic === 'File Handling' && <FileText size={9} />}
                                              {q.topic}
                                            </span>
                                          )}
                                          {paperRef && (
                                            <span className="text-[10px] text-dark-text/70 font-mono">{paperRef}</span>
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

                                  <div className="relative flex items-center gap-3 ml-3 shrink-0">
                                    {q.marks != null && (
                                      <span className="hidden sm:inline text-[10px] text-warning/80 font-mono tabular-nums">
                                        {q.marks}m
                                      </span>
                                    )}
                                    {progress && !isLocked && (
                                      <span className="text-[10px] text-dark-text font-mono tabular-nums">
                                        {progress.bestScore}/{progress.totalTests}
                                      </span>
                                    )}
                                    {!isLocked && (
                                      <ArrowRight
                                        size={14}
                                        className="text-primary opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 shrink-0"
                                      />
                                    )}
                                  </div>
                                </>
                              );

                              return isLocked ? (
                                <div
                                  key={q.id}
                                  className="relative flex items-center justify-between gap-3 pl-4 pr-3 py-3 rounded-xl border border-border bg-surface/40 overflow-hidden opacity-60 cursor-not-allowed animate-fade-in-up"
                                  style={{ animationDelay: `${revealDelay}ms` }}
                                  aria-disabled="true"
                                >
                                  {cardContent}
                                </div>
                              ) : (
                                <Link
                                  key={q.id}
                                  href={`/practice/${q.id}`}
                                  className="group relative flex items-center justify-between gap-3 pl-4 pr-3 py-3 rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200 hover:border-primary/40 hover:-translate-y-px hover:shadow-[0_8px_22px_-12px_rgba(0,0,0,0.55)] animate-fade-in-up"
                                  style={{ animationDelay: `${revealDelay}ms` }}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border border-dashed border-border bg-surface/40 animate-fade-in-up">
      <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-primary/50" />
      </div>
      <h2 className="text-base font-semibold text-light-text mb-1.5">{title}</h2>
      <p className="text-sm text-dark-text max-w-xs">{body}</p>
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
