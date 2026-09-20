import { prisma } from '@/shared/db';
import { COURSE_ID } from '@/modules/learn/types';
import LearnProgressChecklist from '@/modules/learn/LearnProgressChecklist';
import { buildLearnProgressView } from '@/modules/learn/progressView';
import type { LearnProgressRecord } from '@/modules/learn/progress';
import { AdminPageHeader } from '../_components/adminUi';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Paper 2 Path' };

export default async function AdminLearnPage() {
  const rows = await prisma.learnProgress.findMany({
    where: { courseId: COURSE_ID },
    select: {
      userId: true,
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
    orderBy: { updatedAt: 'desc' },
  });

  const byUser = new Map<
    string,
    { name: string | null; email: string | null; rows: LearnProgressRecord[] }
  >();
  for (const row of rows) {
    let bucket = byUser.get(row.userId);
    if (!bucket) {
      bucket = { name: row.user.name, email: row.user.email, rows: [] };
      byUser.set(row.userId, bucket);
    }
    bucket.rows.push({
      lessonId: row.lessonId,
      status: row.status,
      attempts: row.attempts,
      lastOk: row.lastOk,
      lastReason: row.lastReason,
      lastCode: row.lastCode,
      completedAt: row.completedAt,
      updatedAt: row.updatedAt,
    });
  }

  const learners = [...byUser.entries()]
    .map(([userId, info]) => {
      const view = buildLearnProgressView(info.rows);
      return { userId, name: info.name, email: info.email, view };
    })
    .sort((a, b) => (b.view.lastActivityAt ?? '').localeCompare(a.view.lastActivityAt ?? ''));

  return (
    <div className="space-y-5 max-w-4xl">
      <AdminPageHeader
        title="Paper 2 Path"
        description={`${learners.length} signed-in learner${learners.length !== 1 ? 's' : ''} with saved progress. Unsigned traffic still only lives in the browser.`}
      />

      {learners.length === 0 ? (
        <p className="text-sm text-dark-text">No saved path progress yet.</p>
      ) : (
        <div className="space-y-3">
          {learners.map((learner) => (
            <details
              key={learner.userId}
              className="group rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <summary className="cursor-pointer list-none flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0 group-open:bg-success" />
                <span className="min-w-0 flex-1 flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-light-text truncate">
                    {learner.name || learner.email || 'Student'}
                  </span>
                  {learner.name && learner.email && (
                    <span className="text-xs text-dark-text truncate">{learner.email}</span>
                  )}
                  <span className="text-[11px] font-mono text-dark-text tabular-nums">
                    {learner.view.completedCount}/{learner.view.playableCount} done
                    {learner.view.attemptedCount > 0 ? ` · ${learner.view.attemptedCount} tried` : ''}
                    {learner.view.lastActivityAt
                      ? ` · ${new Date(learner.view.lastActivityAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                      : ''}
                  </span>
                </span>
              </summary>
              <div className="mt-4 pt-3 border-t border-border/60">
                <LearnProgressChecklist view={learner.view} showCode />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
