import { redirect } from 'next/navigation';
import { prisma } from '@/shared/db';
import { auth } from '@/modules/auth/auth';
import { AdminPager } from '../_components/AdminPager';
import ScrollMain from '../_components/ScrollMain';
import { AdminPageHeader, ChipRow, EmptyState, FilterLink } from '../_components/adminUi';
import { formatAdminNumber } from '../_components/adminFormat';
import { getUserFacets } from './loadUsers';
import UserSearch from './_components/UserSearch';
import UsersTable from './_components/UsersTable';
import {
  EXPIRING_WITHIN_DAYS,
  USERS_PAGE_SIZE,
  parseUserQuery,
  usersFiltering,
  usersHref,
  usersOrderBy,
  usersWhere,
  type UserQuery,
} from './usersQuery';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Users' };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    role?: string;
    plan?: string;
    access?: string;
    activity?: string;
    sort?: string;
  }>;
}) {
  const query = parseUserQuery(await searchParams);
  const where = usersWhere(query, new Date());
  const [session, total, facets] = await Promise.all([
    auth(),
    prisma.user.count({ where }),
    getUserFacets(),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  if (page !== query.page) redirect(usersHref({ ...query, page }));

  const users = total === 0
    ? []
    : await prisma.user.findMany({
      where,
      orderBy: usersOrderBy(query.sort),
      skip: (page - 1) * USERS_PAGE_SIZE,
      take: USERS_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        planTier: true,
        trialEndsAt: true,
        planUpdatedAt: true,
        planExpiresAt: true,
        legacyCapacity: true,
        paddleCustomerId: true,
        paddleSubscriptionId: true,
        role: true,
        createdAt: true,
        _count: { select: { progress: true, examAttempts: true, learnProgress: true } },
      },
    });

  const filtering = usersFiltering(query);
  const start = total === 0 ? 0 : (page - 1) * USERS_PAGE_SIZE + 1;
  const end = Math.min(page * USERS_PAGE_SIZE, total);
  const noun = total === 1 ? 'user' : 'users';

  return (
    <div className="space-y-5 max-w-6xl">
      <ScrollMain token={`${page}:${query.q}:${query.role}:${query.plan}:${query.access}:${query.activity}:${query.sort}`} />
      <AdminPageHeader
        title="Users"
        description={
          filtering
            ? `${formatAdminNumber(total)} ${noun} ${total === 1 ? 'matches' : 'match'} · ${formatAdminNumber(facets.total)} registered`
            : `${formatAdminNumber(total)} registered ${noun}`
        }
      />

      <UserFilters query={query} facets={facets} />

      {users.length === 0 ? (
        <EmptyState>
          {filtering ? 'No users match these filters.' : 'No registered users yet.'}
        </EmptyState>
      ) : (
        <UsersTable users={users} currentAdminRole={session?.user?.role ?? 'STUDENT'} />
      )}

      <AdminPager
        label="User pages"
        page={page}
        pageCount={pageCount}
        start={start}
        end={end}
        total={total}
        hrefFor={(nextPage) => usersHref({ ...query, page: nextPage })}
      />
    </div>
  );
}

function UserFilters({
  query,
  facets,
}: {
  query: UserQuery;
  facets: Awaited<ReturnType<typeof getUserFacets>>;
}) {
  const href = (patch: Partial<UserQuery>) => usersHref({ ...query, page: 1, ...patch });
  const free = Math.max(0, facets.total - facets.paid);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <UserSearch query={query} />
        {usersFiltering(query) && (
          <FilterLink href="/admin/users" active={false}>
            Clear filters
          </FilterLink>
        )}
      </div>
      <ChipRow label="Access">
        <FilterLink href={href({ access: null })} active={query.access == null}>All</FilterLink>
        <FilterLink href={href({ access: 'paid' })} active={query.access === 'paid'}>
          Paid · {formatAdminNumber(facets.paid)}
        </FilterLink>
        <FilterLink href={href({ access: 'free' })} active={query.access === 'free'}>
          Free · {formatAdminNumber(free)}
        </FilterLink>
        <FilterLink href={href({ access: 'trial' })} active={query.access === 'trial'}>
          Trial · {formatAdminNumber(facets.trial)}
        </FilterLink>
        <FilterLink
          href={href({ access: 'expiring' })}
          active={query.access === 'expiring'}
          title={`Paid plan ends within ${EXPIRING_WITHIN_DAYS} days`}
        >
          Ends soon · {formatAdminNumber(facets.expiring)}
        </FilterLink>
      </ChipRow>
      <ChipRow label="Role">
        <FilterLink href={href({ role: null })} active={query.role == null}>All</FilterLink>
        <FilterLink href={href({ role: 'STUDENT' })} active={query.role === 'STUDENT'}>
          Students · {formatAdminNumber(facets.students)}
        </FilterLink>
        <FilterLink href={href({ role: 'TEACHER' })} active={query.role === 'TEACHER'}>
          Teachers · {formatAdminNumber(facets.teachers)}
        </FilterLink>
        <FilterLink href={href({ role: 'ADMIN' })} active={query.role === 'ADMIN'}>
          Admins · {formatAdminNumber(facets.admins)}
        </FilterLink>
      </ChipRow>
      <ChipRow label="Doing">
        <FilterLink href={href({ activity: null })} active={query.activity == null}>Anyone</FilterLink>
        <FilterLink href={href({ activity: 'path' })} active={query.activity === 'path'}>
          On a path · {formatAdminNumber(facets.path)}
        </FilterLink>
        <FilterLink href={href({ activity: 'practice' })} active={query.activity === 'practice'}>
          Practice · {formatAdminNumber(facets.practice)}
        </FilterLink>
        <FilterLink href={href({ activity: 'exams' })} active={query.activity === 'exams'}>
          Exams · {formatAdminNumber(facets.exams)}
        </FilterLink>
        <FilterLink href={href({ activity: 'quiet' })} active={query.activity === 'quiet'} title="No path, practice, or exam yet">
          Quiet · {formatAdminNumber(facets.quiet)}
        </FilterLink>
      </ChipRow>
      <ChipRow label="Plan">
        <FilterLink href={href({ plan: null })} active={query.plan == null}>All</FilterLink>
        {(['FREE', 'STUDENT', 'STARTER', 'PRO', 'SCHOOL'] as const).map((plan) => (
          <FilterLink key={plan} href={href({ plan })} active={query.plan === plan}>
            {plan === 'FREE' ? 'Free' : plan.charAt(0) + plan.slice(1).toLowerCase()}
          </FilterLink>
        ))}
      </ChipRow>
      <ChipRow label="Sort">
        <FilterLink href={href({ sort: 'newest' })} active={query.sort === 'newest'}>Newest</FilterLink>
        <FilterLink href={href({ sort: 'oldest' })} active={query.sort === 'oldest'}>Oldest</FilterLink>
        <FilterLink href={href({ sort: 'name' })} active={query.sort === 'name'}>Name</FilterLink>
      </ChipRow>
    </div>
  );
}
