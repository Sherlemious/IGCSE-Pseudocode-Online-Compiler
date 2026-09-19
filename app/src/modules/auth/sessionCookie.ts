/** Auth.js / NextAuth session cookies (chunked tokens included). */
export const AUTH_SESSION_COOKIE_RE =
  /(?:^|; )(?:__Secure-)?(?:authjs|next-auth)\.session-token(?:\.\d+)?=/;

export function hasAuthSessionCookie(
  cookie = typeof document === 'undefined' ? '' : document.cookie,
): boolean {
  return AUTH_SESSION_COOKIE_RE.test(cookie);
}

export function isAuthSessionGet(url: string, method = 'GET'): boolean {
  if (method.toUpperCase() !== 'GET') return false;
  try {
    const path = (url.startsWith('http') ? new URL(url).pathname : url.split('?')[0] ?? '').replace(/\/$/, '');
    return path === '/api/auth/session' || path.endsWith('/api/auth/session');
  } catch {
    return false;
  }
}

/**
 * Anonymous visits still mount SessionProvider, which GETs `/api/auth/session`.
 * That is a Vercel invocation on every crawler/pageview. Short-circuit the
 * browser fetch when no session cookie exists so the provider still hydrates
 * as signed-out without hitting the function.
 */
export function installAnonymousSessionShortCircuit(): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { __anonSessionShortCircuit?: boolean };
  if (w.__anonSessionShortCircuit) return;
  w.__anonSessionShortCircuit = true;
  const orig = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method ?? (input instanceof Request ? input.method : 'GET');
    if (isAuthSessionGet(url, method) && !hasAuthSessionCookie()) {
      return Promise.resolve(
        new Response('null', { status: 200, headers: { 'Content-Type': 'application/json' } }),
      );
    }
    return orig(input, init);
  };
}
