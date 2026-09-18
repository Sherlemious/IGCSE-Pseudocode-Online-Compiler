import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { prisma } from '@/shared/db';
import { getPublicQuestion } from '@/shared/lib/catalogCache';
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

  const questions = (
    await Promise.all(
      exam.answers.map(async (a) => {
        const question = await getPublicQuestion(a.questionId);
        if (!question) return null;
        return {
          answerId: a.id,
          questionId: question.id,
          title: question.title,
          description: question.description,
          difficulty: question.difficulty,
          starterCode: question.starterCode ?? '',
          savedCode: a.code,
          graded: a.graded,
          passCount: a.passCount,
          totalTests: a.totalTests,
          testCases: question.testCases.map((tc) => ({
            id: tc.id,
            inputs: tc.inputs,
            expectedOutput: tc.expectedOutput,
            description: tc.description,
          })),
        };
      }),
    )
  ).filter((q): q is NonNullable<typeof q> => q !== null);

  return (
    <ExamWorkspace
      examId={exam.id}
      questions={questions}
      timeLimitMin={exam.timeLimitMin}
      startedAt={exam.startedAt.toISOString()}
    />
  );
}
