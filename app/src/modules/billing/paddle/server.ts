import { Paddle, Environment } from '@paddle/paddle-node-sdk';
import { getPaddleEnv } from './env';

/**
 * Server-side Paddle client, authenticated with the SECRET API key (PADDLE_API_KEY).
 * NEVER import this into a client component — the key must not reach the browser.
 * (PADDLE_API_KEY has no NEXT_PUBLIC_ prefix, so Next won't inline it, but keep this
 * server-only regardless.)
 *
 * Returns null when the key isn't configured so callers can respond gracefully
 * instead of throwing at module load.
 *
 * The live key needs `customer.read` (webhook email lookup) and
 * `customer_portal_session.write` (GET /api/paddle/portal). Missing the latter
 * is a 403: "not authorized to create customer-portal-session".
 */
export function getPaddleServer(): Paddle | null {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) return null;
  const env = getPaddleEnv();
  return new Paddle(apiKey, {
    environment: env === 'production' ? Environment.production : Environment.sandbox,
  });
}
