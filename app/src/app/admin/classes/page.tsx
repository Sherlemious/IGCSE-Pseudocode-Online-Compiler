import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { StatTile } from '../analytics/_components/charts';
import { AdminPager } from '../_components/AdminPager';
import ScrollMain from '../_components/ScrollMain';
import { AdminPageHeader, ChipRow, EmptyState, FilterLink, formatAdminDay, nice } from '../_components/adminUi';
import { formatAdminNumber } from '../_components/adminFormat';
import { UserAvatar } from '../users/_components/UserDrawer';
import { usersHref } from '../users/usersQuery';
import ClassSearch from './_components/ClassSearch';
import {
  CLASSES_PAGE_SIZE,
  classesFiltering,
  classesHref,
  parseClassQuery,
  type ClassQuery,
} from './classesQuery';
import { loadClassAdmin, type AdminClassRow, type ClassMember } from './loadClasses';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Classes' };

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    sort?: string;
    class?: string;
  }>;
}) {
  const query = parseClassQuery(await searchParams);
  const data = await loadClassAdmin(query);
  if (data.page !== query.page) redirect(classesHref({ ...query, page: data.page }));

  const filtering = classesFiltering(query);
  const { facets } = data;
  const start = data.teacherTotal === 0 ? 0 : (data.page - 1) * CLASSES_PAGE_SIZE + 1;
  const end = Math.min(data.page * CLASSES_PAGE_SIZE, data.teacherTotal);
  const teacherNoun = data.teacherTotal === 1 ? 'teacher' : 'teachers';
  const classNoun = data.classTotal === 1 ? 'class' : 'classes';

  return (
    <div className="space-y-5 max-w-6xl">
      <ScrollMain token={`${data.page}:${query.q}:${query.status}:${query.sort}`} />
      <AdminPageHeader
        title="Classes"
        description={
          filtering
            ? `${formatAdminNumber(data.teacherTotal)} ${teacherNoun} and ${formatAdminNumber(data.classTotal)} ${classNoun} match`
            : `${formatAdminNumber(facets.teachers)} ${facets.teachers === 1 ? 'teacher has' : 'teachers have'} created ${formatAdminNumber(facets.classes)} ${facets.classes === 1 ? 'class' : 'classes'}`
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile label="Teachers" value={facets.teachers} sub="created at least one class" />
        <StatTile label="Classes" value={facets.classes} sub={`${formatAdminNumber(facets.active)} still open`} />
        <StatTile label="Students joined" value={facets.students} sub="seats across every class" />
        <StatTile label="Waiting" value={facets.empty} sub="open classes with nobody yet" />
      </div>

      <ClassFilters query={query} facets={facets} />

      {data.teachers.length === 0 ? (
        <EmptyState>
          {filtering ? 'No classes match these filters.' : 'No teacher has created a class yet.'}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {data.teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} query={query} />
          ))}
        </div>
      )}

      <AdminPager
        label="Class pages"
        page={data.page}
        pageCount={data.pageCount}
        start={start}
        end={end}
        total={data.teacherTotal}
        hrefFor={(nextPage) => classesHref({ ...query, page: nextPage, classId: null })}
      />
    </div>
  );
}

function ClassFilters({
  query,
  facets,
}: {
  query: ClassQuery;
  facets: Awaited<ReturnType<typeof loadClassAdmin>>['facets'];
}) {
  const href = (patch: Partial<ClassQuery>) => classesHref({ ...query, page: 1, classId: null, ...patch });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <ClassSearch query={query} />
        {classesFiltering(query) && (
          <FilterLink href="/admin/classes" active={false}>
            Clear filters
          </FilterLink>
        )}
      </div>
      <ChipRow label="Classes">
        <FilterLink href={href({ status: null })} active={query.status == null}>
          All · {formatAdminNumber(facets.classes)}
        </FilterLink>
        <FilterLink href={href({ status: 'active' })} active={query.status === 'active'}>
          Open · {formatAdminNumber(facets.active)}
        </FilterLink>
        <FilterLink href={href({ status: 'enrolled' })} active={query.status === 'enrolled'}>
          With students · {formatAdminNumber(facets.enrolled)}
        </FilterLink>
        <FilterLink href={href({ status: 'empty' })} active={query.status === 'empty'}>
          Empty · {formatAdminNumber(facets.empty)}
        </FilterLink>
        <FilterLink href={href({ status: 'archived' })} active={query.status === 'archived'}>
          Archived · {formatAdminNumber(facets.archived)}
        </FilterLink>
      </ChipRow>
      <ChipRow label="Sort">
        <FilterLink href={href({ sort: 'newest' })} active={query.sort === 'newest'}>Newest class</FilterLink>
        <FilterLink href={href({ sort: 'students' })} active={query.sort === 'students'}>Most students</FilterLink>
        <FilterLink href={href({ sort: 'teacher' })} active={query.sort === 'teacher'}>Teacher name</FilterLink>
      </ChipRow>
    </div>
  );
}

