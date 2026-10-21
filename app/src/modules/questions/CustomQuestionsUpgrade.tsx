'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';

/** Shown when a teacher can open the editor but their plan cannot save questions. */
export default function CustomQuestionsUpgrade({ surface }: { surface: 'list' | 'editor' }) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    captureEvent('nudge_shown', { nudge: 'custom_questions_upgrade', surface });
  }, [surface]);

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
      <span className="flex items-start gap-2 text-xs text-dark-text">
        <Lock size={13} className="shrink-0 mt-0.5" />
        <span>
          Writing your own autograded questions is part of a paid teacher plan.
          Questions you already saved still work in exams.
        </span>
      </span>
      <Link
        href="/pricing?from=custom_questions"
        onClick={() => captureEvent('nudge_clicked', { nudge: 'custom_questions_upgrade', surface })}
        className="shrink-0 text-xs font-medium text-primary hover:underline"
      >
        See plans
      </Link>
    </div>
  );
}
