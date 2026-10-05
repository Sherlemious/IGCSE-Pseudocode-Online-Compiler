import type { Prisma } from '@prisma/client';

/** Teachers per page. Each row then lists that teacher's classes. */
export const CLASSES_PAGE_SIZE = 20;

/** Student rows loaded when a class is opened. Larger classes still show the full count. */
export const CLASS_MEMBER_CAP = 200;

const STATUSES = ['active', 'archived', 'empty', 'enrolled'] as const;
const SORTS = ['newest', 'students', 'teacher'] as const;

export type ClassStatus = (typeof STATUSES)[number];
export type ClassSort = (typeof SORTS)[number];

export type ClassQuery = {
  page: number;
  q: string;
  status: ClassStatus | null;
  sort: ClassSort;
  classId: string | null;
};

const MAX_PAGE = 10_000;

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[]): T | null {
  return allowed.find((item) => item === value) ?? null;
}

export function parseClassQuery(raw: {
  page?: string;
  q?: string;
  status?: string;
  sort?: string;
  class?: string;
}): ClassQuery {
  const pageNum = Number(raw.page);
  const classId = (raw.class ?? '').trim().slice(0, 40);
  return {
    page: Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= MAX_PAGE ? pageNum : 1,
    q: (raw.q ?? '').trim().slice(0, 80),
    status: oneOf(raw.status, STATUSES),
    sort: oneOf(raw.sort, SORTS) ?? 'newest',
    classId: classId || null,
  };
}

/** Defaults stay off the query string so the unfiltered URL is stable. */
export function classesHref(query: {
  page?: number | null;
  q?: string | null;
  status?: string | null;
  sort?: string | null;
  classId?: string | null;
}): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.status) params.set('status', query.status);
  if (query.sort && query.sort !== 'newest') params.set('sort', query.sort);
  if (query.classId) params.set('class', query.classId);
  if (query.page != null && query.page > 1) params.set('page', String(query.page));
  const search = params.toString();
  return search ? `/admin/classes?${search}` : '/admin/classes';
}

export function classesFiltering(query: ClassQuery): boolean {
  return Boolean(query.q || query.status || query.sort !== 'newest');
}

export function classesWhere(query: Pick<ClassQuery, 'q' | 'status'>): Prisma.ClassWhereInput {
  const and: Prisma.ClassWhereInput[] = [];
  if (query.q) {
    and.push({
      OR: [
        { name: { contains: query.q, mode: 'insensitive' } },
        { joinCode: { contains: query.q, mode: 'insensitive' } },
        { owner: { name: { contains: query.q, mode: 'insensitive' } } },
        { owner: { email: { contains: query.q, mode: 'insensitive' } } },
      ],
    });
  }
  if (query.status === 'active') and.push({ archived: false });
  if (query.status === 'archived') and.push({ archived: true });
  if (query.status === 'empty') and.push({ archived: false, memberships: { none: {} } });
  if (query.status === 'enrolled') and.push({ memberships: { some: {} } });
  return and.length > 0 ? { AND: and } : {};
}

export type ClassRankInput = {
  ownerId: string;
  createdAt: Date;
  students: number;
  teacher: string;
};

export type TeacherRank = {
  ownerId: string;
  classes: number;
  students: number;
  latest: number;
  teacher: string;
};

/** One row per teacher, ordered for the admin list. */
export function rankTeachers(rows: ClassRankInput[], sort: ClassSort): TeacherRank[] {
  const map = new Map<string, TeacherRank>();
  for (const row of rows) {
    const latest = row.createdAt.getTime();
    const current = map.get(row.ownerId);
    if (!current) {
      map.set(row.ownerId, {
        ownerId: row.ownerId,
        classes: 1,
        students: row.students,
        latest,
        teacher: row.teacher,
      });
      continue;
    }
    current.classes += 1;
    current.students += row.students;
    if (latest > current.latest) current.latest = latest;
  }

  const list = [...map.values()];
  list.sort((a, b) => {
    if (sort === 'students') {
      return b.students - a.students || b.latest - a.latest || a.teacher.localeCompare(b.teacher);
    }
    if (sort === 'teacher') {
      return a.teacher.localeCompare(b.teacher) || b.latest - a.latest;
    }
    return b.latest - a.latest || a.teacher.localeCompare(b.teacher);
  });
  return list;
}

export function teacherSortKey(name: string | null | undefined, email: string | null | undefined): string {
  return (name?.trim() || email?.trim() || '').toLocaleLowerCase();
}
