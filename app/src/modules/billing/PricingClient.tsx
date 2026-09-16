'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { usePaddle } from './PaddleProvider';
import { hasRegionalPricing } from './ppp';
import { SUPPORT_EMAIL } from '@/shared/lib/seo';

export interface PricingTierView {
  slug: string;
  name: string;
  description: string;
  features: string[];
  monthPriceId: string;
  yearPriceId: string;
  contactOnly: boolean;
  /** Shown when Paddle IDs are not seeded yet. */
  listUsdMonth?: number;
  listUsdYear?: number;
}

export interface StudentPassView {
  slug: string;
  name: string;
  description: string;
  features: string[];
  priceId: string;
  listUsd: number;
  wasUsd: number;
  discountPct: number;
  coversUntil: string;
  featured: boolean;
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

function formatUntil(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function usd(n: number): string {
  return `$${n}`;
}

export default function PricingClient({
  teacherTiers,
  studentPasses,
  showTeachers,
  showPasses,
  viewerIsTeacher,
  countryCode,
  customerEmail,
  appUserId,
  currentTier,
  currentPlanLabel,
  passActiveUntil,
  canManageBilling,
  paddleEnv,
  featuredSlug = 'pro',
}: {
  teacherTiers: PricingTierView[];
  studentPasses: StudentPassView[];
  showTeachers: boolean;
  showPasses: boolean;
  viewerIsTeacher: boolean;
  countryCode?: string;
  customerEmail?: string;
  appUserId?: string;
  currentTier?: string | null;
  currentPlanLabel?: string | null;
  passActiveUntil?: string | null;
  canManageBilling?: boolean;
  paddleEnv: string;
  featuredSlug?: string;
}) {
  const paddle = usePaddle();
  const ph = usePostHog();
  const [interval, setInterval] = useState<Interval>('month');
  const [totals, setTotals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedCountry, setResolvedCountry] = useState<string | undefined>(countryCode);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (!ph || viewedRef.current) return;
    viewedRef.current = true;
    ph.capture('pricing_viewed', {
      paddle_env: paddleEnv,
      tier_count: teacherTiers.length,
      pass_count: studentPasses.length,
      country: countryCode ?? null,
      signed_in: Boolean(customerEmail),
    });
  }, [ph, paddleEnv, teacherTiers.length, studentPasses.length, countryCode, customerEmail]);

