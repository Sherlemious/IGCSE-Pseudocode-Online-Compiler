import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/shared/db';
import { auth } from '@/modules/auth/auth';
import { getPaddleEnv } from '@/modules/billing/paddle/env';
import { planBadge } from '@/modules/billing/planDisplay';
import { SITE_URL, SITE_NAME } from '@/shared/lib/seo';
import PaddleProvider from '@/modules/billing/PaddleProvider';
import PricingClient, {
  type PricingTierView,
  type StudentPassView,
} from '@/modules/billing/PricingClient';
import { displayTier, TIER_COPY } from '@/modules/billing/tierCopy';
import {
  expiryForPurchase,
  priceIdForPass,
  visiblePasses,
} from '@/modules/billing/paddle/passes';

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
    'Teacher plans priced by student capacity, plus one-time May/June and Oct/Nov session passes for students.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing',
    description:
      'Teacher plans priced by student capacity, plus one-time student session passes.',
    url: `${SITE_URL}/pricing`,
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

const STUDENT_SLUGS = new Set(['student', 'student-month', 'student-may-june', 'student-oct-nov']);

const UPCOMING_BANDS: Array<{
  slug: string;
  listUsdMonth: number;
  listUsdYear: number;
}> = [
  { slug: 'department', listUsdMonth: 39, listUsdYear: 390 },
  { slug: 'school', listUsdMonth: 89, listUsdYear: 890 },
];

type PricingView = 'all' | 'student' | 'teacher';

function passDescription(kind: string): { description: string; features: string[] } {
  if (kind === 'may_june') {
    return {
      description: 'Sit the May/June series. One payment, no auto-renew.',
      features: [
        'Full practice + exam library until 30 June',
        'Unlimited saved solutions',
        'Personal progress analytics',
        'Does not auto-renew',
      ],
    };
  }
  if (kind === 'oct_nov') {
    return {
      description: 'Sit the Oct/Nov series. One payment, no auto-renew.',
      features: [
        'Full practice + exam library until 30 November',
        'Unlimited saved solutions',
        'Personal progress analytics',
        'Does not auto-renew',
      ],
    };
  }
  return {
    description: 'Short top-up. Stacks with time you already have.',
    features: [
      'One extra month of the full library',
      'Unlimited saved solutions',
      'Stacks onto an active pass',
    ],
  };
}

