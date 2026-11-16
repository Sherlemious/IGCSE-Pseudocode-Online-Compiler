import { describe, expect, it } from 'vitest';
import { endOfDueDay, isValidTimeZone } from './dueDate';

const due = new Date('2026-11-20T00:00:00.000Z');

describe('endOfDueDay', () => {
  it('ends at UTC midnight when no zone was recorded', () => {
    expect(endOfDueDay(due).toISOString()).toBe('2026-11-20T23:59:59.999Z');
    expect(endOfDueDay(due, null).toISOString()).toBe('2026-11-20T23:59:59.999Z');
    expect(endOfDueDay(due, 'Not/AZone').toISOString()).toBe('2026-11-20T23:59:59.999Z');
  });

  it("ends at the teacher's own midnight", () => {
    expect(endOfDueDay(due, 'Asia/Shanghai').toISOString()).toBe('2026-11-20T15:59:59.999Z');
    expect(endOfDueDay(due, 'America/New_York').toISOString()).toBe('2026-11-21T04:59:59.999Z');
    expect(endOfDueDay(due, 'Asia/Kolkata').toISOString()).toBe('2026-11-20T18:29:59.999Z');
  });

  it('handles a day when the clocks change', () => {
    // London leaves BST on 25 Oct 2026; the day ends at 23:59:59.999 GMT.
    expect(endOfDueDay(new Date('2026-10-25T00:00:00.000Z'), 'Europe/London').toISOString()).toBe('2026-10-25T23:59:59.999Z');
    // New York enters EDT on 8 Mar 2026; the day ends at 23:59:59.999 EDT.
    expect(endOfDueDay(new Date('2026-03-08T00:00:00.000Z'), 'America/New_York').toISOString()).toBe('2026-03-09T03:59:59.999Z');
  });
});

describe('isValidTimeZone', () => {
  it('accepts IANA zones and rejects junk', () => {
    expect(isValidTimeZone('Asia/Shanghai')).toBe(true);
    expect(isValidTimeZone('UTC')).toBe(true);
    expect(isValidTimeZone('Mars/Olympus')).toBe(false);
    expect(isValidTimeZone(42)).toBe(false);
    expect(isValidTimeZone('')).toBe(false);
  });
});
