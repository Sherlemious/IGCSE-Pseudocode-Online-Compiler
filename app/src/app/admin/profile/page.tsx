import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { TrendingUp, TrendingDown, BookOpen, ClipboardList, Trophy, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Profile' };

export default async function AdminProfilePage() {
  const session = await auth();
  const adminId = session?.user?.id ?? '';

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgoStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    adminProgress,
    adminExamCount,
    newUsersThisWeek,
    newUsersLastWeek,
    usersByRole,
    questionCount,
    solvedCount,
    recentSignups,
    recentExams,
  ] = await Promise.all([
    prisma.progress.findMany({ where: { userId: adminId }, select: { status: true } }),
    prisma.examAttempt.count({ where: { userId: adminId } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.question.count(),
    prisma.progress.count({ where: { status: 'SOLVED' } }),
    prisma.user.findMany({
      where: { createdAt: { gte: fourteenDaysAgoStart } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.examAttempt.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const adminQuestionsAttempted = adminProgress.length;
  const adminQuestionsSolved = adminProgress.filter((p) => p.status === 'SOLVED').length;
  const solveRate = adminQuestionsAttempted > 0
    ? Math.round((adminQuestionsSolved / adminQuestionsAttempted) * 100)
    : 0;

  const weekGrowthPct = newUsersLastWeek > 0
    ? Math.round(((newUsersThisWeek - newUsersLastWeek) / newUsersLastWeek) * 100)
    : newUsersThisWeek > 0 ? 100 : 0;
  const weekGrowthUp = weekGrowthPct >= 0;

  const roleMap = Object.fromEntries(
    usersByRole.map(({ role, _count }) => [role, _count._all])
  );
  const totalUsers = (roleMap.STUDENT ?? 0) + (roleMap.TEACHER ?? 0) + (roleMap.ADMIN ?? 0);

  // Build daily signup counts for the last 14 days
  const dailyMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const { createdAt } of recentSignups) {
    const key = new Date(createdAt).toISOString().slice(0, 10);
    if (key in dailyMap) dailyMap[key]++;
  }
  const dailyEntries = Object.entries(dailyMap);
  const maxSignups = Math.max(...dailyEntries.map(([, v]) => v), 1);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-light-text">Profile</h1>
        <p className="text-sm text-dark-text mt-1">Your activity &amp; platform analytics</p>
      </div>

      {/* Your activity */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-dark-text uppercase tracking-widest">Your Activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<ClipboardList size={16} />}
            label="Questions attempted"
            value={adminQuestionsAttempted}
            color="text-primary"
          />
          <StatCard
            icon={<Trophy size={16} />}
            label="Questions solved"
            value={adminQuestionsSolved}
            sub={adminQuestionsAttempted > 0 ? `${solveRate}% solve rate` : undefined}
            color="text-success"
          />
          <StatCard
            icon={<BookOpen size={16} />}
            label="Exams taken"
            value={adminExamCount}
            color="text-warning"
          />
        </div>
      </section>

      {/* Platform growth */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-dark-text uppercase tracking-widest">Platform Growth</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="mb-3 text-primary"><Users size={16} /></div>
            <p className="text-2xl font-bold text-light-text">{newUsersThisWeek}</p>
            <p className="text-xs text-dark-text mt-1">New users this week</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${weekGrowthUp ? 'text-success' : 'text-error'}`}>
              {weekGrowthUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {weekGrowthPct > 0 ? '+' : ''}{weekGrowthPct}% vs last week
            </div>
          </div>

          <StatCard
            icon={<BookOpen size={16} />}
            label="Questions in bank"
            value={questionCount}
            color="text-primary"
          />

          <StatCard
            icon={<Trophy size={16} />}
            label="Total solves (all users)"
            value={solvedCount}
            color="text-success"
          />
        </div>
      </section>

      {/* User distribution */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-dark-text uppercase tracking-widest">User Distribution</h2>
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          {([
            ['STUDENT', 'text-dark-text', 'bg-border/50'],
            ['TEACHER', 'text-primary',   'bg-primary/30'],
            ['ADMIN',   'text-error',     'bg-error/30'],
          ] as const).map(([role, textCls, barCls]) => {
            const count = roleMap[role] ?? 0;
            const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
            return (
              <div key={role} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${textCls}`}>{role.charAt(0) + role.slice(1).toLowerCase()}</span>
                  <span className="text-dark-text">{count} · {pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                  <div className={`h-full ${barCls} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily signups chart */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-dark-text uppercase tracking-widest">Daily Signups — Last 14 Days</h2>
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-end gap-1 h-20">
            {dailyEntries.map(([date, count]) => {
              const heightPct = Math.round((count / maxSignups) * 100);
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-primary/30 hover:bg-primary/60 rounded-sm transition-colors cursor-default"
                    style={{ height: `${Math.max(heightPct, count > 0 ? 8 : 4)}%`, minHeight: '3px' }}
                    title={`${date}: ${count} signup${count !== 1 ? 's' : ''}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-dark-text/50">
            <span>{dailyEntries[0]?.[0]?.slice(5)}</span>
            <span>{dailyEntries[dailyEntries.length - 1]?.[0]?.slice(5)}</span>
          </div>
        </div>
      </section>

      {/* Recent completed exams */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-dark-text uppercase tracking-widest">Recent Completed Exams</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {recentExams.length === 0 ? (
            <p className="px-5 py-4 text-sm text-dark-text">No completed exams yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentExams.map((exam) => {
                const score = exam.totalTests && exam.totalTests > 0
                  ? Math.round(((exam.score ?? 0) / exam.totalTests) * 100)
                  : null;
                return (
                  <div key={exam.id} className="px-5 py-3 flex items-center gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="text-light-text truncate">{exam.user?.name ?? exam.user?.email ?? 'Unknown'}</p>
                      <p className="text-dark-text/60 truncate">{exam.user?.email}</p>
                    </div>
                    {score !== null && (
                      <span className={`font-semibold ${score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-error'}`}>
                        {score}%
                      </span>
                    )}
                    <span className="text-dark-text/50 shrink-0 whitespace-nowrap">
                      {exam.completedAt ? new Date(exam.completedAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="text-2xl font-bold text-light-text">{value.toLocaleString()}</p>
      <p className="text-xs text-dark-text mt-1">{label}</p>
      {sub && <p className="text-[10px] text-dark-text/60 mt-1">{sub}</p>}
    </div>
  );
}
