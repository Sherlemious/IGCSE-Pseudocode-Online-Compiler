import type { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardList, Clock, ListChecks } from 'lucide-react';
import { auth } from '@/modules/auth/auth';
import { authHref } from '@/modules/auth/callback';
import { limitsFor, resolveTier } from '@/modules/billing/entitlements';
import { getAssignmentInvitation } from '@/modules/classes/service';
import { assignmentStudentPath } from '@/modules/classes/assignmentLinks';
import AssignmentLinkTracker from '@/modules/classes/AssignmentLinkTracker';
import JoinClassButton from '@/modules/classes/JoinClassButton';
import StartAssignmentButton from '@/modules/classes/StartAssignmentButton';

export const metadata: Metadata = {
  title: 'Class assignment',
  description: 'Open your pseudocode class assignment.',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-4 sm:p-6">
    <div className="mx-auto max-w-lg py-6 sm:py-10">
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-5">
        <ClipboardList size={24} className="text-primary" aria-hidden="true" />
        {children}
      </div>
    </div>
  </div>;
}

export default async function AssignmentLandingPage({ params, searchParams }: {
  params: Promise<{ code: string; assignmentId: string }>;
  searchParams: Promise<{ utm_source?: string }>;
}) {
  const [{ code, assignmentId }, search, session] = await Promise.all([params, searchParams, auth()]);
  const source = search.utm_source === 'google_classroom' ? 'google_classroom' : 'direct';
  const returnTo = assignmentStudentPath(code, assignmentId, source === 'google_classroom');
  if (!session?.user?.id) {
    // Keep class details private until sign-in; the destination survives either auth path.
    return <Shell>
      <AssignmentLinkTracker assignmentId={assignmentId} source={source} signedIn={false} />
      <h1 className="display-serif text-2xl font-semibold text-light-text">Open your assignment</h1>
      <p className="text-sm text-dark-text">Sign in to see the assignment and join your teacher&apos;s class. The timer only starts when you choose Start.</p>
      <div className="flex flex-wrap gap-3">
        <Link href={authHref('signin', returnTo)} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary">Sign in</Link>
        <Link href={authHref('signup', returnTo)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-light-text">Create an account</Link>
      </div>
    </Shell>;
  }
  const assignment = await getAssignmentInvitation(session.user.id, code, assignmentId);
  if (!assignment) {
    return <Shell>
      <h1 className="display-serif text-2xl font-semibold text-light-text">Assignment unavailable</h1>
      <p className="text-sm text-dark-text">This link is invalid or the assignment is no longer available. Ask your teacher for a current link.</p>
      <Link href="/classes" className="inline-block text-sm text-primary hover:underline">Go to my classes</Link>
    </Shell>;
  }
  const cls = assignment.class;
  const isOwner = cls.ownerId === session.user.id;
  const isMember = cls.memberships.length > 0;
  const full = cls._count.memberships >= limitsFor(resolveTier(cls.owner)).maxStudentsPerClass;
  const latest = assignment.attempts[0];
  const context = { assignmentId, classId: assignment.classId };
  return <Shell>
    {!isOwner && <AssignmentLinkTracker {...context} source={source} signedIn />}
    <div>
      <p className="mono-label text-primary mb-2">{cls.name}</p>
      <h1 className="display-serif text-2xl font-semibold text-light-text break-words">{assignment.exam.title}</h1>
    </div>
    <div className="flex flex-wrap gap-4 text-xs font-mono text-dark-text">
      <span className="inline-flex items-center gap-1.5"><ListChecks size={14} />{assignment.exam._count.questions} questions</span>
      <span className="inline-flex items-center gap-1.5"><Clock size={14} />{assignment.exam.timeLimitMin} min</span>
      {assignment.dueDate && <span>Due {assignment.dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</span>}
    </div>
    {isOwner ? (
      <Link href={`/classes/${assignment.classId}/assignments/${assignmentId}`} className="inline-block text-sm text-primary hover:underline">View assignment results</Link>
    ) : isMember ? (
      <>
        <StartAssignmentButton {...context} attemptId={latest?.id} status={!latest ? 'none' : latest.status === 'IN_PROGRESS' ? 'in_progress' : 'completed'} />
        {!latest && <p className="text-xs text-dark-text">The timer starts when you choose Start. Make sure you&apos;re ready.</p>}
      </>
    ) : full ? (
      <p role="status" className="rounded-lg border border-warning/20 bg-warning/8 p-3 text-sm text-warning">This class is full. Ask your teacher to make room.</p>
    ) : (
      <>
        <p className="text-sm text-dark-text">Join this class to start the assignment. Your teacher will be able to review your assigned submissions and scores.</p>
        <JoinClassButton joinCode={code} returnTo={returnTo} assignment={context} />
      </>
    )}
  </Shell>;
}