function mergeTeacherTiers(
  rows: Array<{
    slug: string;
    name: string;
    description: string;
    features: string[];
    monthPriceId: string;
    yearPriceId: string;
    contactOnly: boolean;
  }>,
): PricingTierView[] {
  const teacherRows = rows.filter((t) => !STUDENT_SLUGS.has(t.slug));
  const views: PricingTierView[] = teacherRows.map((t) => {
    const copy = displayTier(t);
    return {
      slug: t.slug,
      name: copy.name,
      description: copy.description,
      features: copy.features,
      monthPriceId: t.monthPriceId,
      yearPriceId: t.yearPriceId,
      contactOnly: t.contactOnly,
    };
  });
  const have = new Set(views.map((t) => t.slug));
  const extras: PricingTierView[] = [];
  for (const band of UPCOMING_BANDS) {
    if (have.has(band.slug)) continue;
    const copy = TIER_COPY[band.slug];
    extras.push({
      slug: band.slug,
      name: copy.name,
      description: copy.description,
      features: copy.features,
      monthPriceId: '',
      yearPriceId: '',
      contactOnly: false,
      listUsdMonth: band.listUsdMonth,
      listUsdYear: band.listUsdYear,
    });
  }
  const anchor = views.findIndex((t) => t.slug === 'pro' || t.slug === 'classroom');
  if (anchor >= 0) views.splice(anchor + 1, 0, ...extras);
  else views.push(...extras);
  return views;
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const paddleEnv = getPaddleEnv();
  const now = new Date();

  const [{ view: viewParam }, hdrs, session, tiers] = await Promise.all([
    searchParams,
    headers(),
    auth(),
    getPricingTiers(paddleEnv),
  ]);

  const countryCode = hdrs.get('x-vercel-ip-country') ?? undefined;
  const customerEmail = session?.user?.email ?? undefined;

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          plan: true,
          planTier: true,
          paddleCustomerId: true,
          planExpiresAt: true,
          legacyCapacity: true,
          role: true,
        },
      })
    : null;
  const currentTier = dbUser?.planTier ?? null;
  const canManageBilling = Boolean(dbUser?.paddleCustomerId) && dbUser?.plan !== 'STUDENT';
  const currentPlanLabel = currentTier
    ? planBadge({
        plan: dbUser?.plan,
        planTier: currentTier,
        legacyCapacity: dbUser?.legacyCapacity,
        planExpiresAt: dbUser?.planExpiresAt,
      }).label
    : null;
  const passActiveUntil =
    dbUser?.planExpiresAt && dbUser.planExpiresAt.getTime() > Date.now()
      ? dbUser.planExpiresAt.toISOString()
      : null;

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

  const teacherTiers = mergeTeacherTiers(tiers);
  const showTeachers = view === 'all' || view === 'teacher';
  const showPasses = view === 'all' || view === 'student';
  const viewerIsTeacher = role === 'TEACHER';

  const month = now.getUTCMonth();
  const mayJuneUp = visiblePasses(now).some((p) => p.kind === 'may_june');
  const octNovUp = visiblePasses(now).some((p) => p.kind === 'oct_nov');
  // Academic-year default is May/June. In June–August the next sitting is Oct/Nov.
  const featuredKind: 'may_june' | 'oct_nov' | undefined =
    month >= 5 && month <= 7 && octNovUp ? 'oct_nov' : mayJuneUp ? 'may_june' : octNovUp ? 'oct_nov' : undefined;

  const studentPassViews: StudentPassView[] = visiblePasses(now).map((pass) => {
    const copy = passDescription(pass.kind);
    return {
      slug: pass.tier,
      name: pass.label,
      description: copy.description,
      features: copy.features,
      priceId: priceIdForPass(pass, paddleEnv),
      listUsd: pass.listUsd,
      wasUsd: pass.wasUsd,
      discountPct: pass.discountPct,
      coversUntil: expiryForPurchase(pass, { now }).toISOString(),
      featured: pass.kind === featuredKind,
    };
  });

  const switchTo =
    view === 'student' && teacherTiers.length
      ? { href: '/pricing?view=teacher', label: 'Teaching a class? See teacher plans →' }
      : view === 'teacher'
        ? { href: '/pricing?view=student', label: 'Just want a student session pass? →' }
        : null;

  const empty = (showTeachers ? teacherTiers.length === 0 : true) && (showPasses ? studentPassViews.length === 0 : true);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="mono-label text-primary mb-3">Plans</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">
            {view === 'student'
              ? 'Student session passes'
              : view === 'teacher'
                ? 'Plans for teachers'
                : 'Plans for students and teachers'}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-light-text/90 leading-relaxed">
            {view === 'student' ? (
              <>
                Buy the exam series you&apos;re sitting — May/June (from September) or Oct/Nov
                (from June). One payment, no subscription. The {SITE_NAME} editor stays free; a
                pass unlocks the full practice and exam library until the series ends. See how
                this compares on the{' '}
                <Link href="/compare" className="text-primary hover:text-primary-hover">
                  comparison page
                </Link>
                .
              </>
            ) : (
              <>
                Teacher plans are priced by how many students you teach in total. Create a class,
                share the join link, and every student on your roster gets the library — they
                don&apos;t buy a pass. If you already subscribe, your current limits stay as they
                are.
              </>
            )}
          </p>
          {view !== 'student' && (
            <p className="mx-auto mt-2 max-w-xl text-sm text-dark-text leading-relaxed">
              Teacher prices are shown in your local currency. Switch between monthly and yearly
              billing — you&apos;ll see the exact amount before you pay. Yearly is about two
              months free.
            </p>
          )}
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

        {empty ? (
          <div className="rounded-2xl border border-border bg-surface/80 p-8 text-center text-sm text-dark-text">
            Pricing is being finalized — please check back soon.
          </div>
        ) : (
          <PaddleProvider>
            <PricingClient
              teacherTiers={teacherTiers}
              studentPasses={studentPassViews}
              showTeachers={showTeachers}
              showPasses={showPasses}
              viewerIsTeacher={viewerIsTeacher}
              countryCode={countryCode}
              customerEmail={customerEmail}
              appUserId={session?.user?.id}
              currentTier={currentTier}
              currentPlanLabel={currentPlanLabel}
              passActiveUntil={passActiveUntil}
              canManageBilling={canManageBilling}
              paddleEnv={paddleEnv}
              featuredSlug="pro"
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
