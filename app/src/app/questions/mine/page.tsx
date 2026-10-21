import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ListChecks, Plus, SquarePen } from 'lucide-react';
import { auth } from '@/modules/auth/auth';
import { listMyQuestions } from '@/modules/questions/service';

export const metadata: Metadata = {
  title: 'My questions',
  robots: { index: false, follow: false },
};

const DIFFICULTY: Record<string, string> = {
  EASY: 'text-success',
  MEDIUM: 'text-warning',
  HARD: 'text-error',
};

export default async function MyQuestionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/questions/mine');

  const questions = await listMyQuestions(session.user.id);

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div className="max-w-3xl mx-auto relative">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center">
              <SquarePen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="display-serif text-2xl font-semibold text-light-text">My questions</h1>
              <p className="text-xs text-dark-text mt-0.5">
                Autograded questions for your exams. Students never see the solution or hidden tests.
              </p>
            </div>
          </div>
          <Link
            href="/questions/new"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90"
          >
            <Plus size={15} />
            New question
          </Link>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-sm text-dark-text mb-1">You have not written a question yet.</p>
            <p className="text-xs text-dark-text/60 mb-5">A passing solution is required before it can be saved.</p>
            <Link
              href="/questions/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-light-text hover:border-primary/40 hover:text-primary"
            >
              <Plus size={15} />
              Write a question
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((question) => (
              <Link
                key={question.id}
                href={`/questions/${question.id}/edit`}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3.5 hover:border-primary/30 transition-colors group"
              >
                <div className="min-w-0">
                  <span className="block text-sm font-medium text-light-text truncate">{question.title}</span>
                  <span className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-dark-text">
                    <span className={DIFFICULTY[question.difficulty] ?? ''}>{question.difficulty}</span>
                    {question.topic && <span>{question.topic}</span>}
                    <span className="inline-flex items-center gap-1"><ListChecks size={11} />{question.testCount}</span>
                  </span>
                </div>
                <ArrowRight size={15} className="text-dark-text group-hover:text-primary shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
