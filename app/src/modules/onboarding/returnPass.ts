export const RETURN_RUN_DAYS_KEY = 'playground_run_days';
export const RETURN_PASS_SHOWN_KEY = 'playground_return_pass_shown';

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** The student's own calendar day. "Came back" means a later day where they live. */
export function localRunDay(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function parseRunDays(stored: string | null): string[] {
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((day): day is string => typeof day === 'string' && DAY.test(day));
  } catch {
    return [];
  }
}

/**
 * Record one successful playground run.
 * The ask shows on the first success of a later day. Someone who already has
 * 3 sessions and no recorded days counts as already back, so the people who
 * were returning before we started counting see it on their next run.
 */
export function recordPlaygroundRun(
  stored: string | null,
  sessions: number,
  now: Date,
): { days: string[]; show: boolean } {
  const today = localRunDay(now);
  const prev = parseRunDays(stored);
  const priorDay = prev.some((day) => day < today);
  const alreadyToday = prev.includes(today);
  const days = alreadyToday ? prev : [...prev, today].slice(-14);
  const alreadyBack = priorDay || (prev.length === 0 && sessions >= 3);
  return { days, show: alreadyBack && !alreadyToday };
}
