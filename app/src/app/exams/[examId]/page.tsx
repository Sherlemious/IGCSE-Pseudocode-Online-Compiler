import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Clock, ListChecks, Users, Check } from 'lucide-react';
import ExamShareCard from '@/components/exam/ExamShareCard';
import ExamManageActions from '@/components/exam/ExamManageActions';
import AssignExamToClass from '@/components/exam/AssignExamToClass';

export const metadata: Metadata = {
  title: 'Manage Exam',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ examId: string }>;
  searchParams: Promise<{ created?: string }>;
}

const DIFF_COLOR: Record<string, string> = {
  EASY: 'text-success',
  MEDIUM: 'text-warning',
  HARD: 'text-error',
};

export default async function ManageExamPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const { examId } = await params;
  const { created } = await searchParams;

  const exam = await prisma.exam.findFirst({
    where: { id: examId, ownerId: session.user.id },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimitMin: true,
      shareCode: true,
      isPublished: true,
      _count: { select: { attempts: true } },
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: { question: { select: { id: true, title: true, difficulty: true, topic: true } } },
      },
    },
  });

  if (!exam) notFound();

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/exams"
          className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-light-text transition-colors mb-6 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to my exams
        </Link>

        {/* Title + meta */}
        <div className="mb-6">
          <h1 className="display-serif text-2xl font-semibold text-light-text">{exam.title}</h1>
          {exam.description && <p className="text-sm text-dark-text mt-1.5">{exam.description}</p>}
          <div className="flex items-center gap-4 mt-3 text-[11px] text-dark-text font-mono">
            <span className="flex items-center gap-1.5"><ListChecks size={12} />{exam.questions.length} questions</span>
            <span className="flex items-center gap-1.5"><Clock size={12} />{exam.timeLimitMin} min</span>
            <span className="flex items-center gap-1.5"><Users size={12} />{exam._count.attempts} taken</span>
          </div>
        </div>

        {created && (
          <div className="mb-6 flex items-center gap-2 text-sm text-primary bg-primary/[0.06] border border-primary/25 rounded-lg px-4 py-2.5 animate-fade-in-up">
            <Check size={15} />
            Exam created. Share it by link, or assign it to a class below.
          </div>
        )}

        {/* Assign to a class */}
        <div className="mb-6">
          <AssignExamToClass examId={exam.id} highlight={!!created} />
        </div>

        {/* Share */}
        <div className="mb-6">
          <ExamShareCard examId={exam.id} code={exam.shareCode} isPublished={exam.isPublished} />
        </div>

        {/* Actions */}
        <div className="mb-8">
          <ExamManageActions examId={exam.id} />
        </div>

        {/* Question list */}
        <h2 className="mono-label text-dark-text mb-3 px-1">Questions</h2>
        <ol className="space-y-1.5">
          {exam.questions.map((q, i) => (
            <li
              key={q.question.id}
              className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3"
            >
              <span className="text-[10px] font-mono text-dark-text w-4 shrink-0">{i + 1}</span>
              <span className="flex-1 min-w-0 text-xs font-medium text-light-text truncate">{q.question.title}</span>
              {q.question.topic && <span className="text-[10px] text-dark-text truncate hidden sm:block">{q.question.topic}</span>}
              <span className={`text-[10px] font-mono shrink-0 ${DIFF_COLOR[q.question.difficulty] ?? 'text-dark-text'}`}>
                {q.question.difficulty}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
