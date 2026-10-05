import type { Prisma } from '@prisma/client';

/** One screen of accounts. The old list stopped at 500 and hid everyone older. */
export const USERS_PAGE_SIZE = 40;

const DAY = 24 * 60 * 60 * 1000;
/** Paid plans with an end date inside this window show up under "Ends soon". */
export const EXPIRING_WITHIN_DAYS = 14;

const ROLES = ['STUDENT', 'TEACHER', 'ADMIN'] as const;
const PLANS = ['FREE', 'STUDENT', 'STARTER', 'PRO', 'SCHOOL'] as const;
const ACCESS = ['paid', 'free', 'trial', 'expiring'] as const;
const ACTIVITY = ['path', 'practice', 'exams', 'quiet'] as const;
const SORTS = ['newest', 'oldest', 'name'] as const;

export type UserRole = (typeof ROLES)[number];
export type UserPlan = (typeof PLANS)[number];
export type UserAccess = (typeof ACCESS)[number];
export type UserActivity = (typeof ACTIVITY)[number];
export type UserSort = (typeof SORTS)[number];

export type UserQuery = {
  page: number;
  q: string;
  role: UserRole | null;
  plan: UserPlan | null;
  access: UserAccess | null;
  activity: UserActivity | null;
  sort: UserSort;
};

const MAX_PAGE = 10_000;

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[]): T | null {
  return allowed.find((item) => item === value) ?? null;
}

export function parseUserQuery(raw: {
  page?: string;
  q?: string;
  role?: string;
  plan?: string;
  access?: string;
  activity?: string;
  sort?: string;
}): UserQuery {
  const pageNum = Number(raw.page);
  return {
    page: Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= MAX_PAGE ? pageNum : 1,
    q: (raw.q ?? '').trim().slice(0, 80),
    role: oneOf(raw.role, ROLES),
    plan: oneOf(raw.plan, PLANS),
    access: oneOf(raw.access, ACCESS),
    activity: oneOf(raw.activity, ACTIVITY),
    sort: oneOf(raw.sort, SORTS) ?? 'newest',
  };
}

/** Defaults stay off the query string so the unfiltered URL is stable. */
export function usersHref(query: {
  page?: number | null;
  q?: string | null;
  role?: string | null;
  plan?: string | null;
  access?: string | null;
  activity?: string | null;
  sort?: string | null;
}): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.role) params.set('role', query.role);
  if (query.plan) params.set('plan', query.plan);
  if (query.access) params.set('access', query.access);
  if (query.activity) params.set('activity', query.activity);
  if (query.sort && query.sort !== 'newest') params.set('sort', query.sort);
  if (query.page != null && query.page > 1) params.set('page', String(query.page));
  const search = params.toString();
  return search ? `/admin/users?${search}` : '/admin/users';
}

export function usersFiltering(query: UserQuery): boolean {
  return Boolean(query.q || query.role || query.plan || query.access || query.activity || query.sort !== 'newest');
}

/** Currently entitled: a non-free plan that has not passed `planExpiresAt`. */
function paidWhere(now: Date): Prisma.UserWhereInput {
  return {
    plan: { not: 'FREE' },
    OR: [{ planExpiresAt: null }, { planExpiresAt: { gt: now } }],
  };
}

export function usersWhere(query: UserQuery, now: Date): Prisma.UserWhereInput {
  const and: Prisma.UserWhereInput[] = [];
  if (query.q) {
    and.push({
      OR: [
        { name: { contains: query.q, mode: 'insensitive' } },
        { email: { contains: query.q, mode: 'insensitive' } },
      ],
    });
  }
  if (query.role) and.push({ role: query.role });
  if (query.plan) and.push({ plan: query.plan });
  if (query.access === 'paid') and.push(paidWhere(now));
  if (query.access === 'free') {
    and.push({
      OR: [{ plan: 'FREE' }, { planExpiresAt: { lte: now } }],
    });
  }
  if (query.access === 'trial') and.push({ trialEndsAt: { gt: now } });
  if (query.access === 'expiring') {
    and.push({
      plan: { not: 'FREE' },
      planExpiresAt: {
        gt: now,
        lte: new Date(now.getTime() + EXPIRING_WITHIN_DAYS * DAY),
      },
    });
  }
  if (query.activity === 'path') and.push({ learnProgress: { some: {} } });
  if (query.activity === 'practice') and.push({ progress: { some: {} } });
  if (query.activity === 'exams') and.push({ examAttempts: { some: {} } });
  if (query.activity === 'quiet') {
    and.push({
      learnProgress: { none: {} },
      progress: { none: {} },
      examAttempts: { none: {} },
    });
  }
  return and.length > 0 ? { AND: and } : {};
}

export function usersOrderBy(sort: UserSort): Prisma.UserOrderByWithRelationInput[] {
  if (sort === 'oldest') return [{ createdAt: 'asc' }];
  if (sort === 'name') return [{ name: 'asc' }, { createdAt: 'desc' }];
  return [{ createdAt: 'desc' }];
}
