import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import ExamBuilder from '@/modules/exams/ExamBuilder';

export const metadata: Metadata = {
  title: 'Edit Exam',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ examId: string }>;
}

export default async function EditExamPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const { examId } = await params;

  const exam = await prisma.exam.findFirst({
    where: { id: examId, ownerId: session.user.id },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimitMin: true,
      questions: { orderBy: { sortOrder: 'asc' }, select: { questionId: true } },
    },
  });

  if (!exam) notFound();

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <ExamBuilder
        mode="edit"
        examId={exam.id}
        initialTitle={exam.title}
        initialDescription={exam.description ?? ''}
        initialTimeLimitMin={exam.timeLimitMin}
        initialQuestionIds={exam.questions.map((q) => q.questionId)}
      />
    </div>
  );
}
