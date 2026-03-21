import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { gradeSubmission } from '../../../../../lib/autograder';
import { auth } from '../../../../../lib/auth';

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Props) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { code, timeoutMs } = body as { code?: unknown; timeoutMs?: unknown };

  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: '`code` is required' }, { status: 400 });
  }

  const timeout = typeof timeoutMs === 'number' ? Math.min(timeoutMs, 30_000) : 10_000;

  // Get session (optional — anonymous users can grade EASY questions)
  const session = await auth();

  let question;
  try {
    question = await prisma.question.findUnique({
      where: { id },
      include: {
        testCases: { orderBy: { sortOrder: 'asc' } },
      },
    });
  } catch {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  // Access control: MEDIUM/HARD require sign-in + premium
  if (question.difficulty !== 'EASY') {
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in to grade medium and hard questions.' }, { status: 401 });
    }
    if (session.user.plan !== 'PREMIUM') {
      return NextResponse.json({ error: 'Premium plan required for medium and hard questions.' }, { status: 403 });
    }
  }

  // Grade all test cases in parallel
  const settled = await Promise.allSettled(
    question.testCases.map((tc) => gradeSubmission(code, tc.inputs, tc.expectedOutput, timeout))
  );

  const results = question.testCases.map((tc, i) => {
    const s = settled[i];
    const result =
      s.status === 'fulfilled'
        ? s.value
        : {
            passed: false,
            actualOutput: '',
            error: { kind: 'unknown' as const, message: 'Grading failed' },
            executionMs: 0,
          };

    const base = {
      testCaseId: tc.id,
      description: tc.description,
      hidden: tc.isHidden,
      passed: result.passed,
      error: result.error ?? null,
      executionMs: result.executionMs,
    };

    if (tc.isHidden) return base;

    return {
      ...base,
      actualOutput: result.actualOutput,
      expectedOutput: tc.expectedOutput,
      inputs: tc.inputs,
    };
  });

  const passCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passCount === totalCount;

  // Save progress if authenticated
  if (session?.user?.id) {
    try {
      await prisma.progress.upsert({
        where: {
          userId_questionId: { userId: session.user.id, questionId: id },
        },
        create: {
          userId: session.user.id,
          questionId: id,
          status: allPassed ? 'SOLVED' : 'ATTEMPTED',
          bestScore: passCount,
          totalTests: totalCount,
          attempts: 1,
          lastCode: code,
        },
        update: {
          status: allPassed ? 'SOLVED' : undefined, // only upgrade, never downgrade
          totalTests: totalCount,
          attempts: { increment: 1 },
          lastCode: code,
        },
      });

      // Raise bestScore only when the new passCount is higher.
      await prisma.progress.updateMany({
        where: {
          userId: session.user.id,
          questionId: id,
          bestScore: { lt: passCount },
        },
        data: {
          bestScore: passCount,
        },
      });
    } catch {
      // Progress save failure shouldn't block grade response
    }
  }

  return NextResponse.json({ results, passCount, totalCount });
}
