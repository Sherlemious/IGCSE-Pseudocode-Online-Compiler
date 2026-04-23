import { prisma } from '@/lib/prisma';
import ErrorsView from './_components/ErrorsView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Errors' };

export default async function AdminErrorsPage() {
  const [recent, grouped] = await Promise.all([
    prisma.errorLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 300,
    }),
    prisma.errorLog.groupBy({
      by: ['errorMessage', 'errorType'],
      _count: { _all: true },
      orderBy: { _count: { errorMessage: 'desc' } },
      take: 30,
    }),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-light-text">Errors</h1>
        <p className="text-sm text-dark-text mt-1">{recent.length} recent entries · {grouped.length} unique messages</p>
      </div>

      <ErrorsView recent={recent} grouped={grouped} />
    </div>
  );
}
