/**
 * Zero-dependency in-memory sliding-window rate limiter.
 *
 * State lives in the module scope of a single server instance. On a
 * multi-instance / serverless deployment each instance keeps its own counters,
 * so this bounds abuse *per instance* rather than globally — it stops a single
 * client from flooding a warm instance (the common abuse case) with no external
 * infra. For a strict global limit, back this with Redis (e.g. Upstash) instead.
 */

interface Bucket {
  /** Request timestamps (ms) within the window, sorted ascending. */
  hits: number[];
}

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

export interface RateLimitResult {
  ok: boolean;
  /** Remaining requests allowed in the current window (0 when throttled). */
  remaining: number;
  /** Seconds until the caller may retry (0 when not throttled). */
  retryAfterSec: number;
}

export interface RateLimitOptions {
  /** Max requests permitted per key within the window. */
  limit: number;
  /** Sliding window length in milliseconds. */
  windowMs: number;
}

/**
 * Record a request against `key` and report whether it is within the limit.
 * `now` is injectable for deterministic testing; defaults to wall-clock time.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
  now: number = Date.now(),
): RateLimitResult {
  const cutoff = now - windowMs;

  // Opportunistically evict stale buckets to bound memory (at most once/window).
  if (now - lastSweep > windowMs) {
    for (const [k, b] of buckets) {
      if (b.hits.length === 0 || b.hits[b.hits.length - 1] <= cutoff) {
        buckets.delete(k);
      }
    }
    lastSweep = now;
  }

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }

  // Drop timestamps that have aged out of the window (hits is sorted ascending).
  let expired = 0;
  while (expired < bucket.hits.length && bucket.hits[expired] <= cutoff) expired++;
  if (expired > 0) bucket.hits.splice(0, expired);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    const retryAfterMs = oldest + windowMs - now;
    return { ok: false, remaining: 0, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  bucket.hits.push(now);
  return { ok: true, remaining: limit - bucket.hits.length, retryAfterSec: 0 };
}

/**
 * Best-effort client IP from proxy headers (Vercel/most reverse proxies set
 * `x-forwarded-for`). Falls back to a shared bucket when no header is present,
 * which is acceptable — the goal is to slow floods, not to identify users.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Test-only: clear all limiter state. */
export function __resetRateLimit(): void {
  buckets.clear();
  lastSweep = 0;
}
