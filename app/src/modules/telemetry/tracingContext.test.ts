import { describe, expect, it } from 'vitest';
import {
  POSTHOG_DISTINCT_ID_ATTRIBUTE,
  POSTHOG_SESSION_ID_ATTRIBUTE,
  isPostHogExportTarget,
  postHogIngestUrl,
  postHogTraceAttributes,
  spanTargetsPostHogExport,
} from './tracingContext';

describe('postHogIngestUrl', () => {
  it('sends traces to the project host, not the AI observability endpoint', () => {
    expect(postHogIngestUrl('traces')).toBe('https://us.i.posthog.com/i/v1/traces');
    expect(postHogIngestUrl('logs', { host: 'https://eu.i.posthog.com/' })).toBe(
      'https://eu.i.posthog.com/i/v1/logs',
    );
  });

  it('keeps an explicit endpoint, including its path', () => {
    expect(postHogIngestUrl('traces', { endpoint: 'https://example.test/i/v1/traces' })).toBe(
      'https://example.test/i/v1/traces',
    );
  });
});

describe('postHogTraceAttributes', () => {
  it('maps the tracing headers onto the attribute names PostHog joins', () => {
    const headers = new Headers({
      'X-POSTHOG-DISTINCT-ID': 'user_1',
      'X-POSTHOG-SESSION-ID': 'sess_1',
    });
    expect(postHogTraceAttributes(headers)).toEqual({
      [POSTHOG_DISTINCT_ID_ATTRIBUTE]: 'user_1',
      [POSTHOG_SESSION_ID_ATTRIBUTE]: 'sess_1',
    });
  });

  it('drops blank headers', () => {
    expect(postHogTraceAttributes(new Headers({ 'x-posthog-distinct-id': '  ' }))).toEqual({});
    expect(postHogTraceAttributes(new Headers())).toEqual({});
  });
});

describe('isPostHogExportTarget', () => {
  it('recognises the logs and traces ingest paths', () => {
    expect(isPostHogExportTarget('https://us.i.posthog.com/i/v1/traces')).toBe(true);
    expect(isPostHogExportTarget('https://us.i.posthog.com/i/v1/logs')).toBe(true);
    expect(isPostHogExportTarget('https://us.i.posthog.com/capture/')).toBe(false);
    expect(isPostHogExportTarget(undefined)).toBe(false);
  });

  it('matches those paths on the URL attributes Next records', () => {
    expect(spanTargetsPostHogExport({ 'http.url': 'https://us.i.posthog.com/i/v1/traces' })).toBe(true);
    expect(spanTargetsPostHogExport({ 'url.full': 'https://example.com/api/grade' })).toBe(false);
  });
});
