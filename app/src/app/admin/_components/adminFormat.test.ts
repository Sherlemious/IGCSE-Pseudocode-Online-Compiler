import { describe, expect, it } from 'vitest';
import { formatAdminDate, formatAdminDay, formatAdminNumber, formatRelative } from './adminFormat';

// Server (UTC, en-US) and browser (Cairo, any locale) must render identical
// text, or React throws hydration error #418 on the admin tables.
describe('admin formatting is the same on server and browser', () => {
  it('formats in Cairo time (UTC+3 in summer, UTC+2 in winter)', () => {
    expect(formatAdminDate('2026-09-26T19:28:36Z')).toBe('26 Sep 2026, 22:28');
    expect(formatAdminDate('2026-01-10T23:30:00Z')).toBe('11 Jan 2026, 01:30');
    expect(formatAdminDate('2026-09-26T22:30:00Z', true)).toBe('27 Sep');
    expect(formatAdminDay('2026-09-26T22:30:00Z')).toBe('27 Sep 2026');
  });

  it('handles missing and invalid dates', () => {
    expect(formatAdminDate(null)).toBe('—');
    expect(formatAdminDay('not a date')).toBe('—');
    expect(formatRelative(undefined)).toBe('—');
  });

  it('groups numbers with commas regardless of locale', () => {
    expect(formatAdminNumber(0)).toBe('0');
    expect(formatAdminNumber(1234)).toBe('1,234');
    expect(formatAdminNumber(-1234567.5)).toBe('-1,234,567.5');
  });

  it('formats relative times against a given now', () => {
    const now = Date.parse('2026-09-27T12:00:00Z');
    expect(formatRelative('2026-09-27T11:55:00Z', now)).toBe('5m ago');
    expect(formatRelative('2026-09-27T09:00:00Z', now)).toBe('3h ago');
    expect(formatRelative('2026-09-25T12:00:00Z', now)).toBe('2d ago');
    expect(formatRelative('2026-07-01T12:00:00Z', now)).toBe('1 Jul 2026');
  });
});
