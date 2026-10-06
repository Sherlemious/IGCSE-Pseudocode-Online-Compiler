/**
 * Student-only one-time **session** passes. Teachers never see these, and the
 * billing webhook refuses to apply a pass to a teacher role or a teacher
 * subscription. The $2/mo Student plan is a recurring subscription (PricingTier
 * slug `student`), not a pass.
 *
 * Session passes have a fixed exam-series end date (not N months from purchase).
 * Visibility is by UTC calendar month:
 *   Oct/Nov   — shown June through November, then it disappears
 *   May/June  — shown September through May; gone once June starts
 *
 * List USD is 33% off the $2/mo rate for the window length (May/June = 10 months
 * from September, Oct/Nov = 6 months from June). Paddle is the source of truth
 * at checkout once price IDs are filled.
 *
 * A leftover 1-month **one-time** SKU stays in `PASS_PRICES` so purchases that
 * already happened still grant time; it is no longer listed on /pricing.
 */

export const MONTH_PASS_USD = 2;
export const SESSION_DISCOUNT = 0.33;

function sessionPrice(months: number): { wasUsd: number; listUsd: number; discountPct: number } {
  const wasUsd = months * MONTH_PASS_USD;
  const listUsd = Math.round(wasUsd * (1 - SESSION_DISCOUNT));
  return { wasUsd, listUsd, discountPct: Math.round(SESSION_DISCOUNT * 100) };
}

const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);
const THREE_DECIMAL = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);

function minorFactor(currency: string): number {
  const code = currency.toUpperCase();
  if (ZERO_DECIMAL.has(code)) return 1;
  if (THREE_DECIMAL.has(code)) return 1000;
  return 100;
}

/** Paddle `totals.total` is a minor-unit integer string (`"899"` → 8.99 USD). */
export function amountFromPaddleTotal(total: string, currency: string): number | null {
  if (!total || !currency) return null;
  if (total.includes('.')) {
    const major = Number(total);
    return Number.isFinite(major) ? major : null;
  }
  if (!/^-?\d+$/.test(total)) return null;
  const factor = minorFactor(currency);
  const digits = factor === 1 ? 0 : factor === 1000 ? 3 : 2;
  return Number((Number(total) / factor).toFixed(digits));
}

export function formatMajor(amount: number, currency: string): string {
  const code = currency.toUpperCase();
  const max = THREE_DECIMAL.has(code) ? 3 : ZERO_DECIMAL.has(code) ? 0 : 2;
  const rounded = Number(amount.toFixed(max));
  const whole = Math.abs(rounded - Math.trunc(rounded)) < 1e-8;
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: whole ? 0 : max,
    maximumFractionDigits: whole ? 0 : max,
  }).format(rounded);
}

/**
 * Strike price and “% off monthly” from the monthly and session amounts the
 * buyer is actually shown. Months is the window length (May/June 10, Oct/Nov 6).
 * Returns null when the pass is not cheaper than paying monthly.
 */
export function compareToMonthly(input: {
  monthlyAmount: number;
  passAmount: number;
  months: number;
}): { wasAmount: number; discountPct: number } | null {
  const { monthlyAmount, passAmount, months } = input;
  if (!(monthlyAmount > 0) || !(passAmount >= 0) || !Number.isInteger(months) || months <= 0) return null;
  const wasAmount = monthlyAmount * months;
  if (!(wasAmount > passAmount)) return null;
  return { wasAmount, discountPct: Math.round((1 - passAmount / wasAmount) * 100) };
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

export const MONTH_PASS: PassDef = {
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

export const PASS_CATALOG: readonly PassDef[] = [MAY_JUNE, OCT_NOV];

/** Paddle one-time price ID → pass definition, per environment. */
export const PASS_PRICES: Record<'sandbox' | 'production', Record<string, PassDef>> = {
  // Created 2026-09-16 via the paddle-sandbox MCP (see docs/paddle-catalog.md).
  sandbox: {
    pri_01m2nqdbxe4nmfpzqcn1gnv1x4: MONTH_PASS,
    pri_01m2nqdc16zf8vpt5gb9wdntc9: MAY_JUNE,
    pri_01m2nqdc50e62nk65nkcvcpkbp: OCT_NOV,
  },
  // Created 2026-09-16 via the paddle-live MCP, mirroring the sandbox passes.
  production: {
    pri_01m2nqt7289natscexm33zy7pa: MONTH_PASS,
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
 * The old 1-month one-time SKU is no longer listed.
 */
export function isPassVisible(kind: PassKind, now: Date = new Date()): boolean {
  if (kind === 'month') return false;
  const m = utcMonth(now);
  if (kind === 'may_june') return m >= 8 || m <= 4;
  return m >= 5 && m <= 10;
}

export function visiblePasses(now: Date = new Date()): PassDef[] {
  return PASS_CATALOG.filter((p) => isPassVisible(p.kind, now));
}

/**
 * Which session pass to lead with. June–August the Oct/Nov series is the one
 * in progress. Every other month May/June is on sale, and it is the longer
 * grant, so it wins over a still-visible Oct/Nov pass.
 */
export function featuredPassKind(now: Date = new Date()): Exclude<PassKind, 'month'> | null {
  const month = utcMonth(now);
  const mayJuneUp = isPassVisible('may_june', now);
  const octNovUp = isPassVisible('oct_nov', now);
  if (month >= 5 && month <= 7 && octNovUp) return 'oct_nov';
  if (mayJuneUp) return 'may_june';
  if (octNovUp) return 'oct_nov';
  return null;
}

export function featuredPass(now: Date = new Date()): PassDef | null {
  const kind = featuredPassKind(now);
  if (!kind) return null;
  return PASS_CATALOG.find((p) => p.kind === kind) ?? null;
}

/** `?checkout=` slug for student hand-offs. The featured pass while one is on sale. */
export function studentCheckoutSlug(now: Date = new Date()): string {
  return featuredPass(now)?.tier ?? 'student';
}

export function studentCheckoutHref(from: string, now: Date = new Date()): string {
  const params = new URLSearchParams({
    view: 'student',
    checkout: studentCheckoutSlug(now),
    from,
  });
  return `/pricing?${params.toString()}`;
}

/** Button label for a student hand-off that opens checkout. */
export function studentCheckoutLabel(now: Date = new Date()): string {
  const kind = featuredPassKind(now);
  if (kind === 'may_june') return 'Get the May/June pass';
  if (kind === 'oct_nov') return 'Get the Oct/Nov pass';
  return 'Unlock with the Student plan';
}

/** Closing sentence on the Learn paywall. Names the one-time pass while it is on sale. */
export function studentUnlockPitch(now: Date = new Date()): string {
  const kind = featuredPassKind(now);
  if (kind === 'may_june') {
    return 'Unlock them with one payment through 30 June, or join a class from a teacher who has a plan.';
  }
  if (kind === 'oct_nov') {
    return 'Unlock them with one payment through 30 November, or join a class from a teacher who has a plan.';
  }
  return 'Unlock them with the Student plan, or join a class from a teacher who has one.';
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
