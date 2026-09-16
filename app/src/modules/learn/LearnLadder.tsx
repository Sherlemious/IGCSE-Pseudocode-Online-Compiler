'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, Route } from 'lucide-react';
import { IGCSE_PAPER_2 } from './curriculum';
import LearnPathMap from './LearnPathMap';
import { findLesson, flattenLessons } from './path';
import {
  isComplete,
  loadProgress,
  nextIncomplete,
  type ProgressMap,
} from './progress';
import { captureLearn, learnCourseProps, learnLessonProps } from './telemetry';

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

  const next = ready ? nextIncomplete(IGCSE_PAPER_2, progress) : null;
  const nextFound = next ? findLesson(IGCSE_PAPER_2, next.levelSlug, next.lessonSlug) : null;
  const nextHref = nextFound ? `/learn/${nextFound.level.slug}/${nextFound.lesson.slug}` : null;
  const allPlayableDone = ready && !next;
  const playable = flattenLessons(IGCSE_PAPER_2).filter((item) => item.lesson.playable);
  const completed = playable.filter((item) => isComplete(progress, item.lesson.id)).length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-background bg-dot-grid text-light-text scrollbar-pretty">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4">
        <div className="mono-label text-primary/70 mb-2 flex items-center gap-1.5">
          <Route size={12} />
          IGCSE 0478 / 0984 / 2210
        </div>
        <h1 className="display-serif text-[1.6rem] sm:text-[2rem] leading-tight font-semibold mb-2">
          {IGCSE_PAPER_2.title}
        </h1>
        <p className="text-sm text-dark-text max-w-xl mb-5">{IGCSE_PAPER_2.subtitle}</p>

        {ready && nextHref && nextFound && (
          <Link
            href={nextHref}
            onClick={() =>
              captureLearn(
                'learn_continue_clicked',
                learnLessonProps(nextFound.level, nextFound.lesson, { source: 'continue' }),
              )
            }
            className="group sticky top-2 z-10 flex items-center gap-3 mb-6 sm:mb-8 pl-3.5 pr-4 py-3 min-h-14 rounded-xl border border-primary/25 bg-background/85 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 transition-colors"
          >
            <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
              <ArrowRight size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="min-w-0">
              <div className="mono-label text-primary/70 mb-0.5">Continue</div>
              <div className="text-sm font-medium truncate">
                Level {nextFound.level.number} · {nextFound.lesson.title}
              </div>
            </div>
            <span className="ml-auto hidden sm:inline font-mono text-[10px] text-dark-text tabular-nums">
              {completed}/{playable.length}
            </span>
          </Link>
        )}

        {allPlayableDone && (
          <div className="mb-8 px-4 py-3 rounded-xl border border-success/25 bg-success/5 text-sm text-success">
            Levels 1–3 complete. Levels 4–10 are on the map and will unlock as we ship them.
          </div>
        )}
      </div>

      <LearnPathMap
        progress={progress}
        nextLessonId={ready ? nextFound?.lesson.id ?? null : null}
        ready={ready}
      />
    </div>
  );
}
