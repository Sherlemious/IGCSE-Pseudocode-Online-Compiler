import { describe, expect, it } from 'vitest';
import { planUpdateFromPaddle, scheduledCancelEffectiveAt } from './subscriptionState';

describe('scheduledCancelEffectiveAt', () => {
  it('reads camelCase SDK payloads', () => {
    expect(
      scheduledCancelEffectiveAt({
        scheduledChange: { action: 'cancel', effectiveAt: '2026-10-19T12:00:00Z' },
      }),
    ).toEqual(new Date('2026-10-19T12:00:00Z'));
  });

  it('reads snake_case API payloads and falls back to the billing period', () => {
    expect(
      scheduledCancelEffectiveAt({
        scheduled_change: { action: 'cancel' },
        current_billing_period: { ends_at: '2026-11-01T00:00:00Z' },
      }),
    ).toEqual(new Date('2026-11-01T00:00:00Z'));
  });

  it('ignores pause/resume and missing dates', () => {
    expect(scheduledCancelEffectiveAt({ scheduledChange: { action: 'pause' } })).toBeNull();
    expect(scheduledCancelEffectiveAt({ scheduledChange: { action: 'cancel' } })).toBeNull();
    expect(scheduledCancelEffectiveAt({})).toBeNull();
  });
});

describe('planUpdateFromPaddle', () => {
  const mapped = { plan: 'PRO' as const, tier: 'pro' };

  it('keeps access and stamps expiry when cancel is scheduled', () => {
    expect(
      planUpdateFromPaddle(
        {
          status: 'active',
          scheduledChange: { action: 'cancel', effectiveAt: '2026-10-19T12:00:00Z' },
        },
        mapped,
      ),
    ).toEqual({
      outcome: 'scheduled_cancel',
      plan: 'PRO',
      planTier: 'pro',
      planExpiresAt: new Date('2026-10-19T12:00:00Z'),
    });
  });

  it('clears expiry on a normal active grant (resume / new sub)', () => {
    expect(planUpdateFromPaddle({ status: 'active' }, mapped)).toEqual({
      outcome: 'grant',
      plan: 'PRO',
      planTier: 'pro',
      planExpiresAt: null,
    });
  });

  it('revokes when status is no longer entitled', () => {
    expect(planUpdateFromPaddle({ status: 'canceled' }, mapped)).toEqual({
      outcome: 'revoke',
      plan: 'FREE',
      planTier: null,
      planExpiresAt: null,
    });
  });
});
