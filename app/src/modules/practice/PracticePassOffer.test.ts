import { describe, expect, it } from 'vitest';
import { shouldOfferPracticePass } from './PracticePassOffer';

const october = new Date(Date.UTC(2026, 9, 6, 12));
const july = new Date(Date.UTC(2026, 6, 1, 12));

describe('shouldOfferPracticePass', () => {
  it('offers May/June to a signed-out or free student in October', () => {
    expect(shouldOfferPracticePass({ now: october })).toBe(true);
    expect(shouldOfferPracticePass({ plan: 'FREE', role: 'STUDENT', now: october })).toBe(true);
  });

  it('stays quiet for teachers and anyone whose plan is still active', () => {
    expect(shouldOfferPracticePass({ role: 'TEACHER', plan: 'FREE', now: october })).toBe(false);
    expect(shouldOfferPracticePass({ plan: 'STUDENT', planExpiresAt: '2027-06-30T23:59:59.999Z', now: october })).toBe(
      false,
    );
    expect(shouldOfferPracticePass({ plan: 'STARTER', now: october })).toBe(false);
  });

  it('comes back after a pass has expired, and not while Oct/Nov is the series in progress', () => {
    expect(
      shouldOfferPracticePass({ plan: 'STUDENT', planExpiresAt: '2026-06-30T23:59:59.999Z', now: october }),
    ).toBe(true);
    expect(shouldOfferPracticePass({ plan: 'FREE', now: july })).toBe(false);
  });
});
