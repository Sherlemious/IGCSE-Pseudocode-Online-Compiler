import { describe, expect, it } from 'vitest';
import { formatLastActive, mergeRosterStats, rosterHeadlineStats } from './rosterStats';

describe('mergeRosterStats', () => {
  it('returns zeros for members with no activity', () => {
    const stats = mergeRosterStats(['a', 'b'], {
      solved: [],
      attempted: [],
      examLast: [],
      completedAssignments: [],
    });
    expect(stats.get('a')).toEqual({
      solvedCount: 0,
      attemptedCount: 0,
      lastActiveAt: null,
      assignmentsSubmitted: 0,
    });
    expect(stats.get('b')?.solvedCount).toBe(0);
  });

  it('counts solved vs attempted and unique completed assignments', () => {
    const stats = mergeRosterStats(['stu'], {
      solved: [{ userId: 'stu', _count: { _all: 4 } }],
      attempted: [{ userId: 'stu', _count: { _all: 7 }, _max: { updatedAt: new Date('2026-03-01T00:00:00.000Z') } }],
      examLast: [],
      completedAssignments: [
        { userId: 'stu', assignmentId: 'as1' },
        { userId: 'stu', assignmentId: 'as1' },
        { userId: 'stu', assignmentId: 'as2' },
        { userId: 'stu', assignmentId: null },
      ],
    });
    expect(stats.get('stu')).toMatchObject({
      solvedCount: 4,
      attemptedCount: 7,
      assignmentsSubmitted: 2,
    });
  });

  it('uses the latest of practice and exam timestamps', () => {
    const stats = mergeRosterStats(['stu'], {
      solved: [],
      attempted: [{ userId: 'stu', _count: { _all: 1 }, _max: { updatedAt: new Date('2026-01-01T00:00:00.000Z') } }],
      examLast: [{
        userId: 'stu',
        _max: {
          startedAt: new Date('2026-02-01T00:00:00.000Z'),
          completedAt: new Date('2026-03-01T00:00:00.000Z'),
        },
      }],
      completedAssignments: [],
    });
    expect(stats.get('stu')?.lastActiveAt).toBe('2026-03-01T00:00:00.000Z');
  });
});

describe('rosterHeadlineStats', () => {
  it('counts practice and 7-day activity', () => {
    const now = Date.parse('2026-09-16T12:00:00.000Z');
    const headline = rosterHeadlineStats(
      [
        { attemptedCount: 3, lastActiveAt: '2026-09-15T12:00:00.000Z' },
        { attemptedCount: 0, lastActiveAt: null },
        { attemptedCount: 1, lastActiveAt: '2026-08-01T12:00:00.000Z' },
      ],
      now,
    );
    expect(headline).toEqual({ students_with_practice: 2, students_active_7d: 1 });
  });
});

describe('formatLastActive', () => {
  const now = Date.parse('2026-09-16T12:00:00.000Z');

  it('labels missing activity as Never', () => {
    expect(formatLastActive(null, now)).toBe('Never');
  });

  it('uses relative units under two weeks', () => {
    expect(formatLastActive('2026-09-16T11:59:30.000Z', now)).toBe('Just now');
    expect(formatLastActive('2026-09-16T11:40:00.000Z', now)).toBe('20m ago');
    expect(formatLastActive('2026-09-16T09:00:00.000Z', now)).toBe('3h ago');
    expect(formatLastActive('2026-09-14T12:00:00.000Z', now)).toBe('2d ago');
  });
});
