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

export const SESSION_ORDER = ['May/June', 'Oct/Nov', 'Feb/Mar'] as const;

export type PracticeNavigate = (
  overrides: Record<string, string | undefined>,
  mode?: 'push' | 'replace',
) => void;

/** Listing fields the practice index needs — keep this free of Prisma/catalog imports. */
export interface PracticeListQuestion {
  id: string;
  title: string;
  difficulty: string;
  year: number | null;
  session: string | null;
  variant: number | null;
  paper: string | null;
  questionNumber: number | null;
  part: string | null;
  marks: number | null;
  topic: string | null;
  tags: string[];
  isPremium: boolean;
}

export interface PracticeProgress {
  status: string;
  bestScore: number;
  totalTests: number;
  updatedAt: string | Date;
}

export function parsePracticeSearch(search: string): ActiveFilters {
  const raw = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  const diff = params.get('diff')?.toUpperCase();
  const status = params.get('status')?.toLowerCase();
  const yearRaw = params.get('year');
  const year = yearRaw ? parseInt(yearRaw, 10) : NaN;
  const sort = params.get('sort');
  return {
    topic: params.get('topic') || undefined,
    year: Number.isFinite(year) ? year : undefined,
    session: params.get('session') || undefined,
    tag: params.get('tag') || undefined,
    q: params.get('q') || undefined,
    diff: diff && (DIFFICULTIES as readonly string[]).includes(diff) ? (diff as Difficulty) : undefined,
    status: status && (STATUS_KEYS as readonly string[]).includes(status) ? (status as StatusKey) : undefined,
    sort: sort === 'marks' || sort === 'az' ? sort : 'year',
  };
}

export function statusOf(id: string, progress: Map<string, PracticeProgress>): StatusKey {
  const p = progress.get(id);
  if (!p) return 'todo';
  return p.status === 'SOLVED' ? 'solved' : 'started';
}

export function matchesFilters(
  q: PracticeListQuestion,
  active: ActiveFilters,
  progress: Map<string, PracticeProgress>,
  except: string[] = [],
): boolean {
  if (!except.includes('topic') && active.topic && q.topic !== active.topic) return false;
  if (!except.includes('year')) {
    if (active.year && q.year !== active.year) return false;
    if (active.session && q.session !== active.session) return false;
  }
  if (!except.includes('tag') && active.tag && !q.tags.includes(active.tag)) return false;
  if (!except.includes('q') && active.q && !q.title.toLowerCase().includes(active.q.toLowerCase())) {
    return false;
  }
  if (!except.includes('diff') && active.diff && q.difficulty !== active.diff) return false;
  if (!except.includes('status') && active.status && statusOf(q.id, progress) !== active.status) {
    return false;
  }
  return true;
}

export function sortPracticeQuestions(
  arr: PracticeListQuestion[],
  sort: SortKey,
): PracticeListQuestion[] {
  const copy = [...arr];
  if (sort === 'az') copy.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'marks') {
    copy.sort((a, b) => (b.marks ?? -1) - (a.marks ?? -1) || a.title.localeCompare(b.title));
  } else {
    copy.sort((a, b) => (b.year ?? -1) - (a.year ?? -1) || a.title.localeCompare(b.title));
  }
  return copy;
}

export function paperRef(q: PracticeListQuestion): string | null {
  if (q.year) {
    return [
      q.year,
      q.session,
      q.variant ? `V${q.variant}` : null,
      q.questionNumber ? `Q${q.questionNumber}${q.part ? `(${q.part})` : ''}` : null,
    ]
      .filter(Boolean)
      .join(' ');
  }
  return q.paper ?? null;
}

export function computePracticeListing(
  questions: PracticeListQuestion[],
  active: ActiveFilters,
  progress: Map<string, PracticeProgress>,
) {
  const matchExcept = (q: PracticeListQuestion, except: string[]) =>
    matchesFilters(q, active, progress, except);

  const filtered = questions.filter((q) => matchExcept(q, []));

  const allTopics = Array.from(new Set(questions.map((q) => q.topic).filter(Boolean) as string[]));
  const topicCount = new Map<string, number>(allTopics.map((t) => [t, 0]));
  for (const q of questions) {
    if (q.topic && matchExcept(q, ['topic'])) topicCount.set(q.topic, (topicCount.get(q.topic) ?? 0) + 1);
  }
  const topics: NamedFacet[] = allTopics
    .map((name) => ({ name, count: topicCount.get(name) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const yearSessions = new Map<number, Set<string>>();
  for (const q of questions) {
    if (!q.year) continue;
    if (!yearSessions.has(q.year)) yearSessions.set(q.year, new Set());
    if (q.session) yearSessions.get(q.year)!.add(q.session);
  }
  const yearCount = new Map<number, number>();
  const sessionCount = new Map<string, number>();
  for (const q of questions) {
    if (!matchExcept(q, ['year']) || !q.year) continue;
    yearCount.set(q.year, (yearCount.get(q.year) ?? 0) + 1);
    if (q.session) {
      const key = `${q.year}|${q.session}`;
      sessionCount.set(key, (sessionCount.get(key) ?? 0) + 1);
    }
  }
  const years: YearFacet[] = Array.from(yearSessions.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, set]) => ({
      year,
      count: yearCount.get(year) ?? 0,
      sessions: Array.from(set)
        .sort((a, b) => (SESSION_ORDER as readonly string[]).indexOf(b) - (SESSION_ORDER as readonly string[]).indexOf(a))
        .map((name) => ({ name, count: sessionCount.get(`${year}|${name}`) ?? 0 })),
    }));

  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags)));
  const tagCount = new Map<string, number>(allTags.map((t) => [t, 0]));
  for (const q of questions) {
    if (!matchExcept(q, ['tag'])) continue;
    for (const tg of q.tags) if (tagCount.has(tg)) tagCount.set(tg, (tagCount.get(tg) ?? 0) + 1);
  }
  const tags: NamedFacet[] = allTags
    .map((name) => ({ name, count: tagCount.get(name) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const diffCount: Record<Difficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const q of questions) {
    if (matchExcept(q, ['diff']) && q.difficulty in diffCount) {
      diffCount[q.difficulty as Difficulty]++;
    }
  }
  const difficulties: DiffFacet[] = DIFFICULTIES.map((value) => ({ value, count: diffCount[value] }));

  const statusCount: Record<StatusKey, number> = { todo: 0, started: 0, solved: 0 };
  let statusAllCount = 0;
  for (const q of questions) {
    if (!matchExcept(q, ['status'])) continue;
    statusAllCount++;
    statusCount[statusOf(q.id, progress)]++;
  }
  const statuses: StatusFacet[] = STATUS_KEYS.map((value) => ({ value, count: statusCount[value] }));

  const grouped = DIFFICULTIES.reduce(
    (acc, d) => {
      acc[d] = sortPracticeQuestions(
        filtered.filter((q) => q.difficulty === d),
        active.sort,
      );
      return acc;
    },
    {} as Record<Difficulty, PracticeListQuestion[]>,
  );

  return { filtered, grouped, topics, years, tags, difficulties, statuses, statusAllCount };
}
