import Link from 'next/link';
import { AdminPager } from '../../_components/AdminPager';
import { ChipRow, FilterLink, RelativeTime } from '../../_components/adminUi';
import { learnHref, type LearnQuery, type LearnerRow } from '../learnQuery';
import LearnSearch from './LearnSearch';

export default function LearnRoster({
  query,
  learners,
  total,
  page,
  pageCount,
  start,
  end,
  defaultCourseId,
}: {
  query: LearnQuery;
  learners: LearnerRow[];
  total: number;
  page: number;
  pageCount: number;
  start: number;
  end: number;
  defaultCourseId: string;
}) {
  const href = (patch: Partial<LearnQuery>) =>
    learnHref({ ...query, page: 1, learner: query.learner, ...patch }, defaultCourseId);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        <LearnSearch query={query} defaultCourseId={defaultCourseId} />
        <ChipRow label="Show">
          <FilterLink href={href({ filter: 'all' })} active={query.filter === 'all'}>Everyone</FilterLink>
          <FilterLink href={href({ filter: 'active' })} active={query.filter === 'active'}>Active this week</FilterLink>
          <FilterLink href={href({ filter: 'stuck' })} active={query.filter === 'stuck'}>Stuck</FilterLink>
          <FilterLink href={href({ filter: 'done' })} active={query.filter === 'done'}>Finished</FilterLink>
        </ChipRow>
        <ChipRow label="Sort">
          <FilterLink href={href({ sort: 'recent' })} active={query.sort === 'recent'}>Recent</FilterLink>
          <FilterLink href={href({ sort: 'progress' })} active={query.sort === 'progress'}>Furthest</FilterLink>
          <FilterLink href={href({ sort: 'name' })} active={query.sort === 'name'}>Name</FilterLink>
        </ChipRow>
      </div>

      {learners.length === 0 ? (
        <p className="text-sm text-dark-text">No learners match.</p>
      ) : (
        <>
          <ul className="md:hidden space-y-2">
            {learners.map((learner) => (
              <li key={learner.userId}>
                <LearnerLink learner={learner} query={query} defaultCourseId={defaultCourseId} />
              </li>
            ))}
          </ul>
          <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-pretty">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-dark-text">
                    <th className="px-4 py-3 font-medium">Learner</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Furthest</th>
                    <th className="px-4 py-3 font-medium">Last active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {learners.map((learner) => {
                    const pct = learner.playable === 0 ? 0 : Math.round((learner.completed / learner.playable) * 100);
                    const selected = query.learner === learner.userId;
                    return (
                      <tr key={learner.userId} className={selected ? 'bg-primary/10' : 'hover:bg-border/10'}>
                        <td className="px-4 py-3">
                          <Link
                            href={learnHref({ ...query, learner: learner.userId }, defaultCourseId)}
                            scroll={false}
                            prefetch={false}
                            className="block min-w-0"
                          >
                            <span className="text-sm text-light-text font-medium truncate block">
                              {learner.name || learner.email || 'Student'}
                            </span>
                            {learner.name && learner.email && (
                              <span className="text-[11px] text-dark-text truncate block">{learner.email}</span>
                            )}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-border/50 overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-mono tabular-nums text-dark-text">
                              {learner.completed}/{learner.playable}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-dark-text max-w-[16rem]">
                          <p className="truncate">{learner.furthest ?? '—'}</p>
                          {learner.stuckReason && (
                            <p className="text-[11px] text-warning truncate">{learner.stuckReason}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                          <RelativeTime value={learner.lastActivityAt} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AdminPager
        label="Learner pages"
        page={page}
        pageCount={pageCount}
        start={start}
        end={end}
        total={total}
        hrefFor={(nextPage) => learnHref({ ...query, page: nextPage }, defaultCourseId)}
      />
    </div>
  );
}

function LearnerLink({
  learner,
  query,
  defaultCourseId,
}: {
  learner: LearnerRow;
  query: LearnQuery;
  defaultCourseId: string;
}) {
  const pct = learner.playable === 0 ? 0 : Math.round((learner.completed / learner.playable) * 100);
  const selected = query.learner === learner.userId;
  return (
    <Link
      href={learnHref({ ...query, learner: learner.userId }, defaultCourseId)}
      scroll={false}
      prefetch={false}
      className={`block rounded-2xl border p-3 ${selected ? 'border-primary/50 bg-primary/10' : 'border-border bg-surface'}`}
    >
      <span className="text-sm font-medium text-light-text truncate block">
        {learner.name || learner.email || 'Student'}
      </span>
      {learner.name && learner.email && (
        <span className="text-xs text-dark-text truncate block">{learner.email}</span>
      )}
      <span className="mt-2 flex items-center gap-2 text-[11px] font-mono text-dark-text">
        <span className="h-1.5 w-16 rounded-full bg-border/50 overflow-hidden inline-block">
          <span className="block h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
        </span>
        {learner.completed}/{learner.playable}
        <span className="ml-auto"><RelativeTime value={learner.lastActivityAt} /></span>
      </span>
    </Link>
  );
}
