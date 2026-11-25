import { describe, expect, it } from 'vitest';
import { recordPlaygroundRun } from './returnPass';

const day1 = new Date(2026, 10, 20, 15, 0, 0);
const day2 = new Date(2026, 10, 21, 9, 0, 0);

describe('recordPlaygroundRun', () => {
  it('does not ask on the first day', () => {
    const first = recordPlaygroundRun(null, 1, day1);
    expect(first.show).toBe(false);
    expect(first.days).toEqual(['2026-11-20']);
  });

  it('asks on the first run of a later day', () => {
    const next = recordPlaygroundRun(JSON.stringify(['2026-11-20']), 2, day2);
    expect(next.show).toBe(true);
    expect(next.days).toEqual(['2026-11-20', '2026-11-21']);
  });

  it('asks only once on that later day', () => {
    const again = recordPlaygroundRun(JSON.stringify(['2026-11-20', '2026-11-21']), 2, day2);
    expect(again.show).toBe(false);
  });

  it('treats an empty history plus 3 sessions as already back', () => {
    const existing = recordPlaygroundRun(null, 3, day1);
    expect(existing.show).toBe(true);
    expect(existing.days).toEqual(['2026-11-20']);
  });

  it('ignores a stored value that is not a list of days', () => {
    expect(recordPlaygroundRun('nope', 1, day1).days).toEqual(['2026-11-20']);
  });
});
