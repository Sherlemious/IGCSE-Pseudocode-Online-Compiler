'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { usePaddle } from './PaddleProvider';
import { hasRegionalPricing } from './ppp';
import { SUPPORT_EMAIL } from '@/shared/lib/seo';
import {
  LIMITS,
  TEACHER_SLIDER_MAX,
  TEACHER_SLIDER_MIN,
  findTierView,
  formatCap,
  teacherBandForStudents,
} from './limits';

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

function CapacityStats({ maxClasses, maxStudents }: { maxClasses: number; maxStudents: number }) {
  const classLabel = !Number.isFinite(maxClasses) || maxClasses === 1 ? 'class' : 'classes';
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-border bg-background/50 px-3 py-3">
        <p className="text-2xl font-bold tracking-tight text-light-text">{formatCap(maxClasses)}</p>
        <p className="mt-0.5 text-xs text-dark-text">{classLabel}</p>
      </div>
      <div className="rounded-xl border border-border bg-background/50 px-3 py-3">
        <p className="text-2xl font-bold tracking-tight text-light-text">{formatCap(maxStudents)}</p>
        <p className="mt-0.5 text-xs text-dark-text">students in total</p>
      </div>
    </div>
  );
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
}) {
  const paddle = usePaddle();
  const ph = usePostHog();
  const [interval, setInterval] = useState<Interval>('month');
  const [totals, setTotals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedCountry, setResolvedCountry] = useState<string | undefined>(countryCode);
  const [seats, setSeats] = useState(LIMITS.classroom.maxStudentsTotal);

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
      audience: showTeachers && !showPasses ? 'teacher' : showPasses && !showTeachers ? 'student' : 'all',
    });
  }, [ph, paddleEnv, teacherTiers.length, studentPasses.length, countryCode, customerEmail, showTeachers, showPasses]);

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

  const sessionPasses = studentPasses.filter((p) => p.slug !== 'student-month');
  const monthPass = studentPasses.find((p) => p.slug === 'student-month');
  const passGridClass =
    sessionPasses.length <= 1
      ? 'mx-auto grid max-w-md grid-cols-1 gap-6'
      : 'mx-auto grid max-w-3xl gap-6 sm:grid-cols-2';

  const starter = findTierView(teacherTiers, ['starter']);
  const band = teacherBandForStudents(seats);
  const selected = findTierView(teacherTiers, band.slugs);
  const selectedLimits = LIMITS[band.tier];
  const seatLabel = seats >= TEACHER_SLIDER_MAX ? '750+' : String(seats);

  const renderPassCard = (pass: StudentPassView, compact = false) => {
    const total = pass.priceId ? totals[pass.priceId] : undefined;
    const isCurrent = Boolean(currentTier) && pass.slug === currentTier;
    const canBuy = Boolean(paddle) && Boolean(pass.priceId) && !viewerIsTeacher && !isCurrent;
    const price = (
      <>
        {loading && pass.priceId && total === undefined ? (
          <span className="inline-block h-8 w-24 animate-pulse rounded bg-border/60" />
        ) : (
          <>
            <span className={compact ? 'text-xl font-bold tracking-tight text-light-text' : 'text-3xl font-bold tracking-tight text-light-text'}>
              {total ?? usd(pass.listUsd)}
            </span>
            {pass.discountPct > 0 && (
              <span className="text-sm text-dark-text line-through">{usd(pass.wasUsd)}</span>
            )}
          </>
        )}
      </>
    );
    const cta = isCurrent ? (
      <button
        type="button"
        disabled
        className="cursor-default rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary opacity-70"
      >
        Current pass
      </button>
    ) : viewerIsTeacher ? (
      <p className="text-center text-xs text-dark-text">Student checkout only</p>
    ) : canBuy ? (
      <button
        type="button"
        onClick={() => openCheckout({ slug: pass.slug, priceId: pass.priceId, interval: 'pass' })}
        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
          pass.featured || compact
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
        className="cursor-not-allowed rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-dark-text opacity-70"
      >
        {pass.priceId ? 'Loading…' : 'Available soon'}
      </button>
    );

    if (compact) {
      return (
        <div
          key={pass.slug}
          className={`flex flex-col gap-3 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
            isCurrent ? 'border-primary bg-surface ring-1 ring-primary/50' : 'border-border bg-surface/80'
          }`}
        >
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-light-text">{pass.name}</h3>
            <p className="mt-0.5 text-sm text-dark-text">{pass.description}</p>
          </div>
          <div className="flex flex-none items-center gap-3">
            <div className="flex items-baseline gap-2">{price}</div>
            <div className="min-w-[7.5rem]">{cta}</div>
          </div>
        </div>
      );
    }

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
        <div className="mt-5 flex items-baseline gap-2">{price}</div>
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
        <div className="mt-6">{cta}</div>
      </div>
    );
  };

  const renderTeacherCta = (tier: PricingTierView, matchSlugs: readonly string[], featured: boolean) => {
    const priceId = interval === 'month' ? tier.monthPriceId : tier.yearPriceId;
    const isCurrent = Boolean(currentTier) && matchSlugs.includes(currentTier);
    if (tier.contactOnly) {
      return (
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
            `Pseudocode Compiler — ${tier.name} plan enquiry`,
          )}`}
          onClick={() => ph?.capture('contact_sales_clicked', { tier: tier.slug, paddle_env: paddleEnv })}
          className="mt-6 block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Contact me
        </a>
      );
    }
    if (isCurrent) {
      return (
        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-default rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary opacity-70"
        >
          Current plan
        </button>
      );
    }
    if (canManageBilling) {
      return (
        <a
          href="/api/paddle/portal"
          className="mt-6 block w-full rounded-lg border border-primary/40 px-4 py-2.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Change plan
        </a>
      );
    }
    if (priceId && paddle) {
      return (
        <button
          type="button"
          onClick={() => openCheckout({ slug: tier.slug, priceId, interval })}
          className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
            featured
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'border border-primary/40 text-primary hover:bg-primary/10'
          }`}
        >
          {tier.slug === 'starter' ? 'Start with Starter' : `Subscribe to ${tier.name}`}
        </button>
      );
    }
    return (
      <button
        type="button"
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-dark-text opacity-70"
      >
        {priceId ? 'Loading…' : 'Available soon'}
      </button>
    );
  };

  const renderTeacherPrice = (tier: PricingTierView) => {
    const priceId = interval === 'month' ? tier.monthPriceId : tier.yearPriceId;
    const total = priceId ? totals[priceId] : undefined;
    const listFallback = interval === 'month' ? tier.listUsdMonth : tier.listUsdYear;
    if (tier.contactOnly) {
      return <span className="text-3xl font-bold tracking-tight text-light-text">Let&apos;s talk</span>;
    }
    if (loading && priceId && total === undefined) {
      return <span className="inline-block h-8 w-24 animate-pulse rounded bg-border/60" />;
    }
    return (
      <>
        <span className="text-3xl font-bold tracking-tight text-light-text">
          {total ?? (listFallback != null ? usd(listFallback) : '—')}
        </span>
        <span className="text-sm text-dark-text">/{intervalLabel}</span>
      </>
    );
  };

  return (
    <div>
      {currentPlanLabel && (
        <div className="mb-6 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 text-center sm:flex-row sm:gap-3">
          <span className="text-sm text-light-text">
            You&apos;re on{' '}
            <span className="font-semibold text-primary">{currentPlanLabel}</span>
            {passActiveUntil ? <> until {formatUntil(passActiveUntil)}.</> : '.'}
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
        <section>
          {viewerIsTeacher && (
            <p className="mb-4 text-center text-sm text-dark-text">
              Session passes are for students only. Your classes stay on a teacher plan.
            </p>
          )}
          <div className={passGridClass}>{sessionPasses.map((pass) => renderPassCard(pass))}</div>
          {monthPass && <div className="mx-auto mt-6 max-w-3xl">{renderPassCard(monthPass, true)}</div>}
        </section>
      )}

      {showTeachers && (
        <section className={`mx-auto grid max-w-4xl gap-6 ${starter ? 'lg:grid-cols-2' : ''}`}>
          {starter && (
            <div
              className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm ${
                currentTier === 'starter'
                  ? 'border-primary bg-surface shadow-intense ring-1 ring-primary/50'
                  : 'border-border bg-surface/80'
              }`}
            >
              {currentTier === 'starter' && (
                <span className="absolute -top-3 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Current plan
                </span>
              )}
              <h2 className="text-lg font-semibold text-light-text">{starter.name}</h2>
              <p className="mt-1 text-sm text-dark-text">{starter.description}</p>
              <div className="mt-5 flex items-baseline gap-1">{renderTeacherPrice(starter)}</div>
              <CapacityStats
                maxClasses={LIMITS.starter.maxClasses}
                maxStudents={LIMITS.starter.maxStudentsTotal}
              />
              <p className="mt-4 text-sm text-dark-text">
                Students on your roster get the library — they don&apos;t pay.
              </p>
              {renderTeacherCta(starter, ['starter'], false)}
            </div>
          )}

          <div className="relative flex flex-col rounded-2xl border border-primary/60 bg-surface p-6 shadow-intense backdrop-blur-sm">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              Need more seats
            </span>
            <h2 className="text-lg font-semibold text-light-text">How many students?</h2>
            <p className="mt-1 text-sm text-dark-text">
              Drag to match your roster. We&apos;ll show the plan, class cap, and price.
            </p>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-3">
                <p className="text-4xl font-bold tracking-tight text-light-text">{seatLabel}</p>
                <p className="pb-1 text-sm text-dark-text">students</p>
              </div>
              <input
                type="range"
                min={TEACHER_SLIDER_MIN}
                max={TEACHER_SLIDER_MAX}
                step={1}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                aria-label="Number of students"
                aria-valuetext={`${seatLabel} students, ${selected?.name ?? band.tier} plan, ${formatCap(selectedLimits.maxClasses)} classes`}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    [LIMITS.classroom.maxStudentsTotal, '90'],
                    [LIMITS.department.maxStudentsTotal, '250'],
                    [LIMITS.school.maxStudentsTotal, '750'],
                    [TEACHER_SLIDER_MAX, '750+'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSeats(value)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      seats === value
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-border text-dark-text hover:text-light-text'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {selected ? (
              <>
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">{selected.name}</p>
                  <p className="mt-1 text-sm text-dark-text">{selected.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">{renderTeacherPrice(selected)}</div>
                  <CapacityStats
                    maxClasses={selectedLimits.maxClasses}
                    maxStudents={selectedLimits.maxStudentsTotal}
                  />
                </div>
                {renderTeacherCta(selected, band.slugs, true)}
              </>
            ) : (
              <p className="mt-6 text-sm text-dark-text">That plan is being finalized — please check back soon.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
