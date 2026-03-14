import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export const metadata: Metadata = {
  title: 'Practice Questions',
  description: 'Practice IGCSE pseudocode with autograded questions.',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: 'text-success',
  MEDIUM: 'text-warning',
  HARD: 'text-error',
};

export default async function PracticePage() {
  let questions: Awaited<ReturnType<typeof fetchQuestions>> = [];
  try {
    questions = await fetchQuestions();
  } catch {
    // DB not yet configured — show placeholder
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 bg-background text-light-text">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-2">Practice Questions</h1>
        <p className="text-sm text-dark-text mb-6">
          Solve autograded pseudocode questions. Each submission is checked against hidden test cases.
        </p>

        {questions.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center text-dark-text">
            <p className="text-sm">No questions yet. Add questions via the database.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q) => (
              <Link
                key={q.id}
                href={`/practice/${q.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface
                  hover:border-primary/50 hover:bg-surface/80 transition-colors"
              >
                <div>
                  <div className="font-medium text-light-text">{q.title}</div>
                  <div className="text-xs text-dark-text mt-0.5">
                    {q.topic && <span className="mr-2">{q.topic}</span>}
                    {q.year && <span>{q.year}</span>}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${DIFFICULTY_COLOR[q.difficulty] ?? 'text-dark-text'}`}>
                  {q.difficulty}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchQuestions() {
  return prisma.question.findMany({
    select: { id: true, title: true, difficulty: true, topic: true, year: true },
    orderBy: [{ difficulty: 'asc' }, { title: 'asc' }],
  });
}
