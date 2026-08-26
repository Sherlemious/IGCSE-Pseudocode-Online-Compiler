/**
 * OpenTelemetry logs pipeline → PostHog Logs (OTLP/HTTP).
 *
 * PostHog Logs ingests via the OpenTelemetry Protocol, so no PostHog-specific
 * package is needed. Authentication uses the PUBLIC project token (`phc_…`) —
 * the same key the browser SDK already uses (NEXT_PUBLIC_POSTHOG_KEY) — sent as
 * a Bearer token. Never use a personal API key (`phx_…`) here.
 *
 * If no token is configured (e.g. local dev with analytics disabled) we skip
 * setup entirely, so the app runs without attempting to export. This module is
 * imported only from the Node.js runtime (see instrumentation.ts).
 */
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { logs } from '@opentelemetry/api-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';

const token = process.env.POSTHOG_LOGS_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY;
// US cloud by default; set to https://eu.i.posthog.com/i/v1/logs for the EU region.
const endpoint = process.env.POSTHOG_LOGS_ENDPOINT || 'https://us.i.posthog.com/i/v1/logs';

if (token) {
  const exporter = new OTLPLogExporter({
    url: endpoint,
    headers: { Authorization: `Bearer ${token}` },
  });

  const loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({
      'service.name': 'igcse-pseudocode-compiler',
      'service.version': process.env.npm_package_version || '0.1.0',
      'deployment.environment': process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    }),
    processors: [new BatchLogRecordProcessor({ exporter })],
  });

  logs.setGlobalLoggerProvider(loggerProvider);

  // Best-effort flush so batched records aren't lost when a long-running Node
  // process shuts down. (On short-lived serverless invocations, prefer flushing
  // per-request if you find logs are dropped.)
  const shutdown = () => {
    loggerProvider.shutdown().catch(() => {
      /* ignore shutdown errors */
    });
  };
  process.once('SIGTERM', shutdown);
  process.once('beforeExit', shutdown);
} else if (process.env.NODE_ENV !== 'production') {
  console.info('[logs] PostHog Logs disabled — no NEXT_PUBLIC_POSTHOG_KEY / POSTHOG_LOGS_TOKEN set.');
}
