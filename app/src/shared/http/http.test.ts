import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/lib/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import { HttpError, notFound, tooManyRequests } from './errors';
import { clampedNumber, optionalText, readJson, readJsonOrEmpty, requiredText, stringList } from './input';
import { route } from './route';

const req = (body?: string) =>
  new Request('https://x.test/api/thing', { method: 'POST', body, headers: { 'content-type': 'application/json' } });

describe('route()', () => {
  it('returns plain data as 200 JSON', async () => {
    const res = await route(async () => ({ id: 1 }))(req(), {});
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 1 });
  });

  it('passes a Response through untouched', async () => {
    const res = await route(async () => new Response('hi', { status: 302 }))(req(), {});
    expect(res.status).toBe(302);
  });

  it('turns HttpError into its status, message and code', async () => {
    const res = await route(async () => {
      throw notFound('No class found for that code.', 'CLASS_NOT_FOUND');
    })(req(), {});
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'No class found for that code.', code: 'CLASS_NOT_FOUND' });
  });

  it('adds Retry-After and retryAfterSec to a 429', async () => {
    const res = await route(async () => {
      throw tooManyRequests(12, 'Slow down');
    })(req(), {});
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('12');
    expect(await res.json()).toEqual({ error: 'Slow down', retryAfterSec: 12 });
  });

  it('hides unexpected errors behind a generic 500', async () => {
    const res = await route(async () => {
      throw new Error('PrismaClientKnownRequestError: secret details');
    })(req(), {});
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal error' });
  });
});

describe('input', () => {
  it('readJson rejects non-objects with a 400', async () => {
    await expect(readJson(req('[1,2]'))).rejects.toMatchObject({ status: 400 });
    await expect(readJson(req('nope'))).rejects.toBeInstanceOf(HttpError);
    expect(await readJson(req('{"a":1}'))).toEqual({ a: 1 });
  });

  it('readJsonOrEmpty falls back to {}', async () => {
    expect(await readJsonOrEmpty(req('nope'))).toEqual({});
  });

  it('caps and trims text', () => {
    expect(optionalText('  hello  ', 3)).toBe('hel');
    expect(optionalText('   ', 3)).toBeNull();
    expect(optionalText(5, 3)).toBeNull();
    expect(() => requiredText('', 10, 'Name it')).toThrow('Name it');
  });

  it('clamps numbers with a fallback for blanks', () => {
    expect(clampedNumber('500', 10, 180, 60)).toBe(180);
    expect(clampedNumber(undefined, 10, 180, 60)).toBe(60);
    expect(clampedNumber(0, 10, 180, 60)).toBe(60);
    expect(clampedNumber(5, 10, 180, 60)).toBe(10);
  });

  it('dedupes string lists in order', () => {
    expect(stringList(['b', 1, 'a', 'b'])).toEqual(['b', 'a']);
    expect(stringList('x')).toEqual([]);
  });
});
