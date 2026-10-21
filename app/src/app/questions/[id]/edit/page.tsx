import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import QuestionEditor from '@/modules/questions/QuestionEditor';
import { getOwnedQuestion, viewerCanAuthor } from '@/modules/questions/service';

export const metadata: Metadata = {
  title: 'Edit Question',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/questions/mine');
  const { id } = await params;
  const [question, canAuthor] = await Promise.all([
    getOwnedQuestion(session.user.id, id),
    viewerCanAuthor(session.user.id),
  ]);
  if (!question) notFound();

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <QuestionEditor mode="edit" questionId={question.id} canAuthor={canAuthor} initial={question} />
    </div>
  );
}
