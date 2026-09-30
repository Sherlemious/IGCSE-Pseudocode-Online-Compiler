import { prisma } from '@/shared/db';
import { COURSE_CHOICES } from '@/modules/learn/courseChoice';
import { courseById } from '@/modules/learn/curriculum';
import LearnProgressChecklist from '@/modules/learn/LearnProgressChecklist';
import { buildLearnProgressView, type LearnProgressView } from '@/modules/learn/progressView';
import type { LearnProgressRecord } from '@/modules/learn/progress';
import type { LearnCourse } from '@/modules/learn/types';
import { AdminPageHeader } from '../_components/adminUi';
import { formatAdminDate } from '../_components/adminFormat';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Paths' };

type ProgressRow = {
  userId: string;
  courseId: string;
  lessonId: string;
  status: LearnProgressRecord['status'];
  attempts: number;
  lastOk: boolean;
  lastReason: string | null;
  lastCode: string | null;
  completedAt: Date | null;
  updatedAt: Date;
  user: { name: string | null; email: string | null };
};

type Learner = {
  userId: string;
  name: string | null;
  email: string | null;
  view: LearnProgressView;
};

function toRecord(row: ProgressRow): LearnProgressRecord {
  return {
    lessonId: row.lessonId,
    status: row.status,
    attempts: row.attempts,
    lastOk: row.lastOk,
    lastReason: row.lastReason,
    lastCode: row.lastCode,
    completedAt: row.completedAt,
    updatedAt: row.updatedAt,
  };
}

function learnersForCourse(rows: ProgressRow[], course: LearnCourse): Learner[] {
  const byUser = new Map<
    string,
    { name: string | null; email: string | null; rows: LearnProgressRecord[] }
  >();
  for (const row of rows) {
    if (row.courseId !== course.id) continue;
    let bucket = byUser.get(row.userId);
    if (!bucket) {
      bucket = { name: row.user.name, email: row.user.email, rows: [] };
      byUser.set(row.userId, bucket);
    }
    bucket.rows.push(toRecord(row));
  }

  return [...byUser.entries()]
    .map(([userId, info]) => ({
      userId,
      name: info.name,
      email: info.email,
      view: buildLearnProgressView(info.rows, course),
    }))
    .sort((a, b) => (b.view.lastActivityAt ?? '').localeCompare(a.view.lastActivityAt ?? ''));
}

export default async function AdminLearnPage() {
  const rows = await prisma.learnProgress.findMany({
    where: { courseId: { in: COURSE_CHOICES.map((choice) => choice.id) } },
    select: {
      userId: true,
      courseId: true,
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

  const uniqueLearners = new Set(rows.map((row) => row.userId)).size;
  const sections = COURSE_CHOICES.flatMap((choice) => {
    const course = courseById(choice.id);
    if (!course) return [];
    return [{ choice, learners: learnersForCourse(rows, course) }];
  });

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminPageHeader
        title="Paths"
        description={`${uniqueLearners} signed-in learner${uniqueLearners !== 1 ? 's' : ''} with saved progress. Unsigned traffic still only lives in the browser.`}
      />

      {sections.map(({ choice, learners }) => (
        <section key={choice.id} className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-light-text">
              {choice.exam} · {choice.paper}
            </h2>
            <p className="text-xs text-dark-text mt-0.5">
              {learners.length} learner{learners.length !== 1 ? 's' : ''} with saved progress
            </p>
          </div>
          {learners.length === 0 ? (
            <p className="text-sm text-dark-text">No saved path progress yet.</p>
          ) : (
            <LearnerList learners={learners} />
          )}
        </section>
      ))}
    </div>
  );
}

function LearnerList({ learners }: { learners: Learner[] }) {
  return (
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
                  ? ` · ${formatAdminDate(learner.view.lastActivityAt, true)}`
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
  );
}
