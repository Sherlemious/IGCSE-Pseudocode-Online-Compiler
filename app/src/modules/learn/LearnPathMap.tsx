'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Check, HelpCircle, Lock, Star } from 'lucide-react';
import { IGCSE_PAPER_2 } from './curriculum';
import { lessonHref } from './path';
import {
  curveThrough,
  isBossLesson,
  layoutPath,
  progressAlongPath,
  snakeOffset,
  type PathStop,
} from './pathLayout';
import {
  isComplete,
  isLessonUnlocked,
  levelCompletedCount,
  playableCount,
  type ProgressMap,
} from './progress';
import { captureLearn, learnLessonProps, learnLevelProps } from './telemetry';
import type { LearnLesson, LearnLevel } from './types';

const LAYOUT = layoutPath(IGCSE_PAPER_2);
const PATH_D = curveThrough(LAYOUT.stops.map((stop) => ({ x: stop.x, y: stop.y })));

type Props = {
  progress: ProgressMap;
  nextLessonId: string | null;
  ready: boolean;
};

export default function LearnPathMap({ progress, nextLessonId, ready }: Props) {
  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const stop of LAYOUT.stops) {
      if (stop.kind === 'lesson' && isComplete(progress, stop.lesson.id)) {
        ids.add(stop.lesson.id);
      }
    }
    return ids;
  }, [progress]);

  const lit = progressAlongPath(LAYOUT.stops, completedIds);

  const scrolled = useRef(false);
  useEffect(() => {
    if (!ready || !nextLessonId || scrolled.current) return;
    scrolled.current = true;
    const node = document.getElementById(`learn-stop-${nextLessonId}`);
    node?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [ready, nextLessonId]);

  return (
    <>
      <div className="md:hidden space-y-8 px-4 pb-10">
        {IGCSE_PAPER_2.levels.map((level) => (
          <MobileLevel
            key={level.slug}
            level={level}
            stops={LAYOUT.stops.filter((stop) => stop.level.slug === level.slug)}
            progress={progress}
            nextLessonId={nextLessonId}
          />
        ))}
      </div>

      <nav
        aria-label="Paper 2 Path"
        className="relative hidden md:block max-w-5xl mx-auto px-4 sm:px-8 pb-16"
        style={{ height: LAYOUT.height }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="learn-path-lit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-success)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
            <filter id="learn-path-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={PATH_D}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="2.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={PATH_D}
            fill="none"
            stroke="url(#learn-path-lit)"
            strokeWidth="2.6"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${lit} 1`}
            filter="url(#learn-path-glow)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {LAYOUT.plaques.map((plaque) => (
          <LevelPlaque
            key={plaque.level.slug}
            level={plaque.level}
            x={plaque.x}
            y={plaque.y}
            current={plaque.level.lessons.some((lesson) => lesson.id === nextLessonId)}
            progress={progress}
          />
        ))}

        <ol className="contents">
          {LAYOUT.stops.map((stop) => (
            <li
              key={stop.id}
              className="absolute z-[1] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${stop.x}%`, top: stop.y }}
            >
              <StopNode stop={stop} progress={progress} nextLessonId={nextLessonId} desktop />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

function MobileLevel({
  level,
  stops,
  progress,
  nextLessonId,
}: {
  level: LearnLevel;
  stops: PathStop[];
  progress: ProgressMap;
  nextLessonId: string | null;
}) {
  const total = playableCount(level) || level.lessons.length;
  const done = levelCompletedCount(level, progress);
  return (
    <section>
      <div
        className={`rounded-2xl border px-4 py-3 mb-5 ${
          level.playable ? 'border-border bg-surface/80' : 'border-border/70 bg-surface/40'
        }`}
      >
        <div className="flex items-baseline gap-2">
          <span className="mono-label text-primary/70">Level {String(level.number).padStart(2, '0')}</span>
          {level.free ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-success/25 text-success">Free</span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-dark-text">Coming next</span>
          )}
          <span className="ml-auto font-mono text-[10px] text-dark-text tabular-nums">
            {level.playable ? `${done}/${total}` : `${level.hours}h`}
          </span>
        </div>
        <h2 className="display-serif text-lg font-semibold mt-1">{level.name}</h2>
        <p className="text-xs text-dark-text mt-0.5">{level.leaveWith}</p>
      </div>
      <ol className="relative">
        <span className="absolute left-1/2 top-2 bottom-2 w-px bg-border -translate-x-1/2" aria-hidden />
        {stops.map((stop) => (
          <li
            key={stop.id}
            className="relative flex justify-center py-2"
            style={{ transform: `translateX(${snakeOffset(stop.stopIndex) * 28}px)` }}
          >
            <StopNode stop={stop} progress={progress} nextLessonId={nextLessonId} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function LevelPlaque({
  level,
  x,
  y,
  current,
  progress,
}: {
  level: LearnLevel;
  x: number;
  y: number;
  current: boolean;
  progress: ProgressMap;
}) {
  const total = playableCount(level) || level.lessons.length;
  const done = levelCompletedCount(level, progress);
  const complete = level.playable && total > 0 && done === total;
  return (
    <div
      className={`absolute z-[2] w-44 lg:w-52 -translate-x-1/2 rounded-2xl border px-3.5 py-3 backdrop-blur-sm ${
        current
          ? 'border-primary/40 bg-surface/95 shadow-[0_0_48px_-10px_rgba(var(--color-primary-rgb),0.55)]'
          : complete
            ? 'border-success/30 bg-surface/90'
            : 'border-border/80 bg-surface/80'
      }`}
      style={{ left: `${x}%`, top: y }}
    >
      <div className="flex items-center gap-2">
        <span className="mono-label text-primary/70">Level {String(level.number).padStart(2, '0')}</span>
        {level.free ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-success/25 text-success">Free</span>
        ) : (
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-dark-text">Coming next</span>
        )}
      </div>
      <h2 className="display-serif text-[1.05rem] font-semibold leading-tight mt-1">{level.name}</h2>
      <p className="text-[11px] text-dark-text leading-snug mt-1">{level.leaveWith}</p>
      <p className="font-mono text-[10px] text-dark-text/80 tabular-nums mt-2">
        {level.playable ? `${done}/${total} lessons` : `${level.lessons.length} lessons · ${level.hours}h`}
      </p>
    </div>
  );
}

function StopNode({
  stop,
  progress,
  nextLessonId,
  desktop = false,
}: {
  stop: PathStop;
  progress: ProgressMap;
  nextLessonId: string | null;
  desktop?: boolean;
}) {
  if (stop.kind === 'locked-level') {
    return (
      <LockedLevelNode
        level={stop.level}
        desktop={desktop}
        offset={snakeOffset(stop.stopIndex)}
      />
    );
  }
  return (
    <LessonNode
      level={stop.level}
      lesson={stop.lesson}
      progress={progress}
      current={stop.lesson.id === nextLessonId}
      desktop={desktop}
      offset={snakeOffset(stop.stopIndex)}
    />
  );
}

function LessonNode({
  level,
  lesson,
  progress,
  current,
  desktop,
  offset,
}: {
  level: LearnLevel;
  lesson: LearnLesson;
  progress: ProgressMap;
  current: boolean;
  desktop: boolean;
  offset: number;
}) {
  const complete = isComplete(progress, lesson.id);
  const unlocked = isLessonUnlocked(IGCSE_PAPER_2, lesson, progress);
  const boss = isBossLesson(lesson);
  const href = lessonHref(level, lesson);
  const labelSide = offset >= 0 ? 'left' : 'right';

  const inner = (
    <>
      {complete ? (
        <Check size={18} strokeWidth={2.5} />
      ) : lesson.type === 'quiz' ? (
        <HelpCircle size={18} />
      ) : boss ? (
        <Star size={18} />
      ) : unlocked ? (
        <span className="font-mono text-xs tabular-nums">{lesson.id.split('.').pop()}</span>
      ) : (
        <Lock size={15} />
      )}
      {current && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 mono-label text-primary whitespace-nowrap">
          Up next
        </span>
      )}
      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity ${
          desktop ? '' : 'hidden'
        } ${labelSide === 'left' ? 'right-[calc(100%+14px)] text-right' : 'left-[calc(100%+14px)] text-left'}`}
      >
        <span className={complete ? 'text-success' : unlocked ? 'text-light-text' : 'text-dark-text'}>
          {lesson.title}
        </span>
        <span className="text-dark-text/70 font-mono ml-1.5">{lesson.minutes}m</span>
      </span>
    </>
  );

  const nodeClass = nodeSurfaceClass({ complete, current, unlocked, boss, quiz: lesson.type === 'quiz' });

  if (unlocked) {
    return (
      <Link
        id={`learn-stop-${lesson.id}`}
        href={href}
        aria-current={current ? 'step' : undefined}
        aria-label={`${lesson.title}, ${lesson.minutes} minutes`}
        onClick={() =>
          captureLearn('learn_lesson_clicked', learnLessonProps(level, lesson, { source: 'node' }))
        }
        className={nodeClass}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      id={`learn-stop-${lesson.id}`}
      aria-label={`${lesson.title} (locked)`}
      className={nodeClass}
      onClick={() =>
        captureLearn(
          'learn_gate_blocked',
          learnLessonProps(level, lesson, { source: 'node', playable: lesson.playable }),
        )
      }
    >
      {inner}
    </button>
  );
}

function LockedLevelNode({
  level,
  desktop,
  offset,
}: {
  level: LearnLevel;
  desktop: boolean;
  offset: number;
}) {
  const labelSide = offset >= 0 ? 'left' : 'right';
  const first = level.lessons[0];
  return (
    <button
      type="button"
      id={`learn-stop-level-${level.slug}`}
      aria-label={`Level ${level.number} ${level.name} (coming next)`}
      className={nodeSurfaceClass({ complete: false, current: false, unlocked: false, boss: true, quiz: false })}
      onClick={() =>
        captureLearn(
          'learn_gate_blocked',
          first
            ? learnLessonProps(level, first, { source: 'node', playable: false })
            : learnLevelProps(level, { source: 'node', playable: false }),
        )
      }
    >
      <Lock size={16} />
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-dark-text tabular-nums whitespace-nowrap">
        {level.lessons.length} ahead
      </span>
      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity ${
          desktop ? '' : 'hidden'
        } ${labelSide === 'left' ? 'right-[calc(100%+14px)] text-right' : 'left-[calc(100%+14px)] text-left'}`}
      >
        <span className="text-dark-text">{level.name} — coming next</span>
      </span>
    </button>
  );
}

function nodeSurfaceClass({
  complete,
  current,
  unlocked,
  boss,
  quiz,
}: {
  complete: boolean;
  current: boolean;
  unlocked: boolean;
  boss: boolean;
  quiz: boolean;
}): string {
  const shape = quiz ? 'rounded-xl' : 'rounded-full';
  const size = boss ? 'w-16 h-16 md:w-[4.25rem] md:h-[4.25rem]' : 'w-14 h-14 md:w-16 md:h-16';
  const state = complete
    ? 'border-success/50 bg-success/15 text-success'
    : current
      ? 'border-primary bg-primary/20 text-primary learn-node-current'
      : unlocked
        ? 'border-primary/40 bg-background text-light-text hover:border-primary hover:bg-primary/10 hover:text-primary'
        : 'border-border bg-surface text-dark-text/55 cursor-not-allowed';
  return `group relative ${size} ${shape} border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${state}`;
}
