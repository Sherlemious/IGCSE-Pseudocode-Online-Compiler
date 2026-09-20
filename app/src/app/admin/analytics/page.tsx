import { unstable_cache } from 'next/cache';
import { prisma } from '@/shared/db';
import { getQuestionCatalog } from '@/shared/lib/catalogCache';
import {
  SectionHeading,
  Panel,
  StatTile,
  AreaChart,
  RingChart,
  BarRow,
  SegmentBar,
  RankedList,
} from './_components/charts';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Analytics' };

const DAY = 24 * 60 * 60 * 1000;

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function cumulative(arr: number[]): number[] {
  const out: number[] = [];
  let acc = 0;
  for (const v of arr) {
    acc += v;
    out.push(acc);
  }
  return out;
}

function scoreClass(score: number) {
  if (score >= 70) return 'text-success bg-success/10';
  if (score >= 40) return 'text-warning bg-warning/10';
  return 'text-error bg-error/10';
}

/**
 * Every read this page needs, in one cached unit.
 *
 * The page is `force-dynamic` because the admin gate is per-request, but the
 * numbers do not need to be. Neon keeps the compute billable for 5 minutes
 * after any query, so an uncached dashboard turns each refresh into another
 * 5-minute charge — expensive while iterating on the layout. The window is
 * short enough that the figures still read as current.
 */
const ANALYTICS_REVALIDATE_SECONDS = 300;

async function loadAnalytics() {
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * DAY);
  const d14 = new Date(now.getTime() - 14 * DAY);
  const d30 = new Date(now.getTime() - 30 * DAY);

  const [
    userTotals,
    progressTotals,
    examTotals,
    usersByRole,
    usersByPlan,
    feedbackAgg,
    signupRows,
    activityRows,
    questionRows,
    questionsMeta,
    recentExams,
  ] = await Promise.all([
    prisma.$queryRaw<[{ total: number; new7: number; prev7: number }]>`
      SELECT count(*)::int AS total,
             count(*) FILTER (WHERE "createdAt" >= ${d7})::int AS new7,
             count(*) FILTER (WHERE "createdAt" >= ${d14} AND "createdAt" < ${d7})::int AS prev7
      FROM "User"
    `,
    prisma.$queryRaw<[{ attempts: number; solved: number; active7: number }]>`
      SELECT count(*)::int AS attempts,
             count(*) FILTER (WHERE status = 'SOLVED')::int AS solved,
             count(DISTINCT "userId") FILTER (WHERE "updatedAt" >= ${d7})::int AS active7
      FROM "Progress"
    `,
    prisma.$queryRaw<[{ completed: number; inProgress: number; timedOut: number; avgScore: number | null }]>`
      SELECT count(*) FILTER (WHERE status = 'COMPLETED')::int AS "completed",
             count(*) FILTER (WHERE status = 'IN_PROGRESS')::int AS "inProgress",
             count(*) FILTER (WHERE status = 'TIMED_OUT')::int AS "timedOut",
             (avg(COALESCE("score", 0)::float8 / "totalTests" * 100)
                FILTER (WHERE status = 'COMPLETED' AND "totalTests" > 0))::float8 AS "avgScore"
      FROM "ExamAttempt"
    `,
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.user.groupBy({ by: ['plan'], _count: { _all: true } }),
    prisma.feedbackSubmission.aggregate({ _avg: { rating: true }, _count: { _all: true } }),
    // Day buckets are computed in Postgres so the page never ships one row per
    // signup / attempt over the wire. Prisma stores DateTime as UTC `timestamp`,
    // which matches the UTC keys `dayKey` builds below.
    prisma.$queryRaw<Array<{ day: string; n: number }>>`
      SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, count(*)::int AS n
      FROM "User" WHERE "createdAt" >= ${d30} GROUP BY 1
    `,
    prisma.$queryRaw<Array<{ day: string; n: number }>>`
      SELECT to_char(date_trunc('day', "updatedAt"), 'YYYY-MM-DD') AS day,
             count(DISTINCT "userId")::int AS n
      FROM "Progress" WHERE "updatedAt" >= ${d30} GROUP BY 1
    `,
    prisma.$queryRaw<Array<{ questionId: string; attempts: number; solves: number }>>`
      SELECT "questionId",
             count(*)::int AS attempts,
             count(*) FILTER (WHERE status = 'SOLVED')::int AS solves
      FROM "Progress" GROUP BY "questionId"
    `,
    getQuestionCatalog(),
    prisma.examAttempt.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 6,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  // Flattened to plain JSON so the value survives the cache round-trip.
  return {
    generatedAt: now.toISOString(),
    userTotals: userTotals[0],
    progressTotals: progressTotals[0],
    examTotals: examTotals[0],
    usersByRole: usersByRole.map((r) => ({ role: r.role as string, count: r._count._all })),
    usersByPlan: usersByPlan.map((p) => ({ plan: p.plan as string, count: p._count._all })),
    feedback: { avg: feedbackAgg._avg.rating ?? 0, count: feedbackAgg._count._all },
    signupRows,
    activityRows,
    questionRows,
    questions: questionsMeta.map((q) => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty as string,
    })),
    recentExams: recentExams.map((e) => ({
      id: e.id,
      score: e.score,
      totalTests: e.totalTests,
      completedAt: e.completedAt ? e.completedAt.toISOString() : null,
      name: e.user?.name ?? null,
      email: e.user?.email ?? null,
    })),
  };
}

