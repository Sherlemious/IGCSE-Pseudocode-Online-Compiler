'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, BookOpen, Check, Code2, Crown, Lock } from 'lucide-react';
import { authHref } from '@/modules/auth/callback';
import { IGCSE_PAPER_2 } from './curriculum';
import LearnEditorPane from './LearnEditorPane';
import { flattenLessons, lessonHref, nextLesson, previousLesson } from './path';
import {
  isComplete,
  isLessonUnlocked,
  isSequentiallyOpen,
  loadProgress,
  markAttempt,
  markComplete,
  type ProgressMap,
} from './progress';
import { hydrateLearnProgress, persistLearnProgress } from './progressSync';
import { captureLearn, learnCourseProps, learnLessonProps, learnLevelProps } from './telemetry';
import type { LearnLesson, LearnLevel, QuizItem } from './types';

type Props = {
  level: LearnLevel;
  lesson: LearnLesson;
  premiumAccess: boolean;
};

export default function LearnPlayer({ level, lesson, premiumAccess: initialPremium }: Props) {
  const router = useRouter();
  const { status } = useSession();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [premiumAccess, setPremiumAccess] = useState(initialPremium);
  const [mobilePane, setMobilePane] = useState<'lesson' | 'editor'>('lesson');
  const startedFor = useRef<string | null>(null);
  const isQuiz = lesson.type === 'quiz';
  const hasEditor = Boolean(lesson.starterCode);
  const access = { premium: premiumAccess };

  useEffect(() => {
    setPremiumAccess(initialPremium);
  }, [initialPremium]);

  useEffect(() => {
    if (status === 'loading') return;
    let cancelled = false;
    setMobilePane('lesson');
    void (async () => {
      const local = loadProgress();
      if (!cancelled) setProgress(local);
      const hydrated = status === 'authenticated' ? await hydrateLearnProgress() : null;
      if (cancelled) return;
      const map = hydrated?.progress ?? local;
      setProgress(map);
      if (typeof hydrated?.premiumAccess === 'boolean') setPremiumAccess(hydrated.premiumAccess);
      if (startedFor.current === lesson.id) return;
      startedFor.current = lesson.id;
      const open = isLessonUnlocked(IGCSE_PAPER_2, lesson, map, {
        premium: hydrated?.premiumAccess ?? initialPremium,
      });
      if (!lesson.playable || !open) {
        const sequential = isSequentiallyOpen(IGCSE_PAPER_2, lesson, map);
        const paywalled = sequential && lesson.playable;
        captureLearn(
          'learn_gate_viewed',
          learnLessonProps(level, lesson, {
            unlocked: open,
            source: paywalled ? 'paywall' : 'player',
          }),
        );
        if (paywalled) {
          captureLearn(
            'learn_gate_blocked',
            learnLessonProps(level, lesson, { unlocked: false, source: 'paywall' }),
          );
        }
        return;
      }
      captureLearn(
        'learn_lesson_started',
        learnLessonProps(level, lesson, { already_complete: isComplete(map, lesson.id) }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [level, lesson, status, initialPremium]);

  const sequential = isSequentiallyOpen(IGCSE_PAPER_2, lesson, progress);
  const unlocked = isLessonUnlocked(IGCSE_PAPER_2, lesson, progress, access);
  const done = isComplete(progress, lesson.id);
  const prev = previousLesson(IGCSE_PAPER_2, lesson.id);
  const next = nextLesson(IGCSE_PAPER_2, lesson.id);
  const playableIndex = level.lessons.filter((item) => item.playable).findIndex((item) => item.id === lesson.id);

  const goNext = useCallback(() => {
    const toLesson = Boolean(next?.lesson.playable);
    captureLearn(
      'learn_next_clicked',
      learnLessonProps(level, lesson, {
        destination: toLesson ? 'lesson' : 'path',
        next_lesson: toLesson && next ? `${next.level.slug}/${next.lesson.slug}` : null,
      }),
    );
    if (toLesson && next) {
      router.push(lessonHref(next.level, next.lesson));
      return;
    }
    router.push('/learn');
  }, [lesson, level, next, router]);

  const handlePassed = useCallback(
    (attempts: number) => {
      const already = isComplete(loadProgress(), lesson.id);
      const map = markComplete(lesson.id, attempts);
      setProgress(map);
      const entry = map[lesson.id];
      if (entry) void persistLearnProgress({ [lesson.id]: entry });
      if (already) return;
      const course = learnCourseProps(map);
      captureLearn('learn_lesson_completed', {
        ...learnLessonProps(level, lesson, { attempts }),
        ...course,
        $set: {
          learn_level: level.number,
          learn_completed_count: course.completed_count,
        },
        $set_once: { learn_started_at: new Date().toISOString() },
      });
      const remainingOnLevel = level.lessons.filter((item) => item.playable && !isComplete(map, item.id));
      if (remainingOnLevel.length === 0) {
        captureLearn('learn_level_completed', learnLevelProps(level, course));
      }
      const remainingPlayable = flattenLessons(IGCSE_PAPER_2).filter(
        (item) => item.lesson.playable && !isComplete(map, item.lesson.id),
      );
      if (remainingPlayable.length === 0) {
        captureLearn('learn_path_completed', course);
      }
    },
    [lesson, level],
  );

  if (!lesson.playable || !unlocked) {
    const paywalled = lesson.playable && sequential && !premiumAccess && !level.free;
    const lessonPath = lessonHref(level, lesson);
    return (
      <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid px-4 py-8 sm:py-10">
        <div className="max-w-lg mx-auto rounded-2xl border border-border bg-surface p-5 sm:p-6">
          {paywalled ? (
            <Crown className="h-5 w-5 text-warning mb-3" />
          ) : (
            <Lock className="h-5 w-5 text-dark-text mb-3" />
          )}
          <h1 className="display-serif text-xl font-semibold text-light-text mb-2">{lesson.title}</h1>
          <p className="text-sm text-dark-text mb-4">
            {paywalled
              ? 'Levels 4–10 are part of the Student and teacher plans. Upgrade, or join a class from a teacher who has one.'
              : 'Complete the previous lesson to unlock this one.'}
          </p>
          {paywalled && (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {status !== 'authenticated' ? (
                <Link
                  href={authHref('signin', lessonPath)}
                  className="inline-flex items-center min-h-10 px-3 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25"
                >
                  Sign in to continue
                </Link>
              ) : (
                <Link
                  href="/pricing?view=student"
                  className="inline-flex items-center gap-1.5 min-h-10 px-3 rounded-lg bg-warning/15 text-warning text-sm font-medium hover:bg-warning/25"
                >
                  <Crown size={14} />
                  See student plans
                </Link>
              )}
            </div>
          )}
          <Link
            href="/learn"
            className="text-sm text-primary hover:underline"
            onClick={() =>
              captureLearn('learn_path_clicked', learnLessonProps(level, lesson, { source: 'gate' }))
            }
          >
            Back to the path
          </Link>
        </div>
      </div>
    );
  }

  const showLesson = mobilePane === 'lesson' || (isQuiz && !hasEditor);
  const showEditor = hasEditor && mobilePane === 'editor';
  const nextLabel = next?.lesson.playable ? 'Next' : 'Path';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background min-w-0">
      <div className="shrink-0 border-b border-border px-2 sm:px-4 py-2 flex items-center gap-2 min-w-0">
        <Link
          href="/learn"
          className="text-dark-text hover:text-primary flex items-center gap-1 text-xs shrink-0 min-h-9 px-1"
          aria-label="Back to the path"
          onClick={() =>
            captureLearn('learn_path_clicked', learnLessonProps(level, lesson, { source: 'header' }))
          }
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Path</span>
        </Link>
        <span className="hidden md:inline text-[10px] uppercase tracking-wider text-primary/80 shrink-0">
          Level {level.number} · {level.name}
        </span>
        <span className="md:hidden font-mono text-[10px] text-primary/80 shrink-0 tabular-nums">
          {level.number}.{playableIndex >= 0 ? playableIndex + 1 : 0}
        </span>
        <h1 className="text-sm font-medium text-light-text truncate min-w-0 flex-1">{lesson.title}</h1>
        {done && <Check size={14} className="text-success shrink-0 hidden sm:block" />}
        <span className="text-[10px] font-mono text-dark-text tabular-nums shrink-0">
          {playableIndex >= 0 ? playableIndex + 1 : 0}/{level.lessons.filter((item) => item.playable).length}
        </span>
        {done && (
          <button
            type="button"
            onClick={goNext}
            className="shrink-0 inline-flex items-center gap-1 min-h-9 px-2 text-xs font-semibold text-primary hover:underline"
          >
            {nextLabel}
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {!isQuiz || hasEditor ? (
        <div className="lg:hidden flex shrink-0 border-b border-border bg-surface">
          <button
            type="button"
            onClick={() => {
              setMobilePane('lesson');
              captureLearn('learn_pane_changed', learnLessonProps(level, lesson, { pane: 'lesson' }));
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 min-h-10 py-1.5 text-xs font-medium transition-colors ${
              showLesson ? 'text-light-text border-b-2 border-primary' : 'text-dark-text'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            Lesson
          </button>
          <button
            type="button"
            onClick={() => {
              setMobilePane('editor');
              captureLearn('learn_pane_changed', learnLessonProps(level, lesson, { pane: 'editor', source: 'tab' }));
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 min-h-10 py-1.5 text-xs font-medium transition-colors ${
              showEditor ? 'text-light-text border-b-2 border-primary' : 'text-dark-text'
            }`}
          >
            <Code2 className="h-3 w-3" />
            Editor
            {done && <Check size={12} className="text-success" />}
          </button>
        </div>
      ) : null}

      <div className="flex-1 min-h-0 min-w-0 flex flex-col lg:grid lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:grid-rows-1">
        <aside
          className={`min-h-0 overflow-y-auto overflow-x-hidden border-b lg:border-b-0 lg:border-r border-border p-4 scrollbar-pretty lg:h-full ${
            showLesson ? 'flex-1 lg:flex-none' : 'hidden lg:block'
          }`}
        >
          <p className="mono-label text-primary/70 mb-2">Why this is on Paper 2</p>
          <p className="text-sm text-light-text mb-4">{lesson.why}</p>
          <div className="text-sm text-dark-text leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: (props) => <p className="mb-3" {...props} />,
                strong: (props) => <strong className="text-light-text font-semibold" {...props} />,
                ul: (props) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                li: (props) => <li {...props} />,
                table: (props) => (
                  <table className="w-full text-xs border-collapse my-3 font-mono" {...props} />
                ),
                th: (props) => (
                  <th className="border border-border bg-surface px-2 py-1 text-left text-light-text" {...props} />
                ),
                td: (props) => <td className="border border-border px-2 py-1" {...props} />,
                code: ({ className, children, ...props }) => {
                  const content = String(children);
                  const isInline = !className && !content.includes('\n');
                  if (isInline) {
                    return (
                      <code className="font-mono text-[0.82em] px-1 py-0.5 rounded bg-surface border border-border text-info break-all" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="font-mono text-xs text-light-text" {...props}>
                      {children}
                    </code>
                  );
                },
                pre: (props) => (
                  <pre className="my-3 p-3 rounded-md border border-border bg-code-bg overflow-x-auto text-xs" {...props} />
                ),
              }}
            >
              {lesson.body}
            </ReactMarkdown>
          </div>
          {lesson.trap && (
            <p className="mt-3 text-xs text-warning border border-warning/25 bg-warning/5 rounded-lg px-3 py-2">
              {lesson.trap}
            </p>
          )}
          {lesson.docsAnchor && (
            <Link
              href={`/docs#${lesson.docsAnchor}`}
              className="inline-block mt-3 text-xs text-primary hover:underline"
              onClick={() =>
                captureLearn(
                  'learn_docs_clicked',
                  learnLessonProps(level, lesson, { docs_anchor: lesson.docsAnchor }),
                )
              }
            >
              Docs: {lesson.docsAnchor}
            </Link>
          )}

          {lesson.type === 'quiz' && lesson.quiz && (
            <QuizBlock
              items={lesson.quiz}
              alreadyDone={done}
              onPassed={handlePassed}
              level={level}
              lesson={lesson}
            />
          )}

          {!isQuiz || hasEditor ? (
            <button
              type="button"
              onClick={() => {
                setMobilePane('editor');
                captureLearn(
                  'learn_pane_changed',
                  learnLessonProps(level, lesson, { pane: 'editor', source: 'cta' }),
                );
              }}
              className="lg:hidden mt-5 w-full min-h-11 rounded-lg bg-primary text-on-primary text-sm font-semibold"
            >
              Open editor
            </button>
          ) : null}

          {(prev || done) && (
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
              {prev ? (
                <Link
                  href={lessonHref(prev.level, prev.lesson)}
                  className="text-xs text-dark-text hover:text-primary min-h-9 inline-flex items-center"
                  onClick={() =>
                    captureLearn(
                      'learn_prev_clicked',
                      learnLessonProps(level, lesson, {
                        prev_lesson: `${prev.level.slug}/${prev.lesson.slug}`,
                      }),
                    )
                  }
                >
                  Previous
                </Link>
              ) : (
                <span />
              )}
              {done && (
                <button
                  type="button"
                  onClick={goNext}
                  className="ml-auto inline-flex items-center gap-1 min-h-9 text-xs font-semibold text-primary hover:underline"
                >
                  {next?.lesson.playable ? 'Next lesson' : 'Back to path'}
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          )}
        </aside>

        <div
          className={`min-h-0 min-w-0 p-2 sm:p-3 lg:p-4 lg:h-full flex-col ${
            hasEditor ? (showEditor ? 'flex flex-1' : 'hidden lg:flex') : 'hidden lg:flex'
          }`}
        >
          {hasEditor ? (
            <LearnEditorPane
              level={level}
              lesson={lesson}
              onPassed={(attempts) => {
                handlePassed(attempts);
                setMobilePane('editor');
              }}
            />
          ) : (
            <div className="h-full min-h-[160px] w-full rounded-xl border border-dashed border-border bg-surface/40 flex items-center justify-center text-sm text-dark-text px-6 text-center">
              Answer the questions on the left. No editor for this one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizBlock({
  items,
  alreadyDone,
  onPassed,
  level,
  lesson,
}: {
  items: QuizItem[];
  alreadyDone: boolean;
  onPassed: (attempts: number) => void;
  level: LearnLevel;
  lesson: LearnLesson;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(alreadyDone);
  const [attempts, setAttempts] = useState(alreadyDone ? 1 : 0);

  const allCorrect = useMemo(() => {
    return items.every((item, i) => answers[i] === item.correctId);
  }, [answers, items]);

  const handleSubmit = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setSubmitted(true);
    const correctCount = items.filter((item, i) => answers[i] === item.correctId).length;
    const ok = correctCount === items.length;
    captureLearn(
      'learn_quiz_submitted',
      learnLessonProps(level, lesson, {
        ok,
        attempts: nextAttempts,
        correct_count: correctCount,
        total: items.length,
        already_done: alreadyDone,
      }),
    );
    if (ok) {
      onPassed(nextAttempts);
    } else {
      const map = markAttempt(lesson.id, { lastOk: false, lastReason: 'quiz' });
      const entry = map[lesson.id];
      if (entry) void persistLearnProgress({ [lesson.id]: entry });
    }
  };

  return (
    <div className="mt-5 space-y-4">
      {items.map((item, i) => {
        const picked = answers[i];
        return (
          <fieldset key={item.prompt} className="space-y-2">
            <legend className="text-sm font-medium text-light-text mb-2">
              {i + 1}. {item.prompt}
            </legend>
            {item.options.map((option) => {
              const selected = picked === option.id;
              const showMark = submitted && selected;
              const correct = option.id === item.correctId;
              return (
                <label
                  key={option.id}
                  className={`flex items-start gap-2 px-3 py-2.5 min-h-11 rounded-lg border text-sm cursor-pointer ${
                    showMark && correct
                      ? 'border-success/40 bg-success/10 text-success'
                      : showMark && !correct
                        ? 'border-error/40 bg-error/10 text-error'
                        : selected
                          ? 'border-primary/40 bg-primary/5 text-light-text'
                          : 'border-border text-dark-text hover:border-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    className="accent-[var(--color-primary)] mt-0.5 shrink-0"
                    checked={selected}
                    onChange={() => {
                      setSubmitted(false);
                      setAnswers((prev) => ({ ...prev, [i]: option.id }));
                    }}
                  />
                  <span className="min-w-0 break-words">{option.label}</span>
                </label>
              );
            })}
            {submitted && picked && (
              <p className="text-xs text-dark-text">{item.explanation}</p>
            )}
          </fieldset>
        );
      })}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < items.length}
        className="px-3 py-2.5 min-h-11 sm:min-h-0 sm:py-1.5 rounded-md bg-primary text-on-primary text-sm sm:text-xs font-semibold disabled:opacity-40 w-full sm:w-auto"
      >
        Check answers
      </button>
      {submitted && !allCorrect && !alreadyDone && (
        <p className="text-xs text-error">Not all correct — read the notes and try again.</p>
      )}
      {alreadyDone && (
        <p className="text-xs text-success">Already completed. You can still change answers to review.</p>
      )}
    </div>
  );
}
