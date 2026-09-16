'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, BookOpen, Check, Code2, Lock } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { IGCSE_PAPER_2 } from './curriculum';
import LearnEditorPane from './LearnEditorPane';
import { lessonHref, nextLesson, previousLesson } from './path';
import {
  isComplete,
  isLessonUnlocked,
  loadProgress,
  markComplete,
  type ProgressMap,
} from './progress';
import type { LearnLesson, LearnLevel, QuizItem } from './types';

type Props = {
  level: LearnLevel;
  lesson: LearnLesson;
};

export default function LearnPlayer({ level, lesson }: Props) {
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [mobilePane, setMobilePane] = useState<'lesson' | 'editor'>('lesson');
  const isQuiz = lesson.type === 'quiz';

  useEffect(() => {
    setProgress(loadProgress());
    setMobilePane('lesson');
    captureEvent('learn_lesson_started', {
      course: IGCSE_PAPER_2.id,
      level: level.number,
      lesson: lesson.id,
      type: lesson.type,
    });
  }, [level.number, lesson.id, lesson.type]);

  const unlocked = isLessonUnlocked(IGCSE_PAPER_2, lesson, progress);
  const done = isComplete(progress, lesson.id);
  const prev = previousLesson(IGCSE_PAPER_2, lesson.id);
  const next = nextLesson(IGCSE_PAPER_2, lesson.id);
  const playableIndex = level.lessons.filter((item) => item.playable).findIndex((item) => item.id === lesson.id);

  const goNext = useCallback(() => {
    if (next?.lesson.playable) {
      router.push(lessonHref(next.level, next.lesson));
      return;
    }
    router.push('/learn');
  }, [next, router]);

  const handlePassed = useCallback(
    (attempts: number) => {
      const already = isComplete(loadProgress(), lesson.id);
      const map = markComplete(lesson.id, attempts);
      setProgress(map);
      if (already) return;
      captureEvent('learn_lesson_completed', {
        course: IGCSE_PAPER_2.id,
        level: level.number,
        lesson: lesson.id,
        type: lesson.type,
        attempts,
      });
      const remaining = level.lessons.filter((item) => item.playable && !isComplete(map, item.id));
      if (remaining.length === 0) {
        captureEvent('learn_level_completed', { course: IGCSE_PAPER_2.id, level: level.number });
      }
    },
    [lesson.id, lesson.type, level.lessons, level.number],
  );

  if (!lesson.playable || !unlocked) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid px-4 py-8 sm:py-10">
        <div className="max-w-lg mx-auto rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <Lock className="h-5 w-5 text-dark-text mb-3" />
          <h1 className="display-serif text-xl font-semibold text-light-text mb-2">{lesson.title}</h1>
          <p className="text-sm text-dark-text mb-4">
            {!lesson.playable
              ? 'This lesson is on the map but not playable yet. Finish Levels 1–3 first — we are measuring those.'
              : 'Complete the previous lesson to unlock this one.'}
          </p>
          <Link href="/learn" className="text-sm text-primary hover:underline">
            Back to the path
          </Link>
        </div>
      </div>
    );
  }

  const showLesson = mobilePane === 'lesson' || isQuiz;
  const showEditor = !isQuiz && mobilePane === 'editor';
  const nextLabel = next?.lesson.playable ? 'Next' : 'Path';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background min-w-0">
      <div className="shrink-0 border-b border-border px-2 sm:px-4 py-2 flex items-center gap-2 min-w-0">
        <Link
          href="/learn"
          className="text-dark-text hover:text-primary flex items-center gap-1 text-xs shrink-0 min-h-9 px-1"
          aria-label="Back to the path"
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

      {!isQuiz && (
        <div className="lg:hidden flex shrink-0 border-b border-border bg-surface">
          <button
            type="button"
            onClick={() => setMobilePane('lesson')}
            className={`flex-1 flex items-center justify-center gap-1.5 min-h-10 py-1.5 text-xs font-medium transition-colors ${
              showLesson ? 'text-light-text border-b-2 border-primary' : 'text-dark-text'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            Lesson
          </button>
          <button
            type="button"
            onClick={() => setMobilePane('editor')}
            className={`flex-1 flex items-center justify-center gap-1.5 min-h-10 py-1.5 text-xs font-medium transition-colors ${
              showEditor ? 'text-light-text border-b-2 border-primary' : 'text-dark-text'
            }`}
          >
            <Code2 className="h-3 w-3" />
            Editor
            {done && <Check size={12} className="text-success" />}
          </button>
        </div>
      )}

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
            <Link href={`/docs#${lesson.docsAnchor}`} className="inline-block mt-3 text-xs text-primary hover:underline">
              Docs: {lesson.docsAnchor}
            </Link>
          )}

          {lesson.type === 'quiz' && lesson.quiz && (
            <QuizBlock items={lesson.quiz} alreadyDone={done} onPassed={handlePassed} />
          )}

          {!isQuiz && (
            <button
              type="button"
              onClick={() => setMobilePane('editor')}
              className="lg:hidden mt-5 w-full min-h-11 rounded-lg bg-primary text-on-primary text-sm font-semibold"
            >
              Open editor
            </button>
          )}

          {(prev || done) && (
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
              {prev ? (
                <Link href={lessonHref(prev.level, prev.lesson)} className="text-xs text-dark-text hover:text-primary min-h-9 inline-flex items-center">
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
            isQuiz ? 'hidden lg:flex' : showEditor ? 'flex flex-1' : 'hidden lg:flex'
          }`}
        >
          {isQuiz ? (
            <div className="h-full min-h-[160px] w-full rounded-xl border border-dashed border-border bg-surface/40 flex items-center justify-center text-sm text-dark-text px-6 text-center">
              Answer the questions on the left. No editor for this one.
            </div>
          ) : (
            <LearnEditorPane
              lesson={lesson}
              onPassed={(attempts) => {
                handlePassed(attempts);
                setMobilePane('editor');
              }}
            />
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
}: {
  items: QuizItem[];
  alreadyDone: boolean;
  onPassed: (attempts: number) => void;
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
    if (items.every((item, i) => answers[i] === item.correctId)) {
      onPassed(nextAttempts);
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
