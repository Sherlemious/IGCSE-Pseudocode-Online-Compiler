/**
 * Server-side PostHog feature flag check for a signed-in user (distinct id =
 * user id, the same id `identifyAccount` uses in the browser). There is no
 * posthog-node here, so this calls the public `/flags` endpoint with the
 * project key. Fails closed: no key, a timeout or an error reads as off.
 * Results are cached per user for a minute so a burst of requests costs one call.
 */

const TTL_MS = 60_000;
const cache = new Map<string, { at: number; flags: Record<string, boolean> }>();

export async function isFlagEnabledFor(distinctId: string, flag: string): Promise<boolean> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || !distinctId) return false;
  const hit = cache.get(distinctId);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.flags[flag] === true;

  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com').replace(/\/$/, '');
  try {
    const res = await fetch(`${host}/flags?v=2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, distinct_id: distinctId }),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return false;
    const body = (await res.json()) as {
      flags?: Record<string, { enabled?: boolean }>;
      featureFlags?: Record<string, boolean | string>;
    };
    const flags: Record<string, boolean> = {};
    for (const [name, value] of Object.entries(body.flags ?? {})) flags[name] = value?.enabled === true;
    for (const [name, value] of Object.entries(body.featureFlags ?? {})) flags[name] ??= value !== false;
    if (cache.size > 5000) cache.clear();
    cache.set(distinctId, { at: Date.now(), flags });
    return flags[flag] === true;
  } catch {
    return false;
  }
}
