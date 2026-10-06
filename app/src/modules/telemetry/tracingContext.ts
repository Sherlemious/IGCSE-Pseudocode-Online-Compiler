/**
 * Pure helpers for the PostHog trace exporter. Attribute names match the
 * Node.js tracing guide: `posthogDistinctId` and `sessionId` are what join a
 * span to a person and a session replay.
 */

export const TRACE_SERVICE_NAME = 'igcse-pseudocode-compiler';

export const POSTHOG_DISTINCT_ID_ATTRIBUTE = 'posthogDistinctId';
export const POSTHOG_SESSION_ID_ATTRIBUTE = 'sessionId';

const DISTINCT_ID_HEADER = 'x-posthog-distinct-id';
const SESSION_ID_HEADER = 'x-posthog-session-id';

const POSTHOG_EXPORT_PATHS = ['/i/v1/traces', '/i/v1/logs'];

export function postHogIngestUrl(
  signal: 'logs' | 'traces',
  env: { host?: string; endpoint?: string } = {},
): string {
  if (env.endpoint) return env.endpoint;
  const base = (env.host || 'https://us.i.posthog.com').replace(/\/$/, '');
  return `${base}/i/v1/${signal}`;
}

/** Headers the browser SDK adds (`tracing_headers`) → span attributes. */
export function postHogTraceAttributes(headers: {
  get(name: string): string | null;
}): Record<string, string> {
  const attrs: Record<string, string> = {};
  const distinctId = headers.get(DISTINCT_ID_HEADER)?.trim();
  const sessionId = headers.get(SESSION_ID_HEADER)?.trim();
  if (distinctId) attrs[POSTHOG_DISTINCT_ID_ATTRIBUTE] = distinctId;
  if (sessionId) attrs[POSTHOG_SESSION_ID_ATTRIBUTE] = sessionId;
  return attrs;
}

/** The OTLP export itself must not become a span, or export creates more spans. */
export function isPostHogExportTarget(value: unknown): boolean {
  return typeof value === 'string' && POSTHOG_EXPORT_PATHS.some((path) => value.includes(path));
}

const EXPORT_URL_ATTRIBUTES = ['http.url', 'url.full', 'http.target', 'url.path'] as const;

export function spanTargetsPostHogExport(attributes: Record<string, unknown>): boolean {
  return EXPORT_URL_ATTRIBUTES.some((key) => isPostHogExportTarget(attributes[key]));
}
