export const LEARN_PAGE_SIZE = 20;

const SORTS = ['recent', 'progress', 'name'] as const;
const FILTERS = ['all', 'active', 'stuck', 'done'] as const;
const WEEK = 7 * 24 * 60 * 60 * 1000;

export type LearnSort = (typeof SORTS)[number];
export type LearnFilter = (typeof FILTERS)[number];

export type LearnQuery = {
  courseId: string;
  learner: string | null;
  q: string;
  sort: LearnSort;
  filter: LearnFilter;
  page: number;
};

export type LearnerRow = {
  userId: string;
  name: string | null;
  email: string | null;
  completed: number;
  attempted: number;
  playable: number;
  lastActivityAt: string | null;
  furthest: string | null;
  stuckReason: string | null;
};

const REASON_LABELS: Record<string, string> = {
  wrong_output: 'wrong output',
  runtime: "won't run",
  must_contain: 'missing piece',
  forbidden: 'not allowed',
  quiz: 'quiz',
  no_tests: 'no check',
};

export function reasonLabel(reason: string | null | undefined): string | null {
  if (!reason || reason === 'passed') return null;
  return REASON_LABELS[reason] ?? reason.replaceAll('_', ' ');
}

export function parseLearnQuery(
  raw: {
    course?: string;
    learner?: string;
    q?: string;
    sort?: string;
    filter?: string;
    page?: string;
  },
  courseIds: readonly string[],
): LearnQuery {
  const pageNum = Number(raw.page);
  const learner = raw.learner?.trim() ?? '';
  const sort = SORTS.find((item) => item === raw.sort) ?? 'recent';
  const filter = FILTERS.find((item) => item === raw.filter) ?? 'all';
  return {
    courseId: courseIds.find((id) => id === raw.course) ?? courseIds[0] ?? '',
    learner: learner.length > 0 && learner.length <= 80 ? learner : null,
    q: (raw.q ?? '').trim().slice(0, 80),
    sort,
    filter,
    page: Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= 10_000 ? pageNum : 1,
  };
}

export function learnHref(
  query: {
    courseId?: string | null;
    learner?: string | null;
    q?: string | null;
    sort?: string | null;
    filter?: string | null;
    page?: number | null;
  },
  defaultCourseId: string,
): string {
  const params = new URLSearchParams();
  if (query.courseId && query.courseId !== defaultCourseId) params.set('course', query.courseId);
  if (query.learner) params.set('learner', query.learner);
  if (query.q) params.set('q', query.q);
  if (query.sort && query.sort !== 'recent') params.set('sort', query.sort);
  if (query.filter && query.filter !== 'all') params.set('filter', query.filter);
  if (query.page != null && query.page > 1) params.set('page', String(query.page));
  const search = params.toString();
  return search ? `/admin/learn?${search}` : '/admin/learn';
}

export function filterLearners(learners: LearnerRow[], query: LearnQuery, now: Date): LearnerRow[] {
  const q = query.q.toLowerCase();
  const cutoff = now.getTime() - WEEK;
  const list = learners.filter((learner) => {
    if (q && !`${learner.name ?? ''} ${learner.email ?? ''}`.toLowerCase().includes(q)) return false;
    if (query.filter === 'active') {
      return learner.lastActivityAt != null && new Date(learner.lastActivityAt).getTime() >= cutoff;
    }
    if (query.filter === 'stuck') return learner.attempted > 0;
    if (query.filter === 'done') return learner.playable > 0 && learner.completed === learner.playable;
    return true;
  });
  return list.sort((a, b) => {
    if (query.sort === 'name') {
      return (a.name || a.email || '').localeCompare(b.name || b.email || '', undefined, { sensitivity: 'base' });
    }
    if (query.sort === 'progress' && b.completed !== a.completed) return b.completed - a.completed;
    return (b.lastActivityAt ?? '').localeCompare(a.lastActivityAt ?? '');
  });
}
