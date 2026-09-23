'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Lock, CheckCircle, Crown, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { authHref } from '@/modules/auth/callback';
import { PracticeFilters } from './PracticeFilters';
import { PracticeToolbar } from './PracticeToolbar';
import { useShallowPracticeUrl } from './useShallowPracticeUrl';
import SolveCountChip from './SolveCountChip';
import StartHereCard from './StartHereCard';
import { recommendNextQuestion } from './practiceNext';
import { useQuestionSocialStats } from './usePracticeSocialProof';
import {
  DIFFICULTIES,
  DIFF_META,
  computePracticeListing,
  paperRef,
  parsePracticeSearch,
  type PracticeListQuestion,
  type PracticeProgress,
} from './filterUtils';

type ProgressPayload = {
  premiumAccess?: boolean;
  progress?: Array<{
    questionId: string;
    status: string;
    bestScore: number;
    totalTests: number;
    updatedAt: string;
  }>;
};

export default function PracticeIndex({
  questions,
  gatingEnabled,
}: {
  questions: PracticeListQuestion[];
  gatingEnabled: boolean;
}) {
  const { status: authStatus } = useSession();
  const signedIn = authStatus === 'authenticated';
  const { queryString, navigate, clearAll } = useShallowPracticeUrl();
  const active = useMemo(() => parsePracticeSearch(queryString), [queryString]);

  const [progressMap, setProgressMap] = useState<Map<string, PracticeProgress>>(new Map());
  const [premiumAccess, setPremiumAccess] = useState(!gatingEnabled);
  const socialStats = useQuestionSocialStats();

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      if (authStatus === 'unauthenticated') {
        setProgressMap(new Map());
        setPremiumAccess(!gatingEnabled);
      }
      return;
    }
    let cancelled = false;
    void fetch('/api/practice/progress')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ProgressPayload | null) => {
        if (cancelled || !data) return;
        setPremiumAccess(Boolean(data.premiumAccess) || !gatingEnabled);
        setProgressMap(
          new Map(
            (data.progress ?? []).map((row) => [
              row.questionId,
              {
                status: row.status,
                bestScore: row.bestScore,
                totalTests: row.totalTests,
                updatedAt: row.updatedAt,
              },
            ]),
          ),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [authStatus, gatingEnabled]);

  const hasFullAccess = !gatingEnabled || premiumAccess;
  const listing = useMemo(
    () => computePracticeListing(questions, active, progressMap),
    [questions, active, progressMap],
  );

  const totalQuestions = questions.length;
  const totalSolved = Array.from(progressMap.values()).filter((p) => p.status === 'SOLVED').length;
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

  const resumeQuestion = (() => {
    if (!signedIn) return null;
    const inProgress = Array.from(progressMap.entries())
      .filter(([, p]) => p.status === 'ATTEMPTED')
      .sort(
        ([, a], [, b]) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    if (!inProgress.length) return null;
    const [qId] = inProgress[0];
    return questions.find((q) => q.id === qId) ?? null;
  })();

  const nextQuestion = resumeQuestion
    ? null
    : recommendNextQuestion({
        questions,
        progress: progressMap,
        stats: socialStats,
        hasFullAccess,
        signedIn,
      });

  const filterProps = {
    topics: listing.topics,
    years: listing.years,
    tags: listing.tags,
    difficulties: listing.difficulties,
    statuses: listing.statuses,
    statusAllCount: listing.statusAllCount,
    active,
    showStatus: signedIn,
    onNavigate: navigate,
  };

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

        <div className="pt-8 mb-6 lg:shrink-0">
          <div className="flex items-start justify-between gap-5 mb-3">
            <div className="min-w-0">
              <div className="mono-label text-primary/70 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={11} className="shrink-0" />
                Past-paper practice
              </div>
              <h1 className="display-serif text-[1.75rem] leading-tight font-semibold">
                Cambridge Pseudocode Practice Questions
              </h1>
              <p className="text-sm text-dark-text mt-1 max-w-md">
                Solve autograded IGCSE and A Level past-paper questions. Every submission is checked
                against hidden test cases.
              </p>
            </div>

            {signedIn && totalQuestions > 0 && (
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

          <div className="space-y-2">
            {gatingEnabled && signedIn && !premiumAccess && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warning/20 bg-warning/5 text-xs text-warning">
                <Crown size={13} className="shrink-0" />
                <span>
                  Some questions are Premium. <strong>Upgrade</strong>, or join a class from a teacher with a paid plan, to unlock them.
                </span>
              </div>
            )}
            {authStatus === 'unauthenticated' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary">
                <Link href={authHref('signin', '/practice')} className="underline font-medium hover:text-light-text transition-colors">Sign in</Link>
                <span className="text-dark-text">to track your progress.</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:flex-1 lg:min-h-0 lg:[grid-template-rows:1fr]">
          <aside className="hidden lg:block lg:overflow-y-auto lg:pb-8 lg:min-h-0 scrollbar-pretty pr-1">
            <PracticeFilters variant="desktop" {...filterProps} />
          </aside>

          <div className="min-w-0 lg:overflow-y-auto lg:pb-8 lg:min-h-0 scrollbar-pretty">
            <div className="lg:hidden">
              <PracticeFilters variant="mobile" {...filterProps} />
            </div>

            {questions.length === 0 ? (
              <EmptyState
                title="No questions yet"
                body="Questions are added through the database. Check back soon — new past-paper sets land regularly."
              />
            ) : (
              <>
                <PracticeToolbar
                  filteredCount={listing.filtered.length}
                  totalCount={totalQuestions}
                  active={active}
                  onNavigate={navigate}
                  onClearAll={clearAll}
                />

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

                {nextQuestion && (
                  <StartHereCard question={nextQuestion} kind={totalSolved === 0 ? 'first' : 'next'} />
                )}

                {listing.filtered.length === 0 ? (
                  <EmptyState
                    title="Nothing matches those filters"
                    body="Try removing a filter or clearing your search to see more questions."
                  />
                ) : (
                  <div className="space-y-7">
                    {DIFFICULTIES.map((d) => {
                      const qs = listing.grouped[d];
                      if (qs.length === 0) return null;
                      const meta = DIFF_META[d];
                      const groupSolved = qs.filter((q) => progressMap.get(q.id)?.status === 'SOLVED').length;
                      const groupPct = qs.length ? Math.round((groupSolved / qs.length) * 100) : 0;

                      return (
                        <div key={d}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`flex items-center gap-1.5 text-xs font-bold tracking-wider ${meta.text}`}>
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                              {d}
                            </span>
                            <span className="text-xs text-dark-text font-mono tabular-nums">{qs.length}</span>
                            <div
                              className="flex-1 h-px"
                              style={{ background: `linear-gradient(90deg, color-mix(in srgb, ${meta.color} 22%, transparent), var(--color-border) 60%)` }}
                            />
                            {signedIn && groupSolved > 0 && (
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

                          <div className="space-y-2">
                            {qs.map((q) => {
                              const ref = paperRef(q);
                              const progress = progressMap.get(q.id);
                              const solved = progress?.status === 'SOLVED';
                              const isLocked = q.isPremium && !hasFullAccess;
                              const social = socialStats.get(q.id);
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
                                      {(q.topic || ref || q.tags.length > 0) && (
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
                                          {ref && (
                                            <span className="text-[10px] text-dark-text/70 font-mono">{ref}</span>
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
                                    {isLocked && (
                                      <span className="flex items-center gap-1 text-[10px] text-warning/80 px-1.5 py-0.5 rounded border border-warning/25 bg-warning/5">
                                        <Crown size={10} />
                                        Premium
                                      </span>
                                    )}
                                    {social && <SolveCountChip stat={social} compact />}
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
      <h2 className="display-serif text-xl font-semibold text-light-text mb-1.5">{title}</h2>
      <p className="text-sm text-dark-text max-w-xs">{body}</p>
    </div>
  );
}
