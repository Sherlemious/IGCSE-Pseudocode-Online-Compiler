import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getPaddleEnv } from '@/lib/paddle/env';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import PaddleProvider from '@/components/pricing/PaddleProvider';
import PricingClient, { type PricingTierView } from '@/components/pricing/PricingClient';

// Tier rows are the same for everyone in a given Paddle env and only change on a
// reseed, so cache them across requests instead of hitting Neon per page view.
// The page stays dynamic (country + auth are per-request); only this read is cached.
// Revalidate hourly, or bust immediately with revalidateTag('pricing-tiers').
const getPricingTiers = unstable_cache(
  (env: string) =>
    prisma.pricingTier.findMany({
      where: { paddleEnv: env, active: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        slug: true,
        name: true,
        description: true,
        features: true,
        monthPriceId: true,
        yearPriceId: true,
        contactOnly: true,
      },
    }),
  ['pricing-tiers'],
  { revalidate: 3600, tags: ['pricing-tiers'] },
);

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

// The single student-facing tier; everything else is teacher/school.
const STUDENT_SLUGS = new Set(['student']);
const isStudentTier = (slug: string) => STUDENT_SLUGS.has(slug);

type PricingView = 'all' | 'student' | 'teacher';

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const paddleEnv = getPaddleEnv();

  const [{ view: viewParam }, hdrs, session, tiers] = await Promise.all([
    searchParams,
    headers(),
    auth(),
    getPricingTiers(paddleEnv),
  ]);

  // Vercel sets this to an ISO 3166-1 alpha-2 code. Absent off-Vercel (e.g. local
  // dev) — leave it undefined so Paddle geo-locates by IP instead.
  const countryCode = hdrs.get('x-vercel-ip-country') ?? undefined;
  const customerEmail = session?.user?.email ?? undefined;

  // Show plans relevant to who's viewing: students see the student plan, teachers
  // the teacher/school plans, signed-out visitors everything. An explicit ?view=
  // (from the "switch plans" link) overrides the role-derived default.
  const role = session?.user?.role;
  const defaultView: PricingView = !session
    ? 'all'
    : role === 'STUDENT'
      ? 'student'
      : 'teacher';
  const view: PricingView =
    viewParam === 'student' || viewParam === 'teacher' || viewParam === 'all'
      ? viewParam
      : defaultView;

  const visibleTiers =
    view === 'all'
      ? tiers
      : view === 'student'
        ? tiers.filter((t) => isStudentTier(t.slug))
        : tiers.filter((t) => !isStudentTier(t.slug));

  const hasStudentTier = tiers.some((t) => isStudentTier(t.slug));
  const hasTeacherTier = tiers.some((t) => !isStudentTier(t.slug));
  const switchTo =
    view === 'student' && hasTeacherTier
      ? { href: '/pricing?view=teacher', label: 'Teaching a class? See teacher plans →' }
      : view === 'teacher' && hasStudentTier
        ? { href: '/pricing?view=student', label: 'Just want the student plan? →' }
        : null;

  const tierViews: PricingTierView[] = visibleTiers.map((t) => ({
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
          <p className="mx-auto mt-3 max-w-2xl text-sm text-light-text/90 leading-relaxed">
            The {SITE_NAME} lets students write, run, and practice Cambridge pseudocode
            in the browser — with instant output, trace tables, and timed exam practice.
            Paid plans add classes, assignments, and autograding for teachers.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-dark-text leading-relaxed">
            Prices are shown in your local currency. Switch between monthly and yearly billing —
            you&apos;ll see the exact amount before you pay.
          </p>
        </div>

        {switchTo && (
          <div className="mb-8 -mt-2 text-center">
            <Link
              href={switchTo.href}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {switchTo.label}
            </Link>
          </div>
        )}

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
              appUserId={session?.user?.id}
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
