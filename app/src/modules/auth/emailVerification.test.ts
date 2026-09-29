import { beforeEach, describe, expect, it, vi } from 'vitest';

const { tokens, users } = vi.hoisted(() => ({
  tokens: new Map<string, { identifier: string; token: string; expires: Date }>(),
  users: new Map<string, { id: string; email: string; emailVerified: Date | null; password: string | null }>(),
}));

vi.mock('@/shared/db', () => {
  const key = (w: { identifier_token: { identifier: string; token: string } }) =>
    `${w.identifier_token.identifier}|${w.identifier_token.token}`;
  return {
    prisma: {
      verificationToken: {
        create: vi.fn(async ({ data }) => { tokens.set(`${data.identifier}|${data.token}`, data); return data; }),
        findUnique: vi.fn(async ({ where }) => tokens.get(key(where)) ?? null),
        delete: vi.fn(async ({ where }) => { tokens.delete(key(where)); }),
      },
      user: {
        findUnique: vi.fn(async ({ where }) => users.get(where.id) ?? null),
        update: vi.fn(async ({ where, data }) => Object.assign(users.get(where.id)!, data)),
        updateMany: vi.fn(async ({ where, data }) => {
          for (const u of users.values()) {
            if (u.email === where.email && u.emailVerified === null) Object.assign(u, data);
          }
        }),
      },
    },
  };
});

import {
  consumeEmailVerificationToken,
  createEmailVerificationUrl,
  hardenOAuthLink,
} from './emailVerification';

const addUser = (over: Partial<{ emailVerified: Date | null; password: string | null }> = {}) =>
  users.set('u1', { id: 'u1', email: 'ada@example.com', emailVerified: null, password: 'hash', ...over });

const tokenFrom = (url: string) => new URL(url).searchParams.get('token')!;

beforeEach(() => {
  tokens.clear();
  users.clear();
});

describe('email verification links', () => {
  it('stores only a hash of the token', async () => {
    const url = await createEmailVerificationUrl('ada@example.com');
    const [stored] = [...tokens.values()];
    expect(stored.token).not.toBe(tokenFrom(url));
    expect(stored.identifier).toBe('verify-email:ada@example.com');
  });

  it('verifies the email once, then the link is spent', async () => {
    addUser();
    const token = tokenFrom(await createEmailVerificationUrl('ada@example.com'));
    expect(await consumeEmailVerificationToken('ada@example.com', token)).toBe(true);
    expect(users.get('u1')!.emailVerified).toBeInstanceOf(Date);
    expect(await consumeEmailVerificationToken('ada@example.com', token)).toBe(false);
  });

  it('rejects a token for a different email or a wrong token', async () => {
    addUser();
    const token = tokenFrom(await createEmailVerificationUrl('ada@example.com'));
    expect(await consumeEmailVerificationToken('eve@example.com', token)).toBe(false);
    expect(await consumeEmailVerificationToken('ada@example.com', 'nope')).toBe(false);
    expect(users.get('u1')!.emailVerified).toBeNull();
  });

  it('rejects an expired token', async () => {
    addUser();
    const token = tokenFrom(await createEmailVerificationUrl('ada@example.com'));
    for (const row of tokens.values()) row.expires = new Date(Date.now() - 1000);
    expect(await consumeEmailVerificationToken('ada@example.com', token)).toBe(false);
    expect(users.get('u1')!.emailVerified).toBeNull();
  });
});

describe('hardenOAuthLink', () => {
  it('clears a password nobody proved and marks the email verified', async () => {
    addUser();
    expect(await hardenOAuthLink('u1', true)).toBe(true);
    expect(users.get('u1')).toMatchObject({ password: null });
    expect(users.get('u1')!.emailVerified).toBeInstanceOf(Date);
  });

  it('keeps the password of a verified account', async () => {
    const verified = new Date('2026-01-01');
    addUser({ emailVerified: verified });
    expect(await hardenOAuthLink('u1', true)).toBe(false);
    expect(users.get('u1')).toMatchObject({ password: 'hash', emailVerified: verified });
  });

  it('marks a new OAuth-only user verified', async () => {
    addUser({ password: null });
    expect(await hardenOAuthLink('u1', true)).toBe(false);
    expect(users.get('u1')!.emailVerified).toBeInstanceOf(Date);
  });

  it('does nothing when the provider did not verify the email', async () => {
    addUser();
    expect(await hardenOAuthLink('u1', false)).toBe(false);
    expect(users.get('u1')).toMatchObject({ password: 'hash', emailVerified: null });
  });
});