const getAnalytics = unstable_cache(loadAnalytics, ['admin-analytics'], {
  revalidate: ANALYTICS_REVALIDATE_SECONDS,
});

export default async function AdminAnalyticsPage() {
  const {
    generatedAt,
    userTotals,
    progressTotals,
    examTotals,
    usersByRole,
    usersByPlan,
    feedback,
    signupRows,
    activityRows,
    questionRows,
    questions,
    recentExams,
  } = await getAnalytics();

  const now = new Date(generatedAt);
  const totalUsers = userTotals.total;
  const totalAttempts = progressTotals.attempts;
  const totalSolved = progressTotals.solved;
  const active7 = progressTotals.active7;

  // ── 30-day daily buckets ──────────────────────────────────
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) days.push(dayKey(new Date(now.getTime() - i * DAY)));
  const dayIndex = new Map(days.map((k, i) => [k, i]));

  const toSeries = (rows: Array<{ day: string; n: number }>) => {
    const series = new Array<number>(30).fill(0);
    for (const row of rows) {
      const idx = dayIndex.get(row.day);
      if (idx !== undefined) series[idx] = row.n;
    }
    return series;
  };

  const signupSeries = toSeries(signupRows);
  const activitySeries = toSeries(activityRows);

  // Cumulative signups (for the total-users sparkline shape)
  const cumulativeSeries = cumulative(signupSeries);

  // Weekly deltas
  const newUsers7 = userTotals.new7;
  const newUsersPrev7 = userTotals.prev7;
  const usersDelta = newUsersPrev7 > 0
    ? Math.round(((newUsers7 - newUsersPrev7) / newUsersPrev7) * 100)
    : newUsers7 > 0 ? 100 : 0;

  const solveRate = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0;

  // ── Role / plan maps ──────────────────────────────────────
  const roleMap = Object.fromEntries(usersByRole.map((r) => [r.role, r.count])) as Record<string, number>;
  const planMap = Object.fromEntries(usersByPlan.map((p) => [p.plan, p.count])) as Record<string, number>;

  const roleTotal = (roleMap.STUDENT ?? 0) + (roleMap.TEACHER ?? 0) + (roleMap.ADMIN ?? 0);
  const paidCount =
    (planMap.STUDENT ?? 0) + (planMap.STARTER ?? 0) + (planMap.PRO ?? 0) + (planMap.SCHOOL ?? 0);
  const planTotal = (planMap.FREE ?? 0) + paidCount;
  const paidPct = planTotal > 0 ? Math.round((paidCount / planTotal) * 100) : 0;

  // ── Question join ─────────────────────────────────────────
  const questionStats = new Map(questionRows.map((r) => [r.questionId, r]));

  const qStats = questions.map((q) => {
    const row = questionStats.get(q.id);
    const attempts = row?.attempts ?? 0;
    const solves = row?.solves ?? 0;
    return {
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      attempts,
      solves,
      rate: attempts > 0 ? Math.round((solves / attempts) * 100) : 0,
    };
  });

  const maxAttempts = Math.max(...qStats.map((q) => q.attempts), 1);
  const mostAttempted = [...qStats].filter((q) => q.attempts > 0).sort((a, b) => b.attempts - a.attempts).slice(0, 6);
  const hardest = [...qStats].filter((q) => q.attempts >= 3).sort((a, b) => a.rate - b.rate).slice(0, 6);

  // Difficulty solve-rate
  const diffAgg: Record<string, { attempts: number; solves: number }> = {
    EASY: { attempts: 0, solves: 0 },
    MEDIUM: { attempts: 0, solves: 0 },
    HARD: { attempts: 0, solves: 0 },
  };
  for (const q of qStats) {
    const bucket = diffAgg[q.difficulty];
    if (bucket) {
      bucket.attempts += q.attempts;
      bucket.solves += q.solves;
    }
  }

  // ── Exam metrics ──────────────────────────────────────────
  const { completed: examsCompleted, inProgress: examsInProgress, timedOut: examsTimedOut } = examTotals;
  const examsTotal = examsCompleted + examsInProgress + examsTimedOut;
  const examCompletionPct = examsTotal > 0 ? examsCompleted / examsTotal : 0;
  const avgExamScore = Math.round(examTotals.avgScore ?? 0);

  const avgRating = feedback.avg;
  const ratingPct = avgRating / 5;

  return (
    <div className="max-w-6xl stagger-children space-y-6">
      {/* ── Hero ── */}
      <header className="card-glow bg-dot-grid rounded-2xl bg-surface px-4 py-5 sm:px-6 sm:py-7 flex flex-col sm:flex-row sm:items-start justify-between gap-3 overflow-hidden relative">
        <div>
          <p className="mono-label text-primary">Platform Analytics</p>
          <h1 className="hidden md:block text-2xl sm:text-3xl font-bold text-light-text tracking-tight mt-1">Analytics</h1>
          <p className="text-sm text-dark-text mt-1.5">
            Real-time view of growth, engagement &amp; learning outcomes
          </p>
        </div>
        <div className="flex items-center gap-2 self-start shrink-0 bg-background/60 border border-border rounded-full px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-[11px] text-dark-text font-mono">Live · 30d</span>
        </div>
      </header>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total users"
          value={totalUsers}
          sub={`${roleMap.STUDENT ?? 0} students`}
          spark={cumulativeSeries}
        />
        <StatTile
          label="New users · 7d"
          value={newUsers7}
          delta={usersDelta}
          sub="vs previous week"
          spark={signupSeries}
        />
        <StatTile
          label="Active learners · 7d"
          value={active7}
          sub="distinct, last 7 days"
          spark={activitySeries}
          sparkColor="var(--color-success)"
        />
        <StatTile
          label="Questions solved"
          value={totalSolved}
          sub={`${solveRate}% of ${totalAttempts.toLocaleString()} attempts`}
          spark={undefined}
        />
      </div>

      {/* ── Bento: trend + rings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2">
          <SectionHeading
            eyebrow="Growth"
            title="Signups vs active learners"
            meta={
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-primary rounded" />Signups</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-success rounded" />Active</span>
              </span>
            }
          />
          {signupRows.length === 0 && activityRows.length === 0 ? (
            <p className="text-sm text-dark-text py-10 text-center">No activity in the last 30 days.</p>
          ) : (
            <AreaChart primary={signupSeries} secondary={activitySeries} labels={days.map((d) => d.slice(5))} />
          )}
        </Panel>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <Panel className="flex flex-col items-center justify-center">
            <RingChart
              pct={examCompletionPct}
              centerValue={`${Math.round(examCompletionPct * 100)}%`}
              centerSub="completed"
              label="Exam completion"
              color="var(--color-primary)"
            />
          </Panel>
          <Panel className="flex flex-col items-center justify-center">
            <RingChart
              pct={ratingPct}
              centerValue={avgRating > 0 ? avgRating.toFixed(1) : '—'}
              centerSub={`${feedback.count} reviews`}
              label="Avg feedback rating"
              color="var(--color-warning)"
            />
          </Panel>
        </div>
      </div>

      {/* ── Distributions ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel>
          <SectionHeading eyebrow="Audience" title="Users by role" />
          <div className="space-y-3.5 mt-4">
            <BarRow label="Students" count={roleMap.STUDENT ?? 0} pct={roleTotal ? Math.round(((roleMap.STUDENT ?? 0) / roleTotal) * 100) : 0} color="bg-primary" />
            <BarRow label="Teachers" count={roleMap.TEACHER ?? 0} pct={roleTotal ? Math.round(((roleMap.TEACHER ?? 0) / roleTotal) * 100) : 0} color="bg-success" />
            <BarRow label="Admins" count={roleMap.ADMIN ?? 0} pct={roleTotal ? Math.round(((roleMap.ADMIN ?? 0) / roleTotal) * 100) : 0} color="bg-error" />
          </div>
        </Panel>

        <Panel>
          <SectionHeading eyebrow="Monetisation" title="Plan mix" meta={`${paidPct}% paid`} />
          <div className="flex flex-col items-center justify-center py-2">
            <RingChart
              pct={planTotal ? paidCount / planTotal : 0}
              centerValue={paidCount.toLocaleString()}
              centerSub="paid"
              color="var(--color-warning)"
              size={108}
            />
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[11px] text-dark-text">
                <span className="w-2 h-2 rounded-full bg-warning" /> Paid {paidCount}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-dark-text">
                <span className="w-2 h-2 rounded-full bg-border" /> Free {planMap.FREE ?? 0}
              </span>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeading eyebrow="Difficulty" title="Solve rate" />
          <div className="space-y-3.5 mt-4">
            {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => {
              const b = diffAgg[diff];
              const rate = b.attempts > 0 ? Math.round((b.solves / b.attempts) * 100) : 0;
              const color = diff === 'EASY' ? 'bg-success' : diff === 'MEDIUM' ? 'bg-warning' : 'bg-error';
              return (
                <BarRow
                  key={diff}
                  label={diff.charAt(0) + diff.slice(1).toLowerCase()}
                  count={`${b.solves}/${b.attempts}`}
                  pct={rate}
                  color={color}
                />
              );
            })}
          </div>
        </Panel>
      </div>

      {/* ── Question leaderboards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionHeading eyebrow="Engagement" title="Most attempted questions" />
          <div className="mt-4">
            <RankedList
              items={mostAttempted.map((q) => ({
                id: q.id,
                title: q.title,
                barPct: Math.round((q.attempts / maxAttempts) * 100),
                chip: `${q.attempts}`,
                chipClass: 'text-primary bg-primary/10',
                barClass: 'bg-primary/60',
              }))}
            />
          </div>
        </Panel>

        <Panel>
          <SectionHeading eyebrow="Struggle points" title="Hardest questions" meta="≥3 attempts" />
          <div className="mt-4">
            <RankedList
              items={hardest.map((q) => ({
                id: q.id,
                title: q.title,
                barPct: q.rate,
                chip: `${q.rate}%`,
                chipClass: q.rate < 30 ? 'text-error bg-error/10' : q.rate < 60 ? 'text-warning bg-warning/10' : 'text-success bg-success/10',
                barClass: q.rate < 30 ? 'bg-error/60' : q.rate < 60 ? 'bg-warning/60' : 'bg-success/60',
              }))}
              emptyText="Not enough attempts yet"
            />
          </div>
        </Panel>
      </div>

      {/* ── Exams ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <SectionHeading
            eyebrow="Assessments"
            title="Exam outcomes"
            meta={<span className="font-mono tabular-nums">avg <span className="text-light-text font-semibold">{avgExamScore}%</span></span>}
          />
          <div className="mt-4">
            {examsTotal === 0 ? (
              <p className="text-sm text-dark-text py-4">No exams attempted yet.</p>
            ) : (
              <SegmentBar
                segments={[
                  { label: 'Completed', value: examsCompleted, color: 'bg-success', text: 'text-success' },
                  { label: 'In progress', value: examsInProgress, color: 'bg-primary', text: 'text-primary' },
                  { label: 'Timed out', value: examsTimedOut, color: 'bg-error', text: 'text-error' },
                ]}
              />
            )}
          </div>
        </Panel>

        <Panel pad={false}>
          <div className="p-5 pb-3">
            <SectionHeading eyebrow="Latest" title="Recent completed exams" />
          </div>
          {recentExams.length === 0 ? (
            <p className="text-sm text-dark-text px-5 pb-5">No completed exams yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentExams.map((exam) => {
                const score = exam.totalTests && exam.totalTests > 0
                  ? Math.round(((exam.score ?? 0) / exam.totalTests) * 100)
                  : null;
                return (
                  <div key={exam.id} className="px-5 py-2.5 flex items-center gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="text-light-text truncate">{exam.name ?? exam.email ?? 'Unknown'}</p>
                      {exam.name && <p className="text-dark-text/60 truncate">{exam.email}</p>}
                    </div>
                    {score !== null && (
                      <span className={`font-mono tabular-nums font-semibold px-1.5 py-0.5 rounded ${scoreClass(score)}`}>
                        {score}%
                      </span>
                    )}
                    <span className="text-dark-text/50 shrink-0 whitespace-nowrap font-mono">
                      {exam.completedAt ? new Date(exam.completedAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
