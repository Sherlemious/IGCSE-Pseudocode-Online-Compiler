'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, Crown, Play, Trophy } from 'lucide-react';
import CourseChooser from './CourseChooser';
import LearnPathMap from './LearnPathMap';
import { findLesson, flattenLessons, lessonHref } from './path';
import { formatMinutes } from './pathTheme';
import { isComplete, loadProgress, nextIncomplete, type ProgressMap } from './progress';
import { hydrateLearnProgress } from './progressSync';
import { captureLearn, learnCourseProps, learnLessonProps } from './telemetry';
import type { LearnCourse } from './types';

export default function LearnLadder({
  course,
  premiumAccess: initialPremium,
}: {
  course: LearnCourse;
  premiumAccess: boolean;
}) {
  const playable = useMemo(
    () => flattenLessons(course).filter((item) => item.lesson.playable),
    [course],
  );
  const playableMinutes = playable.reduce((sum, item) => sum + item.lesson.minutes, 0);
  const freeLevels = course.levels.filter((level) => level.free);
  const freeRange =
    freeLevels.length > 0
      ? `Levels ${freeLevels[0]!.number}–${freeLevels[freeLevels.length - 1]!.number}`
      : null;
  const paidLevels = course.levels.filter((level) => !level.free);
  const paidRange =
    paidLevels.length > 0
      ? `Levels ${paidLevels[0]!.number}–${paidLevels[paidLevels.length - 1]!.number}`
      : null;
  const freeLessons = playable.filter((item) => item.level.free);
  const firstPaid = playable.find((item) => !item.level.free);
  const firstPaidHref = firstPaid
    ? lessonHref(firstPaid.level, firstPaid.lesson, course.basePath)
    : null;
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [premiumAccess, setPremiumAccess] = useState(initialPremium);
  const [ready, setReady] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;
    let cancelled = false;
    void (async () => {
      const hydrated = status === 'authenticated' ? await hydrateLearnProgress(course.id) : null;
      if (cancelled) return;
      const map = hydrated?.progress ?? loadProgress(course.id);
      setProgress(map);
      if (typeof hydrated?.premiumAccess === 'boolean') setPremiumAccess(hydrated.premiumAccess);
      setReady(true);
      if (opened.current) return;
      opened.current = true;
      const next = nextIncomplete(course, map);
      captureLearn('learn_opened', {
        ...learnCourseProps(map, course),
        from: searchParams.get('from') ?? 'direct',
        signed_in: status === 'authenticated',
        next_lesson: next ? `${next.levelSlug}/${next.lessonSlug}` : null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [course, searchParams, status]);

  useEffect(() => {
    const onChange = () => setProgress(loadProgress(course.id));
    window.addEventListener('learn-progress-changed', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('learn-progress-changed', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [course.id]);

  // Computed from whatever progress we have so the first node reads as "current"
  // before hydration for a fresh visitor; the Continue card waits for `ready`.
  const next = nextIncomplete(course, progress);
  const nextFound = next ? findLesson(course, next.levelSlug, next.lessonSlug) : null;
  const nextHref = nextFound
    ? `${course.basePath}/${nextFound.level.slug}/${nextFound.lesson.slug}`
    : null;
  const allPlayableDone = ready && !next;
  const freeDone = freeLessons.every((item) => isComplete(progress, item.lesson.id));
  const showUpgrade = ready && freeDone && !premiumAccess && !allPlayableDone;
  const completed = playable.filter((item) => isComplete(progress, item.lesson.id)).length;
  const pct = playable.length > 0 ? Math.round((completed / playable.length) * 100) : 0;

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
        <CourseChooser courseId={course.id} completed={completed} total={playable.length} />

        <p className="mt-5 text-sm sm:text-[15px] text-dark-text max-w-xl leading-relaxed">
          {course.subtitle}
        </p>
        <p className="mt-2 font-mono text-[11px] text-dark-text tabular-nums">
          <span className="text-light-text font-semibold">{playable.length} lessons</span>
          {' · '}
          {formatMinutes(playableMinutes)} to finish
        </p>
        {course.basePath === '/learn' && (
          <p className="mt-2 text-sm text-dark-text">
            New to this?{' '}
            <Link
              href="/tutorial"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              Read the written O Level tutorial first
            </Link>
            .
          </p>
        )}

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
                {completed}/{playable.length}
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

        {status === 'unauthenticated' && (
          <p className="mt-3 text-xs text-dark-text">
            <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(course.basePath)}`} className="text-primary hover:underline">
              Sign in
            </Link>{' '}
            to save progress across devices.
          </p>
        )}

        {allPlayableDone && (
          <div className="mt-6 sm:mt-8 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-success/30 bg-success/[0.07]">
            <span className="shrink-0 w-10 h-10 rounded-xl bg-success/15 border border-success/30 text-success flex items-center justify-center">
              <Trophy size={16} />
            </span>
            <div className="min-w-0">
              <div className="mono-label text-success mb-0.5">Path complete</div>
              <div className="text-sm text-light-text">{course.completeNote}</div>
            </div>
          </div>
        )}

        {showUpgrade && status === 'authenticated' && (
          <div className="mt-6 sm:mt-8 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-warning/30 bg-warning/[0.07]">
            <span className="shrink-0 w-10 h-10 rounded-xl bg-warning/15 border border-warning/30 text-warning flex items-center justify-center">
              <Crown size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mono-label text-warning mb-0.5">{freeRange} complete</div>
              <div className="text-sm text-light-text">
                Unlock {paidRange} with a Student plan, or join a class from a teacher who has one.
              </div>
            </div>
            <Link
              href="/pricing?view=student"
              className="shrink-0 text-sm font-semibold text-warning hover:underline"
            >
              See plans
            </Link>
          </div>
        )}
        {showUpgrade && status === 'unauthenticated' && firstPaidHref && (
          <div className="mt-6 sm:mt-8 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-primary/30 bg-primary/[0.07]">
            <span className="shrink-0 w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center">
              <Crown size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mono-label text-primary mb-0.5">{freeRange} complete</div>
              <div className="text-sm text-light-text">
                Create a free account to continue into {paidRange}.
              </div>
            </div>
            <Link
              href={firstPaidHref}
              className="shrink-0 text-sm font-semibold text-primary hover:underline"
            >
              Continue
            </Link>
          </div>
        )}
      </div>

      <LearnPathMap
        course={course}
        progress={progress}
        nextLessonId={nextFound?.lesson.id ?? null}
        ready={ready}
        completedCount={completed}
        premiumAccess={premiumAccess}
      />
    </div>
  );
}

