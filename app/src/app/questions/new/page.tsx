import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import QuestionEditor from '@/modules/questions/QuestionEditor';
import { viewerCanAuthor } from '@/modules/questions/service';

export const metadata: Metadata = {
  title: 'New Question',
  robots: { index: false, follow: false },
};

export default async function NewQuestionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/questions/new');
  const canAuthor = await viewerCanAuthor(session.user.id);

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <QuestionEditor mode="create" canAuthor={canAuthor} />
    </div>
  );
}
