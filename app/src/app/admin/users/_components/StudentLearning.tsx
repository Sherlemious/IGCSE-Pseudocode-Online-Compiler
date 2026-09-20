'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { formatAdminDate, formatRelative } from '../../_components/adminUi';

type LessonState = 'not_started' | 'attempted' | 'completed';

export type StudentLearning = {
  learn: {
    playableCount: number;
    completedCount: number;
    attemptedCount: number;
    notStartedCount: number;
    lastActivityAt: string | null;
    lessons: Array<{
      lessonId: string;
      title: string;
      levelNumber: number;
      levelName: string;
      levelSlug: string;
      state: LessonState;
      attempts: number;
    }>;
  };
  practice: {
    solved: number;
    attempted: number;
    recent: Array<{
      questionId: string;
      title: string;
      status: string;
      bestScore: number;
      totalTests: number;
      attempts: number;
      updatedAt: string;
    }>;
  };
  exams: Array<{
    id: string;
    status: string;
    score: number | null;
    totalTests: number | null;
    topic: string | null;
    questionCount: number;
    startedAt: string;
    completedAt: string | null;
  }>;
};

export function useStudentLearning(userId: string | null, open: boolean) {
  const [data, setData] = useState<StudentLearning | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    let cancelled = false;
    setLoading(true);
    setData(null);
    void fetch(`/api/admin/users/${userId}/learning`)
      .then(async (res) => {
        if (!res.ok) throw new Error('failed');
        return res.json() as Promise<StudentLearning>;
      })
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, open]);

  return { data, loading };
}

