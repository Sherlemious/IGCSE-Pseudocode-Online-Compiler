/**
 * An expected failure with the HTTP status and body it should produce. Thrown
 * from any layer (guard, service, input parsing) and turned into
 * `{ error, code? }` JSON by `route()`, so handlers never build error
 * responses by hand.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
    /** Extra JSON fields (e.g. `retryAfterSec`) and response headers. */
    readonly extra?: { body?: Record<string, unknown>; headers?: Record<string, string> },
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const badRequest = (message: string, code?: string) => new HttpError(400, message, code);
export const unauthorized = (message = 'Unauthorized', code?: string) => new HttpError(401, message, code);
export const forbidden = (message = 'Forbidden', code?: string) => new HttpError(403, message, code);
export const notFound = (message = 'Not found', code?: string) => new HttpError(404, message, code);
export const conflict = (message: string, code?: string) => new HttpError(409, message, code);
export const payloadTooLarge = (message: string, code?: string) => new HttpError(413, message, code);
export const unprocessable = (message: string, code?: string) => new HttpError(422, message, code);

export function tooManyRequests(retryAfterSec: number, message: string): HttpError {
  return new HttpError(429, message, undefined, {
    body: { retryAfterSec },
    headers: { 'Retry-After': String(retryAfterSec) },
  });
}
