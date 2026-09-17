import { prisma } from '@/shared/db';
import { COURSE_ID } from '@/modules/learn/types';
import LearnProgressChecklist from '@/modules/learn/LearnProgressChecklist';
import { buildLearnProgressView } from '@/modules/learn/progressView';
import type { LearnProgressRecord } from '@/modules/learn/progress';

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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-light-text">Paper 2 Path</h1>
        <p className="text-sm text-dark-text mt-1">
          {learners.length} signed-in learner{learners.length !== 1 ? 's' : ''} with saved progress.
          Unsigned traffic still only lives in the browser.
        </p>
      </div>

      {learners.length === 0 ? (
        <p className="text-sm text-dark-text">No saved path progress yet.</p>
      ) : (
        <div className="space-y-3">
          {learners.map((learner) => (
            <details
              key={learner.userId}
              className="rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <summary className="cursor-pointer list-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm font-medium text-light-text truncate">
                  {learner.name || learner.email || 'Student'}
                  {learner.name && learner.email && (
                    <span className="ml-2 text-xs font-normal text-dark-text">{learner.email}</span>
                  )}
                </span>
                <span className="text-[11px] font-mono text-dark-text tabular-nums">
                  {learner.view.completedCount}/{learner.view.playableCount} done
                  {learner.view.attemptedCount > 0 ? ` · ${learner.view.attemptedCount} tried` : ''}
                  {learner.view.lastActivityAt
                    ? ` · ${new Date(learner.view.lastActivityAt).toLocaleString()}`
                    : ''}
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
