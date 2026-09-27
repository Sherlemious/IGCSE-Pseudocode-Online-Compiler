/**
 * Purchasing-power / regional pricing — **student prices only**. Teacher plans
 * have no overrides: schools already charge enough to pay list price.
 *
 * Paddle is the source of truth for the actual amounts: set lower **per-country
 * price overrides** on each Price in the Paddle dashboard (target ≈ 40% below the
 * USD list price for these markets). The pricing page already calls
 * `PricePreview({ address: { countryCode } })` and renders whatever Paddle
 * returns, so the reduced prices show automatically — no amounts live here.
 *
 * This list exists ONLY so the funnel can be segmented in analytics
 * (`regional_pricing` on `pricing_prices_loaded`); the page shows no badge. Keep
 * it in sync with the countries you actually configured overrides for in Paddle.
 *
 * Seeded from the top-of-funnel geography (PostHog, Sep 2026): South & SE Asia,
 * plus Egypt. The Maldives was dropped (Sep 2026): upper-middle income, pays list.
 */
export const PPP_COUNTRIES: ReadonlySet<string> = new Set([
  // South Asia
  'IN', // India
  'PK', // Pakistan
  'BD', // Bangladesh
  'LK', // Sri Lanka
  'NP', // Nepal
  // South-East Asia
  'TH', // Thailand
  'VN', // Vietnam
  'ID', // Indonesia
  'PH', // Philippines
  'MM', // Myanmar
  'KH', // Cambodia
  'LA', // Laos
  // Middle East & North Africa
  'EG', // Egypt
]);

/** True when this ISO 3166-1 alpha-2 country has regional pricing configured. */
export function hasRegionalPricing(country?: string | null): boolean {
  return !!country && PPP_COUNTRIES.has(country.toUpperCase());
}