  const allPriceIds = useMemo(() => {
    const ids: string[] = [];
    if (showTeachers) {
      for (const t of teacherTiers) {
        if (!t.contactOnly) {
          if (t.monthPriceId) ids.push(t.monthPriceId);
          if (t.yearPriceId) ids.push(t.yearPriceId);
        }
      }
    }
    if (showPasses) {
      for (const p of studentPasses) {
        if (p.priceId) ids.push(p.priceId);
      }
    }
    return ids;
  }, [showTeachers, showPasses, teacherTiers, studentPasses]);

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
        const resolved = preview.data.address?.countryCode ?? countryCode;
        setResolvedCountry(resolved);
        ph?.capture('pricing_prices_loaded', {
          paddle_env: paddleEnv,
          country: countryCode ?? null,
          resolved_country: preview.data.address?.countryCode ?? null,
          regional_pricing: hasRegionalPricing(resolved),
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

  const openCheckout = (opts: {
    slug: string;
    priceId: string;
    interval: Interval | 'pass';
  }) => {
    if (!paddle || !opts.priceId) return;
    ph?.capture(opts.interval === 'pass' ? 'pass_clicked' : 'subscribe_clicked', {
      tier: opts.slug,
      interval: opts.interval,
      price_id: opts.priceId,
      paddle_env: paddleEnv,
    });
    paddle.Checkout.open({
      items: [{ priceId: opts.priceId, quantity: 1 }],
      ...(customerEmail ? { customer: { email: customerEmail } } : {}),
      ...(appUserId ? { customData: { app_user_id: appUserId } } : {}),
      settings: {
        displayMode: 'overlay',
        variant: 'one-page',
        successUrl: `${window.location.origin}/welcome`,
      },
    });
  };

  const intervalLabel = interval === 'month' ? 'mo' : 'yr';
  const regional = hasRegionalPricing(resolvedCountry);
  const regionName =
    regional && resolvedCountry
      ? (() => {
          try {
            return new Intl.DisplayNames(['en'], { type: 'region' }).of(resolvedCountry) ?? null;
          } catch {
            return null;
          }
        })()
      : null;

  const teacherCount = teacherTiers.length;
  const teacherGridClass =
    teacherCount === 1
      ? 'mx-auto grid max-w-sm grid-cols-1 gap-6'
      : teacherCount === 2
        ? 'mx-auto grid max-w-3xl gap-6 sm:grid-cols-2'
        : teacherCount === 3
          ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';

  const passGridClass =
    studentPasses.length <= 2
      ? 'mx-auto grid max-w-3xl gap-6 sm:grid-cols-2'
      : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div>
      {currentPlanLabel && (
        <div className="mb-6 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 text-center sm:flex-row sm:gap-3">
          <span className="text-sm text-light-text">
            You&apos;re on{' '}
            <span className="font-semibold text-primary">{currentPlanLabel}</span>
            {passActiveUntil ? (
              <>
                {' '}
                until {formatUntil(passActiveUntil)}.
              </>
            ) : (
              '.'
            )}
          </span>
          {canManageBilling && !passActiveUntil && (
            <a
              href="/api/paddle/portal"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Manage subscription →
            </a>
          )}
        </div>
      )}

      {showTeachers && (
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
      )}

      {regional && (
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span aria-hidden="true">🌍</span>
            {regionName
              ? `Regional pricing for ${regionName} — adjusted for your area`
              : 'Regional pricing applied for your area'}
          </span>
        </div>
      )}

      {error && (
        <p className="mb-6 text-center text-sm text-error" role="alert">
          {error}
        </p>
      )}

      {showPasses && (
        <section className={showTeachers ? 'mb-14' : undefined}>
          {showTeachers && (
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-light-text">For students</h2>
              <p className="mt-1 text-sm text-dark-text">
                One-time session passes. No auto-renew. Teachers buy a class plan instead.
              </p>
            </div>
          )}
          {viewerIsTeacher && (
            <p className="mb-4 text-center text-sm text-dark-text">
              Session passes are for students only. Your classes stay on a teacher plan.
            </p>
          )}
          <div className={passGridClass}>
            {studentPasses.map((pass) => {
              const total = pass.priceId ? totals[pass.priceId] : undefined;
              const isCurrent = Boolean(currentTier) && pass.slug === currentTier;
              const canBuy =
                Boolean(paddle) && Boolean(pass.priceId) && !viewerIsTeacher && !isCurrent;
              return (
                <div
                  key={pass.slug}
                  className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm ${
                    isCurrent
                      ? 'border-primary bg-surface shadow-intense ring-1 ring-primary/50'
                      : pass.featured
                        ? 'border-primary/60 bg-surface shadow-intense'
                        : 'border-border bg-surface/80'
                  }`}
                >
                  {isCurrent ? (
                    <span className="absolute -top-3 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Current pass
                    </span>
                  ) : (
                    pass.featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                        This series
                      </span>
                    )
                  )}
                  <h2 className="text-lg font-semibold text-light-text">{pass.name}</h2>
                  <p className="mt-1 text-sm text-dark-text">{pass.description}</p>
                  <div className="mt-5 flex items-baseline gap-2">
                    {loading && pass.priceId && total === undefined ? (
                      <span className="inline-block h-8 w-24 animate-pulse rounded bg-border/60" />
                    ) : (
                      <>
                        <span className="text-3xl font-bold tracking-tight text-light-text">
                          {total ?? usd(pass.listUsd)}
                        </span>
                        {pass.discountPct > 0 && (
                          <span className="text-sm text-dark-text line-through">{usd(pass.wasUsd)}</span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-dark-text">
                    One-time · covers until {formatUntil(pass.coversUntil)}
                    {pass.discountPct > 0 ? ` · ${pass.discountPct}% off monthly` : ''}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {pass.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm text-dark-text">
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="mt-6 w-full cursor-default rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary opacity-70"
                    >
                      Current pass
                    </button>
                  ) : viewerIsTeacher ? (
                    <p className="mt-6 text-center text-xs text-dark-text">Student checkout only</p>
                  ) : canBuy ? (
                    <button
                      type="button"
                      onClick={() =>
                        openCheckout({ slug: pass.slug, priceId: pass.priceId, interval: 'pass' })
                      }
                      className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                        pass.featured
                          ? 'bg-primary text-white hover:bg-primary-hover'
                          : 'border border-primary/40 text-primary hover:bg-primary/10'
                      }`}
                    >
                      Buy pass
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-6 w-full cursor-not-allowed rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-dark-text opacity-70"
                    >
                      {pass.priceId ? 'Loading…' : 'Available soon'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {showTeachers && (
        <section>
          {showPasses && (
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-light-text">For teachers</h2>
              <p className="mt-1 text-sm text-dark-text">
                Priced by total student capacity. Existing teachers keep the limits they already have.
              </p>
            </div>
          )}
          <div className={teacherGridClass}>
            {teacherTiers.map((tier) => {
              const priceId = interval === 'month' ? tier.monthPriceId : tier.yearPriceId;
              const total = priceId ? totals[priceId] : undefined;
              const listFallback =
                interval === 'month' ? tier.listUsdMonth : tier.listUsdYear;
              const featured = tier.slug === featuredSlug;
              const isCurrent = Boolean(currentTier) && tier.slug === currentTier;
              return (
                <div
                  key={tier.slug}
                  className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm ${
                    isCurrent
                      ? 'border-primary bg-surface shadow-intense ring-1 ring-primary/50'
                      : featured
                        ? 'border-primary/60 bg-surface shadow-intense'
                        : 'border-border bg-surface/80'
                  }`}
                >
                  {isCurrent ? (
                    <span className="absolute -top-3 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Current plan
                    </span>
                  ) : (
                    featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                        Most popular
                      </span>
                    )
                  )}

                  <h2 className="text-lg font-semibold text-light-text">{tier.name}</h2>
                  <p className="mt-1 text-sm text-dark-text">{tier.description}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    {tier.contactOnly ? (
                      <span className="text-3xl font-bold tracking-tight text-light-text">
                        Let&apos;s talk
                      </span>
                    ) : loading && priceId && total === undefined ? (
                      <span className="inline-block h-8 w-24 animate-pulse rounded bg-border/60" />
                    ) : (
                      <>
                        <span className="text-3xl font-bold tracking-tight text-light-text">
                          {total ?? (listFallback != null ? usd(listFallback) : '—')}
                        </span>
                        {!tier.contactOnly && (
                          <span className="text-sm text-dark-text">/{intervalLabel}</span>
                        )}
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
                      href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
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
                  ) : isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="mt-6 w-full cursor-default rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary opacity-70"
                    >
                      Current plan
                    </button>
                  ) : canManageBilling ? (
                    <a
                      href="/api/paddle/portal"
                      className="mt-6 block w-full rounded-lg border border-primary/40 px-4 py-2.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                    >
                      Change plan
                    </a>
                  ) : priceId && paddle ? (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => openCheckout({ slug: tier.slug, priceId, interval })}
                        className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                          featured
                            ? 'bg-primary text-white hover:bg-primary-hover'
                            : 'border border-primary/40 text-primary hover:bg-primary/10'
                        }`}
                      >
                        {tier.slug === 'starter' ? 'Start with Starter' : `Subscribe to ${tier.name}`}
                      </button>
                      {tier.slug === 'starter' && (
                        <p className="mt-2 text-center text-[11px] leading-relaxed text-dark-text/80">
                          Up to 30 students in total get the full practice library — they don&apos;t pay.
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-6 w-full cursor-not-allowed rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-dark-text opacity-70"
                    >
                      {priceId ? 'Loading…' : 'Available soon'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
