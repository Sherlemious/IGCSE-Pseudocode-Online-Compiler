'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { captureEvent } from '@/modules/interpreter/analytics';

const NUDGE = 'custom_questions_upgrade';

/** Shown when a free or lapsed teacher opens the editor. Saving stays closed. */
export default function UpgradeCard() {
  useEffect(() => {
    captureEvent('nudge_shown', { nudge: NUDGE });
  }, []);

  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3.5">
      <p className="text-sm font-medium text-light-text">Writing questions is part of a teacher plan</p>
      <p className="text-xs text-dark-text mt-1 leading-relaxed">
        You can look through the editor. Saving and running a solution needs Starter or above.
        Questions you already saved still work on exams if a plan lapses.
      </p>
      <Link
        href="/pricing?from=custom_questions"
        onClick={() => captureEvent('nudge_clicked', { nudge: NUDGE })}
        className="inline-flex mt-3 text-xs font-semibold text-primary hover:underline"
      >
        See teacher plans
      </Link>
    </div>
  );
}
