import { prisma } from '@/lib/prisma';
import { Users, MessageSquare, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Overview' };

export default async function AdminOverviewPage() {
  const [userCount, feedbackCount, examCount, recentFeedback] =
    await Promise.all([
      prisma.user.count(),
      prisma.feedbackSubmission.count(),
      prisma.examAttempt.count(),
      prisma.feedbackSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, rating: true, tier: true, email: true, comment: true, createdAt: true },
      }),
    ]);

  const stats = [
    { label: 'Total users',    value: userCount,     icon: Users,         color: 'text-primary' },
    { label: 'Feedback items', value: feedbackCount, icon: MessageSquare, color: 'text-success' },
    { label: 'Exam attempts',  value: examCount,     icon: BookOpen,      color: 'text-warning' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-light-text">Overview</h1>
        <p className="text-sm text-dark-text mt-1">Platform activity at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-5">
            <div className={`mb-3 ${color}`}><Icon size={18} /></div>
            <p className="text-2xl font-bold text-light-text">{value.toLocaleString()}</p>
            <p className="text-xs text-dark-text mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent feedback */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden max-w-lg">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-light-text">Recent feedback</h2>
        </div>
        <div className="divide-y divide-border">
          {recentFeedback.length === 0 && (
            <p className="px-5 py-4 text-sm text-dark-text">No feedback yet.</p>
          )}
          {recentFeedback.map((f) => (
            <div key={f.id} className="px-5 py-3 flex items-start gap-3">
              <span className={`mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded border ${ratingColor(f.rating)}`}>
                {f.rating}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-dark-text truncate">{f.email ?? 'Anonymous'}</p>
                {f.comment && <p className="text-xs text-light-text/70 truncate mt-0.5">{f.comment}</p>}
              </div>
              <span className="ml-auto text-[10px] text-dark-text/60 shrink-0">
                {new Date(f.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ratingColor(r: number) {
  if (r <= 2) return 'text-error border-error/40 bg-error/10';
  if (r === 3) return 'text-warning border-warning/40 bg-warning/10';
  return 'text-success border-success/40 bg-success/10';
}
