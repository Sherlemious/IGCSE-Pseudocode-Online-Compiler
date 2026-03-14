import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/prisma';
import PracticeRunner from '../../../components/practice/PracticeRunner';

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

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-background text-light-text flex flex-col lg:flex-row">
      {/* Left: Question description */}
      <div className="lg:w-96 shrink-0 border-r border-border overflow-y-auto p-6">
        <h1 className="text-lg font-bold text-light-text mb-2">{question.title}</h1>
        <div className="flex gap-2 mb-4 text-xs">
          <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">
            {question.difficulty}
          </span>
          {question.year && (
            <span className="bg-surface px-2 py-0.5 rounded border border-border text-dark-text">
              {question.year}
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
        {question.testCases.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-light-text mb-2">Sample Test Cases</h2>
            <div className="space-y-3">
              {question.testCases.slice(0, 3).map((tc, i) => (
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

      {/* Right: Code editor + results */}
      <PracticeRunner
        starterCode={question.starterCode ?? ''}
        testCases={question.testCases}
      />
    </div>
  );
}
