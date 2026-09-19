import { describe, expect, it } from 'vitest';
import { hasAuthSessionCookie, isAuthSessionGet } from './sessionCookie';

describe('hasAuthSessionCookie', () => {
  it('matches Auth.js and NextAuth cookie names, including Secure + chunks', () => {
    expect(hasAuthSessionCookie('foo=1; authjs.session-token=abc')).toBe(true);
    expect(hasAuthSessionCookie('__Secure-authjs.session-token.0=chunk')).toBe(true);
    expect(hasAuthSessionCookie('next-auth.session-token=legacy')).toBe(true);
    expect(hasAuthSessionCookie('authjs.csrf-token=nope')).toBe(false);
    expect(hasAuthSessionCookie('')).toBe(false);
  });
});

describe('isAuthSessionGet', () => {
  it('only matches GET /api/auth/session', () => {
    expect(isAuthSessionGet('/api/auth/session')).toBe(true);
    expect(isAuthSessionGet('https://example.com/api/auth/session?ts=1')).toBe(true);
    expect(isAuthSessionGet('https://example.com/api/auth/session/')).toBe(true);
    expect(isAuthSessionGet('/api/auth/session', 'POST')).toBe(false);
    expect(isAuthSessionGet('/api/auth/csrf')).toBe(false);
  });
});
