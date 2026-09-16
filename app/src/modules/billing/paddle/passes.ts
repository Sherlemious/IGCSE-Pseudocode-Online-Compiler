/**
 * Student-only one-time passes. Teachers never see these, and the billing
 * webhook refuses to apply a pass to a teacher role or a teacher subscription.
 *
 * Session passes have a fixed exam-series end date (not N months from purchase).
 * Visibility is by UTC calendar month:
 *   Oct/Nov   — shown June through November, then it disappears
 *   May/June  — shown September through May; gone once June starts
 * 1-month     — always shown (short top-up)
 *
 * List USD is 33% off the $2/mo rate for the window length (May/June = 10 months
 * from September, Oct/Nov = 6 months from June). Paddle is the source of truth
 * at checkout once price IDs are filled.
 *
 * Fill the `pri_…` IDs once the one-time prices exist. Until then
 * `passForPriceId` returns null and purchases are ignored.
 */

export const MONTH_PASS_USD = 2;
export const SESSION_DISCOUNT = 0.33;

function sessionPrice(months: number): { wasUsd: number; listUsd: number; discountPct: number } {
  const wasUsd = months * MONTH_PASS_USD;
  const listUsd = Math.round(wasUsd * (1 - SESSION_DISCOUNT));
  return { wasUsd, listUsd, discountPct: Math.round(SESSION_DISCOUNT * 100) };
}

export type PassKind = 'month' | 'may_june' | 'oct_nov';

export interface PassDef {
  kind: PassKind;
  /** Marketing slug recorded on `User.planTier`. */
  tier: string;
  label: string;
  /** USD list price before Paddle localization. */
  listUsd: number;
  /** Undiscounted window price (months × $2), for strike-through copy. */
  wasUsd: number;
  discountPct: number;
}

const MONTH: PassDef = {
  kind: 'month',
  tier: 'student-month',
  label: '1-month pass',
  listUsd: MONTH_PASS_USD,
  wasUsd: MONTH_PASS_USD,
  discountPct: 0,
};

const MAY_JUNE: PassDef = {
  kind: 'may_june',
  tier: 'student-may-june',
  label: 'May/June session',
  ...sessionPrice(10),
};

const OCT_NOV: PassDef = {
  kind: 'oct_nov',
  tier: 'student-oct-nov',
  label: 'Oct/Nov session',
  ...sessionPrice(6),
};

export const PASS_CATALOG: readonly PassDef[] = [MAY_JUNE, OCT_NOV, MONTH];

/** Paddle one-time price ID → pass definition, per environment. */
export const PASS_PRICES: Record<'sandbox' | 'production', Record<string, PassDef>> = {
  // Created 2026-09-16 via the paddle-sandbox MCP (see docs/paddle-catalog.md).
  sandbox: {
    pri_01m2nqdbxe4nmfpzqcn1gnv1x4: MONTH,
    pri_01m2nqdc16zf8vpt5gb9wdntc9: MAY_JUNE,
    pri_01m2nqdc50e62nk65nkcvcpkbp: OCT_NOV,
  },
  // Created 2026-09-16 via the paddle-live MCP, mirroring the sandbox passes.
  production: {
    pri_01m2nqt7289natscexm33zy7pa: MONTH,
    pri_01m2nqt7729dg9w1gxmmtcj42p: MAY_JUNE,
    pri_01m2nqt7bgw87v9svw5brqe9my: OCT_NOV,
  },
};

export function passForPriceId(priceId: string, paddleEnv: string): PassDef | null {
  if (!priceId) return null;
  const env = paddleEnv === 'production' ? 'production' : 'sandbox';
  return PASS_PRICES[env][priceId] ?? null;
}

export function priceIdForPass(pass: PassDef, paddleEnv: string): string {
  const env = paddleEnv === 'production' ? 'production' : 'sandbox';
  for (const [id, def] of Object.entries(PASS_PRICES[env])) {
    if (def.kind === pass.kind) return id;
  }
  return '';
}

/** UTC month 0–11. Session windows are defined on the UTC calendar. */
function utcMonth(d: Date): number {
  return d.getUTCMonth();
}

function utcYear(d: Date): number {
  return d.getUTCFullYear();
}

function endOfUtcDay(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day, 23, 59, 59, 999));
}

/**
 * Oct/Nov: June–November. May/June: September–May (hidden in June–August).
 * The 1-month top-up is always listed.
 */
export function isPassVisible(kind: PassKind, now: Date = new Date()): boolean {
  if (kind === 'month') return true;
  const m = utcMonth(now);
  if (kind === 'may_june') return m >= 8 || m <= 4;
  return m >= 5 && m <= 10;
}

export function visiblePasses(now: Date = new Date()): PassDef[] {
  return PASS_CATALOG.filter((p) => isPassVisible(p.kind, now));
}

/** Calendar end of the exam series this purchase covers. */
export function seriesEnd(kind: Exclude<PassKind, 'month'>, now: Date = new Date()): Date {
  const m = utcMonth(now);
  const y = utcYear(now);
  if (kind === 'may_june') {
    // Sep–Dec → next calendar year's June; Jan–Jun → this June.
    const examYear = m >= 8 ? y + 1 : y;
    return endOfUtcDay(examYear, 5, 30);
  }
  // Jun–Nov → this November; Dec → next November; Jan–May → this November.
  const examYear = m === 11 ? y + 1 : y;
  return endOfUtcDay(examYear, 10, 30);
}

export function addCalendarMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

/**
 * Access-expiry for a purchase. Session passes end on the series date (buying
 * late does not extend past the exams). A 1-month pass stacks from remaining
 * time. Buying a session pass while another pass is active takes the later of
 * the two dates — it never shortens an existing grant.
 */
export function expiryForPurchase(
  pass: PassDef,
  opts: { now?: Date; existingExpiresAt?: Date | null } = {},
): Date {
  const now = opts.now ?? new Date();
  const remaining =
    opts.existingExpiresAt && opts.existingExpiresAt.getTime() > now.getTime()
      ? opts.existingExpiresAt
      : null;

  if (pass.kind === 'month') {
    return addCalendarMonths(remaining ?? now, 1);
  }

  const end = seriesEnd(pass.kind, now);
  if (remaining && remaining.getTime() > end.getTime()) return remaining;
  return end;
}

export function isTeacherPlan(plan: string | null | undefined): boolean {
  return plan === 'STARTER' || plan === 'PRO' || plan === 'SCHOOL';
}
