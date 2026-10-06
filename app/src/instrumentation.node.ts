/**
 * OpenTelemetry logs and traces → PostHog (OTLP/HTTP).
 *
 * PostHog ingests both signals with the project token (`phc_…`, the same key
 * the browser SDK uses). Never use a personal API key (`phx_…`). Traces go to
 * `/i/v1/traces` — not the AI observability endpoint `/i/v0/ai/otel`.
 *
 * Next.js creates the request, render, and fetch spans once a tracer provider
 * is registered. This module stamps `posthogDistinctId` / `sessionId` from the
 * headers `tracing_headers` adds in the browser, and flushes when the root
 * span ends so a Vercel isolate does not freeze with a full batch queue.
 *
 * If no token is configured (local dev with analytics disabled) setup is
 * skipped. Imported only from the Node.js runtime (see instrumentation.ts).
 */
import { createRequire } from 'node:module';
import { trace, type Context } from '@opentelemetry/api';
import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import {
  BatchSpanProcessor,
  type ReadableSpan,
  type Span,
  type SpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import {
  TRACE_SERVICE_NAME,
  postHogIngestUrl,
  postHogTraceAttributes,
  spanTargetsPostHogExport,
} from '@/modules/telemetry/tracingContext';

const token = process.env.POSTHOG_LOGS_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: TRACE_SERVICE_NAME,
  [ATTR_SERVICE_VERSION]: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || '0.1.0',
  'deployment.environment': process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
});

const require = createRequire(import.meta.url);

type HeaderSource = { get(name: string): string | null };
type RequestStore = { type?: string; headers?: HeaderSource };

let requestStore: { getStore(): RequestStore | undefined } | null | undefined;

function currentRequestHeaders(): HeaderSource | undefined {
  if (requestStore === undefined) {
    try {
      const mod = require('next/dist/server/app-render/work-unit-async-storage.external') as {
        workUnitAsyncStorage: { getStore(): RequestStore | undefined };
      };
      requestStore = mod.workUnitAsyncStorage;
    } catch {
      requestStore = null;
    }
  }
  if (!requestStore) return undefined;
  try {
    const store = requestStore.getStore();
    // Reading the store directly does not call headers(), so static pages stay static.
    if (store?.type === 'request' && store.headers) return store.headers;
  } catch {
    return undefined;
  }
  return undefined;
}

function stampPostHogContext(span: Span, parentContext: Context) {
  const headers = currentRequestHeaders();
  if (!headers) return;
  const attrs = postHogTraceAttributes(headers);
  if (Object.keys(attrs).length === 0) return;
  span.setAttributes(attrs);
  trace.getSpan(parentContext)?.setAttributes(attrs);
}

type VercelRequestContext = { waitUntil?: (promise: Promise<unknown>) => void };

function vercelWaitUntil(promise: Promise<unknown>) {
  const reader = (globalThis as Record<symbol, { get?: () => VercelRequestContext } | undefined>)[
    Symbol.for('@vercel/request-context')
  ];
  const waitUntil = reader?.get?.()?.waitUntil;
  if (typeof waitUntil !== 'function') return;
  try {
    waitUntil(promise);
  } catch {
    /* tracing must never break a request */
  }
}

/**
 * Forwards spans to the batch exporter, and on each root span asks Vercel to
 * keep the isolate alive until that span has ended and the batch is flushed.
 */
class FlushingSpanProcessor implements SpanProcessor {
  private readonly pending = new Map<string, () => void>();

  constructor(private readonly batch: BatchSpanProcessor) {}

  onStart(span: Span, parentContext: Context): void {
    stampPostHogContext(span, parentContext);
    this.batch.onStart(span, parentContext);
    if (span.parentSpanContext?.spanId) return;

    const traceId = span.spanContext().traceId;
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ended = new Promise<void>((resolve) => {
      const finish = () => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        this.pending.delete(traceId);
        resolve();
      };
      this.pending.set(traceId, finish);
      timer = setTimeout(finish, 60_000);
      timer.unref?.();
    });

    vercelWaitUntil(ended.then(() => this.batch.forceFlush()).catch(() => undefined));
  }

  onEnd(span: ReadableSpan): void {
    if (!spanTargetsPostHogExport(span.attributes)) this.batch.onEnd(span);
    if (span.parentSpanContext?.spanId) return;
    this.pending.get(span.spanContext().traceId)?.();
  }

  forceFlush(): Promise<void> {
    return this.batch.forceFlush();
  }

  shutdown(): Promise<void> {
    return this.batch.shutdown();
  }
}

const started = Symbol.for('igcse.posthog.otel');
const globalState = globalThis as typeof globalThis & { [started]?: boolean };

if (token && !globalState[started]) {
  globalState[started] = true;
  const logExporter = new OTLPLogExporter({
    url: postHogIngestUrl('logs', { host, endpoint: process.env.POSTHOG_LOGS_ENDPOINT }),
    headers: { Authorization: `Bearer ${token}` },
  });
  const loggerProvider = new LoggerProvider({
    resource,
    processors: [new BatchLogRecordProcessor({ exporter: logExporter })],
  });
  logs.setGlobalLoggerProvider(loggerProvider);

  const traceExporter = new OTLPTraceExporter({
    url: postHogIngestUrl('traces', { host, endpoint: process.env.POSTHOG_TRACES_ENDPOINT }),
    headers: { Authorization: `Bearer ${token}` },
  });
  const tracerProvider = new NodeTracerProvider({
    resource,
    spanProcessors: [
      new FlushingSpanProcessor(
        // The public constructor is (exporter, config). A warm Node server still
        // exports on this interval if the root-span flush is missed.
        new BatchSpanProcessor(traceExporter, { scheduledDelayMillis: 2_000 }),
      ),
    ],
  });
  tracerProvider.register();

  const shutdown = () => {
    Promise.all([loggerProvider.shutdown(), tracerProvider.shutdown()]).catch(() => {
      /* ignore shutdown errors */
    });
  };
  process.once('SIGTERM', shutdown);
  process.once('beforeExit', shutdown);
} else if (process.env.NODE_ENV !== 'production') {
  console.info('[otel] PostHog logs and traces disabled — no NEXT_PUBLIC_POSTHOG_KEY / POSTHOG_LOGS_TOKEN set.');
}
