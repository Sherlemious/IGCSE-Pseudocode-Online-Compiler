/** Where a copy of this app must call home. Hardcoded so a rehost cannot point it elsewhere. */
export const BEACON_URL = 'https://pseudocode-compiler.sherlemious.com/api/deployment-notice';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);

function normalizeHost(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  let host = value.trim().toLowerCase();
  if (!host || host.length > 253 || /[\s/\\]/.test(host)) return null;
  if (host.startsWith('[') && host.endsWith(']')) host = host.slice(1, -1);
  if (host.endsWith('.')) host = host.slice(0, -1);
  return host || null;
}

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return normalizeHost(new URL(value).hostname);
  } catch {
    return null;
  }
}

/** Your own site, and a machine running it for the person sitting at it. */
export function isOfficialHost(host: string): boolean {
  if (LOCAL_HOSTS.has(host)) return true;
  return host === 'sherlemious.com' || host.endsWith('.sherlemious.com');
}

function isIpv4(host: string): boolean {
  const parts = host.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isIpv6(host: string): boolean {
  return host.includes(':') && /^[0-9a-f:]+$/.test(host) && host.length <= 45;
}

function isDnsName(host: string): boolean {
  if (!/^[a-z0-9.-]+$/.test(host) || host.includes('..')) return false;
  const labels = host.split('.');
  return labels.every((label) => label.length > 0 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label));
}

function isPlausibleHost(host: string): boolean {
  return isIpv4(host) || isIpv6(host) || isDnsName(host);
}

/**
 * Hostname to report, or null when this page should stay quiet.
 * `originUrl` is the page's real origin. It must name the same host as `pageHost`,
 * so a request cannot claim some other site.
 */
export function hostToReport(pageHost: unknown, originUrl: string | null): string | null {
  const host = normalizeHost(pageHost);
  const originHost = hostOf(originUrl);
  if (!host || !originHost || host !== originHost) return null;
  if (isOfficialHost(host) || !isPlausibleHost(host)) return null;
  return host;
}
