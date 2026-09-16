import { describe, it, expect } from 'vitest';
import {
  expiryForPurchase,
  isPassVisible,
  isTeacherPlan,
  seriesEnd,
  visiblePasses,
  PASS_CATALOG,
  MONTH_PASS,
  type PassDef,
} from './passes';

const month = MONTH_PASS;
const mayJune = PASS_CATALOG.find((p) => p.kind === 'may_june') as PassDef;
const octNov = PASS_CATALOG.find((p) => p.kind === 'oct_nov') as PassDef;

function utc(y: number, m: number, d: number, hh = 12): Date {
  return new Date(Date.UTC(y, m, d, hh));
}

describe('session pass visibility (UTC months)', () => {
  it('shows May/June from September through May; gone in June–August', () => {
    expect(isPassVisible('may_june', utc(2026, 8, 1))).toBe(true); // Sep
    expect(isPassVisible('may_june', utc(2026, 11, 15))).toBe(true); // Dec
    expect(isPassVisible('may_june', utc(2027, 0, 10))).toBe(true); // Jan
    expect(isPassVisible('may_june', utc(2027, 4, 31))).toBe(true); // May
    expect(isPassVisible('may_june', utc(2027, 5, 1))).toBe(false); // Jun
    expect(isPassVisible('may_june', utc(2027, 6, 1))).toBe(false); // Jul
    expect(isPassVisible('may_june', utc(2027, 7, 31))).toBe(false); // Aug
  });

  it('shows Oct/Nov from June through November only', () => {
    expect(isPassVisible('oct_nov', utc(2026, 5, 1))).toBe(true); // Jun
    expect(isPassVisible('oct_nov', utc(2026, 10, 30))).toBe(true); // Nov
    expect(isPassVisible('oct_nov', utc(2026, 11, 1))).toBe(false); // Dec
    expect(isPassVisible('oct_nov', utc(2027, 4, 31))).toBe(false); // May
  });

  it('does not list the leftover 1-month one-time SKU', () => {
    expect(isPassVisible('month', utc(2026, 6, 1))).toBe(false);
    expect(visiblePasses(utc(2026, 8, 15)).map((p) => p.kind)).toEqual(['may_june', 'oct_nov']);
    expect(visiblePasses(utc(2027, 4, 1)).map((p) => p.kind)).toEqual(['may_june']);
    expect(visiblePasses(utc(2027, 5, 1)).map((p) => p.kind)).toEqual(['oct_nov']);
    expect(visiblePasses(utc(2027, 6, 1)).map((p) => p.kind)).toEqual(['oct_nov']);
  });
});

describe('series end dates', () => {
  it('May/June bought in September expires 30 June the following year', () => {
    const end = seriesEnd('may_june', utc(2026, 8, 16));
    expect(end.toISOString()).toBe('2027-06-30T23:59:59.999Z');
  });

  it('May/June bought in April expires 30 June the same year', () => {
    const end = seriesEnd('may_june', utc(2027, 3, 2));
    expect(end.toISOString()).toBe('2027-06-30T23:59:59.999Z');
  });

  it('Oct/Nov bought in June expires 30 November the same year', () => {
    const end = seriesEnd('oct_nov', utc(2026, 5, 1));
    expect(end.toISOString()).toBe('2026-11-30T23:59:59.999Z');
  });
});

describe('expiryForPurchase', () => {
  it('prices session passes at 33% off the $2/mo window', () => {
    expect(month.listUsd).toBe(2);
    expect(mayJune.listUsd).toBe(13);
    expect(mayJune.wasUsd).toBe(20);
    expect(octNov.listUsd).toBe(8);
    expect(octNov.wasUsd).toBe(12);
  });

  it('stacks a 1-month pass onto remaining time', () => {
    const existing = utc(2026, 9, 1);
    const next = expiryForPurchase(month, { now: utc(2026, 8, 1), existingExpiresAt: existing });
    expect(next.toISOString()).toBe('2026-11-01T12:00:00.000Z');
  });

  it('does not shorten a later existing expiry when buying a soon-ending session', () => {
    const existing = utc(2027, 5, 30, 23);
    const next = expiryForPurchase(octNov, {
      now: utc(2026, 5, 15),
      existingExpiresAt: existing,
    });
    expect(next.getTime()).toBe(existing.getTime());
  });

  it('extends to the series end when that is later than remaining time', () => {
    const existing = utc(2026, 9, 1);
    const next = expiryForPurchase(mayJune, {
      now: utc(2026, 8, 16),
      existingExpiresAt: existing,
    });
    expect(next.toISOString()).toBe('2027-06-30T23:59:59.999Z');
  });
});

describe('isTeacherPlan', () => {
  it('treats teacher subscriptions as ineligible for student passes', () => {
    expect(isTeacherPlan('STARTER')).toBe(true);
    expect(isTeacherPlan('PRO')).toBe(true);
    expect(isTeacherPlan('SCHOOL')).toBe(true);
    expect(isTeacherPlan('STUDENT')).toBe(false);
    expect(isTeacherPlan('FREE')).toBe(false);
  });
});
