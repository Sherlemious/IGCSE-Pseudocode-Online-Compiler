import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/modules/auth/auth';
import ExamBuilder from '@/modules/exams/ExamBuilder';

export const metadata: Metadata = {
  title: 'Create an Exam',
  robots: { index: false, follow: false },
};

export default async function NewExamPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-6 scrollbar-pretty">
      <ExamBuilder mode="create" />
    </div>
  );
}
