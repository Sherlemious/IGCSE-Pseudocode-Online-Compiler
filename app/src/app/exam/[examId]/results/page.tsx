import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Trophy, Clock, ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export const metadata: Metadata = { title: 'Exam Results' };

interface Props {
  params: Promise<{ examId: string }>;
}

export default async function ExamResultsPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const { examId } = await params;

  const exam = await prisma.examAttempt.findFirst({
    where: { id: examId, userId: session.user.id },
    include: {
      answers: {
        orderBy: { sortOrder: 'asc' },
        include: {
          question: { select: { id: true, title: true, difficulty: true } },
        },
      },
    },
  });

  if (!exam) notFound();
  if (exam.status === 'IN_PROGRESS') redirect(`/exam/${examId}`);

  const totalPassed = exam.answers.reduce((s, a) => s + a.passCount, 0);
  const totalTests = exam.answers.reduce((s, a) => s + a.totalTests, 0);
  const percentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  const durationMs = exam.completedAt
    ? new Date(exam.completedAt).getTime() - new Date(exam.startedAt).getTime()
    : exam.timeLimitMin * 60 * 1000;
  const durationMin = Math.ceil(durationMs / 60000);

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-xl mx-auto">
        <Link
          href="/exam"
          className="inline-flex items-center gap-1 text-xs text-dark-text hover:text-light-text transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          Back to Exams
        </Link>

        {/* Score card */}
        <div className="bg-surface border border-border rounded-lg p-6 text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-light-text mb-1">
            {exam.status === 'TIMED_OUT' ? 'Time\'s Up!' : 'Exam Complete'}
          </h1>

          <div className="text-4xl font-bold text-primary my-3">{percentage}%</div>

          <div className="flex items-center justify-center gap-4 text-xs text-dark-text">
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-success" />
              {totalPassed}/{totalTests} tests
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {durationMin} min
            </span>
          </div>

          {exam.topic && (
            <div className="text-xs text-dark-text mt-2">
              Topic: {exam.topic}
              {exam.difficulty && ` · ${exam.difficulty}`}
            </div>
          )}
        </div>

        {/* Per-question breakdown */}
        <h2 className="text-sm font-semibold text-light-text mb-3">Question Breakdown</h2>
        <div className="space-y-2 mb-6">
          {exam.answers.map((a, i) => {
            const allPassed = a.totalTests > 0 && a.passCount === a.totalTests;
            return (
              <div
                key={a.id}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                    allPassed ? 'bg-success/20 text-success' :
                    a.graded ? 'bg-warning/20 text-warning' :
                    'bg-background text-dark-text'
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-xs font-medium text-light-text">{a.question.title}</div>
                    <div className="text-[10px] text-dark-text">{a.question.difficulty}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {allPassed ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : a.graded ? (
                    <XCircle size={14} className="text-error" />
                  ) : (
                    <span className="text-dark-text">—</span>
                  )}
                  {a.graded && (
                    <span className={allPassed ? 'text-success' : 'text-warning'}>
                      {a.passCount}/{a.totalTests}
                    </span>
                  )}
                  {!a.graded && <span className="text-dark-text">Not graded</span>}
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/exam"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
            bg-primary/15 text-primary text-sm font-medium
            hover:bg-primary/25 transition-colors"
        >
          <RotateCcw size={14} />
          Try Another Exam
        </Link>
      </div>
    </div>
  );
}
