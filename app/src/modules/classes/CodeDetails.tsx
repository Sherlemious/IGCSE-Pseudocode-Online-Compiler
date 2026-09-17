'use client';

import type { SyntheticEvent } from 'react';
import { Code2 } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';

export type CodeDetailsSurface = 'assigned_work' | 'practice' | 'learn';

/** Read-only, collapsible code viewer for the teacher dashboard. */
export default function CodeDetails({
  label,
  code,
  classId,
  surface,
}: {
  label: string;
  code: string | null;
  classId?: string;
  surface?: CodeDetailsSurface;
}) {
  if (!code || !code.trim()) {
    return <p className="text-[11px] text-dark-text/50 italic">No code submitted.</p>;
  }

  function onToggle(e: SyntheticEvent<HTMLDetailsElement>) {
    if (!classId || !surface || !e.currentTarget.open) return;
    captureEvent('class_student_code_expanded', { class_id: classId, surface });
  }

  return (
    <details className="group" onToggle={onToggle}>
      <summary className="flex items-center gap-1.5 cursor-pointer text-[11px] text-primary hover:underline list-none">
        <Code2 size={12} />
        {label}
      </summary>
      <pre className="mt-2 bg-background border border-border rounded-lg p-3 text-xs font-mono text-light-text overflow-x-auto whitespace-pre scrollbar-pretty">
        {code}
      </pre>
    </details>
  );
}
