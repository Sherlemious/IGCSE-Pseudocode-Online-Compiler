/**
 * A class assignment's due date is a calendar day (stored as UTC midnight of
 * that day). It ends at 23:59:59.999 in the timezone of the teacher who set
 * it, so a teacher in Shanghai gets the end of their own day, not 08:00 the
 * next morning. A null or unknown zone falls back to UTC, which is how every
 * due date set before the zone was recorded behaves.
 */

export function isValidTimeZone(zone: unknown): zone is string {
  if (typeof zone !== 'string' || zone.length === 0 || zone.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** Offset of `zone` from UTC at `instant`, in ms (positive east of Greenwich). */
function zoneOffsetMs(instant: number, zone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(instant / 1000) * 1000;
}

/** The last millisecond of the due date's calendar day in the teacher's zone. */
export function endOfDueDay(dueDate: Date, timeZone?: string | null): Date {
  const wallClock = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate(), 23, 59, 59, 999);
  if (!timeZone || !isValidTimeZone(timeZone)) return new Date(wallClock);
  // Two passes settle the offset on days when the clocks change.
  let instant = wallClock - zoneOffsetMs(wallClock, timeZone);
  instant = wallClock - zoneOffsetMs(instant, timeZone);
  return new Date(instant);
}

/** The browser's IANA zone, sent with a due date so the cut-off is the teacher's own midnight. */
export function browserTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}
