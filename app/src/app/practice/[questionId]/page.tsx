import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Crown, Lock } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../lib/auth';
import PracticeWorkspace from '../../../components/practice/PracticeWorkspace';

interface Props {
  params: Promise<{ questionId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { questionId } = await params;
  try {
    const q = await prisma.question.findUnique({ where: { id: questionId }, select: { title: true } });
    return { title: q?.title ?? 'Question' };
  } catch {
    return { title: 'Question' };
  }
}

export default async function QuestionPage({ params }: Props) {
  const { questionId } = await params;
  const session = await auth();
  const isPremium = session?.user?.plan === 'PREMIUM';

  let question;
  try {
    question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        testCases: {
          where: { isHidden: false },
          orderBy: { sortOrder: 'asc' },
          select: { id: true, inputs: true, expectedOutput: true, description: true },
        },
      },
    });
  } catch {
    notFound();
  }

  if (!question) notFound();

  // Access control: MEDIUM/HARD require premium
  const isLocked = question.difficulty !== 'EASY' && !isPremium;

  // Load saved code for authenticated users
  let savedCode: string | null = null;
  if (session?.user?.id) {
    try {
      const progress = await prisma.progress.findUnique({
        where: { userId_questionId: { userId: session.user.id, questionId } },
        select: { lastCode: true },
      });
      savedCode = progress?.lastCode ?? null;
    } catch { /* ignore */ }
  }

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-background text-light-text flex flex-col lg:flex-row">
      {/* Left: Question description */}
      <div className="lg:w-96 shrink-0 border-r border-border overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary">
        <Link
          href="/practice"
          className="inline-flex items-center gap-1 text-xs text-dark-text hover:text-light-text transition-colors mb-4"
        >
          <ChevronLeft size={12} />
          Practice
        </Link>
        <h1 className="text-lg font-bold text-light-text mb-2">{question.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">
            {question.difficulty}
          </span>
          {question.year && (
            <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">
              {question.year}
            </span>
          )}
          {question.paper && (
            <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">
              {question.paper}
            </span>
          )}
          {question.topic && (
            <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">
              {question.topic}
            </span>
          )}
        </div>
        <div className="text-sm text-light-text/80 whitespace-pre-wrap leading-relaxed">
          {question.description}
        </div>

        {/* Sample test cases (always visible — they're a teaser for locked questions) */}
        {question.testCases.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-light-text mb-2">Sample Test Cases</h2>
            <div className="space-y-3">
              {question.testCases.map((tc, i) => (
                <div key={tc.id} className="bg-surface rounded border border-border p-3 text-xs font-mono">
                  <div className="text-dark-text mb-1">Test {i + 1}{tc.description ? `: ${tc.description}` : ''}</div>
                  {tc.inputs.length > 0 && (
                    <div className="mb-1">
                      <span className="text-info">Inputs: </span>
                      {tc.inputs.join(', ')}
                    </div>
                  )}
                  <div>
                    <span className="text-success">Expected: </span>
                    <span className="whitespace-pre-wrap">{tc.expectedOutput}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Workspace or locked state */}
      {isLocked ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-7 w-7 text-warning" />
            </div>
            <h2 className="text-lg font-bold text-light-text mb-2">Premium Question</h2>
            <p className="text-sm text-dark-text mb-6">
              {question.difficulty} questions require a Premium plan.
              You can read the description and sample tests, but grading is locked.
            </p>
            {!session ? (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 text-primary
                  font-medium text-sm hover:bg-primary/25 transition-colors"
              >
                Sign in to get started
              </Link>
            ) : (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/15 text-warning
                  font-medium text-sm hover:bg-warning/25 transition-colors"
              >
                <Crown size={15} />
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      ) : (
        <PracticeWorkspace
          questionId={question.id}
          starterCode={question.starterCode ?? ''}
          savedCode={savedCode}
        />
      )}
    </div>
  );
}
