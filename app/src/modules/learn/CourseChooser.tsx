'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COURSE_CHOICES, type CourseChoice } from './courseChoice';
import { captureLearn } from './telemetry';
import type { CourseId } from './types';

const RING = 58;
const RING_STROKE = 4.5;
const RING_R = (RING - RING_STROKE) / 2;
const RING_C = 2 * Math.PI * RING_R;

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export default function CourseChooser({
  courseId,
  completed,
  total,
}: {
  courseId: CourseId;
  completed: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <p id="course-choice-label" className="mono-label text-dark-text mb-3">
        Which exam are you sitting?
      </p>
      <nav aria-labelledby="course-choice-label" className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
        {COURSE_CHOICES.map((choice) => {
          const current = choice.id === courseId;
          return (
            <ChoiceCard
              key={choice.id}
              choice={choice}
              current={current}
              completed={completed}
              total={total}
              pct={pct}
              fromCourse={courseId}
            />
          );
        })}
      </nav>
    </div>
  );
}

function ChoiceCard({
  choice,
  current,
  completed,
  total,
  pct,
  fromCourse,
}: {
  choice: CourseChoice;
  current: boolean;
  completed: number;
  total: number;
  pct: number;
  fromCourse: CourseId;
}) {
  const shell = current
    ? 'border-primary/55 bg-primary/[0.08] shadow-[0_16px_40px_-24px_rgba(var(--color-primary-rgb),0.85)]'
    : 'border-dark-text/25 bg-surface/50 hover:border-primary/45 hover:bg-primary/[0.05]';

  const body = (
    <>
      <span
        aria-hidden
        className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${current ? 'bg-primary' : 'bg-dark-text/30'}`}
      />
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 min-h-5">
            {current ? (
              <span className="mono-label text-primary">You&apos;re here</span>
            ) : (
              <span className="mono-label text-dark-text group-hover:text-primary inline-flex items-center gap-1">
                Open this path
                <ArrowRight size={11} aria-hidden />
              </span>
            )}
          </div>
          <Heading current={current} choice={choice} />
          <p className="mono-label text-dark-text mt-2">{choice.codes}</p>
          <p className="mt-2 text-sm text-light-text leading-snug">{choice.audience}</p>
          <p className="mt-1 text-[13px] text-dark-text leading-snug">{choice.covers}</p>
        </div>
        {current && <ProgressRing pct={pct} completed={completed} total={total} />}
      </div>
      <p className="mt-auto pt-3.5 font-mono text-[11px] text-dark-text tabular-nums">
        <span className="text-light-text font-semibold">{choice.levels} levels</span>
        {' · '}
        first {choice.freeLevels} free
        {current && total > 0 && (
          <>
            {' · '}
            <span className="text-light-text font-semibold">
              {completed} of {total}
            </span>{' '}
            done
          </>
        )}
      </p>
    </>
  );

  const className = `group relative flex h-full flex-col rounded-2xl border pl-4 pr-3.5 py-3.5 text-left transition-colors ${shell}`;

  if (current) {
    return (
      <div aria-current="page" className={className}>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={choice.href}
      onClick={() =>
        captureLearn('learn_course_switched', {
          from_course: fromCourse,
          to_course: choice.id,
        })
      }
      className={`${className} ${FOCUS}`}
    >
      {body}
    </Link>
  );
}

function Heading({ current, choice }: { current: boolean; choice: CourseChoice }) {
  const className = 'display-serif m-0 mt-1.5 text-[1.65rem] sm:text-[1.85rem] leading-none font-semibold text-light-text';
  const title = `${choice.exam} ${choice.paper}`;
  if (current) return <h1 className={className}>{title}</h1>;
  return <p className={className}>{title}</p>;
}

function ProgressRing({ pct, completed, total }: { pct: number; completed: number; total: number }) {
  const offset = RING_C * (1 - pct / 100);
  return (
    <div className="relative shrink-0" style={{ width: RING, height: RING }} aria-hidden>
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
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold font-mono text-light-text leading-none tabular-nums">{pct}%</span>
        <span className="text-[8px] uppercase tracking-wider text-dark-text mt-0.5 tabular-nums">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}
