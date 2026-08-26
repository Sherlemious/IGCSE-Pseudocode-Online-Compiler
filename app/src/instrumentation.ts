/**
 * Next.js instrumentation hook (Next 15+). Runs once per server process, before
 * any request is handled. We initialise the OpenTelemetry logs pipeline only in
 * the Node.js runtime — the OTLP/HTTP exporter relies on Node APIs and cannot
 * run on the Edge runtime (middleware, edge routes).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node');
  }
}
