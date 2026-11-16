import { describe, expect, it } from 'vitest';
import { attemptDeadline, isPastDeadline } from './deadline';

const startedAt = new Date('2026-11-16T09:00:00Z');
const due = new Date('2026-11-20T00:00:00Z');
const endOfDue = new Date('2026-11-20T23:59:59.999Z').getTime();

describe('attemptDeadline', () => {
  it('timed: start plus the limit, whatever the due date', () => {
    const attempt = { startedAt, timeLimitMin: 30 };
    expect(attemptDeadline(attempt, null)).toBe(startedAt.getTime() + 30 * 60_000);
    expect(attemptDeadline(attempt, due)).toBe(startedAt.getTime() + 30 * 60_000);
  });

  it('untimed with a due date: the end of that day, in UTC when no zone was recorded', () => {
    expect(attemptDeadline({ startedAt, timeLimitMin: null }, due)).toBe(endOfDue);
    expect(attemptDeadline({ startedAt, timeLimitMin: null }, due, null)).toBe(endOfDue);
  });

  it("untimed with a due date and the teacher's zone: their own midnight", () => {
    expect(attemptDeadline({ startedAt, timeLimitMin: null }, due, 'Asia/Shanghai'))
      .toBe(new Date('2026-11-20T15:59:59.999Z').getTime());
    expect(isPastDeadline({ startedAt, timeLimitMin: null }, due, new Date('2026-11-20T16:00:00Z'), 'Asia/Shanghai')).toBe(true);
    expect(isPastDeadline({ startedAt, timeLimitMin: null }, due, new Date('2026-11-20T16:00:00Z'))).toBe(false);
  });

  it('untimed without a due date: none', () => {
    expect(attemptDeadline({ startedAt, timeLimitMin: null }, null)).toBeNull();
    expect(attemptDeadline({ startedAt, timeLimitMin: null }, undefined)).toBeNull();
  });
});

describe('isPastDeadline', () => {
  it('timed: closes at the exact limit', () => {
    const attempt = { startedAt, timeLimitMin: 30 };
    expect(isPastDeadline(attempt, null, new Date(startedAt.getTime() + 30 * 60_000 - 1))).toBe(false);
    expect(isPastDeadline(attempt, null, new Date(startedAt.getTime() + 30 * 60_000))).toBe(true);
  });

  it('untimed with a due date: open all of the due day, days after starting', () => {
    const attempt = { startedAt, timeLimitMin: null };
    expect(isPastDeadline(attempt, due, new Date('2026-11-20T23:00:00Z'))).toBe(false);
    expect(isPastDeadline(attempt, due, new Date(endOfDue))).toBe(true);
  });

  it('untimed without a due date: never closes on its own', () => {
    expect(isPastDeadline({ startedAt, timeLimitMin: null }, null, new Date('2030-01-01T00:00:00Z'))).toBe(false);
  });
});
