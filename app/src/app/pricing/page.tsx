import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getPaddleEnv } from '@/lib/paddle/env';
import { SITE_URL } from '@/lib/seo';
import PaddleProvider from '@/components/pricing/PaddleProvider';
import PricingClient, { type PricingTierView } from '@/components/pricing/PricingClient';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Plans for the Cambridge IGCSE & A Level Pseudocode Compiler — pick Starter, Pro, or Advanced, billed monthly or yearly.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing',
    description:
      'Plans for the Cambridge IGCSE & A Level Pseudocode Compiler — Starter, Pro, or Advanced.',
    url: `${SITE_URL}/pricing`,
    type: 'website',
  },
};

// Rendered per request: prices are localized by the visitor's country and the
// checkout email is prefilled from the session — both are request-specific.
export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const paddleEnv = getPaddleEnv();

  const [hdrs, session, tiers] = await Promise.all([
    headers(),
    auth(),
    prisma.pricingTier.findMany({
      where: { paddleEnv, active: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  // Vercel sets this to an ISO 3166-1 alpha-2 code. Absent off-Vercel (e.g. local
  // dev) — leave it undefined so Paddle geo-locates by IP instead.
  const countryCode = hdrs.get('x-vercel-ip-country') ?? undefined;
  const customerEmail = session?.user?.email ?? undefined;

  const tierViews: PricingTierView[] = tiers.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    features: t.features,
    monthPriceId: t.monthPriceId,
    yearPriceId: t.yearPriceId,
    contactOnly: t.contactOnly,
  }));

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="mono-label text-primary mb-3">Plans</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">
            Choose your plan
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dark-text leading-relaxed">
            Prices are shown in your local currency. Switch between monthly and yearly billing —
            you&apos;ll see the exact amount before you pay.
          </p>
        </div>

        {tierViews.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/80 p-8 text-center text-sm text-dark-text">
            Pricing is being finalized — please check back soon.
          </div>
        ) : (
          <PaddleProvider>
            <PricingClient
              tiers={tierViews}
              countryCode={countryCode}
              customerEmail={customerEmail}
              paddleEnv={paddleEnv}
            />
          </PaddleProvider>
        )}

        <p className="mt-8 text-center text-sm text-dark-text">
          Payments are processed by Paddle. See the{' '}
          <Link href="/refund" className="text-primary hover:text-primary-hover transition-colors font-medium">
            Refund Policy
          </Link>{' '}
          for cancellations and refunds.
        </p>
      </div>
    </div>
  );
}
