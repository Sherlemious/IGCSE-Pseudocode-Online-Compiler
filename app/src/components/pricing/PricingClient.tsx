'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { usePaddle } from './PaddleProvider';

// Contact-sales tiers link here instead of opening checkout.
const CONTACT_EMAIL = 'abd.moh.yousef@gmail.com';

export interface PricingTierView {
  slug: string;
  name: string;
  description: string;
  features: string[];
  monthPriceId: string;
  yearPriceId: string;
  contactOnly: boolean;
}

type Interval = 'month' | 'year';

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 h-4 w-4 flex-none text-primary"
      aria-hidden="true"
    >
      <path
        d="M5 10.5l3.2 3.2L15 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingClient({
  tiers,
  countryCode,
  customerEmail,
  paddleEnv,
}: {
  tiers: PricingTierView[];
  countryCode?: string;
  customerEmail?: string;
  paddleEnv: string;
}) {
  const paddle = usePaddle();
  const ph = usePostHog();
  const [interval, setInterval] = useState<Interval>('month');
  // Paddle's already-formatted total string, keyed by price ID. We never format
  // or do math on prices ourselves — we display exactly what Paddle returns.
  const [totals, setTotals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funnel entry — fire once, as soon as PostHog is available.
  const viewedRef = useRef(false);
  useEffect(() => {
    if (!ph || viewedRef.current) return;
    viewedRef.current = true;
    ph.capture('pricing_viewed', {
      paddle_env: paddleEnv,
      tier_count: tiers.length,
      country: countryCode ?? null,
      signed_in: Boolean(customerEmail),
    });
  }, [ph, paddleEnv, tiers.length, countryCode, customerEmail]);

  // Contact-only tiers have no self-serve price, so they're excluded from preview.
  const allPriceIds = useMemo(
    () =>
      tiers
        .filter((t) => !t.contactOnly)
        .flatMap((t) => [t.monthPriceId, t.yearPriceId])
        .filter(Boolean),
    [tiers],
  );

  useEffect(() => {
    if (!paddle) return;
    if (allPriceIds.length === 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    paddle
      .PricePreview({
        items: allPriceIds.map((priceId) => ({ priceId, quantity: 1 })),
        // Only send a real ISO country. When we don't have one, omit `address`
        // entirely so Paddle geo-locates by the visitor's IP. Never pass an
        // app-side "unknown" sentinel to Paddle as a country code.
        ...(countryCode ? { address: { countryCode } } : {}),
      })
      .then((preview) => {
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const item of preview.data.details.lineItems) {
          next[item.price.id] = item.formattedTotals.total;
        }
        setTotals(next);
        setLoading(false);
        ph?.capture('pricing_prices_loaded', {
          paddle_env: paddleEnv,
          country: countryCode ?? null,
          // What Paddle actually localized to — set even when we passed no
          // country and it geo-located by IP.
          resolved_country: preview.data.address?.countryCode ?? null,
          price_count: allPriceIds.length,
          priced_count: Object.keys(next).length,
          currency: preview.data.currencyCode,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[paddle] PricePreview failed', err);
        setError('Could not load prices right now. Please try again shortly.');
        setLoading(false);
        ph?.capture('pricing_prices_error', {
          paddle_env: paddleEnv,
          country: countryCode ?? null,
          error: err instanceof Error ? err.message : String(err),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [paddle, allPriceIds, countryCode, ph, paddleEnv]);

  const openCheckout = (tier: PricingTierView, priceId: string) => {
    if (!paddle) return;
    ph?.capture('subscribe_clicked', {
      tier: tier.slug,
      interval,
      price_id: priceId,
      paddle_env: paddleEnv,
    });
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      // Prefill the email for signed-in users so they don't retype it.
      ...(customerEmail ? { customer: { email: customerEmail } } : {}),
      settings: {
        displayMode: 'overlay',
        variant: 'one-page',
        // Same-origin works for localhost (sandbox) and the live domain alike.
        successUrl: `${window.location.origin}/welcome`,
      },
    });
  };

  const intervalLabel = interval === 'month' ? 'mo' : 'yr';

  return (
    <div>
      {/* Billing interval toggle */}
      <div className="mb-8 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing interval"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/80 p-1"
        >
          {(['month', 'year'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={interval === value}
              onClick={() => {
                setInterval(value);
                ph?.capture('pricing_interval_changed', { interval: value, paddle_env: paddleEnv });
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                interval === value
                  ? 'bg-primary text-white'
                  : 'text-dark-text hover:text-light-text'
              }`}
            >
              {value === 'month' ? 'Monthly' : 'Yearly'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-6 text-center text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const priceId = interval === 'month' ? tier.monthPriceId : tier.yearPriceId;
          const total = totals[priceId];
          const featured = tier.slug === 'pro'; // "Most popular"
          return (
            <div
              key={tier.slug}
              className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm ${
                featured
                  ? 'border-primary/60 bg-surface shadow-intense'
                  : 'border-border bg-surface/80'
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}

              <h2 className="text-lg font-semibold text-light-text">{tier.name}</h2>
              <p className="mt-1 text-sm text-dark-text">{tier.description}</p>

              <div className="mt-5 flex items-baseline gap-1">
                {tier.contactOnly ? (
                  <span className="text-3xl font-bold tracking-tight text-light-text">
                    Let&apos;s talk
                  </span>
                ) : loading || total === undefined ? (
                  <span className="inline-block h-8 w-24 animate-pulse rounded bg-border/60" />
                ) : (
                  <>
                    <span className="text-3xl font-bold tracking-tight text-light-text">
                      {total}
                    </span>
                    <span className="text-sm text-dark-text">/{intervalLabel}</span>
                  </>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-dark-text">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.contactOnly ? (
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    `Pseudocode Compiler — ${tier.name} plan enquiry`,
                  )}`}
                  onClick={() =>
                    ph?.capture('contact_sales_clicked', { tier: tier.slug, paddle_env: paddleEnv })
                  }
                  className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    featured
                      ? 'bg-primary text-white hover:bg-primary-hover'
                      : 'border border-primary/40 text-primary hover:bg-primary/10'
                  }`}
                >
                  Contact me
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => openCheckout(tier, priceId)}
                  disabled={!paddle}
                  className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    featured
                      ? 'bg-primary text-white hover:bg-primary-hover'
                      : 'border border-primary/40 text-primary hover:bg-primary/10'
                  }`}
                >
                  {paddle ? `Subscribe to ${tier.name}` : 'Loading…'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
