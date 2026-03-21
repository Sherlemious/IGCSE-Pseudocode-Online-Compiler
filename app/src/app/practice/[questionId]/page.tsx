import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Crown, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../lib/auth';
import { PREMIUM_GATING_ENABLED } from '../../../lib/featureFlags';
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
  const hasFullAccess = isPremium || !PREMIUM_GATING_ENABLED;

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

  // Access control applies only when premium gating is enabled.
  const isLocked = question.difficulty !== 'EASY' && !hasFullAccess;

  // Load saved code for authenticated users
  let savedCode: string | null = null;
  if (session?.user?.id) {
    try {
      const progress = await prisma.progress.findUnique({
        where: { userId_questionId: { userId: session.user.id, questionId } },
        select: { lastCode: true },
      });
      savedCode = progress?.lastCode ?? null;
    } catch {
      /* ignore */
    }
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
            <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">{question.year}</span>
          )}
          {question.paper && (
            <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">{question.paper}</span>
          )}
          {question.topic && (
            <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">{question.topic}</span>
          )}
        </div>
        <div className="text-sm text-light-text/85 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => <h3 className="text-base font-semibold text-light-text mt-5 mb-2" {...props} />,
              h2: ({ ...props }) => <h3 className="text-base font-semibold text-light-text mt-5 mb-2" {...props} />,
              h3: ({ ...props }) => <h4 className="text-sm font-semibold text-light-text mt-4 mb-2" {...props} />,
              p: ({ ...props }) => <p className="mb-3" {...props} />,
              strong: ({ ...props }) => <strong className="text-light-text font-semibold" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
              li: ({ ...props }) => <li className="text-light-text/85" {...props} />,
              code: ({ className, children, ...props }) => {
                const content = String(children);
                const isInline = !className && !content.includes('\n');
                if (isInline) {
                  return (
                    <code
                      className="font-mono text-[0.82em] px-1 py-0.5 rounded bg-surface border border-border text-info"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <code className="font-mono text-xs text-light-text" {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ ...props }) => (
                <pre
                  className="mb-4 p-3 rounded bg-code-bg border border-border overflow-x-auto
                    scrollbar-thin scrollbar-thumb-primary scrollbar-track-background"
                  {...props}
                />
              ),
              table: ({ ...props }) => (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full border-collapse text-xs" {...props} />
                </div>
              ),
              thead: ({ ...props }) => <thead className="bg-surface text-light-text" {...props} />,
              tbody: ({ ...props }) => <tbody className="text-light-text/85" {...props} />,
              tr: ({ ...props }) => <tr className="border-b border-border" {...props} />,
              th: ({ ...props }) => <th className="text-left px-2 py-1.5 font-semibold" {...props} />,
              td: ({ ...props }) => <td className="px-2 py-1.5" {...props} />,
            }}
          >
            {question.description}
          </ReactMarkdown>
        </div>

        {!PREMIUM_GATING_ENABLED && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary">
            <Crown size={13} className="shrink-0" />
            <span>Premium is coming soon. All grading features are currently unlocked.</span>
          </div>
        )}

        {/* Sample test cases (always visible — they're a teaser for locked questions) */}
        {question.testCases.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-light-text mb-2">Sample Test Cases</h2>
            <div className="space-y-3">
              {question.testCases.map((tc, i) => (
                <div key={tc.id} className="bg-surface rounded border border-border p-3 text-xs font-mono">
                  <div className="text-dark-text mb-1">
                    Test {i + 1}
                    {tc.description ? `: ${tc.description}` : ''}
                  </div>
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
              {question.difficulty} questions require a Premium plan. You can read the description and sample tests, but
              grading is locked.
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
        <PracticeWorkspace questionId={question.id} starterCode={question.starterCode ?? ''} savedCode={savedCode} />
      )}
    </div>
  );
}
