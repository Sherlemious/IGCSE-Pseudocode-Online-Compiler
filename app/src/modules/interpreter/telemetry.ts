/**
 * Capture hook for interpreter analytics. The language runtime must not import
 * PostHog (or any other product SDK) — the app injects an implementation at
 * startup via `setInterpreterCapture`.
 */
export type InterpreterCaptureFn = (
  event: string,
  properties?: Record<string, unknown>,
) => void;

let captureImpl: InterpreterCaptureFn = () => {};

export function setInterpreterCapture(fn: InterpreterCaptureFn): void {
  captureImpl = fn;
}

export function captureRaw(event: string, properties: Record<string, unknown> = {}): void {
  try {
    captureImpl(event, properties);
  } catch {
    /* analytics must never break a student's run */
  }
}
