import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { loadAttemptQuestionContent } from '@/modules/questions/read';
import ExamWorkspace from '@/modules/exams/ExamWorkspace';

export const metadata: Metadata = {
  title: 'Exam in Progress',
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{ examId: string }>;
}

export default async function ExamActivePage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  const { examId } = await params;

  const exam = await prisma.examAttempt.findFirst({
    where: { id: examId, userId: session.user.id },
    include: {
      answers: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          questionId: true,
          code: true,
          graded: true,
          passCount: true,
          totalTests: true,
        },
      },
    },
  });

  if (!exam) notFound();

  // If already completed, redirect to results
  if (exam.status !== 'IN_PROGRESS') {
    redirect(`/exam/${examId}/results`);
  }

  const content = await loadAttemptQuestionContent(exam.answers.map((a) => a.questionId));
  const questions = exam.answers.flatMap((a) => {
    const question = content.get(a.questionId);
    if (!question) return [];
    return [{
      answerId: a.id,
      questionId: question.questionId,
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      starterCode: question.starterCode,
      flowchart: question.flowchart,
      savedCode: a.code,
      graded: a.graded,
      passCount: a.passCount,
      totalTests: a.totalTests,
      testCases: question.testCases,
    }];
  });

  return (
    <ExamWorkspace
      examId={exam.id}
      questions={questions}
      timeLimitMin={exam.timeLimitMin}
      startedAt={exam.startedAt.toISOString()}
    />
  );
}
