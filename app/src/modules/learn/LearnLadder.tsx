'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle, Lock, Route } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { IGCSE_PAPER_2 } from './curriculum';
import { lessonHref } from './path';
import {
  isComplete,
  isLessonUnlocked,
  levelCompletedCount,
  loadProgress,
  nextIncomplete,
  playableCount,
  type ProgressMap,
} from './progress';

export default function LearnLadder() {
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
    captureEvent('learn_opened', {
      course: IGCSE_PAPER_2.id,
      from: searchParams.get('from') ?? 'direct',
    });
  }, [searchParams]);

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
  const nextHref = next ? `/learn/${next.levelSlug}/${next.lessonSlug}` : null;
  const allPlayableDone = ready && !next;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-background bg-dot-grid text-light-text scrollbar-pretty">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="mono-label text-primary/70 mb-2 flex items-center gap-1.5">
          <Route size={12} />
          IGCSE 0478 / 0984 / 2210
        </div>
        <h1 className="display-serif text-[1.5rem] sm:text-[1.75rem] leading-tight font-semibold mb-2">{IGCSE_PAPER_2.title}</h1>
        <p className="text-sm text-dark-text max-w-xl mb-6">{IGCSE_PAPER_2.subtitle}</p>

        {ready && nextHref && (
          <Link
            href={nextHref}
            className="group flex items-center gap-3 mb-6 sm:mb-8 pl-3.5 pr-4 py-3 min-h-14 rounded-xl border border-primary/25 bg-primary/[0.06] hover:bg-primary/10 hover:border-primary/40 transition-colors"
          >
            <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
              <ArrowRight size={14} className="text-primary group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="min-w-0">
              <div className="mono-label text-primary/70 mb-0.5">Continue</div>
              <div className="text-sm font-medium truncate">
                {labelFor(next!.levelSlug, next!.lessonSlug)}
              </div>
            </div>
          </Link>
        )}

        {allPlayableDone && (
          <div className="mb-8 px-4 py-3 rounded-xl border border-success/25 bg-success/5 text-sm text-success">
            Levels 1–3 complete. Levels 4–10 are on the map and will unlock as we ship them.
          </div>
        )}

        <ol className="space-y-3">
          {IGCSE_PAPER_2.levels.map((level) => {
            const total = playableCount(level) || level.lessons.length;
            const done = levelCompletedCount(level, progress);
            const open = level.playable;
            const first = level.lessons[0];
            const firstUnlocked = first ? isLessonUnlocked(IGCSE_PAPER_2, first, progress) : false;

            return (
              <li
                key={level.slug}
                className={`rounded-2xl border bg-surface overflow-hidden ${
                  open ? 'border-border' : 'border-border/60 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs ${
                      open && done === total && total > 0
                        ? 'border-success/40 text-success bg-success/10'
                        : open
                          ? 'border-primary/30 text-primary bg-primary/10'
                          : 'border-border text-dark-text'
                    }`}
                  >
                    {open && done === total && total > 0 ? <CheckCircle size={14} /> : level.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-semibold">{level.name}</h2>
                      {level.free ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-success/25 text-success">Free</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-dark-text">Coming next</span>
                      )}
                      <span className="text-[10px] text-dark-text font-mono ml-auto tabular-nums">
                        {open ? `${done}/${total}` : `${level.hours}h`}
                      </span>
                    </div>
                    <p className="text-xs text-dark-text mt-0.5 break-words">{level.leaveWith}</p>
                  </div>
                </div>

                <ul className="border-t border-border/80 divide-y divide-border/60">
                  {level.lessons.map((lesson) => {
                    const complete = isComplete(progress, lesson.id);
                    const unlocked = isLessonUnlocked(IGCSE_PAPER_2, lesson, progress);
                    const href = lessonHref(level, lesson);

                    const inner = (
                      <>
                        {complete ? (
                          <CheckCircle size={14} className="text-success shrink-0" />
                        ) : unlocked ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-primary/40 shrink-0" />
                        ) : (
                          <Lock size={13} className="text-dark-text/50 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                        <span className="ml-auto text-[10px] text-dark-text/60 font-mono shrink-0">{lesson.minutes}m</span>
                      </>
                    );

                    if (unlocked) {
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={href}
                            className="flex items-center gap-2 px-4 py-2.5 min-h-11 text-sm text-light-text hover:bg-primary/5 hover:text-primary"
                          >
                            {inner}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-4 py-2.5 min-h-11 text-sm text-dark-text/70 cursor-not-allowed"
                          onClick={() => {
                            captureEvent('learn_gate_blocked', {
                              course: IGCSE_PAPER_2.id,
                              level: level.number,
                              lesson: lesson.id,
                              playable: lesson.playable,
                            });
                          }}
                        >
                          {inner}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {open && first && firstUnlocked && done === 0 && (
                  <div className="px-4 py-2 border-t border-border/80">
                    <Link href={lessonHref(level, first)} className="text-xs font-semibold text-primary hover:underline">
                      Start {level.name}
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function labelFor(levelSlug: string, lessonSlug: string): string {
  const level = IGCSE_PAPER_2.levels.find((item) => item.slug === levelSlug);
  const lesson = level?.lessons.find((item) => item.slug === lessonSlug);
  if (!level || !lesson) return 'Continue';
  return `Level ${level.number} · ${lesson.title}`;
}
