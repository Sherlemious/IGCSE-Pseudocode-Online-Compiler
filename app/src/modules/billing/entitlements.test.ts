import { describe, it, expect } from 'vitest';
import type { Plan } from '@prisma/client';
import { resolveTier, tierForUser, limitsFor, LIMITS, hasPremiumAccess } from './entitlements';

const IN_FUTURE = new Date(Date.now() + 60_000);
const IN_PAST = new Date(Date.now() - 60_000);

const plan = (p: string, trialEndsAt: Date | null = null) => ({ plan: p as Plan, trialEndsAt });

describe('resolveTier', () => {
  it('maps plans to tiers', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: null })).toBe('free');
    expect(resolveTier({ plan: 'STARTER' as Plan, trialEndsAt: null })).toBe('starter');
    // The Plan enum is coarse: PRO resolves to the Classroom capacity band.
    expect(resolveTier({ plan: 'PRO' as Plan, trialEndsAt: null })).toBe('classroom');
    expect(resolveTier({ plan: 'SCHOOL' as Plan, trialEndsAt: null })).toBe('school');
    // A paid student plan buys student features, not teaching capacity.
    expect(resolveTier({ plan: 'STUDENT' as Plan, trialEndsAt: null })).toBe('free');
  });

  it('grants Classroom-level access during an active trial regardless of plan', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: IN_FUTURE })).toBe('classroom');
  });

  it('ignores an expired trial and falls back to the plan', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: IN_PAST })).toBe('free');
  });

  it('lifts a School plan to Classroom during an active trial (trial short-circuits)', () => {
    expect(resolveTier({ plan: 'SCHOOL' as Plan, trialEndsAt: IN_FUTURE })).toBe('classroom');
  });
});

describe('tierForUser (precise, slug-driven)', () => {
  const base = { trialEndsAt: null, planExpiresAt: null };
  it('prefers the exact planTier slug over the coarse plan', () => {
    expect(tierForUser({ ...base, plan: 'PRO' as Plan, planTier: 'department' })).toBe('department');
    expect(tierForUser({ ...base, plan: 'SCHOOL' as Plan, planTier: 'school' })).toBe('school');
  });
  it('maps legacy slugs (pro→classroom, advanced→campus)', () => {
    expect(tierForUser({ ...base, plan: 'PRO' as Plan, planTier: 'pro' })).toBe('classroom');
    expect(tierForUser({ ...base, plan: 'SCHOOL' as Plan, planTier: 'advanced' })).toBe('campus');
  });
  it('treats an expired one-time pass as free', () => {
    expect(tierForUser({ trialEndsAt: null, plan: 'STUDENT' as Plan, planTier: 'student', planExpiresAt: IN_PAST })).toBe('free');
  });
  it('falls back to the plan when no slug is recorded', () => {
    expect(tierForUser({ ...base, plan: 'STARTER' as Plan, planTier: null })).toBe('starter');
  });
});

describe('limits', () => {
  it('free tier is 1 class / 5 students', () => {
    expect(limitsFor('free')).toEqual({ maxClasses: 1, maxStudentsTotal: 5, maxStudentsPerClass: 5 });
  });

  it('starter tier is 3 classes / 30 students', () => {
    expect(limitsFor('starter')).toEqual({ maxClasses: 3, maxStudentsTotal: 30, maxStudentsPerClass: 30 });
  });

  it('bands scale by total students', () => {
    expect(LIMITS.classroom.maxStudentsTotal).toBe(90);
    expect(LIMITS.department.maxStudentsTotal).toBe(250);
    expect(LIMITS.school.maxStudentsTotal).toBe(750);
    expect(LIMITS.campus.maxStudentsTotal).toBe(Infinity);
  });
});

describe('hasPremiumAccess', () => {
  it('denies a free student with no classes', () => {
    expect(hasPremiumAccess({ ...plan('FREE'), classOwners: [] })).toBe(false);
  });

  it('grants any paid student plan on its own', () => {
    for (const p of ['STUDENT', 'STARTER', 'PRO', 'SCHOOL']) {
      expect(hasPremiumAccess({ ...plan(p), classOwners: [] })).toBe(true);
    }
  });

  it('grants a free student during their own active trial', () => {
    expect(hasPremiumAccess({ ...plan('FREE', IN_FUTURE), classOwners: [] })).toBe(true);
    expect(hasPremiumAccess({ ...plan('FREE', IN_PAST), classOwners: [] })).toBe(false);
  });

  it('grants a free student whose teacher is on a paid teacher tier', () => {
    for (const p of ['STARTER', 'PRO', 'SCHOOL']) {
      expect(hasPremiumAccess({ ...plan('FREE'), classOwners: [plan(p)] })).toBe(true);
    }
  });

  it('grants a free student whose teacher is on an active trial', () => {
    expect(hasPremiumAccess({ ...plan('FREE'), classOwners: [plan('FREE', IN_FUTURE)] })).toBe(true);
  });

  it('does NOT inherit from a free or plain-Student teacher', () => {
    expect(hasPremiumAccess({ ...plan('FREE'), classOwners: [plan('FREE')] })).toBe(false);
    // A teacher on the personal Student plan has no teaching entitlement to confer.
    expect(hasPremiumAccess({ ...plan('FREE'), classOwners: [plan('STUDENT')] })).toBe(false);
  });

  it('grants access when at least one of several teachers has paid', () => {
    expect(
      hasPremiumAccess({ ...plan('FREE'), classOwners: [plan('FREE'), plan('STUDENT'), plan('PRO')] }),
    ).toBe(true);
  });
});
