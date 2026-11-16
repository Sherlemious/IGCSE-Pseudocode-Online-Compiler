/**
 * When an exam attempt stops accepting work. Pure, so the server rules, the
 * take page and the tests share one answer.
 *
 * - Timed attempt (`timeLimitMin` set): `startedAt + timeLimitMin`.
 * - Untimed attempt with a due date: the end of the due date's day in the
 *   teacher's timezone (UTC if none was recorded), the same cut-off the mark
 *   book uses for "late" and "missing".
 * - Untimed attempt without a due date: no deadline; it closes when submitted.
 */

import { endOfDueDay } from '@/shared/lib/dueDate';

export interface DeadlineAttempt {
  startedAt: Date;
  timeLimitMin: number | null;
}

/** Epoch ms after which no more work is accepted, or null when there is none. */
export function attemptDeadline(
  attempt: DeadlineAttempt,
  dueDate: Date | null | undefined,
  dueTimeZone?: string | null,
): number | null {
  if (attempt.timeLimitMin != null) return attempt.startedAt.getTime() + attempt.timeLimitMin * 60_000;
  return dueDate ? endOfDueDay(dueDate, dueTimeZone).getTime() : null;
}

export function isPastDeadline(
  attempt: DeadlineAttempt,
  dueDate: Date | null | undefined,
  now: Date,
  dueTimeZone?: string | null,
): boolean {
  const deadline = attemptDeadline(attempt, dueDate, dueTimeZone);
  return deadline !== null && now.getTime() >= deadline;
}
