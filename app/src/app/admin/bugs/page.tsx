import { prisma } from '@/lib/prisma';
import BugReportTable from './_components/BugReportTable';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Bug Reports' };

export default async function AdminBugsPage() {
  const reports = await prisma.bugReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end gap-6">
        <div>
          <h1 className="text-2xl font-bold text-light-text">Bug Reports</h1>
          <p className="text-sm text-dark-text mt-1">
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <BugReportTable reports={reports} />
    </div>
  );
}
