import { describe, expect, it } from 'vitest';
import { SITTINGS, SITTING_VALUES, isSitting } from './sittings';

describe('sittings', () => {
  it('accepts every listed sitting and nothing else', () => {
    for (const s of SITTINGS) expect(isSitting(s.value)).toBe(true);
    expect(SITTING_VALUES).toEqual(['oct_nov_2026', 'feb_mar_2027', 'may_jun_2027', 'later']);
    expect(isSitting('may_jun_2026')).toBe(false);
    expect(isSitting(undefined)).toBe(false);
    expect(isSitting(5)).toBe(false);
  });
});
