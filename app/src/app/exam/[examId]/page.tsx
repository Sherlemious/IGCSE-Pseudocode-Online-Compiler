import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ExamWorkspace from '@/components/exam/ExamWorkspace';

export const metadata: Metadata = { title: 'Exam in Progress' };

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
        include: {
          question: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              starterCode: true,
              testCases: {
                where: { isHidden: false },
                orderBy: { sortOrder: 'asc' },
                select: { id: true, inputs: true, expectedOutput: true, description: true },
              },
            },
          },
        },
      },
    },
  });

  if (!exam) notFound();

  // If already completed, redirect to results
  if (exam.status !== 'IN_PROGRESS') {
    redirect(`/exam/${examId}/results`);
  }

  const questions = exam.answers.map((a) => ({
    answerId: a.id,
    questionId: a.question.id,
    title: a.question.title,
    description: a.question.description,
    difficulty: a.question.difficulty,
    starterCode: a.question.starterCode ?? '',
    savedCode: a.code ?? '',
    graded: a.graded,
    passCount: a.passCount,
    totalTests: a.totalTests,
    testCases: a.question.testCases,
  }));

  return (
    <ExamWorkspace
      examId={exam.id}
      questions={questions}
      timeLimitMin={exam.timeLimitMin}
      startedAt={exam.startedAt.toISOString()}
    />
  );
}
