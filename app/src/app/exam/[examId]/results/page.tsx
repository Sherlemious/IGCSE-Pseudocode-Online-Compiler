import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Clock, ArrowLeft, CheckCircle, XCircle, RotateCcw, Minus } from 'lucide-react';
import ExamShareButton from '@/components/share/ExamShareButton';

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

  const passedQuestions = exam.answers.filter((a) => a.graded && a.totalTests > 0 && a.passCount === a.totalTests).length;
  const totalQuestions = exam.answers.length;
  const percentage = totalQuestions > 0 ? Math.round((passedQuestions / totalQuestions) * 100) : 0;

  const durationMs = exam.completedAt
    ? new Date(exam.completedAt).getTime() - new Date(exam.startedAt).getTime()
    : exam.timeLimitMin * 60 * 1000;
  const durationMin = Math.ceil(durationMs / 60000);

  // SVG ring parameters
  const ringSize = 140;
  const ringStroke = 8;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - percentage / 100);

  const scoreColor =
    percentage >= 70 ? 'var(--color-success)' : percentage >= 40 ? 'var(--color-warning)' : 'var(--color-error)';

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(var(--color-primary-rgb), 0.06) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-xl mx-auto relative">
        <Link
          href="/exam"
          className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-light-text transition-colors mb-8 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Exams
        </Link>

        {/* Score ring */}
        <div className="bg-surface rounded-xl border border-border p-8 text-center mb-6 animate-fade-in-up">
          <div className="relative inline-block mb-4">
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth={ringStroke}
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                fill="none"
                stroke={scoreColor}
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                style={{ animation: 'draw-progress 1.2s ease-out forwards' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono" style={{ color: scoreColor }}>
                {percentage}%
              </span>
            </div>
          </div>

          <h1 className="text-lg font-bold text-light-text mb-1">
            {exam.status === 'TIMED_OUT' ? 'Time\u2019s Up!' : 'Exam Complete'}
          </h1>

          <div className="flex items-center justify-center gap-5 text-xs text-dark-text mt-3">
            <span className="flex items-center gap-1.5 font-mono">
              <CheckCircle size={13} className="text-success" />
              {passedQuestions}/{totalQuestions} correct
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Clock size={13} />
              {durationMin}min
            </span>
          </div>

          {exam.topic && (
            <div className="mono-label text-dark-text mt-3">
              {exam.topic}
              {exam.difficulty && ` / ${exam.difficulty}`}
            </div>
          )}
        </div>

        {/* Share */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <ExamShareButton percentage={percentage} topic={exam.topic} />
        </div>

        {/* Per-question breakdown */}
        <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h2 className="mono-label text-dark-text mb-3 px-1">Question Breakdown</h2>
          <div className="space-y-2 stagger-children mb-6">
            {exam.answers.map((a, i) => {
              const allPassed = a.totalTests > 0 && a.passCount === a.totalTests;
              const pct = a.totalTests > 0 ? Math.round((a.passCount / a.totalTests) * 100) : 0;
              return (
                <div
                  key={a.id}
                  className="bg-surface border border-border rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      allPassed
                        ? 'bg-success/15 text-success border border-success/25'
                        : a.graded
                          ? 'bg-warning/15 text-warning border border-warning/25'
                          : 'bg-background text-dark-text border border-border'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-light-text truncate">{a.question.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] font-mono ${
                          a.question.difficulty === 'EASY'
                            ? 'text-success'
                            : a.question.difficulty === 'MEDIUM'
                              ? 'text-warning'
                              : 'text-error'
                        }`}
                      >
                        {a.question.difficulty}
                      </span>
                      {a.graded && (
                        <>
                          <span className="text-border">&middot;</span>
                          {/* Mini progress bar */}
                          <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${allPassed ? 'bg-success' : 'bg-warning'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold shrink-0">
                    {allPassed ? (
                      <CheckCircle size={14} className="text-success" />
                    ) : a.graded ? (
                      <XCircle size={14} className="text-error" />
                    ) : (
                      <Minus size={14} className="text-dark-text/40" />
                    )}
                    {a.graded ? (
                      <span className={allPassed ? 'text-success' : 'text-warning'}>
                        {a.passCount}/{a.totalTests}
                      </span>
                    ) : (
                      <span className="text-dark-text/40 text-[10px] font-normal">skipped</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href="/exam"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg
            bg-primary text-on-primary text-sm font-semibold
            hover:opacity-90 active:scale-[0.98] transition-all duration-200
            animate-fade-in-up"
          style={{ animationDelay: '250ms' }}
        >
          <RotateCcw size={14} />
          Try Another Exam
        </Link>
      </div>
    </div>
  );
}
