import { prisma } from '@/lib/prisma';
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
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end gap-6">
        <div>
          <h1 className="text-2xl font-bold text-light-text">Feedback</h1>
          <p className="text-sm text-dark-text mt-1">{submissions.length} submission{submissions.length !== 1 ? 's' : ''} · avg rating {avgRating}</p>
        </div>
      </div>

      <FeedbackTable submissions={submissions} />
    </div>
  );
}
