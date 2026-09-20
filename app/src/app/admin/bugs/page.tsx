import { prisma } from '@/shared/db';
import { AdminPageHeader } from '../_components/adminUi';
import BugReportTable from './_components/BugReportTable';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Bug Reports' };

export default async function AdminBugsPage() {
  const reports = await prisma.bugReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  const openCount = reports.filter((r) => r.status === 'OPEN').length;

  return (
    <div className="space-y-5 max-w-6xl">
      <AdminPageHeader
        title="Bug Reports"
        description={
          <>
            {reports.length} report{reports.length !== 1 ? 's' : ''}
            {openCount > 0 && <span className="text-error"> · {openCount} open</span>}
          </>
        }
      />

      <BugReportTable reports={reports} />
    </div>
  );
}
