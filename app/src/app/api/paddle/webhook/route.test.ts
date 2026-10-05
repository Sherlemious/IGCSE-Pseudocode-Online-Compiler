import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';

type FakeUser = {
  id: string;
  email: string;
  role: string;
  plan: string;
  planTier: string | null;
  planExpiresAt: Date | null;
  planUpdatedAt: Date | null;
  paddleCustomerId: string | null;
  paddleSubscriptionId: string | null;
};

const { users, events, failNextUpdate, captured } = vi.hoisted(() => ({
  users: new Map<string, FakeUser>(),
  events: new Set<string>(),
  failNextUpdate: { value: false },
  captured: [] as Array<{ distinctId: string; event: string; properties: Record<string, unknown> }>,
}));

vi.mock('@/shared/db', () => {
  const find = (where: Partial<FakeUser>) =>
    [...users.values()].find((u) =>
      Object.entries(where).every(([k, v]) => u[k as keyof FakeUser] === v),
    ) ?? null;
  return {
    prisma: {
      user: {
        findUnique: vi.fn(async ({ where }) => (find(where) ? { ...find(where)! } : null)),
        findFirst: vi.fn(async ({ where }) => (find(where) ? { ...find(where)! } : null)),
        update: vi.fn(async ({ where, data }) => {
          if (failNextUpdate.value) {
            failNextUpdate.value = false;
            throw new Error('db down');
          }
          const user = users.get(where.id)!;
          for (const [k, v] of Object.entries(data)) if (v !== undefined) Object.assign(user, { [k]: v });
          return user;
        }),
      },
      paddleEvent: {
        create: vi.fn(async ({ data }) => {
          if (events.has(data.id)) {
            throw new Prisma.PrismaClientKnownRequestError('Unique constraint', { code: 'P2002', clientVersion: 'test' });
          }
          events.add(data.id);
          return data;
        }),
        deleteMany: vi.fn(async ({ where }) => { events.delete(where.id); }),
      },
    },
  };
});
vi.mock('@/modules/billing/paddle/server', () => ({
  getPaddleServer: () => ({
    webhooks: { unmarshal: async (raw: string) => JSON.parse(raw) },
    customers: { get: async () => ({ email: null }) },
  }),
}));
vi.mock('@/modules/billing/paddle/env', () => ({ getPaddleEnv: () => 'sandbox' }));
vi.mock('@/modules/billing/paddle/plan', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/modules/billing/paddle/plan')>()),
  tierSlugForPriceId: async () => 'starter',
}));
vi.mock('@/modules/telemetry/serverCapture', () => ({
  captureServerEvent: async (distinctId: string, event: string, properties: Record<string, unknown> = {}) => {
    captured.push({ distinctId, event, properties });
  },
}));
vi.mock('@/modules/billing/entitlements', () => ({ revalidatePremiumAccess: () => {} }));

import { POST } from './route';

const MONTH_PASS_PRICE = 'pri_01m2nqdbxe4nmfpzqcn1gnv1x4'; // sandbox month pass

function deliver(eventId: string, eventType: string, occurredAt: string, data: object) {
  return POST(
    new Request('http://localhost/api/paddle/webhook', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig' },
      body: JSON.stringify({ eventId, eventType, occurredAt, data }),
    }),
  );
}

const subscription = (id: string, status: string) => ({
  id,
  status,
  customerId: 'ctm_1',
  customData: { app_user_id: 'u1' },
  items: [{ price: { id: 'pri_starter' } }],
});

function addUser(over: Partial<FakeUser> = {}) {
  users.set('u1', {
    id: 'u1',
    email: 'ada@example.com',
    role: 'STUDENT',
    plan: 'FREE',
    planTier: null,
    planExpiresAt: null,
    planUpdatedAt: null,
    paddleCustomerId: 'ctm_1',
    paddleSubscriptionId: null,
    ...over,
  });
}

beforeEach(() => {
  users.clear();
  events.clear();
  failNextUpdate.value = false;
  captured.length = 0;
  process.env.PADDLE_WEBHOOK_SECRET = 'secret';
});

