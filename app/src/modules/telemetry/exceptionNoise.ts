/**
 * `$exception` events that are not app crashes, dropped before they are sent.
 * In Oct 2026 they were most of Error Tracking (700 of 860 events in 14 days):
 * - "ResizeObserver loop …" is a browser warning about layout timing; nothing breaks.
 * - "Object Not Found Matching Id:N, MethodName:update" comes from Microsoft's
 *   Outlook/Defender link scanner opening our links, not from a student.
 */
const NOISE = [/ResizeObserver loop/i, /Object Not Found Matching Id/i];

type ExceptionEntry = { value?: unknown };
type CaptureLike = { event?: string; properties?: Record<string, unknown> } | null | undefined;

function exceptionMessages(properties: Record<string, unknown>): string[] {
  const messages: string[] = [];
  const list = properties.$exception_list;
  if (Array.isArray(list)) {
    for (const entry of list as ExceptionEntry[]) {
      if (typeof entry?.value === 'string') messages.push(entry.value);
    }
  }
  const values = properties.$exception_values;
  if (Array.isArray(values)) {
    for (const value of values) if (typeof value === 'string') messages.push(value);
  }
  if (typeof properties.$exception_message === 'string') messages.push(properties.$exception_message);
  return messages;
}

export function isNoiseException(event: CaptureLike): boolean {
  if (!event || event.event !== '$exception' || !event.properties) return false;
  const messages = exceptionMessages(event.properties);
  return messages.length > 0 && messages.every((message) => NOISE.some((pattern) => pattern.test(message)));
}
