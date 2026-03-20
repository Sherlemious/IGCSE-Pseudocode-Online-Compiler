import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { gradeSubmission } from '@/lib/autograder';

interface Context {
  params: Promise<{ examId: string }>;
}

export async function POST(req: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { examId } = await params;
  const { questionId, code } = await req.json();

  // Verify ownership
  const exam = await prisma.examAttempt.findFirst({
    where: { id: examId, userId: session.user.id, status: 'IN_PROGRESS' },
    select: { id: true },
  });

  if (!exam) {
    return NextResponse.json({ error: 'Exam not found or already completed' }, { status: 404 });
  }

  // Get test cases
  const testCases = await prisma.testCase.findMany({
    where: { questionId },
    orderBy: { sortOrder: 'asc' },
  });

  // Grade all test cases in parallel
  const results = await Promise.allSettled(
    testCases.map((tc) => gradeSubmission(code, tc.inputs, tc.expectedOutput))
  );

  let passCount = 0;
  results.forEach((r) => {
    if (r.status === 'fulfilled' && r.value.passed) passCount++;
  });

  // Save the grade
  await prisma.examAnswer.update({
    where: { examAttemptId_questionId: { examAttemptId: examId, questionId } },
    data: { code, passCount, totalTests: testCases.length, graded: true },
  });

  return NextResponse.json({
    passCount,
    totalTests: testCases.length,
    results: results.map((r, i) => ({
      passed: r.status === 'fulfilled' && r.value.passed,
      isHidden: testCases[i].isHidden,
      description: testCases[i].isHidden ? undefined : testCases[i].description,
      error: r.status === 'fulfilled' ? r.value.error : undefined,
    })),
  });
}
