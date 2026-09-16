import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { loadProgressReport } from '@/modules/progress/loadReport';
import ProgressReport from '@/modules/progress/ProgressReport';

export const metadata: Metadata = {
  title: 'Analytics',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const report = await loadProgressReport(session.user.id);
  const studentName = session.user.name ?? null;

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 30% at 50% 0%, rgba(var(--color-primary-rgb), 0.04) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <ProgressReport
          report={report}
          subtitle={
            <>
              Computer Science — Pseudocode
              {studentName && <> · <span className="text-light-text/80">{studentName}</span></>}
            </>
          }
        />
      </div>
    </div>
  );
}
