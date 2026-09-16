import { describe, it, expect } from 'vitest';
import type { Plan } from '@prisma/client';
import {
  resolveTier,
  tierForUser,
  limitsFor,
  limitsForUser,
  LIMITS,
  LEGACY_STARTER_LIMITS,
  hasPremiumAccess,
  isAtStudentCap,
  isPlanActive,
  type PlanHolder,
} from './entitlements';

const IN_FUTURE = new Date(Date.now() + 60_000);
const IN_PAST = new Date(Date.now() - 60_000);

const plan = (p: string, trialEndsAt: Date | null = null): PlanHolder => ({
  plan: p as Plan,
  trialEndsAt,
});

describe('resolveTier', () => {
  it('maps plans to tiers', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: null })).toBe('free');
    expect(resolveTier({ plan: 'STARTER' as Plan, trialEndsAt: null })).toBe('starter');
    expect(resolveTier({ plan: 'PRO' as Plan, trialEndsAt: null })).toBe('classroom');
    expect(resolveTier({ plan: 'SCHOOL' as Plan, trialEndsAt: null })).toBe('school');
    expect(resolveTier({ plan: 'STUDENT' as Plan, trialEndsAt: null })).toBe('free');
  });

  it('grants Classroom-level access during an active trial', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: IN_FUTURE })).toBe('classroom');
  });

  it('ignores an expired trial', () => {
    expect(resolveTier({ plan: 'FREE' as Plan, trialEndsAt: IN_PAST })).toBe('free');
  });
});

describe('tierForUser', () => {
  const base = { trialEndsAt: null, planExpiresAt: null, legacyCapacity: false };

  it('prefers the exact planTier slug over the coarse plan', () => {
    expect(tierForUser({ ...base, plan: 'PRO' as Plan, planTier: 'department' })).toBe('department');
    expect(tierForUser({ ...base, plan: 'SCHOOL' as Plan, planTier: 'school' })).toBe('school');
  });

  it('maps the live $15 price slug pro → classroom for new buyers', () => {
    expect(tierForUser({ ...base, plan: 'PRO' as Plan, planTier: 'pro' })).toBe('classroom');
  });

  it('keeps grandfathered Pro on unlimited pro, not Classroom', () => {
    expect(
      tierForUser({
        ...base,
        plan: 'PRO' as Plan,
        planTier: 'pro',
        legacyCapacity: true,
      }),
    ).toBe('pro');
  });

  it('treats an expired student pass as free', () => {
    expect(
      tierForUser({
        trialEndsAt: null,
        plan: 'STUDENT' as Plan,
        planTier: 'student-may-june',
        planExpiresAt: IN_PAST,
      }),
    ).toBe('free');
  });

  it('does not grant teaching capacity for an active student pass', () => {
    expect(
      tierForUser({
        trialEndsAt: null,
        plan: 'STUDENT' as Plan,
        planTier: 'student-may-june',
        planExpiresAt: IN_FUTURE,
      }),
    ).toBe('free');
  });
});

describe('limits', () => {
  it('new starter is 3 classes / 30 students total', () => {
    expect(limitsFor('starter')).toEqual({
      maxClasses: 3,
      maxStudentsTotal: 30,
      maxStudentsPerClass: 30,
    });
  });

  it('bands scale by total students', () => {
    expect(LIMITS.classroom.maxStudentsTotal).toBe(90);
    expect(LIMITS.department.maxStudentsTotal).toBe(250);
    expect(LIMITS.school.maxStudentsTotal).toBe(750);
    expect(LIMITS.campus.maxStudentsTotal).toBe(Infinity);
  });

  it('grandfathered Starter keeps 3 classes × 30 per class with no total cap', () => {
    const limits = limitsForUser({
      plan: 'STARTER' as Plan,
      trialEndsAt: null,
      planTier: 'starter',
      legacyCapacity: true,
    });
    expect(limits).toEqual(LEGACY_STARTER_LIMITS);
    expect(limits.maxStudentsTotal).toBe(Infinity);
    expect(isAtStudentCap({ limits, studentsInClass: 30, studentsAcrossClasses: 90 })).toBe(true);
    expect(isAtStudentCap({ limits, studentsInClass: 29, studentsAcrossClasses: 87 })).toBe(false);
  });

  it('new Starter hits the total cap even when a class is not full', () => {
    const limits = limitsForUser({
      plan: 'STARTER' as Plan,
      trialEndsAt: null,
      planTier: 'starter',
      legacyCapacity: false,
    });
    expect(isAtStudentCap({ limits, studentsInClass: 10, studentsAcrossClasses: 30 })).toBe(true);
    expect(isAtStudentCap({ limits, studentsInClass: 10, studentsAcrossClasses: 29 })).toBe(false);
  });

  it('grandfathered Pro stays unlimited', () => {
    const limits = limitsForUser({
      plan: 'PRO' as Plan,
      trialEndsAt: null,
      planTier: 'pro',
      legacyCapacity: true,
    });
    expect(limits.maxStudentsTotal).toBe(Infinity);
    expect(limits.maxClasses).toBe(Infinity);
  });
});

describe('isPlanActive', () => {
  it('rejects an expired pass', () => {
    expect(isPlanActive({ plan: 'STUDENT' as Plan, planExpiresAt: IN_PAST })).toBe(false);
  });
  it('accepts a subscription with no expiry', () => {
    expect(isPlanActive({ plan: 'STARTER' as Plan, planExpiresAt: null })).toBe(true);
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

  it('does not grant an expired student pass', () => {
    expect(
      hasPremiumAccess({
        ...plan('STUDENT'),
        planExpiresAt: IN_PAST,
        classOwners: [],
      }),
    ).toBe(false);
  });

  it('grants a still-valid student pass', () => {
    expect(
      hasPremiumAccess({
        ...plan('STUDENT'),
        planExpiresAt: IN_FUTURE,
        classOwners: [],
      }),
    ).toBe(true);
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

  it('does NOT inherit from a free or student-pass teacher', () => {
    expect(hasPremiumAccess({ ...plan('FREE'), classOwners: [plan('FREE')] })).toBe(false);
    expect(hasPremiumAccess({ ...plan('FREE'), classOwners: [plan('STUDENT')] })).toBe(false);
  });
});
