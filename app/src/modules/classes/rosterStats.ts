export interface RosterMemberStats {
  solvedCount: number;
  attemptedCount: number;
  lastActiveAt: string | null;
  assignmentsSubmitted: number;
}

export type ProgressGroupCount = {
  userId: string;
  _count: { _all: number };
  _max?: { updatedAt: Date | null };
};

export type ExamLastGroup = {
  userId: string;
  _max: { startedAt: Date | null; completedAt: Date | null };
};

export type CompletedAssignmentRow = {
  userId: string;
  assignmentId: string | null;
};

function later(...dates: Array<Date | null | undefined>): Date | null {
  let best: Date | null = null;
  for (const d of dates) {
    if (!d) continue;
    if (!best || d > best) best = d;
  }
  return best;
}

/** Merge per-student Progress / ExamAttempt aggregates into roster columns. */
export function mergeRosterStats(
  memberIds: string[],
  data: {
    solved: ProgressGroupCount[];
    attempted: ProgressGroupCount[];
    examLast: ExamLastGroup[];
    completedAssignments: CompletedAssignmentRow[];
  },
): Map<string, RosterMemberStats> {
  const solvedByUser = new Map(data.solved.map((row) => [row.userId, row._count._all]));
  const attemptedByUser = new Map(
    data.attempted.map((row) => [row.userId, { count: row._count._all, updatedAt: row._max?.updatedAt ?? null }]),
  );
  const examByUser = new Map(data.examLast.map((row) => [row.userId, row._max]));

  const submittedByUser = new Map<string, Set<string>>();
  for (const row of data.completedAssignments) {
    if (!row.assignmentId) continue;
    let set = submittedByUser.get(row.userId);
    if (!set) {
      set = new Set();
      submittedByUser.set(row.userId, set);
    }
    set.add(row.assignmentId);
  }

  const out = new Map<string, RosterMemberStats>();
  for (const userId of memberIds) {
    const attempted = attemptedByUser.get(userId);
    const exam = examByUser.get(userId);
    const last = later(attempted?.updatedAt, exam?.startedAt, exam?.completedAt);
    out.set(userId, {
      solvedCount: solvedByUser.get(userId) ?? 0,
      attemptedCount: attempted?.count ?? 0,
      lastActiveAt: last ? last.toISOString() : null,
      assignmentsSubmitted: submittedByUser.get(userId)?.size ?? 0,
    });
  }
  return out;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function rosterHeadlineStats(
  members: Array<{ attemptedCount: number; lastActiveAt: string | null }>,
  now = Date.now(),
): { students_with_practice: number; students_active_7d: number } {
  return {
    students_with_practice: members.filter((m) => m.attemptedCount > 0).length,
    students_active_7d: members.filter(
      (m) => m.lastActiveAt && now - new Date(m.lastActiveAt).getTime() < WEEK_MS,
    ).length,
  };
}

export function formatLastActive(iso: string | null, now = Date.now()): string {
  if (!iso) return 'Never';
  const diff = now - new Date(iso).getTime();
  if (diff < 60_000) return 'Just now';
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
