import { unstable_cache } from 'next/cache';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';
import {
  ADMIN_FEEDBACK_CACHE_TAG,
  ADMIN_FEEDBACK_REVALIDATE_SECONDS,
  FEEDBACK_PAGE_SIZE,
  type FeedbackListItem,
} from './feedbackQuery';

export type FeedbackPageData = {
  items: FeedbackListItem[];
  total: number;
  page: number;
  pageCount: number;
  avgRating: number | null;
};

const TIERS = new Set(['low', 'mid', 'high']);

function whereFor(rating: number, tier: string): Prisma.FeedbackSubmissionWhereInput {
  return {
    ...(rating >= 1 && rating <= 5 ? { rating } : {}),
    ...(TIERS.has(tier) ? { tier } : {}),
  };
}

/**
 * One cached read per page + filter. Arguments are part of the cache key.
 * `rating` 0 and `tier` '' mean "no filter" so the key stays a pair of primitives.
 * Dates are strings because a Date does not survive the cache round-trip.
 */
async function loadFeedbackPage(page: number, rating: number, tier: string): Promise<FeedbackPageData> {
  const where = whereFor(rating, tier);
  const [total, agg, rows] = await Promise.all([
    prisma.feedbackSubmission.count({ where }),
    prisma.feedbackSubmission.aggregate({ where, _avg: { rating: true } }),
    prisma.feedbackSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * FEEDBACK_PAGE_SIZE,
      take: FEEDBACK_PAGE_SIZE,
      select: {
        id: true,
        email: true,
        rating: true,
        tier: true,
        tags: true,
        comment: true,
        createdAt: true,
      },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / FEEDBACK_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  return {
    items: safePage === page
      ? rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }))
      : [],
    total,
    page: safePage,
    pageCount,
    avgRating: agg._avg.rating,
  };
}

export const getFeedbackPage = unstable_cache(loadFeedbackPage, [ADMIN_FEEDBACK_CACHE_TAG], {
  revalidate: ADMIN_FEEDBACK_REVALIDATE_SECONDS,
  tags: [ADMIN_FEEDBACK_CACHE_TAG],
});
