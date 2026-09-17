'use client';

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Flag, Lock } from 'lucide-react';
import { IGCSE_PAPER_2 } from './curriculum';
import { lessonHref } from './path';
import {
  curveThrough,
  isBossLesson,
  layoutPath,
  leadingCompleted,
  progressAlongPath,
  type LevelSection,
  type Side,
} from './pathLayout';
import { TRACK, formatMinutes, lessonTypeMeta, levelHue, levelMinutes, pad2 } from './pathTheme';
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
const SECTION_PATHS = LAYOUT.sections.map((section) =>
  curveThrough(section.stops.map((stop) => ({ x: stop.x, y: stop.y }))),
);

type NodeState = 'complete' | 'current' | 'open' | 'gated';
type BannerState = 'complete' | 'current' | 'upcoming';

type Props = {
  progress: ProgressMap;
  nextLessonId: string | null;
  ready: boolean;
  completedCount: number;
};

export default function LearnPathMap({ progress, nextLessonId, ready, completedCount }: Props) {
  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const stop of LAYOUT.stops) {
      if (isComplete(progress, stop.lesson.id)) ids.add(stop.lesson.id);
    }
    return ids;
  }, [progress]);

  // Bring a returning student to their next node. First-time visitors keep the hero.
  const scrolled = useRef(false);
  useEffect(() => {
    if (!ready || !nextLessonId || completedCount === 0 || scrolled.current) return;
    scrolled.current = true;
    const nodes = document.querySelectorAll<HTMLElement>(`[data-learn-stop="${nextLessonId}"]`);
    const visible = Array.from(nodes).find((node) => node.offsetParent !== null);
    visible?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [ready, nextLessonId, completedCount]);

  return (
    <>
      {/* Phones: level banner + rail list, every lesson titled and tappable. */}
      <div className="md:hidden px-4 pb-12 space-y-10">
        {LAYOUT.sections.map((section) => (
          <MobileSection
            key={section.level.slug}
            section={section}
            progress={progress}
            completedIds={completedIds}
            nextLessonId={nextLessonId}
          />
        ))}
        <Roadmap levels={LAYOUT.ahead} />
      </div>

      {/* Desktop: the winding map. */}
      <div className="hidden md:block max-w-3xl mx-auto px-6 pb-16">
        <nav aria-label="Paper 2 Path" className="relative" style={{ height: LAYOUT.height }}>
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
            </defs>
            {LAYOUT.sections.map((section, i) => {
              const d = SECTION_PATHS[i]!;
              const lit = progressAlongPath(section.stops, completedIds);
              return (
                <g key={section.level.slug}>
                  <path
                    d={d}
                    fill="none"
                    stroke={TRACK}
                    strokeWidth="6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Halo as a second wide stroke rather than a blur filter: the viewBox
                      scales x and y differently, so a Gaussian blur smears sideways. */}
                  {lit > 0 && (
                    <>
                      <path
                        d={d}
                        fill="none"
                        stroke="url(#learn-path-lit)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        opacity="0.16"
                        pathLength={1}
                        strokeDasharray={`${lit} 1`}
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d={d}
                        fill="none"
                        stroke="url(#learn-path-lit)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray={`${lit} 1`}
                        vectorEffect="non-scaling-stroke"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {LAYOUT.sections.map((section) => (
            <DesktopSection
              key={section.level.slug}
              section={section}
              progress={progress}
              nextLessonId={nextLessonId}
            />
          ))}
        </nav>
        <Roadmap levels={LAYOUT.ahead} />
      </div>
    </>
  );
}

/* ── State helpers ─────────────────────────────────────────── */

function nodeState(lesson: LearnLesson, progress: ProgressMap, nextLessonId: string | null): NodeState {
  if (isComplete(progress, lesson.id)) return 'complete';
  if (lesson.id === nextLessonId) return 'current';
  if (isLessonUnlocked(IGCSE_PAPER_2, lesson, progress)) return 'open';
  return 'gated';
}

function bannerState(level: LearnLevel, progress: ProgressMap, nextLessonId: string | null): BannerState {
  const total = playableCount(level);
  if (total > 0 && levelCompletedCount(level, progress) === total) return 'complete';
  if (level.lessons.some((lesson) => lesson.id === nextLessonId)) return 'current';
  return 'upcoming';
}

/* ── Desktop section: watermark + banner + nodes ───────────── */

function DesktopSection({
  section,
  progress,
  nextLessonId,
}: {
  section: LevelSection;
  progress: ProgressMap;
  nextLessonId: string | null;
}) {
  const { level } = section;
  const hue = levelHue(level);
  // The first node sits on the centre line with its label on the watermark's
  // side, so the numeral starts level with the second node instead.
  const anchor = section.stops[1] ?? section.stops[0];
  const watermark: CSSProperties = {
    top: (anchor?.y ?? section.bannerY + section.bannerHeight) - 60,
    color: hue,
    opacity: 0.07,
  };
  if (section.watermarkSide === 'left') watermark.left = -6;
  else watermark.right = -6;

  return (
    <>
      <span
        aria-hidden
        className="absolute z-0 display-serif font-semibold text-[11rem] leading-none select-none pointer-events-none"
        style={watermark}
      >
        {pad2(level.number)}
      </span>
      <div
        className="absolute left-0 right-0 z-[2]"
        style={{ top: section.bannerY, height: section.bannerHeight }}
      >
        <LevelBanner
          level={level}
          progress={progress}
          state={bannerState(level, progress, nextLessonId)}
          className="h-full"
        />
      </div>
      <ol className="contents">
        {section.stops.map((stop) => (
          <li
            key={stop.id}
            /* Zero-size anchor sitting exactly on the path point; the link
               positions itself around it so the node stays centred. */
            className="absolute z-[1]"
            style={{ left: `${stop.x}%`, top: stop.y }}
          >
            <LessonNode
              level={level}
              lesson={stop.lesson}
              state={nodeState(stop.lesson, progress, nextLessonId)}
              size="lg"
              labelSide={stop.labelSide}
              bubble
            />
          </li>
        ))}
      </ol>
    </>
  );
}

/* ── Mobile section: banner + rail list ────────────────────── */

function MobileSection({
  section,
  progress,
  completedIds,
  nextLessonId,
}: {
  section: LevelSection;
  progress: ProgressMap;
  completedIds: Set<string>;
  nextLessonId: string | null;
}) {
  const lit = leadingCompleted(section.stops, completedIds);
  return (
    <section>
      <LevelBanner
        level={section.level}
        progress={progress}
        state={bannerState(section.level, progress, nextLessonId)}
      />
      <ol className="mt-4">
        {section.stops.map((stop, i) => {
          const last = i === section.stops.length - 1;
          return (
            <li key={stop.id} className="relative">
              {i > 0 && (
                <span
                  aria-hidden
                  className="absolute left-[26px] top-0 h-1/2 w-1"
                  style={{ background: i <= lit ? 'var(--color-success)' : TRACK }}
                />
              )}
              {!last && (
                <span
                  aria-hidden
                  className="absolute left-[26px] top-1/2 h-1/2 w-1"
                  style={{ background: i < lit ? 'var(--color-success)' : TRACK }}
                />
              )}
              <LessonNode
                level={section.level}
                lesson={stop.lesson}
                state={nodeState(stop.lesson, progress, nextLessonId)}
                size="sm"
                row
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ── Level banner ──────────────────────────────────────────── */

function LevelBanner({
  level,
  progress,
  state,
  className = '',
}: {
  level: LearnLevel;
  progress: ProgressMap;
  state: BannerState;
  className?: string;
}) {
  const hue = levelHue(level);
  const total = playableCount(level) || level.lessons.length;
  const done = levelCompletedCount(level, progress);
  const style: CSSProperties = {
    background: `linear-gradient(135deg, color-mix(in srgb, ${hue} 18%, var(--color-surface)) 0%, var(--color-surface) 68%)`,
    borderColor: `color-mix(in srgb, ${hue} ${state === 'current' ? 55 : 32}%, var(--color-border))`,
    boxShadow:
      state === 'current'
        ? `0 0 64px -14px color-mix(in srgb, ${hue} 75%, transparent), 0 1px 2px rgba(0, 0, 0, 0.25)`
        : '0 1px 2px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${className}`} style={style}>
      <span
        aria-hidden
        className="absolute -top-12 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none"
        style={{ background: `color-mix(in srgb, ${hue} 22%, transparent)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="mono-label font-semibold" style={{ color: hue }}>
              Level {pad2(level.number)}
            </span>
            {level.free && <Chip tone="success">Free</Chip>}
            {state === 'current' && <Chip tone="primary">Up next</Chip>}
            {state === 'complete' && (
              <Chip tone="success">
                <Check size={10} strokeWidth={3} />
                Complete
              </Chip>
            )}
          </div>
          <div
            className="shrink-0 flex items-center gap-1.5"
            aria-label={`${done} of ${total} lessons complete`}
          >
            {level.lessons.map((lesson) => (
              <span
                key={lesson.id}
                className="h-1.5 w-4 sm:w-5 rounded-full"
                style={{ background: isComplete(progress, lesson.id) ? 'var(--color-success)' : TRACK }}
              />
            ))}
            <span className="font-mono text-[11px] tabular-nums text-dark-text ml-1">
              {done}/{total}
            </span>
          </div>
        </div>
        <h2 className="display-serif text-[1.65rem] font-semibold leading-tight mt-1.5 text-light-text">
          {level.name}
        </h2>
        <p className="text-sm text-dark-text mt-1 leading-snug">{level.leaveWith}</p>
        <p className="mono-label text-dark-text/80 mt-3 tabular-nums">
          § {level.syllabus} · {level.lessons.length} lessons · {formatMinutes(levelMinutes(level))}
        </p>
      </div>
    </div>
  );
}

function Chip({ tone, children }: { tone: 'success' | 'primary'; children: ReactNode }) {
  const cls =
    tone === 'success'
      ? 'border-success/30 text-success bg-success/10'
      : 'border-primary/30 text-primary bg-primary/10';
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] leading-none px-1.5 py-1 rounded-md border font-medium ${cls}`}
    >
      {children}
    </span>
  );
}

/* ── Lesson node (shared by the map and the mobile list) ───── */

type NodeStyle = CSSProperties & Record<'--learn-node-shade' | '--learn-node-gloss', string>;

/** Padding inside a map lesson's hover pill, in px — also its anchor offset. */
const PILL_PAD = 8;

const NODE_SHADE: Record<NodeState, string> = {
  complete: 'color-mix(in srgb, var(--color-success) 55%, black)',
  current: 'color-mix(in srgb, var(--color-primary) 55%, black)',
  open: 'color-mix(in srgb, var(--color-primary) 45%, black)',
  gated: 'color-mix(in srgb, var(--color-border) 65%, black)',
};

const NODE_GLOSS: Record<NodeState, string> = {
  complete: 'color-mix(in srgb, var(--color-success) 28%, transparent)',
  current: 'color-mix(in srgb, white 22%, transparent)',
  open: 'transparent',
  gated: 'transparent',
};

/**
 * Fills are opaque on purpose: the connector runs to each node's centre, so a
 * translucent face lets the lit path draw straight across the glyph.
 * Tinting toward the page background (rather than a flat success fill) keeps the
 * glyph readable on light and dark themes alike.
 */
const NODE_FILL: Record<NodeState, string> = {
  complete: 'color-mix(in srgb, var(--color-success) 22%, var(--color-background))',
  current: 'var(--color-primary)',
  open: 'color-mix(in srgb, var(--color-primary) 16%, var(--color-background))',
  gated: 'var(--color-surface)',
};

const NODE_FACE: Record<NodeState, string> = {
  complete: 'border-success text-success',
  current: 'learn-node-current border-primary text-on-primary',
  open: 'border-primary/70 text-primary',
  gated: 'border-border text-dark-text/60',
};

function LessonNode({
  level,
  lesson,
  state,
  size,
  labelSide = 'right',
  bubble = false,
  row = false,
}: {
  level: LearnLevel;
  lesson: LearnLesson;
  state: NodeState;
  size: 'sm' | 'lg';
  labelSide?: Side;
  /** Show the bouncing START tag above the current node (desktop only). */
  bubble?: boolean;
  /** Render as a full-width row: node on the left, label inline (mobile). */
  row?: boolean;
}) {
  const meta = lessonTypeMeta(lesson);
  const Icon = meta.icon;
  const boss = isBossLesson(lesson);
  const quiz = lesson.type === 'quiz';
  const href = lessonHref(level, lesson);
  const gated = state === 'gated';

  const shape = boss ? 'rounded-[24px]' : quiz ? 'rounded-2xl' : 'rounded-full';
  const dims = size === 'lg' ? (boss ? 'w-20 h-20' : 'w-[72px] h-[72px]') : 'w-14 h-14';
  const iconSize = size === 'lg' ? (boss ? 26 : 22) : 20;
  const nodeStyle: NodeStyle = {
    '--learn-node-shade': NODE_SHADE[state],
    '--learn-node-gloss': NODE_GLOSS[state],
    background: NODE_FILL[state],
  };

  const face = (
    <span
      className={`learn-node relative shrink-0 flex items-center justify-center ${dims} ${shape} border-2 transition-colors ${NODE_FACE[state]}`}
      style={nodeStyle}
    >
      {state === 'complete' ? (
        <Check size={iconSize + 4} strokeWidth={3.25} />
      ) : (
        <Icon
          size={iconSize}
          strokeWidth={state === 'current' ? 2.5 : 2}
          className={gated ? 'opacity-60' : undefined}
        />
      )}
      {gated && (
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-border bg-background flex items-center justify-center text-dark-text">
          <Lock size={10} />
        </span>
      )}
      {bubble && state === 'current' && (
        <span
          aria-hidden
          className="learn-start-bubble absolute -top-[42px] left-1/2 -translate-x-1/2 mono-label font-bold px-2.5 py-1.5 rounded-lg bg-primary text-on-primary whitespace-nowrap shadow-[0_8px_22px_-8px_rgba(var(--color-primary-rgb),0.7)]"
        >
          Start
          <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-primary" />
        </span>
      )}
    </span>
  );

  const label = (
    <span
      className={
        row ? 'min-w-0 flex-1' : `w-[190px] ${labelSide === 'left' ? 'text-right' : 'text-left'}`
      }
    >
      <span
        className={`block text-[13px] font-medium leading-snug transition-colors ${
          gated ? 'text-dark-text group-hover:text-light-text' : 'text-light-text group-hover:text-primary'
        }`}
      >
        {lesson.title}
      </span>
      <span className="block mono-label mt-1 text-dark-text/70 tabular-nums">
        {meta.label} · {lesson.minutes} min
      </span>
    </span>
  );

  // On the map the label is an in-flow sibling, so the link's box (and therefore
  // its hover surface and hit area) covers the node and its text. The row is
  // anchored by whichever edge keeps the node centred on the path point.
  const half = size === 'lg' ? (boss ? 40 : 36) : 28;
  const shellStyle: CSSProperties | undefined = row
    ? undefined
    : labelSide === 'left'
      ? { right: -(half + PILL_PAD) }
      : { left: -(half + PILL_PAD) };
  const shell = row
    ? 'group relative flex items-center gap-4 w-full min-h-16 py-1.5 pr-2 rounded-xl text-left transition-colors hover:bg-surface/70'
    : `group absolute top-0 -translate-y-1/2 flex items-center gap-4 p-2 rounded-2xl text-left transition-colors hover:bg-surface/70 ${
        labelSide === 'left' ? 'flex-row-reverse' : ''
      }`;
  const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  if (!gated) {
    return (
      <Link
        href={href}
        data-learn-stop={lesson.id}
        aria-current={state === 'current' ? 'step' : undefined}
        aria-label={`${lesson.title}, ${meta.label}, ${lesson.minutes} minutes`}
        onClick={() =>
          captureLearn('learn_lesson_clicked', learnLessonProps(level, lesson, { source: 'node' }))
        }
        className={`${shell} ${focus}`}
        style={shellStyle}
      >
        {face}
        {label}
        {row && state === 'current' && (
          <span className="mono-label text-primary shrink-0 inline-flex items-center gap-1">
            Start
            <ArrowRight size={11} />
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-learn-stop={lesson.id}
      aria-label={`${lesson.title} (locked)`}
      className={`${shell} ${focus} cursor-not-allowed`}
      style={shellStyle}
      onClick={() =>
        captureLearn(
          'learn_gate_blocked',
          learnLessonProps(level, lesson, { source: 'node', playable: lesson.playable }),
        )
      }
    >
      {face}
      {label}
    </button>
  );
}

/* ── Roadmap: the levels that are not playable yet ─────────── */

function Roadmap({ levels }: { levels: LearnLevel[] }) {
  if (levels.length === 0) return null;
  const lessons = levels.reduce((sum, level) => sum + level.lessons.length, 0);
  const hours = levels.reduce((sum, level) => sum + (parseFloat(level.hours) || 0), 0);
  const first = levels[0]!;
  const lastLevel = levels[levels.length - 1]!;

  return (
    <section aria-label="Coming levels" className="mt-6 md:mt-2">
      <div className="flex items-center gap-3">
        <span className="mono-label text-dark-text">Ahead on the path</span>
        <span className="flex-1 h-px" style={{ background: TRACK }} aria-hidden />
        <span className="mono-label text-dark-text/70 tabular-nums">
          {levels.length} levels · {lessons} lessons · {hours} h
        </span>
      </div>
      <p className="text-xs text-dark-text mt-1.5 mb-4">
        Levels {first.number}–{lastLevel.number} unlock as we ship them. Levels 1–3 are being
        measured first.
      </p>
      <ol className="relative">
        <span
          aria-hidden
          className="absolute left-[19px] top-6 bottom-6 border-l-2 border-dashed"
          style={{ borderColor: TRACK }}
        />
        {levels.map((level, i) => {
          const hue = levelHue(level);
          const finish = i === levels.length - 1;
          const firstLesson = level.lessons[0];
          return (
            <li key={level.slug} className="relative">
              <button
                type="button"
                className="group w-full flex items-center gap-4 py-2.5 pr-3 rounded-xl text-left hover:bg-surface/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                onClick={() =>
                  captureLearn(
                    'learn_gate_blocked',
                    firstLesson
                      ? learnLessonProps(level, firstLesson, { source: 'roadmap', playable: false })
                      : learnLevelProps(level, { source: 'roadmap', playable: false }),
                  )
                }
              >
                <span
                  className="relative z-[1] shrink-0 w-10 h-10 rounded-full border-2 bg-background flex items-center justify-center text-dark-text/70 transition-colors group-hover:text-light-text"
                  style={{ borderColor: `color-mix(in srgb, ${hue} 45%, var(--color-border))` }}
                >
                  {finish ? <Flag size={14} /> : <Lock size={13} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="mono-label font-semibold" style={{ color: hue }}>
                      {pad2(level.number)}
                    </span>
                    <span className="display-serif text-lg font-semibold text-light-text leading-tight">
                      {level.name}
                    </span>
                  </span>
                  <span className="block text-xs text-dark-text truncate mt-0.5">{level.leaveWith}</span>
                  <span className="block sm:hidden mono-label text-dark-text/70 tabular-nums mt-1">
                    {level.lessons.length} lessons · {level.hours} h
                  </span>
                </span>
                <span className="hidden sm:block mono-label text-dark-text/70 tabular-nums shrink-0">
                  {level.lessons.length} lessons · {level.hours} h
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
