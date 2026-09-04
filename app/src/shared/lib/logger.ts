/**
 * Server-side structured logger → PostHog Logs (via the OpenTelemetry logs
 * pipeline set up in instrumentation.node.ts).
 *
 * Usage:
 *   import { logger } from '@/shared/lib/logger';   // or a relative path
 *   logger.error('Grade DB fetch failed', { question_id: id, error: String(e) });
 *
 * If the pipeline wasn't initialised (no token configured), emit() is a no-op
 * for OTLP but still mirrors warnings/errors to the console so nothing is lost
 * in local dev. Logging must never throw into a request handler.
 */
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

const otelLogger = logs.getLogger('igcse-pseudocode-compiler');

export type LogAttributes = Record<string, string | number | boolean | null | undefined>;

function emit(
  severityNumber: SeverityNumber,
  severityText: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
  message: string,
  attributes?: LogAttributes,
) {
  // Drop null/undefined — the OTLP attribute encoder rejects them.
  const attrs: Record<string, string | number | boolean> = {};
  if (attributes) {
    for (const [k, v] of Object.entries(attributes)) {
      if (v !== null && v !== undefined) attrs[k] = v;
    }
  }

  try {
    otelLogger.emit({ severityNumber, severityText, body: message, attributes: attrs });
  } catch {
    /* never let logging break a request */
  }

  // Mirror the important levels to stdout/stderr for local dev and platform logs.
  if (severityText === 'ERROR' || severityText === 'WARN') {
    const sink = severityText === 'ERROR' ? console.error : console.warn;
    sink(`[${severityText}] ${message}`, attrs);
  }
}

export const logger = {
  debug: (message: string, attributes?: LogAttributes) => emit(SeverityNumber.DEBUG, 'DEBUG', message, attributes),
  info: (message: string, attributes?: LogAttributes) => emit(SeverityNumber.INFO, 'INFO', message, attributes),
  warn: (message: string, attributes?: LogAttributes) => emit(SeverityNumber.WARN, 'WARN', message, attributes),
  error: (message: string, attributes?: LogAttributes) => emit(SeverityNumber.ERROR, 'ERROR', message, attributes),
};
