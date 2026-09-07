/** Only local paths can be used as post-auth destinations. */
export function safeCallback(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback;
  try {
    let decoded = value;
    for (let i = 0; i < 3; i++) {
      if (/[\\\u0000-\u0020\u007f]/.test(decoded) || decoded.startsWith('//')) return fallback;
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    const target = new URL(value, 'https://local.invalid');
    if (target.origin !== 'https://local.invalid') return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}

export function authHref(mode: 'signin' | 'signup', callbackUrl?: string): string {
  const callback = safeCallback(callbackUrl, '');
  return `/auth/${mode}${callback ? `?callbackUrl=${encodeURIComponent(callback)}` : ''}`;
}