describe('paddle webhook', () => {
  it('applies a redelivered pass purchase only once', async () => {
    addUser();
    const txn = { id: 'txn_1', status: 'completed', customerId: 'ctm_1', customData: { app_user_id: 'u1' }, items: [{ price: { id: MONTH_PASS_PRICE } }] };
    await deliver('evt_1', 'transaction.completed', '2026-09-01T10:00:00Z', txn);
    const firstExpiry = users.get('u1')!.planExpiresAt;
    expect(users.get('u1')!.plan).toBe('STUDENT');

    const again = await deliver('evt_1', 'transaction.completed', '2026-09-01T10:00:00Z', txn);
    expect(await again.json()).toMatchObject({ duplicate: true });
    expect(users.get('u1')!.planExpiresAt).toEqual(firstExpiry);
  });

  it('ignores an older event for the current subscription that arrives late', async () => {
    addUser();
    await deliver('evt_a', 'subscription.created', '2026-09-01T10:00:00Z', subscription('sub_1', 'active'));
    await deliver('evt_b', 'subscription.canceled', '2026-09-05T10:00:00Z', subscription('sub_1', 'canceled'));
    expect(users.get('u1')!.plan).toBe('FREE');

    // An update from before the cancellation, delivered after it.
    await deliver('evt_c', 'subscription.updated', '2026-09-03T10:00:00Z', subscription('sub_1', 'active'));
    expect(users.get('u1')!.plan).toBe('FREE');
  });

  it("doesn't downgrade a user when their old subscription is cancelled", async () => {
    addUser();
    await deliver('evt_a', 'subscription.created', '2026-09-01T10:00:00Z', subscription('sub_old', 'active'));
    await deliver('evt_b', 'subscription.created', '2026-09-10T10:00:00Z', subscription('sub_new', 'active'));
    await deliver('evt_c', 'subscription.canceled', '2026-09-11T10:00:00Z', subscription('sub_old', 'canceled'));
    expect(users.get('u1')).toMatchObject({ plan: 'STARTER', paddleSubscriptionId: 'sub_new' });
  });

  it("grants a new subscription whose events arrive after the old one's cancellation", async () => {
    addUser();
    await deliver('evt_a', 'subscription.created', '2026-09-01T10:00:00Z', subscription('sub_old', 'active'));
    await deliver('evt_c', 'subscription.canceled', '2026-09-11T10:00:00Z', subscription('sub_old', 'canceled'));
    await deliver('evt_b', 'subscription.created', '2026-09-10T10:00:00Z', subscription('sub_new', 'active'));
    expect(users.get('u1')).toMatchObject({ plan: 'STARTER', paddleSubscriptionId: 'sub_new' });
  });

  it('lets Paddle retry an event whose handler failed', async () => {
    addUser();
    failNextUpdate.value = true;
    const failed = await deliver('evt_a', 'subscription.created', '2026-09-01T10:00:00Z', subscription('sub_1', 'active'));
    expect(failed.status).toBe(500);
    expect(users.get('u1')!.plan).toBe('FREE');

    const retried = await deliver('evt_a', 'subscription.created', '2026-09-01T10:00:00Z', subscription('sub_1', 'active'));
    expect(retried.status).toBe(200);
    expect(users.get('u1')!.plan).toBe('STARTER');
  });

  it('records a signed-in checkout opening with the email the follow-up needs', async () => {
    addUser();
    const txn = { id: 'txn_9', status: 'draft', origin: 'web', customerId: null, customData: { app_user_id: 'u1' }, items: [{ price: { id: 'pri_starter' } }] };
    await deliver('evt_open', 'transaction.created', '2026-10-01T01:35:08Z', txn);
    expect(captured).toEqual([
      expect.objectContaining({
        distinctId: 'u1',
        event: 'checkout_opened',
        properties: expect.objectContaining({ transaction_id: 'txn_9', tier: 'starter', email: 'ada@example.com', $set: { email: 'ada@example.com' } }),
      }),
    ]);
  });

  it('skips signed-out checkouts and renewals', async () => {
    addUser();
    const guest = { id: 'txn_g', status: 'draft', origin: 'web', customerId: null, customData: null, items: [{ price: { id: 'pri_starter' } }] };
    const renewal = { id: 'txn_r', status: 'billed', origin: 'subscription_recurring', customerId: 'ctm_1', customData: { app_user_id: 'u1' }, items: [{ price: { id: 'pri_starter' } }] };
    await deliver('evt_g', 'transaction.created', '2026-10-01T01:00:00Z', guest);
    await deliver('evt_r', 'transaction.created', '2026-10-01T02:00:00Z', renewal);
    expect(captured).toEqual([]);
  });
});
