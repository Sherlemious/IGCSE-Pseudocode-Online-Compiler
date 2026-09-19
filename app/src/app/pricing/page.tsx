import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/shared/db';
import { getPaddleEnv } from '@/modules/billing/paddle/env';
import { SITE_URL } from '@/shared/lib/seo';
import PricingPageClient from '@/modules/billing/PricingPageClient';
import { type PricingTierView, type StudentMonthlyView, type StudentPassView } from '@/modules/billing/PricingClient';
import { displayTier, TIER_COPY } from '@/modules/billing/tierCopy';
import {
  expiryForPurchase,
  MONTH_PASS_USD,
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
  ['pricing-tiers', 'student-2usd'],
  { revalidate: 3600, tags: ['pricing-tiers'] },
);

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Student monthly access at $2, optional exam-series passes, and teacher plans priced by how many students you teach.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing',
    description:
      'Teacher plans priced by student capacity, plus a $2/month student plan and exam-series passes.',
    url: `${SITE_URL}/pricing`,
    type: 'website',
  },
};

export const revalidate = 3600;

const STUDENT_SLUGS = new Set(['student', 'student-month', 'student-may-june', 'student-oct-nov']);

const UPCOMING_BANDS: Array<{
  slug: string;
  listUsdMonth: number;
  listUsdYear: number;
}> = [
  { slug: 'department', listUsdMonth: 39, listUsdYear: 390 },
  { slug: 'school', listUsdMonth: 89, listUsdYear: 890 },
];

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
    description: 'Sit this exam series. One payment, no auto-renew.',
    features: [
      'Full practice + exam library until the series ends',
      'Unlimited saved solutions',
      'Personal progress analytics',
      'Does not auto-renew',
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

export default async function PricingPage() {
  const paddleEnv = getPaddleEnv();
  const now = new Date();
  const tiers = await getPricingTiers(paddleEnv);

  const month = now.getUTCMonth();
  const mayJuneUp = visiblePasses(now).some((p) => p.kind === 'may_june');
  const octNovUp = visiblePasses(now).some((p) => p.kind === 'oct_nov');
  const featuredKind: 'may_june' | 'oct_nov' | undefined =
    month >= 5 && month <= 7 && octNovUp ? 'oct_nov' : mayJuneUp ? 'may_june' : octNovUp ? 'oct_nov' : undefined;

  const studentPasses: StudentPassView[] = visiblePasses(now)
    .filter((pass): pass is typeof pass & { kind: 'may_june' | 'oct_nov' } => pass.kind !== 'month')
    .map((pass) => {
      const copy = passDescription(pass.kind);
      return {
        slug: pass.tier,
        kind: pass.kind,
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

  const studentRow = tiers.find((t) => t.slug === 'student');
  const studentCopy = TIER_COPY.student;
  const studentMonthly: StudentMonthlyView | null = {
    slug: 'student',
    name: studentCopy.name,
    description: studentCopy.description,
    features: studentCopy.features,
    monthPriceId: studentRow?.monthPriceId ?? '',
    listUsdMonth: MONTH_PASS_USD,
  };

  return (
    <PricingPageClient
      teacherTiers={mergeTeacherTiers(tiers)}
      studentMonthly={studentMonthly}
      studentPasses={studentPasses}
      paddleEnv={paddleEnv}
    />
  );
}
