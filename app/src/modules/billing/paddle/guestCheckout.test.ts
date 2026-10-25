import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Paddle } from '@paddle/paddle-node-sdk';

vi.mock('@/modules/billing/repo', () => ({
  findBillingUserByCustomer: vi.fn(),
  findBillingUserById: vi.fn(),
  findBillingUserByEmail: vi.fn(),
  createBillingUserForPayer: vi.fn(),
  setPlan: vi.fn(),
}));
vi.mock('@/modules/auth/accountClaim', () => ({ sendClaimEmail: vi.fn() }));
vi.mock('@/modules/telemetry/serverCapture', () => ({ captureServerEvent: vi.fn() }));
vi.mock('@/modules/billing/entitlements', () => ({ revalidatePremiumAccess: vi.fn() }));

import * as repo from '@/modules/billing/repo';
import { sendClaimEmail } from '@/modules/auth/accountClaim';
import { applyPassPurchase, type TransactionData } from './webhookHandlers';

const MAY_JUNE_SANDBOX = 'pri_01m2nqdc16zf8vpt5gb9wdntc9';
const paddle = {
  customers: { get: vi.fn(async () => ({ email: 'New.Buyer@Example.com', name: 'New Buyer' })) },
} as unknown as Paddle;

const student = (id: string, email: string) => ({
  id,
  email,
  role: 'STUDENT' as const,
  plan: 'FREE' as const,
  planExpiresAt: null,
  planUpdatedAt: null,
  paddleSubscriptionId: null,
  paddleCustomerId: null,
});

const txn = (customData: Record<string, unknown> | null): TransactionData => ({
  id: 'txn_1',
  status: 'completed',
  customerId: 'ctm_1',
  customData,
  items: [{ price: { id: MAY_JUNE_SANDBOX } }],
});

describe('pay without an account', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_PADDLE_ENV = 'sandbox';
    vi.mocked(repo.findBillingUserByCustomer).mockResolvedValue(null);
    vi.mocked(repo.findBillingUserByEmail).mockResolvedValue(null);
  });

  it('makes an account on the payer email, gives it the pass and sends the claim email', async () => {
    vi.mocked(repo.createBillingUserForPayer).mockResolvedValue({ user: student('u_new', 'new.buyer@example.com'), created: true });
    await applyPassPurchase(txn({ guest: true, intended_role: 'STUDENT' }), paddle, new Date());
    expect(repo.createBillingUserForPayer).toHaveBeenCalledWith({ email: 'new.buyer@example.com', name: 'New Buyer', role: 'STUDENT' });
    expect(repo.setPlan).toHaveBeenCalledWith('u_new', expect.objectContaining({ plan: 'STUDENT', planTier: 'student-may-june' }));
    expect(sendClaimEmail).toHaveBeenCalledWith('new.buyer@example.com', 'May/June session pass');
  });

  it('puts the pass on an existing account with that email, without a claim email', async () => {
    vi.mocked(repo.findBillingUserByEmail).mockResolvedValue(student('u_old', 'new.buyer@example.com'));
    await applyPassPurchase(txn({ guest: true }), paddle, new Date());
    expect(repo.createBillingUserForPayer).not.toHaveBeenCalled();
    expect(repo.setPlan).toHaveBeenCalledWith('u_old', expect.anything());
    expect(sendClaimEmail).not.toHaveBeenCalled();
  });

  it('never makes an account for a checkout that was not a guest checkout', async () => {
    await applyPassPurchase(txn(null), paddle, new Date());
    expect(repo.createBillingUserForPayer).not.toHaveBeenCalled();
    expect(repo.setPlan).not.toHaveBeenCalled();
  });

  it('sends one claim email when a racing event already made the account', async () => {
    vi.mocked(repo.createBillingUserForPayer).mockResolvedValue({ user: student('u_new', 'new.buyer@example.com'), created: false });
    await applyPassPurchase(txn({ guest: true }), paddle, new Date());
    expect(repo.setPlan).toHaveBeenCalled();
    expect(sendClaimEmail).not.toHaveBeenCalled();
  });
});
