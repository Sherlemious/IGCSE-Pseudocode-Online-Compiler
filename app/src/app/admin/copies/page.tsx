import { prisma } from '@/shared/db';
import { AdminPageHeader, EmptyState } from '../_components/adminUi';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Copies' };

function when(value: Date) {
  return value.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminCopiesPage() {
  const sightings = await prisma.hostSighting.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });

  return (
    <div className="space-y-5 max-w-6xl">
      <AdminPageHeader
        title="Copies"
        description="Sites that opened a copy of this app. Your own domain and localhost are ignored. The first visit from a new host also sends you an email."
      />

      {sightings.length === 0 ? (
        <EmptyState>No other copies have called home.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-dark-text border-b border-border">
                <th className="px-4 py-3 font-medium">Host</th>
                <th className="px-4 py-3 font-medium">Visits</th>
                <th className="px-4 py-3 font-medium">First seen</th>
                <th className="px-4 py-3 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {sightings.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-light-text font-medium">{row.host}</td>
                  <td className="px-4 py-3 text-dark-text">{row.hits}</td>
                  <td className="px-4 py-3 text-dark-text whitespace-nowrap">{when(row.createdAt)}</td>
                  <td className="px-4 py-3 text-dark-text whitespace-nowrap">{when(row.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
