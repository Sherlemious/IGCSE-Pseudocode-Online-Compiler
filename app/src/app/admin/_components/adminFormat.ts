/**
 * Date/number formatting for admin pages. Admin tables render on the server
 * (UTC, en-US) and hydrate in the browser (Cairo, the owner's locale), so
 * locale-default `toLocaleString()` produced different text and React error
 * #418. These helpers pin the time zone and build the string from numeric
 * parts only, so server and browser output is identical regardless of ICU
 * version. Plain module (no 'use client') so server pages can use it too.
 */
export const ADMIN_TIME_ZONE = 'Africa/Cairo';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: ADMIN_TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

type DateInput = Date | string | number | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value == null || value === '') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function cairoParts(d: Date) {
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(partsFormatter.formatToParts(d).find((p) => p.type === type)?.value ?? 0);
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour') % 24, minute: get('minute') };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** `26 Sep 2026, 14:05` (or `26 Sep` when compact), in Cairo time. */
export function formatAdminDate(value: DateInput, compact = false): string {
  const d = toDate(value);
  if (!d) return '—';
  const p = cairoParts(d);
  const day = `${p.day} ${MONTHS[p.month - 1]}`;
  return compact ? day : `${day} ${p.year}, ${pad(p.hour)}:${pad(p.minute)}`;
}

/** `26 Sep 2026`, in Cairo time. */
export function formatAdminDay(value: DateInput): string {
  const d = toDate(value);
  if (!d) return '—';
  const p = cairoParts(d);
  return `${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
}

/** Thousands separated with commas, independent of locale. */
export function formatAdminNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const [int, frac] = String(Math.abs(value)).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${value < 0 ? '-' : ''}${grouped}${frac ? `.${frac}` : ''}`;
}

/** `5m ago`, `3h ago`, `2d ago`, else a date. Depends on "now" — render via <RelativeTime>. */
export function formatRelative(value: DateInput, now = Date.now()): string {
  const d = toDate(value);
  if (!d) return '—';
  const mins = Math.round((now - d.getTime()) / 60_000);
  if (Math.abs(mins) < 1) return 'just now';
  if (Math.abs(mins) < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return `${days}d ago`;
  return formatAdminDay(d);
}
