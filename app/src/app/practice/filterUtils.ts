// Shared, framework-agnostic helpers + types for the practice listing filters.
// Imported by both the server page (counts/filtering) and the client filter
// components (URL building / labels), so this module must stay free of any
// client-only APIs.

export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const STATUS_KEYS = ['todo', 'started', 'solved'] as const;
export type StatusKey = (typeof STATUS_KEYS)[number];

export const SORT_KEYS = ['year', 'marks', 'az'] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export interface NamedFacet {
  name: string;
  count: number;
}
export interface SessionFacet {
  name: string;
  count: number;
}
export interface YearFacet {
  year: number;
  count: number;
  sessions: SessionFacet[];
}
export interface DiffFacet {
  value: Difficulty;
  count: number;
}
export interface StatusFacet {
  value: StatusKey;
  count: number;
}

export interface ActiveFilters {
  topic?: string;
  year?: number;
  session?: string;
  tag?: string;
  q?: string;
  diff?: Difficulty;
  status?: StatusKey;
  sort: SortKey;
}

// Per-difficulty colour + label. `color` is a CSS var so it tracks the
// active runtime theme.
export const DIFF_META: Record<Difficulty, { label: string; color: string; text: string }> = {
  EASY: { label: 'Easy', color: 'var(--color-success)', text: 'text-success' },
  MEDIUM: { label: 'Medium', color: 'var(--color-warning)', text: 'text-warning' },
  HARD: { label: 'Hard', color: 'var(--color-error)', text: 'text-error' },
};

export const STATUS_META: Record<StatusKey, { label: string; color: string }> = {
  todo: { label: 'To do', color: 'var(--color-dark-text)' },
  started: { label: 'Started', color: 'var(--color-warning)' },
  solved: { label: 'Solved', color: 'var(--color-success)' },
};

export const SORT_META: Record<SortKey, string> = {
  year: 'Newest',
  marks: 'Marks',
  az: 'A–Z',
};

/**
 * Rebuild the `/practice` URL with a patch of query params. `undefined` / ''
 * removes a key. Always resets to a clean URL when no params remain.
 */
export function buildPracticeUrl(
  current: string,
  overrides: Record<string, string | undefined>
): string {
  const params = new URLSearchParams(current);
  for (const [key, val] of Object.entries(overrides)) {
    if (val === undefined || val === '') params.delete(key);
    else params.set(key, val);
  }
  const qs = params.toString();
  return qs ? `/practice?${qs}` : '/practice';
}
