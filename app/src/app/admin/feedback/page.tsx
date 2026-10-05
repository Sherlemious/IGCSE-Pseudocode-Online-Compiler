import { redirect } from 'next/navigation';
import { AdminPager } from '../_components/AdminPager';
import ScrollMain from '../_components/ScrollMain';
import { ChipRow, EmptyState, AdminPageHeader, FilterLink } from '../_components/adminUi';
import { formatAdminNumber } from '../_components/adminFormat';
import FeedbackTable from './_components/FeedbackTable';
import { feedbackHref, FEEDBACK_PAGE_SIZE, parseFeedbackQuery } from './feedbackQuery';
import { getFeedbackPage } from './loadFeedback';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Feedback' };

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; rating?: string; tier?: string }>;
}) {
  const query = parseFeedbackQuery(await searchParams);
  const data = await getFeedbackPage(query.page, query.rating ?? 0, query.tier ?? '');
  if (data.page !== query.page) {
    redirect(feedbackHref({ page: data.page, rating: query.rating, tier: query.tier }));
  }

  const avg = data.avgRating == null ? '—' : data.avgRating.toFixed(1);
  const filtered = query.rating != null || query.tier != null;
  const noun = data.total === 1 ? 'submission' : 'submissions';
  const start = data.total === 0 ? 0 : (data.page - 1) * FEEDBACK_PAGE_SIZE + 1;
  const end = Math.min(data.page * FEEDBACK_PAGE_SIZE, data.total);

  return (
    <div className="space-y-5 max-w-6xl">
      <ScrollMain token={`${data.page}:${query.rating ?? ''}:${query.tier ?? ''}`} />
      <AdminPageHeader
        title="Feedback"
        description={
          filtered
            ? `${formatAdminNumber(data.total)} ${noun} ${data.total === 1 ? 'matches' : 'match'} · avg rating ${avg}`
            : `${formatAdminNumber(data.total)} ${noun} · avg rating ${avg}`
        }
      />

      <FeedbackFilters rating={query.rating} tier={query.tier} />

      {data.items.length === 0 ? (
        <EmptyState>
          {filtered ? 'No submissions match the current filters.' : 'No feedback yet.'}
        </EmptyState>
      ) : (
        <FeedbackTable submissions={data.items} />
      )}

      <AdminPager
        label="Feedback pages"
        page={data.page}
        pageCount={data.pageCount}
        start={start}
        end={end}
        total={data.total}
        hrefFor={(page) => feedbackHref({ page, rating: query.rating, tier: query.tier })}
      />
    </div>
  );
}

function FeedbackFilters({
  rating,
  tier,
}: {
  rating: number | null;
  tier: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ChipRow label="Rating">
        <FilterLink href={feedbackHref({ rating: null, tier })} active={rating == null}>
          All
        </FilterLink>
        {[1, 2, 3, 4, 5].map((value) => (
          <FilterLink
            key={value}
            href={feedbackHref({ rating: value, tier })}
            active={rating === value}
          >
            {value}
          </FilterLink>
        ))}
      </ChipRow>
      <ChipRow label="Tier">
        <FilterLink href={feedbackHref({ rating, tier: null })} active={tier == null}>
          All
        </FilterLink>
        {['low', 'mid', 'high'].map((value) => (
          <FilterLink
            key={value}
            href={feedbackHref({ rating, tier: value })}
            active={tier === value}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </FilterLink>
        ))}
      </ChipRow>
    </div>
  );
}
