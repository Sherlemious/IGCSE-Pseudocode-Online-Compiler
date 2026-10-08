import { clientIp, rateLimit, type RateLimitOptions } from '@/shared/lib/rateLimit';
import { tooManyRequests } from './errors';

const DEFAULT_MESSAGE = 'Too many requests. Please wait a moment and try again.';

/** Record a hit against `key`; throws a 429 when it is over the limit. */
export function enforceRateLimit(
  key: string,
  options: RateLimitOptions,
  message: string | ((retryAfterSec: number) => string) = DEFAULT_MESSAGE,
): void {
  const result = rateLimit(key, options);
  if (result.ok) return;
  throw tooManyRequests(
    result.retryAfterSec,
    typeof message === 'function' ? message(result.retryAfterSec) : message,
  );
}

/** `user:<id>` when signed in, otherwise `ip:<address>`. */
export function requesterKey(req: Request, userId: string | null | undefined): string {
  return userId ? `user:${userId}` : `ip:${clientIp(req)}`;
}

export { clientIp };
