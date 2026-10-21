/**
 * Mark book grid and CSV. Pure: roster, assignments and attempts in, no I/O.
 * Due dates are calendar days stored as UTC midnight (`yyyy-mm-dd` from the
 * date picker). A submission is late only when completedAt is after that UTC day.
 */

export type MarkStatus = 'not_started' | 'in_progress' | 'submitted' | 'late' | 'missing';

export interface MarkStudent {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface MarkAssignment {
  id: string;
  title: string;
  dueDate: Date | null;
}

export interface MarkAttempt {
  userId: string;
  assignmentId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';
  score: number | null;
  totalTests: number | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface MarkCell {
  status: MarkStatus;
  score: number | null;
  totalTests: number | null;
  /** 0–100. Null when the attempt has no usable score. */
  percent: number | null;
}

export interface MarkRow {
  userId: string;
  name: string | null;
  email: string | null;
  cells: MarkCell[];
  /** Mean of submitted and late percents. Null when none of those have a score. */
  averagePercent: number | null;
  submittedCount: number;
}

export interface MarkColumn {
  id: string;
  title: string;
  submittedCount: number;
  averagePercent: number | null;
}

export interface MarkBook {
  rows: MarkRow[];
  columns: MarkColumn[];
}

/** Cell shown to the browser. Locked cells carry no score, status, or percent. */
export interface MarkPreviewCell {
  locked: boolean;
  status: MarkStatus | null;
  score: number | null;
  totalTests: number | null;
  percent: number | null;
}

export interface MarkPreviewColumn {
  id: string;
  title: string;
  locked: boolean;
  submittedCount: number | null;
  averagePercent: number | null;
}

export interface MarkPreviewRow {
  userId: string;
  name: string | null;
  email: string | null;
  cells: MarkPreviewCell[];
  averagePercent: number | null;
  submittedCount: number | null;
  averageLocked: boolean;
}

export interface MarkPreview {
  columns: MarkPreviewColumn[];
  rows: MarkPreviewRow[];
}

export const MARK_STATUS_LABEL: Record<MarkStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  submitted: 'Submitted',
  late: 'Late',
  missing: 'Missing',
};

const SUBMITTED_STATUS = new Set<MarkStatus>(['submitted', 'late']);

function endOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function duePassed(due: Date | null, now: Date): boolean {
  if (!due) return false;
  return now.getTime() > endOfUtcDay(due).getTime();
}

function isLate(completedAt: Date | null, due: Date | null): boolean {
  if (!completedAt || !due) return false;
  return completedAt.getTime() > endOfUtcDay(due).getTime();
}

function percentOf(score: number | null, total: number | null): number | null {
  if (score == null || total == null || total <= 0) return null;
  if (!Number.isFinite(score) || !Number.isFinite(total)) return null;
  return (score / total) * 100;
}

function mean(values: Array<number | null>): number | null {
  let sum = 0;
  let count = 0;
  for (const value of values) {
    if (value == null || !Number.isFinite(value)) continue;
    sum += value;
    count += 1;
  }
  return count === 0 ? null : sum / count;
}

function pairKey(userId: string, assignmentId: string): string {
  return `${userId}\0${assignmentId}`;
}

function attemptStamp(attempt: MarkAttempt): number {
  return (attempt.completedAt ?? attempt.createdAt).getTime();
}

function preferCompleted(current: MarkAttempt | null, next: MarkAttempt): MarkAttempt {
  if (!current) return next;
  const delta = attemptStamp(next) - attemptStamp(current);
  if (delta !== 0) return delta > 0 ? next : current;
  return next.createdAt.getTime() >= current.createdAt.getTime() ? next : current;
}

interface AttemptSlot {
  completed: MarkAttempt | null;
  inProgress: boolean;
}

function cellFor(slot: AttemptSlot | undefined, due: Date | null, now: Date): MarkCell {
  const completed = slot?.completed ?? null;
  if (completed) {
    return {
      status: isLate(completed.completedAt, due) ? 'late' : 'submitted',
      score: completed.score,
      totalTests: completed.totalTests,
      percent: percentOf(completed.score, completed.totalTests),
    };
  }
  if (duePassed(due, now)) {
    return { status: 'missing', score: null, totalTests: null, percent: null };
  }
  if (slot?.inProgress) {
    return { status: 'in_progress', score: null, totalTests: null, percent: null };
  }
  return { status: 'not_started', score: null, totalTests: null, percent: null };
}

export function buildMarkBook(input: {
  students: MarkStudent[];
  assignments: MarkAssignment[];
  attempts: MarkAttempt[];
  now?: Date;
}): MarkBook {
  const now = input.now ?? new Date();
  const byPair = new Map<string, AttemptSlot>();

  for (const attempt of input.attempts) {
    const key = pairKey(attempt.userId, attempt.assignmentId);
    let slot = byPair.get(key);
    if (!slot) {
      slot = { completed: null, inProgress: false };
      byPair.set(key, slot);
    }
    if (attempt.status === 'IN_PROGRESS') slot.inProgress = true;
    else if (attempt.status === 'COMPLETED' || attempt.status === 'TIMED_OUT') {
      slot.completed = preferCompleted(slot.completed, attempt);
    }
  }

  const rows: MarkRow[] = input.students.map((student) => {
    const cells = input.assignments.map((assignment) =>
      cellFor(byPair.get(pairKey(student.userId, assignment.id)), assignment.dueDate, now),
    );
    const submitted = cells.filter((cell) => SUBMITTED_STATUS.has(cell.status));
    return {
      userId: student.userId,
      name: student.name,
      email: student.email,
      cells,
      submittedCount: submitted.length,
      averagePercent: mean(submitted.map((cell) => cell.percent)),
    };
  });

  const columns: MarkColumn[] = input.assignments.map((assignment, index) => {
    const submitted = rows
      .map((row) => row.cells[index])
      .filter((cell): cell is MarkCell => cell != null && SUBMITTED_STATUS.has(cell.status));
    return {
      id: assignment.id,
      title: assignment.title,
      submittedCount: submitted.length,
      averagePercent: mean(submitted.map((cell) => cell.percent)),
    };
  });

  return { rows, columns };
}

/**
 * Free teachers see the first assignment only. Later columns, their totals,
 * and the row average are omitted so the preview payload cannot leak them.
 */
export function previewMarkBook(book: MarkBook, exportAllowed: boolean): MarkPreview {
  const hideFrom = exportAllowed ? Number.POSITIVE_INFINITY : 1;
  const averageLocked = !exportAllowed && book.columns.length > 1;

  return {
    columns: book.columns.map((column, index) => {
      const locked = index >= hideFrom;
      return {
        id: column.id,
        title: column.title,
        locked,
        submittedCount: locked ? null : column.submittedCount,
        averagePercent: locked ? null : column.averagePercent,
      };
    }),
    rows: book.rows.map((row) => ({
      userId: row.userId,
      name: row.name,
      email: row.email,
      averageLocked,
      averagePercent: averageLocked ? null : row.averagePercent,
      submittedCount: averageLocked ? null : row.submittedCount,
      cells: row.cells.map((cell, index) =>
        index >= hideFrom
          ? { locked: true, status: null, score: null, totalTests: null, percent: null }
          : {
              locked: false,
              status: cell.status,
              score: cell.score,
              totalTests: cell.totalTests,
              percent: cell.percent,
            },
      ),
    })),
  };
}

export function formatMarkPercent(percent: number | null): string {
  if (percent == null || !Number.isFinite(percent)) return '';
  return `${Math.round(percent)}%`;
}

/** A leading quote stops a spreadsheet from treating the cell as a formula (OWASP's list). */
const FORMULA_START = /^[=+\-@\t\r]/;

export function csvField(value: string): string {
  const safe = FORMULA_START.test(value) ? `'${value}` : value;
  // `;` and tab too: semicolon-locale Excel splits on them, starting a new unprefixed cell.
  if (/[",;\t\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function csvLine(fields: string[]): string {
  return fields.map(csvField).join(',');
}

export function serializeMarkBookCsv(book: MarkBook): string {
  const header = ['Student name', 'Email'];
  for (const column of book.columns) {
    header.push(`${column.title} ${'%'}`, `${column.title} status`);
  }
  header.push('Submitted', 'Average of submitted');

  const lines = [csvLine(header)];
  for (const row of book.rows) {
    const fields = [row.name ?? '', row.email ?? ''];
    for (const cell of row.cells) {
      fields.push(formatMarkPercent(cell.percent), MARK_STATUS_LABEL[cell.status]);
    }
    fields.push(String(row.submittedCount), formatMarkPercent(row.averagePercent));
    lines.push(csvLine(fields));
  }
  return `\uFEFF${lines.join('\r\n')}`;
}

export function marksCsvFilename(className: string, now = new Date()): string {
  const cleaned = className
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/^-+|-+$/g, '');
  const base = cleaned || 'class';
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${base}-marks-${y}-${m}-${d}.csv`;
}
