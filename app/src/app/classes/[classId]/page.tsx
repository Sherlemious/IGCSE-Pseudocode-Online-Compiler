import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, School, ClipboardList, ListChecks, CalendarClock } from 'lucide-react';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { SITE_URL } from '@/shared/lib/seo';
import { getEntitlements } from '@/modules/billing/entitlements';
import ClassManager from '@/modules/classes/ClassManager';
import ClassAssignments, { type AssignmentRow } from '@/modules/classes/ClassAssignments';
import StartAssignmentButton from '@/modules/classes/StartAssignmentButton';

export const metadata: Metadata = {
  title: 'Class',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ classId: string }>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)' }}
      />
      <div className="max-w-2xl mx-auto relative animate-fade-in-up">
        <Link href="/classes" className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-primary transition-colors mb-6">
          <ArrowLeft size={13} />
          All classes
        </Link>
        {children}
      </div>
    </div>
  );
}

function formatDue(d: Date | null): string | null {
  return d ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : null;
}

export default async function ClassDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');
  const userId = session.user.id;
  const { classId } = await params;

  const cls = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      ownerId: true,
      name: true,
      joinCode: true,
      archived: true,
      owner: { select: { name: true } },
      memberships: {
        orderBy: { joinedAt: 'asc' },
        select: { userId: true, joinedAt: true, user: { select: { name: true, email: true } } },
      },
      assignments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          dueDate: true,
          exam: { select: { id: true, title: true, _count: { select: { questions: true } } } },
        },
      },
    },
  });

  if (!cls || cls.archived) notFound();

  const isOwner = cls.ownerId === userId;
  const isMember = cls.memberships.some((m) => m.userId === userId);
  if (!isOwner && !isMember) notFound();

  const assignmentIds = cls.assignments.map((a) => a.id);

  // ── Teacher view ──────────────────────────────────────────────────────────
  if (isOwner) {
    const rosterSize = cls.memberships.length;

    // Distinct students who have a completed attempt, per assignment.
    const completed = assignmentIds.length
      ? await prisma.examAttempt.findMany({
          where: { assignmentId: { in: assignmentIds }, status: { in: ['COMPLETED', 'TIMED_OUT'] } },
          distinct: ['assignmentId', 'userId'],
          select: { assignmentId: true },
        })
      : [];
    const submittedByAssignment = new Map<string, number>();
    for (const a of completed) {
      if (a.assignmentId) submittedByAssignment.set(a.assignmentId, (submittedByAssignment.get(a.assignmentId) ?? 0) + 1);
    }

    const assignedExamIds = cls.assignments.map((a) => a.exam.id);
    const [{ limits }, availableExams] = await Promise.all([
      getEntitlements(userId),
      prisma.exam.findMany({
        where: { ownerId: userId, isPublished: true, id: { notIn: assignedExamIds } },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true },
      }),
    ]);

    const assignmentRows: AssignmentRow[] = cls.assignments.map((a) => ({
      id: a.id,
      examTitle: a.exam.title,
      dueDate: a.dueDate ? a.dueDate.toISOString() : null,
      questionCount: a.exam._count.questions,
      submittedCount: submittedByAssignment.get(a.id) ?? 0,
      rosterSize,
    }));

    const members = cls.memberships.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      joinedAt: m.joinedAt.toISOString(),
    }));

    return (
      <Shell>
        <ClassManager
          classId={classId}
          initialName={cls.name}
          joinCode={cls.joinCode}
          joinUrl={`${SITE_URL}/c/${cls.joinCode}`}
          maxStudents={Number.isFinite(limits.maxStudentsPerClass) ? limits.maxStudentsPerClass : null}
          members={members}
        />
        <div className="mt-8">
          <ClassAssignments classId={classId} assignments={assignmentRows} availableExams={availableExams} />
        </div>
      </Shell>
    );
  }

  // ── Student view ──────────────────────────────────────────────────────────
  const myAttempts = assignmentIds.length
    ? await prisma.examAttempt.findMany({
        where: { userId, assignmentId: { in: assignmentIds } },
        orderBy: { createdAt: 'desc' },
        select: { assignmentId: true, status: true, score: true, totalTests: true },
      })
    : [];
  const latestByAssignment = new Map<string, (typeof myAttempts)[number]>();
  for (const at of myAttempts) {
    if (at.assignmentId && !latestByAssignment.has(at.assignmentId)) latestByAssignment.set(at.assignmentId, at);
  }

  return (
    <Shell>
      <div className="flex items-center gap-3 mb-2">
        <School size={20} className="text-primary" />
        <h1 className="display-serif text-2xl font-semibold text-light-text truncate">{cls.name}</h1>
      </div>
      {cls.owner?.name && <p className="text-xs text-dark-text mb-8">Taught by {cls.owner.name}</p>}

      <div className="flex items-center gap-2 mb-3 px-1">
        <ClipboardList size={14} className="text-dark-text" />
        <h2 className="mono-label text-dark-text">Assigned work{cls.assignments.length > 0 && ` · ${cls.assignments.length}`}</h2>
      </div>

      {cls.assignments.length === 0 ? (
        <p className="text-sm text-dark-text/70 px-1 py-6 text-center">
          No work has been assigned yet. Check back later.
        </p>
      ) : (
        <div className="space-y-2">
          {cls.assignments.map((a) => {
            const at = latestByAssignment.get(a.id);
            const status: 'none' | 'in_progress' | 'completed' = !at
              ? 'none'
              : at.status === 'IN_PROGRESS'
                ? 'in_progress'
                : 'completed';
            const dueLabel = formatDue(a.dueDate);
            return (
              <div key={a.id} className="flex items-center justify-between gap-3 bg-surface border border-border rounded-lg px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-light-text truncate">{a.exam.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-dark-text font-mono">
                    <span className="flex items-center gap-1"><ListChecks size={11} />{a.exam._count.questions} q</span>
                    {dueLabel && <span className="flex items-center gap-1"><CalendarClock size={11} />due {dueLabel}</span>}
                  </div>
                </div>
                <StartAssignmentButton assignmentId={a.id} status={status} score={at?.score} totalTests={at?.totalTests} />
              </div>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
