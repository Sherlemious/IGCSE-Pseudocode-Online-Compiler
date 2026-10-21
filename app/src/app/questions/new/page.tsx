import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { getEntitlements } from '@/modules/billing/entitlements';
import { mayWriteQuestions } from '@/modules/questions/access';
import QuestionEditor, { type EditorQuestion } from '@/modules/questions/QuestionEditor';

export const metadata: Metadata = {
  title: 'New question',
  robots: { index: false, follow: false },
};

const initial: EditorQuestion = {
  title: '',
  description: '',
  difficulty: 'EASY',
  topic: '',
  starterCode: '',
  solution: '',
  testCases: [{ key: 't0', inputs: '', expectedOutput: '', isHidden: false }],
};

export default async function NewQuestionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/questions/new');
  const { tier } = await getEntitlements(session.user.id);

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <QuestionEditor mode="new" canWrite={mayWriteQuestions(tier)} initial={initial} />
    </div>
  );
}
