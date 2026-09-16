/**
 * Fire-and-forget PostHog capture from API routes (Paddle webhook). Never
 * throws — billing must succeed even if analytics is down.
 */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || !distinctId) return;
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com').replace(/\/$/, '');
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties: { ...properties, $lib: 'paddle-webhook' },
      }),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    /* non-critical */
  }
}
