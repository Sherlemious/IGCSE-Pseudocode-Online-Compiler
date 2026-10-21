import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/modules/auth/auth';
import { HttpError } from '@/shared/http/errors';
import { getClassMarkBook } from '@/modules/classes/service';
import MarkBookTable from '@/modules/classes/MarkBookTable';

export const metadata: Metadata = {
  title: 'Mark book',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ classId: string }>;
}

export default async function ClassMarksPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');
  const { classId } = await params;

  let book: Awaited<ReturnType<typeof getClassMarkBook>>;
  try {
    book = await getClassMarkBook(classId, session.user.id);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid p-4 sm:p-6 relative scrollbar-pretty">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 60%)' }}
      />
      <div className="max-w-6xl mx-auto relative animate-fade-in-up">
        <Link
          href={`/classes/${classId}`}
          className="inline-flex items-center gap-1.5 text-xs text-dark-text hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={13} />
          {book.className}
        </Link>
        <MarkBookTable
          classId={classId}
          tier={book.tier}
          exportAllowed={book.exportAllowed}
          columns={book.preview.columns}
          rows={book.preview.rows}
        />
      </div>
    </div>
  );
}
