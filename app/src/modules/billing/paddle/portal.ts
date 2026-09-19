/**
 * Helpers for GET /api/paddle/portal. Authenticated Paddle customer-portal
 * sessions need `customer_portal_session.write` on PADDLE_API_KEY. When that
 * permission is missing, callers can fall back to the public magic-link portal
 * URL from Paddle → Business account → Customer portal
 * (`PADDLE_CUSTOMER_PORTAL_URL`).
 */

export function paddleErrorAttrs(err: unknown): {
  code?: string;
  detail?: string;
  type?: string;
} {
  const e = err as
    | { code?: string; detail?: string; type?: string; message?: string }
    | undefined;
  const detail = e?.detail || e?.message;
  return {
    ...(e?.code ? { code: e.code } : {}),
    ...(detail ? { detail } : {}),
    ...(e?.type ? { type: e.type } : {}),
  };
}

export function isPaddleForbidden(err: unknown): boolean {
  return paddleErrorAttrs(err).code === 'forbidden';
}

/** Only allow Paddle-hosted customer portal URLs — never an open redirect. */
export function safeCustomerPortalFallbackUrl(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;
    const host = parsed.hostname.toLowerCase();
    if (host !== 'customer-portal.paddle.com' && host !== 'sandbox-customer-portal.paddle.com') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
