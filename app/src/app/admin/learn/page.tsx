import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/shared/db';
import { COURSE_CHOICES } from '@/modules/learn/courseChoice';
import { courseById } from '@/modules/learn/curriculum';
import LearnProgressChecklist from '@/modules/learn/LearnProgressChecklist';
import { buildLearnProgressView } from '@/modules/learn/progressView';
import type { LearnProgressRecord } from '@/modules/learn/progress';
import ScrollTo from '../_components/ScrollTo';
import { AdminPageHeader, EmptyState, FilterLink } from '../_components/adminUi';
import { formatAdminNumber } from '../_components/adminFormat';
import { AreaChart, Panel, RankedList, SectionHeading, StatTile } from '../analytics/_components/charts';
import { getLearnAdmin } from './loadLearnAdmin';
import { filterLearners, LEARN_PAGE_SIZE, learnHref, parseLearnQuery } from './learnQuery';
import LearnRoster from './_components/LearnRoster';
import type { LearnAdminCourse } from './learnAdmin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Paths' };

const DEFAULT_COURSE = COURSE_CHOICES[0]?.id ?? '';

export default async function AdminLearnPage({
  searchParams,
}: {
  searchParams: Promise<{
    course?: string;
    learner?: string;
    q?: string;
    sort?: string;
    filter?: string;
    page?: string;
  }>;
}) {
  const query = parseLearnQuery(await searchParams, COURSE_CHOICES.map((choice) => choice.id));
  const data = await getLearnAdmin();
  const course = data.courses.find((item) => item.courseId === query.courseId) ?? data.courses[0];
  if (!course) {
    return (
      <div className="max-w-6xl">
        <AdminPageHeader title="Paths" description="No path is configured." />
      </div>
    );
  }

  const now = new Date(data.generatedAt);
  const filtered = filterLearners(course.roster, query, now);
  const pageCount = Math.max(1, Math.ceil(filtered.length / LEARN_PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  if (page !== query.page) {
    redirect(learnHref({ ...query, page }, DEFAULT_COURSE));
  }
  const start = filtered.length === 0 ? 0 : (page - 1) * LEARN_PAGE_SIZE + 1;
  const end = Math.min(page * LEARN_PAGE_SIZE, filtered.length);
  const slice = filtered.slice((page - 1) * LEARN_PAGE_SIZE, page * LEARN_PAGE_SIZE);
  const detail = query.learner ? await loadLearner(query.learner, course.courseId) : null;

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminPageHeader
        title="Paths"
        description={`${formatAdminNumber(data.learnerCount)} signed-in learners across both paths. Anyone who never signed in still only has progress in their browser. Refreshes every 5 minutes.`}
      />

      <div className="flex flex-wrap gap-2">
        {data.courses.map((item) => (
          <FilterLink
            key={item.courseId}
            href={learnHref({ courseId: item.courseId }, DEFAULT_COURSE)}
            active={item.courseId === course.courseId}
          >
            {item.exam} · {item.paper}
            <span className="ml-1.5 font-mono tabular-nums">{formatAdminNumber(item.learners)}</span>
          </FilterLink>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile label="Learners" value={course.learners} sub="with saved progress" />
        <StatTile
          label="Active this week"
          value={course.active7}
          sub="versus the week before"
          delta={course.activeDelta ?? undefined}
          spark={course.activity}
          sparkColor="var(--color-success)"
        />
        <StatTile label="Median progress" value={`${course.medianPct}%`} sub={`of ${course.playableCount} lessons`} />
        <StatTile
          label="Finished the path"
          value={course.pathFinished}
          sub={`${formatAdminNumber(course.lessonCompletions)} lessons completed`}
        />
      </div>

      <Panel>
        <SectionHeading
          eyebrow={course.exam}
          title="Who showed up"
          meta="Distinct learners with a saved lesson that day"
        />
        <AreaChart
          primary={course.activity}
          labels={course.days.map((day) => day.slice(5))}
          unit="learners"
        />
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionHeading
            eyebrow="Funnel"
            title="How far they get"
            meta={`First ${course.freeLevels} levels are free`}
          />
          <LevelFunnel course={course} />
        </Panel>
        <Panel>
          <SectionHeading
            eyebrow="Lessons"
            title={course.stuckKind === 'retries' ? 'Most retries' : 'Where they stop'}
            meta={course.stuckKind === 'dropoff' ? 'Lowest finish rate among people who started' : 'Average tries'}
          />
          <RankedList
            emptyText={course.learners === 0 ? 'No saved progress yet.' : 'No lesson has been started yet.'}
            items={course.stuck.map((lesson) => {
              const done = lesson.started === 0 ? 0 : Math.round((lesson.completed / lesson.started) * 100);
              return {
                id: lesson.lessonId,
                title: `${lesson.lessonId} ${lesson.title}`,
                barPct: course.stuckKind === 'retries' ? Math.min(100, lesson.avgAttempts * 20) : done,
                chip: lesson.reason ?? `${lesson.completed}/${lesson.started} done`,
                chipClass: done < 50 && course.stuckKind === 'dropoff'
                  ? 'text-error bg-error/10'
                  : 'text-warning bg-warning/10',
                barClass: course.stuckKind === 'retries' ? 'bg-warning/80' : 'bg-primary/70',
              };
            })}
          />
        </Panel>
      </div>

      <section id="path-learners" className="space-y-4">
        <SectionHeading
          eyebrow="Roster"
          title="Learners"
          meta={filtered.length === course.learners
            ? `${formatAdminNumber(course.learners)} on this path`
            : `${formatAdminNumber(filtered.length)} match`}
        />
        {query.learner && (
          <>
            <ScrollTo id="path-learner" token={query.learner} />
            <LearnerDetail
              detail={detail}
              closeHref={learnHref({ ...query, learner: null }, DEFAULT_COURSE)}
            />
          </>
        )}
        {course.learners === 0 ? (
          <EmptyState>No saved path progress yet.</EmptyState>
        ) : (
          <LearnRoster
            query={{ ...query, page }}
            learners={slice}
            total={filtered.length}
            page={page}
            pageCount={pageCount}
            start={start}
            end={end}
            defaultCourseId={DEFAULT_COURSE}
          />
        )}
      </section>
    </div>
  );
}

function LevelFunnel({ course }: { course: LearnAdminCourse }) {
  if (course.learners === 0) {
    return <p className="text-sm text-dark-text">No saved progress yet.</p>;
  }
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-dark-text">Pale is started. Solid is every lesson in the level finished.</p>
      {course.levels.map((level) => {
        const reached = Math.round((level.reached / course.learners) * 100);
        const finished = Math.round((level.finished / course.learners) * 100);
        return (
          <div key={level.levelNumber} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-light-text font-medium truncate">
                {level.levelNumber} · {level.levelName}
                {!level.free && <span className="ml-2 text-[10px] uppercase tracking-wide text-warning">Paid</span>}
              </span>
              <span className="font-mono tabular-nums text-dark-text shrink-0">
                {level.finished} finished · {level.reached} started
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-border/40 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-primary/30 rounded-full" style={{ width: `${reached}%` }} />
              <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${finished}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LearnerDetail({
  detail,
  closeHref,
}: {
  detail: { name: string | null; email: string | null; view: ReturnType<typeof buildLearnProgressView> } | null;
  closeHref: string;
}) {
  return (
    <div id="path-learner" className="rounded-2xl border border-border bg-surface p-4 sm:p-5 space-y-4 scroll-mt-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-light-text truncate">
            {detail?.name || detail?.email || 'Student'}
          </h3>
          {detail?.name && detail.email && (
            <p className="text-xs text-dark-text truncate">{detail.email}</p>
          )}
        </div>
        <Link href={closeHref} scroll={false} className="text-xs text-primary hover:underline shrink-0">
          Close
        </Link>
      </div>
      {detail == null || detail.view.lessons.length === 0 ? (
        <p className="text-sm text-dark-text">No saved lessons for this person on this path.</p>
      ) : (
        <>
          <p className="text-[11px] text-dark-text">Lessons they have not opened are hidden. Counts still include them.</p>
          <LearnProgressChecklist view={detail.view} showCode />
        </>
      )}
    </div>
  );
}

async function loadLearner(userId: string, courseId: string) {
  const course = courseById(courseId);
  if (!course) return null;
  const rows = await prisma.learnProgress.findMany({
    where: { userId, courseId },
    select: {
      lessonId: true,
      status: true,
      attempts: true,
      lastOk: true,
      lastReason: true,
      lastCode: true,
      completedAt: true,
      updatedAt: true,
      user: { select: { name: true, email: true } },
    },
  });
  if (rows.length === 0) return null;
  const records: LearnProgressRecord[] = rows.map((row) => ({
    lessonId: row.lessonId,
    status: row.status,
    attempts: row.attempts,
    lastOk: row.lastOk,
    lastReason: row.lastReason,
    lastCode: row.lastCode,
    completedAt: row.completedAt,
    updatedAt: row.updatedAt,
  }));
  const view = buildLearnProgressView(records, course);
  return {
    name: rows[0]?.user.name ?? null,
    email: rows[0]?.user.email ?? null,
    view: {
      ...view,
      lessons: view.lessons.filter((lesson) => lesson.state !== 'not_started'),
    },
  };
}
