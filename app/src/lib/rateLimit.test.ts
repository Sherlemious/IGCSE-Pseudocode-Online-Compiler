import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, clientIp, __resetRateLimit } from './rateLimit';

describe('rateLimit', () => {
  beforeEach(() => __resetRateLimit());

  it('allows requests up to the limit, then throttles', () => {
    const opts = { limit: 3, windowMs: 1000 };
    expect(rateLimit('k', opts, 0).ok).toBe(true);
    expect(rateLimit('k', opts, 10).ok).toBe(true);
    expect(rateLimit('k', opts, 20).ok).toBe(true);
    const blocked = rateLimit('k', opts, 30);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('reports remaining allowance', () => {
    const opts = { limit: 2, windowMs: 1000 };
    expect(rateLimit('k', opts, 0).remaining).toBe(1);
    expect(rateLimit('k', opts, 1).remaining).toBe(0);
  });

  it('reports a positive retry-after when throttled', () => {
    const opts = { limit: 1, windowMs: 1000 };
    rateLimit('k', opts, 0); // oldest hit at t=0
    const blocked = rateLimit('k', opts, 400);
    expect(blocked.ok).toBe(false);
    // window frees at t=1000 → ~600ms → ceil to 1s
    expect(blocked.retryAfterSec).toBe(1);
  });

  it('lets requests through again once the window slides past old hits', () => {
    const opts = { limit: 1, windowMs: 1000 };
    expect(rateLimit('k', opts, 0).ok).toBe(true);
    expect(rateLimit('k', opts, 500).ok).toBe(false);
    // t=1001 is strictly beyond the window that started at t=0
    expect(rateLimit('k', opts, 1001).ok).toBe(true);
  });

  it('tracks keys independently', () => {
    const opts = { limit: 1, windowMs: 1000 };
    expect(rateLimit('a', opts, 0).ok).toBe(true);
    expect(rateLimit('b', opts, 0).ok).toBe(true);
    expect(rateLimit('a', opts, 1).ok).toBe(false);
  });

  it('only counts hits inside the sliding window', () => {
    const opts = { limit: 2, windowMs: 100 };
    rateLimit('k', opts, 0);
    rateLimit('k', opts, 50);
    // at t=150 the t=0 hit has expired, leaving just t=50 → one slot free
    expect(rateLimit('k', opts, 150).ok).toBe(true);
  });
});

describe('clientIp', () => {
  it('takes the first entry of x-forwarded-for', () => {
    const req = new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } });
    expect(clientIp(req)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip', () => {
    const req = new Request('http://x', { headers: { 'x-real-ip': '9.9.9.9' } });
    expect(clientIp(req)).toBe('9.9.9.9');
  });

  it('returns "unknown" when no proxy headers are present', () => {
    expect(clientIp(new Request('http://x'))).toBe('unknown');
  });
});
