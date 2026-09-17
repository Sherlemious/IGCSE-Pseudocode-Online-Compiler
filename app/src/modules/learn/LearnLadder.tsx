'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, Play, Route, Trophy } from 'lucide-react';
import { IGCSE_PAPER_2 } from './curriculum';
import LearnPathMap from './LearnPathMap';
import { findLesson, flattenLessons } from './path';
import { formatMinutes } from './pathTheme';
import { isComplete, loadProgress, nextIncomplete, type ProgressMap } from './progress';
import { captureLearn, learnCourseProps, learnLessonProps } from './telemetry';

const PLAYABLE = flattenLessons(IGCSE_PAPER_2).filter((item) => item.lesson.playable);
const PLAYABLE_MINUTES = PLAYABLE.reduce((sum, item) => sum + item.lesson.minutes, 0);
const FREE_LEVELS = IGCSE_PAPER_2.levels.filter((level) => level.free);
const FREE_RANGE =
  FREE_LEVELS.length > 0
    ? `Levels ${FREE_LEVELS[0]!.number}–${FREE_LEVELS[FREE_LEVELS.length - 1]!.number}`
    : null;

const RING = 76;
const RING_STROKE = 5;
const RING_R = (RING - RING_STROKE) / 2;
const RING_C = 2 * Math.PI * RING_R;

export default function LearnLadder() {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (status === 'loading' || opened.current) return;
    opened.current = true;
    const map = loadProgress();
    const next = nextIncomplete(IGCSE_PAPER_2, map);
    captureLearn('learn_opened', {
      ...learnCourseProps(map),
      from: searchParams.get('from') ?? 'direct',
      signed_in: status === 'authenticated',
      next_lesson: next ? `${next.levelSlug}/${next.lessonSlug}` : null,
    });
  }, [searchParams, status]);

  useEffect(() => {
    const onChange = () => setProgress(loadProgress());
    window.addEventListener('learn-progress-changed', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('learn-progress-changed', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  // Computed from whatever progress we have so the first node reads as "current"
  // before hydration for a fresh visitor; the Continue card waits for `ready`.
  const next = nextIncomplete(IGCSE_PAPER_2, progress);
  const nextFound = next ? findLesson(IGCSE_PAPER_2, next.levelSlug, next.lessonSlug) : null;
  const nextHref = nextFound ? `/learn/${nextFound.level.slug}/${nextFound.lesson.slug}` : null;
  const allPlayableDone = ready && !next;
  const completed = PLAYABLE.filter((item) => isComplete(progress, item.lesson.id)).length;
  const pct = PLAYABLE.length > 0 ? Math.round((completed / PLAYABLE.length) * 100) : 0;
  const ringOffset = RING_C * (1 - pct / 100);

  return (
    <div className="relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-background bg-dot-grid text-light-text scrollbar-pretty">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(var(--color-primary-rgb), 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-3">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="mono-label text-primary/80 mb-2.5 flex items-center gap-1.5">
              <Route size={12} />
              IGCSE 0478 / 0984 / 2210 · Paper 2
            </div>
            <h1 className="display-serif text-[2rem] sm:text-[2.75rem] leading-[1.05] font-semibold mb-3">
              {IGCSE_PAPER_2.title}
            </h1>
            <p className="text-sm sm:text-[15px] text-dark-text max-w-xl leading-relaxed">
              {IGCSE_PAPER_2.subtitle}
            </p>
          </div>

          <div className="hidden sm:flex shrink-0 items-center gap-5 pt-1 animate-fade-in-up">
            <dl className="flex flex-col gap-1.5 text-right">
              <Stat value={String(PLAYABLE.length)} label="lessons live" />
              <Stat value={formatMinutes(PLAYABLE_MINUTES)} label="to finish" />
              {FREE_RANGE && <Stat value={FREE_RANGE} label="free" />}
            </dl>
            <div className="relative shrink-0 animate-scale-in" style={{ width: RING, height: RING }}>
              <svg width={RING} height={RING} className="-rotate-90">
                <circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={RING_R}
                  fill="none"
                  stroke="color-mix(in srgb, var(--color-dark-text) 28%, transparent)"
                  strokeWidth={RING_STROKE}
                />
                <circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={RING_R}
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth={RING_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold font-mono text-light-text leading-none tabular-nums">
                  {pct}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-dark-text mt-1 tabular-nums">
                  {completed}/{PLAYABLE.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="sm:hidden mt-4 font-mono text-[11px] text-dark-text tabular-nums">
          <span className="text-light-text font-semibold">{completed}/{PLAYABLE.length}</span> done ·{' '}
          {formatMinutes(PLAYABLE_MINUTES)} to finish{FREE_RANGE ? ` · ${FREE_RANGE} free` : ''}
        </p>

        {ready && nextHref && nextFound && (
          <Link
            href={nextHref}
            onClick={() =>
              captureLearn(
                'learn_continue_clicked',
                learnLessonProps(nextFound.level, nextFound.lesson, { source: 'continue' }),
              )
            }
            className="group sticky top-2 z-10 mt-6 sm:mt-8 flex items-center gap-3.5 pl-3.5 pr-4 py-3 min-h-16 rounded-2xl border border-primary/40 bg-background/90 backdrop-blur-md hover:border-primary/70 hover:bg-primary/[0.06] transition-colors overflow-hidden shadow-[0_10px_32px_-14px_rgba(var(--color-primary-rgb),0.5)]"
          >
            <span className="shrink-0 w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <Play size={15} fill="currentColor" className="ml-0.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mono-label text-primary mb-0.5">
                {completed === 0 ? 'Start the path' : 'Continue'}
              </div>
              <div className="text-sm sm:text-base font-medium truncate">
                Level {nextFound.level.number} · {nextFound.lesson.title}
              </div>
            </div>
            <span className="hidden sm:flex flex-col items-end shrink-0 font-mono text-[11px] tabular-nums leading-tight">
              <span className="text-dark-text">{nextFound.lesson.minutes} min</span>
              <span className="text-dark-text/70">
                {completed}/{PLAYABLE.length}
              </span>
            </span>
            <ArrowRight
              size={16}
              className="shrink-0 text-primary group-hover:translate-x-0.5 transition-transform"
            />
            <span
              aria-hidden
              className="absolute left-0 bottom-0 h-0.5 w-full"
              style={{ background: 'color-mix(in srgb, var(--color-dark-text) 20%, transparent)' }}
            >
              <span
                className="block h-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, var(--color-success), var(--color-primary))',
                }}
              />
            </span>
          </Link>
        )}

        {allPlayableDone && (
          <div className="mt-6 sm:mt-8 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-success/30 bg-success/[0.07]">
            <span className="shrink-0 w-10 h-10 rounded-xl bg-success/15 border border-success/30 text-success flex items-center justify-center">
              <Trophy size={16} />
            </span>
            <div className="min-w-0">
              <div className="mono-label text-success mb-0.5">Path complete</div>
              <div className="text-sm text-light-text">
                {FREE_RANGE ?? 'All live levels'} done. The rest of the map unlocks as we ship each
                level.
              </div>
            </div>
          </div>
        )}
      </div>

      <LearnPathMap
        progress={progress}
        nextLessonId={nextFound?.lesson.id ?? null}
        ready={ready}
        completedCount={completed}
      />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="font-mono text-[11px] text-dark-text tabular-nums whitespace-nowrap">
      <dd className="inline text-light-text font-semibold">{value}</dd>{' '}
      <dt className="inline">{label}</dt>
    </div>
  );
}
