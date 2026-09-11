/**
 * One-time **student passes** — non-recurring purchases that grant premium
 * student access for a fixed number of months, then expire (no auto-renewal).
 *
 * Unlike the teacher subscription tiers (which live in the `PricingTier` table),
 * passes are one-time Paddle prices with a duration, so their catalog lives here
 * in code. The billing webhook reads this on `transaction.completed` to set
 * `User.planExpiresAt`; a daily sweep resets expired passes to Free.
 *
 * Fill the `pri_…` IDs once the one-time prices are created in Paddle. Until then
 * `passForPriceId` returns null and pass purchases are safely ignored.
 */
export interface PassDef {
  /** How many months of access the pass grants. */
  months: number;
  /** Marketing slug recorded on `User.planTier` for display. */
  tier: string;
  /** Short label for the pricing UI. */
  label: string;
}

/** Paddle one-time price ID → pass definition, per environment. */
export const PASS_PRICES: Record<'sandbox' | 'production', Record<string, PassDef>> = {
  sandbox: {
    // 'pri_xxx_1month': { months: 1, tier: 'student', label: '1-month pass' },
    // 'pri_xxx_6month': { months: 6, tier: 'student', label: '6-month pass' },
  },
  production: {
    // 'pri_xxx_1month': { months: 1, tier: 'student', label: '1-month pass' },
    // 'pri_xxx_6month': { months: 6, tier: 'student', label: '6-month pass' },
  },
};

/** Resolve a Paddle price ID to a pass definition (null if it isn't a pass). */
export function passForPriceId(priceId: string, paddleEnv: string): PassDef | null {
  if (!priceId) return null;
  const env = paddleEnv === 'production' ? 'production' : 'sandbox';
  return PASS_PRICES[env][priceId] ?? null;
}

/** Access-expiry date for a pass of `months`, counting from `from`. */
export function passExpiry(months: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setMonth(d.getMonth() + months);
  return d;
}
