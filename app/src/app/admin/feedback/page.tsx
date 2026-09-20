import { prisma } from '@/shared/db';
import { AdminPageHeader } from '../_components/adminUi';
import FeedbackTable from './_components/FeedbackTable';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Feedback' };

export default async function AdminFeedbackPage() {
  const submissions = await prisma.feedbackSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const avgRating = submissions.length
    ? (submissions.reduce((s, f) => s + f.rating, 0) / submissions.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-5 max-w-6xl">
      <AdminPageHeader
        title="Feedback"
        description={`${submissions.length} submission${submissions.length !== 1 ? 's' : ''} · avg rating ${avgRating}`}
      />

      <FeedbackTable submissions={submissions} />
    </div>
  );
}
