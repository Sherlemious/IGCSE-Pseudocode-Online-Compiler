/** Rows per admin page. The old list stopped at 200 and dropped everything older. */
export const FEEDBACK_PAGE_SIZE = 50;

/** Shared with the feedback POST handler so a new submission drops this cache. */
export const ADMIN_FEEDBACK_CACHE_TAG = 'admin-feedback';

/**
 * Same window as the analytics dashboard: Neon stays billable for 5 minutes
 * after a query, so an uncached refresh on every admin visit keeps the compute
 * awake. A new submission also busts the tag, so the list is not stuck for the
 * whole window.
 */
export const ADMIN_FEEDBACK_REVALIDATE_SECONDS = 300;

const TIERS = ['low', 'mid', 'high'] as const;

export type FeedbackListItem = {
  id: string;
  email: string | null;
  rating: number;
  tier: string;
  tags: string[];
  comment: string | null;
  createdAt: string;
};
const MAX_PAGE = 10_000;

export type FeedbackQuery = {
  page: number;
  rating: number | null;
  tier: (typeof TIERS)[number] | null;
};

export function parseFeedbackQuery(raw: {
  page?: string;
  rating?: string;
  tier?: string;
}): FeedbackQuery {
  const pageNum = Number(raw.page);
  const ratingNum = Number(raw.rating);
  const tier = TIERS.find((t) => t === raw.tier) ?? null;
  return {
    page: Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= MAX_PAGE ? pageNum : 1,
    rating: Number.isInteger(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? ratingNum : null,
    tier,
  };
}

/** Page 1 and "all" filters stay off the query string so the default URL is stable. */
export function feedbackHref(query: {
  page?: number;
  rating?: number | null;
  tier?: string | null;
}): string {
  const params = new URLSearchParams();
  if (query.rating != null) params.set('rating', String(query.rating));
  if (query.tier) params.set('tier', query.tier);
  if (query.page != null && query.page > 1) params.set('page', String(query.page));
  const search = params.toString();
  return search ? `/admin/feedback?${search}` : '/admin/feedback';
}
