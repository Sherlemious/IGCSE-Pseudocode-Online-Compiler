import { describe, expect, it } from 'vitest';
import { createPayForToken, PAY_LINK_TTL_MS, verifyPayForToken } from './parentPay';

const now = new Date('2026-10-26T12:00:00Z');

describe('parent pay link token', () => {
  it('round-trips the student id', () => {
    expect(verifyPayForToken(createPayForToken('cmtrf48m80002l704sq1y85cw', now), now)).toBe('cmtrf48m80002l704sq1y85cw');
  });

  it('expires after the TTL', () => {
    const token = createPayForToken('student1', now);
    expect(verifyPayForToken(token, new Date(now.getTime() + PAY_LINK_TTL_MS - 1000))).toBe('student1');
    expect(verifyPayForToken(token, new Date(now.getTime() + PAY_LINK_TTL_MS + 1000))).toBeNull();
  });

  it('rejects a token pointed at another student', () => {
    const [, expiry, signature] = createPayForToken('student1', now).split('.');
    expect(verifyPayForToken(`student2.${expiry}.${signature}`, now)).toBeNull();
  });

  it('rejects an extended expiry', () => {
    const [id, , signature] = createPayForToken('student1', now).split('.');
    const later = (now.getTime() + 10 * PAY_LINK_TTL_MS).toString(36);
    expect(verifyPayForToken(`${id}.${later}.${signature}`, now)).toBeNull();
  });

  it('rejects junk', () => {
    for (const junk of [undefined, null, 42, '', 'a.b', 'a.b.c.d', 'x'.repeat(300)]) {
      expect(verifyPayForToken(junk, now)).toBeNull();
    }
  });
});