export default function StudentLearning({
  data,
  loading,
}: {
  data: StudentLearning | null;
  loading: boolean;
}) {
  if (loading && !data) {
    return (
      <div className="space-y-3">
        <p className="mono-label text-dark-text">Learning</p>
        <div className="h-16 rounded-xl border border-border bg-background/40 animate-pulse" />
        <div className="h-28 rounded-xl border border-border bg-background/40 animate-pulse" />
      </div>
    );
  }
  if (!data) return null;

  const { learn, practice, exams } = data;
  const pct = learn.playableCount > 0
    ? Math.round((learn.completedCount / learn.playableCount) * 100)
    : 0;
  const next = learn.lessons.find((lesson) => lesson.state !== 'completed');
  const groups = groupLevels(learn.lessons);
  const hasPath = learn.completedCount + learn.attemptedCount > 0;

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <p className="mono-label text-dark-text">Paper 2 Path</p>
        <div className="rounded-xl border border-border bg-background/50 p-3 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono tabular-nums text-lg font-semibold text-light-text leading-none">
                {learn.completedCount}/{learn.playableCount}
              </p>
              <p className="text-[11px] text-dark-text mt-1">lessons done · {pct}%</p>
            </div>
            <div className="text-right text-[11px] text-dark-text font-mono tabular-nums">
              <p className="text-warning">{learn.attemptedCount} tried</p>
              {learn.lastActivityAt && (
                <p className="text-dark-text/70">{formatRelative(learn.lastActivityAt)}</p>
              )}
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border/50 overflow-hidden">
            <div className="h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
          </div>
          {next && (
            <p className="text-xs text-dark-text">
              Next: <span className="text-light-text">{next.title}</span>
              <span className="text-dark-text/60"> · L{next.levelNumber}</span>
            </p>
          )}
          {!hasPath && (
            <p className="text-xs text-dark-text/70">No signed-in path progress yet.</p>
          )}
        </div>

        {hasPath && (
          <div className="space-y-2">
            {groups.map((group) => {
              const done = group.lessons.filter((l) => l.state === 'completed').length;
              const current = group.lessons.some((l) => l.state !== 'completed')
                && (done > 0 || group.lessons.some((l) => l.state === 'attempted'));
              return (
                <details
                  key={group.slug}
                  open={current}
                  className="rounded-xl border border-border bg-background/40 px-3 py-2"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
                    <span className="text-xs font-medium text-light-text truncate">
                      L{group.number} · {group.name}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-dark-text shrink-0">
                      {done}/{group.lessons.length}
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1 border-t border-border/50 pt-2">
                    {group.lessons.map((lesson) => (
                      <li key={lesson.lessonId} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-light-text/90 truncate">{lesson.title}</span>
                        <span className="shrink-0 inline-flex items-center gap-1 font-mono text-[10px]">
                          {lesson.state === 'completed' ? (
                            <CheckCircle2 size={12} className="text-success" />
                          ) : lesson.state === 'attempted' ? (
                            <Clock size={12} className="text-warning" />
                          ) : (
                            <Circle size={12} className="text-dark-text/35" />
                          )}
                          {lesson.attempts > 0 && (
                            <span className="text-dark-text/50">{lesson.attempts}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <p className="mono-label text-dark-text">Practice</p>
        {practice.attempted === 0 ? (
          <p className="text-xs text-dark-text/70">No practice attempts yet.</p>
        ) : (
          <div className="rounded-xl border border-border bg-background/50 overflow-hidden">
            <p className="px-3 py-2 text-[11px] font-mono text-dark-text">
              {practice.solved} solved · {practice.attempted} attempted
            </p>
            <ul className="divide-y divide-border">
              {practice.recent.map((row) => (
                <li key={row.questionId} className="px-3 py-2 flex items-center gap-2">
                  <span className="min-w-0 flex-1 text-xs text-light-text truncate">{row.title}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${
                    row.status === 'SOLVED'
                      ? 'text-success border-success/40 bg-success/10'
                      : 'text-warning border-warning/40 bg-warning/10'
                  }`}>
                    {row.status === 'SOLVED' ? 'Solved' : 'Tried'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <p className="mono-label text-dark-text">Exams</p>
        {exams.length === 0 ? (
          <p className="text-xs text-dark-text/70">No exam attempts yet.</p>
        ) : (
          <ul className="rounded-xl border border-border bg-background/50 divide-y divide-border overflow-hidden">
            {exams.map((exam) => {
              const pctScore = exam.totalTests && exam.totalTests > 0 && exam.score != null
                ? Math.round((exam.score / exam.totalTests) * 100)
                : null;
              return (
                <li key={exam.id} className="px-3 py-2 flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-light-text truncate">
                      {exam.topic ?? 'Exam'} · {exam.questionCount}q
                    </p>
                    <p className="text-[10px] text-dark-text font-mono">
                      {formatAdminDate(exam.completedAt ?? exam.startedAt, true)}
                      {' · '}
                      {niceStatus(exam.status)}
                    </p>
                  </div>
                  {pctScore != null && (
                    <span className={`font-mono tabular-nums text-xs font-semibold px-1.5 py-0.5 rounded ${scoreClass(pctScore)}`}>
                      {pctScore}%
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function groupLevels(lessons: StudentLearning['learn']['lessons']) {
  const groups: Array<{ number: number; name: string; slug: string; lessons: typeof lessons }> = [];
  for (const lesson of lessons) {
    const last = groups[groups.length - 1];
    if (!last || last.number !== lesson.levelNumber) {
      groups.push({
        number: lesson.levelNumber,
        name: lesson.levelName,
        slug: lesson.levelSlug,
        lessons: [lesson],
      });
    } else {
      last.lessons.push(lesson);
    }
  }
  return groups;
}

function niceStatus(status: string) {
  if (status === 'IN_PROGRESS') return 'In progress';
  if (status === 'TIMED_OUT') return 'Timed out';
  if (status === 'COMPLETED') return 'Completed';
  return status;
}

function scoreClass(score: number) {
  if (score >= 70) return 'text-success bg-success/10';
  if (score >= 40) return 'text-warning bg-warning/10';
  return 'text-error bg-error/10';
}
