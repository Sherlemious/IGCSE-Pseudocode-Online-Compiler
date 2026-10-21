'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import AssignToClassButton, { type AssignResult } from './AssignToClass';

export default function ClassQuickStart({
  classId,
  className,
  joinCode,
  questions,
  onAssigned,
  onOpenChange,
}: {
  classId: string;
  className: string;
  joinCode: string;
  questions: { id: string; title: string }[];
  onAssigned?: (result: AssignResult, dueDate: string) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  if (questions.length === 0) return null;
  const label = questions.length === 1 ? 'Assign this question' : `Assign these ${questions.length}`;
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={14} className="text-primary" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-light-text">Quick start</h3>
      </div>
      <p className="text-xs text-dark-text mb-3">
        This class has no work yet. Assign a few short easy questions so students have something to do when they join.
      </p>
      <ol className="mb-3 space-y-1.5">
        {questions.map((question, index) => (
          <li key={question.id} className="text-sm text-light-text">
            <span className="mr-2 font-mono text-[11px] text-dark-text">{index + 1}.</span>
            <Link href={`/practice/${question.id}`} className="hover:text-primary transition-colors">
              {question.title}
            </Link>
          </li>
        ))}
      </ol>
      <AssignToClassButton
        questionIds={questions.map((question) => question.id)}
        surface="class_quick_start"
        fixedClass={{ id: classId, name: className, joinCode }}
        label={label}
        onAssigned={onAssigned}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
