import { prisma } from '@/lib/prisma';
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

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * DAY);
  const d14 = new Date(now.getTime() - 14 * DAY);
  const d30 = new Date(now.getTime() - 30 * DAY);

  const [
    totalUsers,
    totalAttempts,
    totalSolved,
    usersByRole,
    usersByPlan,
    examsByStatus,
    feedbackAgg,
    signups30,
    activity30,
    attemptsByQ,
    solvesByQ,
    questionsMeta,
    completedExams,
    recentExams,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.progress.count(),
    prisma.progress.count({ where: { status: 'SOLVED' } }),
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.user.groupBy({ by: ['plan'], _count: { _all: true } }),
    prisma.examAttempt.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.feedbackSubmission.aggregate({ _avg: { rating: true }, _count: { _all: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: d30 } }, select: { createdAt: true } }),
    prisma.progress.findMany({ where: { updatedAt: { gte: d30 } }, select: { updatedAt: true, userId: true } }),
    prisma.progress.groupBy({ by: ['questionId'], _count: { _all: true } }),
    prisma.progress.groupBy({ by: ['questionId'], where: { status: 'SOLVED' }, _count: { _all: true } }),
    prisma.question.findMany({ select: { id: true, title: true, difficulty: true } }),
    prisma.examAttempt.findMany({ where: { status: 'COMPLETED', totalTests: { gt: 0 } }, select: { score: true, totalTests: true } }),
    prisma.examAttempt.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 6,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  // ── 30-day daily buckets ──────────────────────────────────
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) days.push(dayKey(new Date(now.getTime() - i * DAY)));
  const dayIndex = new Map(days.map((k, i) => [k, i]));

  const signupSeries = new Array(30).fill(0);
  for (const u of signups30) {
    const idx = dayIndex.get(dayKey(new Date(u.createdAt)));
    if (idx !== undefined) signupSeries[idx]++;
  }

  // Distinct active users per day
  const activeSets: Array<Set<string>> = days.map(() => new Set());
  for (const p of activity30) {
    const idx = dayIndex.get(dayKey(new Date(p.updatedAt)));
    if (idx !== undefined) activeSets[idx].add(p.userId);
  }
  const activitySeries = activeSets.map((s) => s.size);

  // Cumulative signups (for the total-users sparkline shape)
  const cumulativeSeries = cumulative(signupSeries);

  // Weekly deltas derived from buckets
  const newUsers7 = signups30.filter((u) => new Date(u.createdAt) >= d7).length;
  const newUsersPrev7 = signups30.filter((u) => {
    const t = new Date(u.createdAt);
    return t >= d14 && t < d7;
  }).length;
  const usersDelta = newUsersPrev7 > 0
    ? Math.round(((newUsers7 - newUsersPrev7) / newUsersPrev7) * 100)
    : newUsers7 > 0 ? 100 : 0;

  // Active learners in last 7 days (distinct)
  const active7 = new Set(activity30.filter((p) => new Date(p.updatedAt) >= d7).map((p) => p.userId)).size;

  const solveRate = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0;

  // ── Role / plan maps ──────────────────────────────────────
  const roleMap = Object.fromEntries(usersByRole.map((r) => [r.role, r._count._all])) as Record<string, number>;
  const planMap = Object.fromEntries(usersByPlan.map((p) => [p.plan, p._count._all])) as Record<string, number>;
  const statusMap = Object.fromEntries(examsByStatus.map((e) => [e.status, e._count._all])) as Record<string, number>;

  const roleTotal = (roleMap.STUDENT ?? 0) + (roleMap.TEACHER ?? 0) + (roleMap.ADMIN ?? 0);
  const planTotal = (planMap.FREE ?? 0) + (planMap.PREMIUM ?? 0);
  const premiumPct = planTotal > 0 ? Math.round(((planMap.PREMIUM ?? 0) / planTotal) * 100) : 0;

  // ── Question join ─────────────────────────────────────────
  const attemptMap = new Map(attemptsByQ.map((a) => [a.questionId, a._count._all]));
  const solveMap = new Map(solvesByQ.map((s) => [s.questionId, s._count._all]));

  const qStats = questionsMeta.map((q) => {
    const attempts = attemptMap.get(q.id) ?? 0;
    const solves = solveMap.get(q.id) ?? 0;
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
  const examsTotal = (statusMap.COMPLETED ?? 0) + (statusMap.IN_PROGRESS ?? 0) + (statusMap.TIMED_OUT ?? 0);
  const examCompletionPct = examsTotal > 0 ? (statusMap.COMPLETED ?? 0) / examsTotal : 0;
  const avgExamScore = completedExams.length > 0
    ? Math.round(completedExams.reduce((s, e) => s + ((e.score ?? 0) / (e.totalTests || 1)) * 100, 0) / completedExams.length)
    : 0;

  const avgRating = feedbackAgg._avg.rating ?? 0;
  const ratingPct = avgRating / 5;

  return (
    <div className="max-w-6xl stagger-children space-y-6">
      {/* ── Hero ── */}
      <header className="card-glow bg-dot-grid rounded-2xl bg-surface px-6 py-7 flex items-start justify-between gap-4 overflow-hidden relative">
        <div>
          <p className="mono-label text-primary">Platform Analytics</p>
          <h1 className="text-3xl font-bold text-light-text tracking-tight mt-1">Analytics</h1>
          <p className="text-sm text-dark-text mt-1.5">
            Real-time view of growth, engagement &amp; learning outcomes
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 bg-background/60 border border-border rounded-full px-3 py-1.5">
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
          {signups30.length === 0 && activity30.length === 0 ? (
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
              centerSub={`${feedbackAgg._count._all} reviews`}
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
          <SectionHeading eyebrow="Monetisation" title="Plan mix" meta={`${premiumPct}% premium`} />
          <div className="flex flex-col items-center justify-center py-2">
            <RingChart
              pct={planTotal ? (planMap.PREMIUM ?? 0) / planTotal : 0}
              centerValue={(planMap.PREMIUM ?? 0).toLocaleString()}
              centerSub="premium"
              color="var(--color-warning)"
              size={108}
            />
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[11px] text-dark-text">
                <span className="w-2 h-2 rounded-full bg-warning" /> Premium {planMap.PREMIUM ?? 0}
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
                  { label: 'Completed', value: statusMap.COMPLETED ?? 0, color: 'bg-success', text: 'text-success' },
                  { label: 'In progress', value: statusMap.IN_PROGRESS ?? 0, color: 'bg-primary', text: 'text-primary' },
                  { label: 'Timed out', value: statusMap.TIMED_OUT ?? 0, color: 'bg-error', text: 'text-error' },
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
                      <p className="text-light-text truncate">{exam.user?.name ?? exam.user?.email ?? 'Unknown'}</p>
                      {exam.user?.name && <p className="text-dark-text/60 truncate">{exam.user?.email}</p>}
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
