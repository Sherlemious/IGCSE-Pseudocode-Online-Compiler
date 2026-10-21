import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import { getEntitlements } from '@/modules/billing/entitlements';
import { mayWriteQuestions } from '@/modules/questions/access';
import { getMyQuestion } from '@/modules/questions/service';
import QuestionEditor from '@/modules/questions/QuestionEditor';

export const metadata: Metadata = {
  title: 'Edit question',
  robots: { index: false, follow: false },
};

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/questions/mine');
  const { id } = await params;
  const question = await getMyQuestion(session.user.id, id);
  if (!question) notFound();
  const { tier } = await getEntitlements(session.user.id);

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <QuestionEditor
        mode="edit"
        questionId={question.id}
        canWrite={mayWriteQuestions(tier)}
        initial={{
          title: question.title,
          description: question.description,
          difficulty: question.difficulty,
          topic: question.topic,
          starterCode: question.starterCode,
          solution: question.solution,
          testCases: question.testCases.map((test, index) => ({
            key: `t${index}`,
            inputs: test.inputs,
            expectedOutput: test.expectedOutput,
            isHidden: test.isHidden,
          })),
        }}
      />
    </div>
  );
}
