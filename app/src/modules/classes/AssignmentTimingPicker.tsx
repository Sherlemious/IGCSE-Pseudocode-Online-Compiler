'use client';

import { CalendarClock, Timer } from 'lucide-react';

/**
 * "No time limit, due by date" vs "Timed (N min)" for a class assignment.
 * An untimed attempt stays open until the due date or until the student submits.
 */
export default function AssignmentTimingPicker({
  timed,
  onChange,
  timeLimitMin,
  disabled = false,
}: {
  timed: boolean;
  onChange: (timed: boolean) => void;
  /** The limit a timed assignment uses (the exam's own). */
  timeLimitMin: number | null;
  disabled?: boolean;
}) {
  const option = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors disabled:opacity-50 ${
      active ? 'bg-primary/15 text-primary font-semibold' : 'text-dark-text hover:text-light-text'
    }`;
  return (
    <div role="radiogroup" aria-label="Time limit" className="flex gap-1 rounded-lg border border-border bg-background p-1">
      <button type="button" role="radio" aria-checked={!timed} disabled={disabled} onClick={() => onChange(false)} className={option(!timed)}>
        <CalendarClock size={12} aria-hidden="true" />
        No time limit
      </button>
      <button type="button" role="radio" aria-checked={timed} disabled={disabled} onClick={() => onChange(true)} className={option(timed)}>
        <Timer size={12} aria-hidden="true" />
        {timeLimitMin ? `Timed (${timeLimitMin} min)` : 'Timed'}
      </button>
    </div>
  );
}

/** One-line hint under the picker. */
export function timingHint(timed: boolean): string {
  return timed
    ? 'Students get one sitting with a countdown, as in an exam.'
    : 'Students can leave and come back. It closes at the end of the due date, or when they submit.';
}
