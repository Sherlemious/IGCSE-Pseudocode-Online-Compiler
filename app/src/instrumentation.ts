/**
 * Next.js instrumentation hook (Next 15+). Runs once per server process, before
 * any request is handled. Logs and traces are initialised only in the Node.js
 * runtime — the OTLP exporters rely on Node APIs and cannot run on the Edge
 * runtime (proxy, edge routes) or in a Cloudflare Worker.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.CLOUDFLARE_BUILD !== '1') {
    await import('./instrumentation.node');
  }
}
