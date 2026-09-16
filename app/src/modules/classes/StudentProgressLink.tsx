'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { captureEvent } from '@/modules/interpreter/analytics';

export type StudentProgressSource = 'roster' | 'assignment_results';

export default function StudentProgressLink({
  classId,
  studentId,
  source,
  className,
  children,
}: {
  classId: string;
  studentId: string;
  source: StudentProgressSource;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/classes/${classId}/students/${studentId}`}
      className={className}
      onClick={() => captureEvent('class_student_progress_clicked', { class_id: classId, source })}
    >
      {children}
    </Link>
  );
}
