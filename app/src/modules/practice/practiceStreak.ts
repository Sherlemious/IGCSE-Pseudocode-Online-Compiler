/**
 * Daily solve streak, kept per browser. Anyone who solves 5+ questions comes
 * back on ~3x as many days as a non-solver, so the streak rewards the habit
 * that keeps students around. Local-only on purpose: it works signed out and
 * costs no DB reads.
 */

const DAYS_KEY = 'practice_solve_days';
/** Enough history for any streak we show; older days are dropped. */
const MAX_DAYS = 120;

export type StreakState = {
  /** Consecutive days with a solve, ending today or yesterday. */
  streak: number;
  solvedToday: boolean;
};

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

/** Pure: streak from a set of local-date keys, as of `today`. */
export function computeStreak(days: Iterable<string>, today: Date): StreakState {
  const set = new Set(days);
  const todayKey = dayKey(today);
  const solvedToday = set.has(todayKey);
  // A streak survives until the end of the day after the last solve.
  let cursor = solvedToday ? todayKey : previousDay(todayKey);
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = previousDay(cursor);
  }
  return { streak, solvedToday };
}

function loadDays(): string[] {
  try {
    const raw = localStorage.getItem(DAYS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((d): d is string => typeof d === 'string') : [];
  } catch {
    return [];
  }
}

export function readStreak(today: Date = new Date()): StreakState {
  return computeStreak(loadDays(), today);
}

/** Record a solve today. `extended` is true only for the first solve of the day. */
export function recordSolveDay(today: Date = new Date()): StreakState & { extended: boolean } {
  const days = loadDays();
  const key = dayKey(today);
  const extended = !days.includes(key);
  if (extended) {
    const next = [...days, key].sort().slice(-MAX_DAYS);
    try {
      localStorage.setItem(DAYS_KEY, JSON.stringify(next));
    } catch {
      /* storage full or blocked: the streak just won't persist */
    }
    return { ...computeStreak(next, today), extended };
  }
  return { ...computeStreak(days, today), extended };
}