function TeacherCard({
  teacher,
  query,
}: {
  teacher: Awaited<ReturnType<typeof loadClassAdmin>>['teachers'][number];
  query: ClassQuery;
}) {
  const profileHref = usersHref({ q: teacher.email ?? teacher.name ?? '' });
  const classNoun = teacher.classes.length === 1 ? 'class' : 'classes';

  return (
    <section className="rounded-2xl border border-border bg-surface overflow-hidden">
      <header className="px-4 py-3 flex items-center gap-3 border-b border-border">
        <UserAvatar name={teacher.name} image={teacher.image} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={profileHref} className="text-sm font-medium text-light-text truncate hover:text-primary">
              {teacher.name ?? 'Unnamed'}
            </Link>
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded border text-primary border-primary/40 bg-primary/10">
              {planLabel(teacher.plan, teacher.planTier)}
            </span>
          </div>
          <p className="text-xs text-dark-text truncate">{teacher.email ?? 'No email'}</p>
        </div>
        <p className="shrink-0 text-right text-[11px] text-dark-text leading-tight">
          <span className="block font-mono tabular-nums text-light-text">{formatAdminNumber(teacher.classes.length)} {classNoun}</span>
          <span className="font-mono tabular-nums">{formatAdminNumber(teacher.students)} students</span>
        </p>
      </header>
      <ul className="divide-y divide-border">
        {teacher.classes.map((cls) => (
          <ClassRow key={cls.id} cls={cls} query={query} />
        ))}
      </ul>
    </section>
  );
}

function ClassRow({ cls, query }: { cls: AdminClassRow; query: ClassQuery }) {
  const open = cls.members != null;
  const href = classesHref({ ...query, classId: open ? null : cls.id });

  return (
    <li>
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-sm text-light-text truncate">{cls.name}</p>
            {cls.archived && (
              <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded border text-dark-text border-border bg-border/20">
                Archived
              </span>
            )}
          </div>
          <p className="text-[11px] text-dark-text mt-0.5">
            <span className="font-mono">{cls.joinCode}</span>
            <span className="mx-1.5 text-dark-text/40">·</span>
            {formatAdminDay(cls.createdAt)}
            <span className="mx-1.5 text-dark-text/40">·</span>
            {cls.assignments === 0 ? 'No assignments' : `${formatAdminNumber(cls.assignments)} assignment${cls.assignments === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link
          href={href}
          scroll={false}
          prefetch={false}
          aria-expanded={open}
          className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border transition-colors ${
            open
              ? 'bg-primary/15 border-primary/50 text-primary'
              : 'bg-background border-border text-dark-text hover:text-light-text'
          }`}
        >
          {cls.students === 0 ? 'No students' : `${formatAdminNumber(cls.students)} student${cls.students === 1 ? '' : 's'}`}
          <ChevronRight size={13} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
        </Link>
      </div>
      {open && cls.members && (
        <StudentList members={cls.members} total={cls.students} truncated={cls.membersTruncated} />
      )}
    </li>
  );
}

function StudentList({
  members,
  total,
  truncated,
}: {
  members: ClassMember[];
  total: number;
  truncated: boolean;
}) {
  if (members.length === 0) {
    return (
      <p className="px-4 pb-3 text-xs text-dark-text">No students have joined this class yet.</p>
    );
  }

  return (
    <div className="px-4 pb-3">
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-background/40">
              <th className="text-left px-3 py-2 text-dark-text font-medium">Student</th>
              <th className="text-left px-3 py-2 text-dark-text font-medium hidden sm:table-cell">Email</th>
              <th className="text-right px-3 py-2 text-dark-text font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-3 py-2 text-light-text">
                  {member.email ? (
                    <Link href={usersHref({ q: member.email })} className="hover:text-primary">
                      {member.name ?? 'Unnamed'}
                    </Link>
                  ) : (
                    member.name ?? 'Unnamed'
                  )}
                  <span className="block sm:hidden text-[10px] text-dark-text truncate">{member.email ?? '—'}</span>
                </td>
                <td className="px-3 py-2 text-dark-text hidden sm:table-cell">{member.email ?? '—'}</td>
                <td className="px-3 py-2 text-right text-dark-text whitespace-nowrap">{formatAdminDay(member.joinedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {truncated && (
        <p className="mt-2 text-[11px] text-dark-text">
          Showing the {formatAdminNumber(members.length)} most recent of {formatAdminNumber(total)} students.
        </p>
      )}
    </div>
  );
}

function planLabel(plan: string, tier: string | null) {
  const base = nice(plan);
  if (!tier || tier.toLowerCase() === plan.toLowerCase()) return base;
  return `${base} · ${tier}`;
}
