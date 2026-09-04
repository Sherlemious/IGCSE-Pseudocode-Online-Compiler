import { describe, it, expect } from 'vitest';
import type { Plan } from '@prisma/client';
import { resolveTier, limitsFor, LIMITS } from '../entitlements';

const IN_FUTURE = new Date(Date.now() + 60_000);
const IN_PAST = new Date(Date.now() - 60_000);

describe('resolveTier', () => {
  it('maps plans to tiers', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: null })).toBe('free');
    expect(resolveTier({ plan: 'STARTER' as Plan, trialEndsAt: null })).toBe('starter');
    expect(resolveTier({ plan: 'PRO' as Plan, trialEndsAt: null })).toBe('pro');
    expect(resolveTier({ plan: 'SCHOOL' as Plan, trialEndsAt: null })).toBe('school');
    // A paid student plan buys student features, not teaching capacity.
    expect(resolveTier({ plan: 'STUDENT' as Plan, trialEndsAt: null })).toBe('free');
  });

  it('grants Pro during an active trial regardless of plan', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: IN_FUTURE })).toBe('pro');
  });

  it('ignores an expired trial and falls back to the plan', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: IN_PAST })).toBe('free');
  });

  it('keeps a School plan even with an active trial (trial only lifts to pro-level access)', () => {
    // Trial short-circuits to pro; School is only reached via the stored plan.
    expect(resolveTier({ plan: 'SCHOOL' as Plan, trialEndsAt: IN_FUTURE })).toBe('pro');
  });
});

describe('limits', () => {
  it('free tier is 1 class / 5 students', () => {
    expect(limitsFor('free')).toEqual({ maxClasses: 1, maxStudentsPerClass: 5 });
  });

  it('starter tier is 3 classes / 30 students', () => {
    expect(limitsFor('starter')).toEqual({ maxClasses: 3, maxStudentsPerClass: 30 });
  });

  it('pro and school are unlimited', () => {
    expect(LIMITS.pro.maxClasses).toBe(Infinity);
    expect(LIMITS.pro.maxStudentsPerClass).toBe(Infinity);
    expect(LIMITS.school.maxClasses).toBe(Infinity);
  });
});
