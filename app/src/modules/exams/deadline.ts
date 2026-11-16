/**
 * When an exam attempt stops accepting work. Pure, so the server rules, the
 * take page and the tests share one answer.
 *
 * - Timed attempt (`timeLimitMin` set): `startedAt + timeLimitMin`.
 * - Untimed attempt with a due date: the end of the due date's UTC day, the
 *   same cut-off the mark book uses for "late" and "missing".
 * - Untimed attempt without a due date: no deadline; it closes when submitted.
 */

export interface DeadlineAttempt {
  startedAt: Date;
  timeLimitMin: number | null;
}

export function endOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

/** Epoch ms after which no more work is accepted, or null when there is none. */
export function attemptDeadline(attempt: DeadlineAttempt, dueDate: Date | null | undefined): number | null {
  if (attempt.timeLimitMin != null) return attempt.startedAt.getTime() + attempt.timeLimitMin * 60_000;
  return dueDate ? endOfUtcDay(dueDate).getTime() : null;
}

export function isPastDeadline(attempt: DeadlineAttempt, dueDate: Date | null | undefined, now: Date): boolean {
  const deadline = attemptDeadline(attempt, dueDate);
  return deadline !== null && now.getTime() >= deadline;
}
