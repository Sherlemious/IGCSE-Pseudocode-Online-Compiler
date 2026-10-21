import { describe, expect, it } from 'vitest';
import {
  buildMarkBook,
  marksCsvFilename,
  previewMarkBook,
  serializeMarkBookCsv,
  type MarkAttempt,
} from './markBook';

const NOW = new Date('2026-10-21T12:00:00.000Z');
const DUE_PAST = new Date('2026-10-01T00:00:00.000Z');
const DUE_FUTURE = new Date('2026-11-01T00:00:00.000Z');

function attempt(partial: Partial<MarkAttempt> & Pick<MarkAttempt, 'userId' | 'assignmentId' | 'status'>): MarkAttempt {
  return {
    score: null,
    totalTests: null,
    createdAt: new Date('2026-10-01T12:00:00.000Z'),
    completedAt: null,
    ...partial,
  };
}

describe('buildMarkBook', () => {
  it('uses the latest completed or timed-out attempt and ignores a newer in-progress run', () => {
    const book = buildMarkBook({
      students: [{ userId: 's', name: 'Ada', email: 'ada@school.com' }],
      assignments: [{ id: 'q', title: 'Quiz', dueDate: null }],
      attempts: [
        attempt({
          userId: 's',
          assignmentId: 'q',
          status: 'COMPLETED',
          score: 1,
          totalTests: 10,
          createdAt: new Date('2026-10-01T08:00:00.000Z'),
          completedAt: new Date('2026-10-01T09:00:00.000Z'),
        }),
        attempt({
          userId: 's',
          assignmentId: 'q',
          status: 'TIMED_OUT',
          score: 9,
          totalTests: 10,
          createdAt: new Date('2026-10-02T08:00:00.000Z'),
          completedAt: new Date('2026-10-02T09:00:00.000Z'),
        }),
        attempt({
          userId: 's',
          assignmentId: 'q',
          status: 'IN_PROGRESS',
          createdAt: new Date('2026-10-03T08:00:00.000Z'),
        }),
      ],
      now: NOW,
    });
    expect(book.rows[0]?.cells[0]).toMatchObject({
      status: 'submitted',
      score: 9,
      totalTests: 10,
      percent: 90,
    });
    expect(book.rows[0]).toMatchObject({ submittedCount: 1, averagePercent: 90 });
    expect(book.columns[0]).toMatchObject({ submittedCount: 1, averagePercent: 90 });
  });

  it('marks a submission late only after the due date’s UTC day', () => {
    const due = new Date('2026-10-01T15:30:00.000Z');
    const book = buildMarkBook({
      students: [
        { userId: 'on-time', name: 'On Time', email: null },
        { userId: 'edge', name: 'Edge', email: null },
        { userId: 'late', name: 'Late', email: null },
      ],
      assignments: [{ id: 'q', title: 'Quiz', dueDate: due }],
      attempts: [
        attempt({
          userId: 'on-time',
          assignmentId: 'q',
          status: 'COMPLETED',
          score: 10,
          totalTests: 10,
          completedAt: new Date('2026-10-01T16:00:00.000Z'),
        }),
        attempt({
          userId: 'edge',
          assignmentId: 'q',
          status: 'COMPLETED',
          score: 8,
          totalTests: 10,
          completedAt: new Date('2026-10-01T23:59:59.999Z'),
        }),
        attempt({
          userId: 'late',
          assignmentId: 'q',
          status: 'COMPLETED',
          score: 4,
          totalTests: 10,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
      ],
      now: NOW,
    });
    expect(book.rows.map((row) => row.cells[0]?.status)).toEqual(['submitted', 'submitted', 'late']);
    expect(book.columns[0]).toMatchObject({ submittedCount: 3 });
    expect(book.columns[0]?.averagePercent).toBeCloseTo((100 + 80 + 40) / 3);
  });

  it('treats a passed due date with no submission as missing, including an in-progress attempt', () => {
    const book = buildMarkBook({
      students: [
        { userId: 'gone', name: 'Gone', email: null },
        { userId: 'open', name: 'Open', email: null },
        { userId: 'wait', name: 'Wait', email: null },
        { userId: 'blank', name: 'Blank', email: null },
      ],
      assignments: [{ id: 'q', title: 'Quiz', dueDate: DUE_PAST }],
      attempts: [
        attempt({ userId: 'open', assignmentId: 'q', status: 'IN_PROGRESS' }),
        attempt({ userId: 'wait', assignmentId: 'q', status: 'IN_PROGRESS' }),
      ],
      now: NOW,
    });
    expect(book.rows.map((row) => row.cells[0]?.status)).toEqual(['missing', 'missing', 'missing', 'missing']);
    expect(book.rows.every((row) => row.averagePercent == null && row.submittedCount === 0)).toBe(true);
    expect(book.columns[0]).toMatchObject({ submittedCount: 0, averagePercent: null });
  });

  it('does not call a due day missing until that UTC day has ended', () => {
    const book = buildMarkBook({
      students: [{ userId: 's', name: 'Ada', email: null }],
      assignments: [{ id: 'q', title: 'Quiz', dueDate: new Date('2026-10-21T00:00:00.000Z') }],
      attempts: [],
      now: NOW,
    });
    expect(book.rows[0]?.cells[0]?.status).toBe('not_started');
  });

  it('keeps in-progress and not-started while the due day has not ended', () => {
    const book = buildMarkBook({
      students: [
        { userId: 'working', name: 'Working', email: null },
        { userId: 'yet', name: 'Yet', email: null },
        { userId: 'nodue', name: 'No due', email: null },
      ],
      assignments: [
        { id: 'future', title: 'Future', dueDate: DUE_FUTURE },
        { id: 'open', title: 'Open', dueDate: null },
      ],
      attempts: [
        attempt({ userId: 'working', assignmentId: 'future', status: 'IN_PROGRESS' }),
        attempt({ userId: 'nodue', assignmentId: 'open', status: 'IN_PROGRESS' }),
      ],
      now: NOW,
    });
    expect(book.rows[0]?.cells.map((cell) => cell.status)).toEqual(['in_progress', 'not_started']);
    expect(book.rows[1]?.cells.map((cell) => cell.status)).toEqual(['not_started', 'not_started']);
    expect(book.rows[2]?.cells.map((cell) => cell.status)).toEqual(['not_started', 'in_progress']);
  });

  it('averages submitted percents per row and column, counting a zero and skipping a missing score', () => {
    const book = buildMarkBook({
      students: [
        { userId: 'a', name: 'A', email: 'a@school.com' },
        { userId: 'b', name: 'B', email: 'b@school.com' },
      ],
      assignments: [
        { id: 'q1', title: 'One', dueDate: null },
        { id: 'q2', title: 'Two', dueDate: null },
      ],
      attempts: [
        attempt({
          userId: 'a',
          assignmentId: 'q1',
          status: 'COMPLETED',
          score: 0,
          totalTests: 10,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
        attempt({
          userId: 'a',
          assignmentId: 'q2',
          status: 'COMPLETED',
          score: 10,
          totalTests: 10,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
        attempt({
          userId: 'b',
          assignmentId: 'q1',
          status: 'COMPLETED',
          score: null,
          totalTests: 0,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
        attempt({
          userId: 'stranger',
          assignmentId: 'q1',
          status: 'COMPLETED',
          score: 10,
          totalTests: 10,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
      ],
      now: NOW,
    });
    expect(book.rows[0]).toMatchObject({ submittedCount: 2, averagePercent: 50 });
    expect(book.rows[1]).toMatchObject({ submittedCount: 1, averagePercent: null });
    expect(book.columns[0]).toMatchObject({ submittedCount: 2, averagePercent: 0 });
    expect(book.columns[1]).toMatchObject({ submittedCount: 1, averagePercent: 100 });
    expect(book.rows).toHaveLength(2);
  });

  it('returns no rows for an empty class and still lists assignments', () => {
    const book = buildMarkBook({
      students: [],
      assignments: [{ id: 'q', title: 'Quiz', dueDate: DUE_PAST }],
      attempts: [
        attempt({
          userId: 'former',
          assignmentId: 'q',
          status: 'COMPLETED',
          score: 10,
          totalTests: 10,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
      ],
      now: NOW,
    });
    expect(book.rows).toEqual([]);
    expect(book.columns).toEqual([{ id: 'q', title: 'Quiz', submittedCount: 0, averagePercent: null }]);
  });

  it('returns student rows with no columns when nothing is assigned', () => {
    const book = buildMarkBook({
      students: [{ userId: 's', name: 'Ada', email: 'ada@school.com' }],
      assignments: [],
      attempts: [],
      now: NOW,
    });
    expect(book.columns).toEqual([]);
    expect(book.rows).toEqual([
      {
        userId: 's',
        name: 'Ada',
        email: 'ada@school.com',
        cells: [],
        averagePercent: null,
        submittedCount: 0,
      },
    ]);
  });

  it('hides every column after the first, and the row average, when export is locked', () => {
    const book = buildMarkBook({
      students: [{ userId: 's', name: 'Ada', email: null }],
      assignments: [
        { id: 'new', title: 'Newest', dueDate: null },
        { id: 'old', title: 'Older', dueDate: null },
      ],
      attempts: [
        attempt({
          userId: 's',
          assignmentId: 'new',
          status: 'COMPLETED',
          score: 5,
          totalTests: 10,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
        attempt({
          userId: 's',
          assignmentId: 'old',
          status: 'COMPLETED',
          score: 9,
          totalTests: 10,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
      ],
      now: NOW,
    });
    const preview = previewMarkBook(book, false);
    expect(preview.columns[0]).toMatchObject({ id: 'new', locked: false, submittedCount: 1 });
    expect(preview.columns[1]).toMatchObject({
      id: 'old',
      locked: true,
      submittedCount: null,
      averagePercent: null,
    });
    expect(preview.rows[0]?.cells[1]).toEqual({
      locked: true,
      status: null,
      score: null,
      totalTests: null,
      percent: null,
    });
    expect(preview.rows[0]).toMatchObject({ averageLocked: true, averagePercent: null, submittedCount: null });
    expect(JSON.stringify(preview.rows[0]?.cells[1])).not.toContain('9');

    const open = previewMarkBook(book, true);
    expect(open.columns.every((column) => !column.locked)).toBe(true);
    expect(open.rows[0]?.averageLocked).toBe(false);
    expect(open.rows[0]?.cells[1]?.score).toBe(9);
  });
});

describe('serializeMarkBookCsv', () => {
  it('writes percent, status, and average with a UTF-8 BOM', () => {
    const book = buildMarkBook({
      students: [{ userId: 's', name: 'Ada', email: 'ada@school.com' }],
      assignments: [{ id: 'q', title: 'Quiz', dueDate: null }],
      attempts: [
        attempt({
          userId: 's',
          assignmentId: 'q',
          status: 'COMPLETED',
          score: 17,
          totalTests: 20,
          completedAt: new Date('2026-10-02T00:00:00.000Z'),
        }),
      ],
      now: NOW,
    });
    const csv = serializeMarkBookCsv(book);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    const percent = '%';
    expect(csv.slice(1)).toBe(
      `Student name,Email,Quiz ${percent},Quiz status,Average\r\nAda,ada@school.com,85${percent},Submitted,85${percent}`,
    );
  });

  it('escapes commas, quotes, and newlines, and prefixes formula characters', () => {
    const book = buildMarkBook({
      students: [
        { userId: 'a', name: 'Smith, Alice', email: 'a"b@school.com' },
        { userId: 'b', name: 'Bob\nJones', email: '+44123' },
        { userId: 'c', name: '=1+1', email: '@cmd' },
      ],
      assignments: [{ id: 'q', title: '-drop', dueDate: null }],
      attempts: [],
      now: NOW,
    });
    const csv = serializeMarkBookCsv(book).slice(1);
    const percent = '%';
    expect(csv.split('\r\n')[0]).toBe(`Student name,Email,'-drop ${percent},'-drop status,Average`);
    expect(csv).toContain('"Smith, Alice","a""b@school.com",,Not started,');
    expect(csv).toContain('"Bob\nJones",\'+44123,,Not started,');
    expect(csv).toContain("'=1+1,'@cmd,,Not started,");
  });

  it('sanitizes the download filename', () => {
    const day = new Date('2026-10-21T23:30:00.000Z');
    expect(marksCsvFilename('Year 10 / Set A', day)).toBe('Year-10-Set-A-marks-2026-10-21.csv');
    expect(marksCsvFilename('=cmd', day)).toBe('cmd-marks-2026-10-21.csv');
    expect(marksCsvFilename('../../etc', day)).toBe('etc-marks-2026-10-21.csv');
    expect(marksCsvFilename('   ', day)).toBe('class-marks-2026-10-21.csv');
  });
});
