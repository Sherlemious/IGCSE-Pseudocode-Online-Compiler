import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/modules/auth/auth';
import { ListChecks, Plus, ArrowRight } from 'lucide-react';
import CustomQuestionsUpgrade from '@/modules/questions/CustomQuestionsUpgrade';
import { listOwnedQuestions, viewerCanAuthor } from '@/modules/questions/service';

export const metadata: Metadata = {
  title: 'My Questions',
  robots: { index: false, follow: false },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: 'text-success',
  MEDIUM: 'text-warning',
  HARD: 'text-error',
};

export default async function MyQuestionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/questions/mine');

  const [questions, canAuthor] = await Promise.all([
    listOwnedQuestions(session.user.id),
    viewerCanAuthor(session.user.id),
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 relative scrollbar-pretty">
      <div className="max-w-3xl mx-auto relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="display-serif text-2xl font-semibold text-light-text">My questions</h1>
              <p className="text-xs text-dark-text mt-0.5">
                Autograded questions for your exams.{' '}
                <Link href="/exams" className="text-primary hover:underline">Back to exams</Link>
              </p>
            </div>
          </div>
          <Link href="/questions/new"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90">
            <Plus size={15} />
            New question
          </Link>
        </div>

        {!canAuthor && (
          <div className="mb-6">
            <CustomQuestionsUpgrade surface="list" />
          </div>
        )}

        {questions.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-sm text-dark-text mb-1">You haven&apos;t written a question yet.</p>
            <p className="text-xs text-dark-text/60 mb-5">Add tests, prove your solution passes them, then drop the question into an exam.</p>
            <Link href="/questions/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-light-text hover:border-primary/40 hover:text-primary">
              <Plus size={15} />
              Write your first question
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((question) => (
              <Link key={question.id} href={`/questions/${question.id}/edit`}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3.5 hover:border-primary/30 transition-colors group">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-light-text truncate">{question.title}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-dark-text">
                    <span className={DIFFICULTY_COLOR[question.difficulty] ?? ''}>{question.difficulty}</span>
                    {question.topic && <span className="truncate">{question.topic}</span>}
                    <span>{question.testCount} test{question.testCount === 1 ? '' : 's'}</span>
                  </div>
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
