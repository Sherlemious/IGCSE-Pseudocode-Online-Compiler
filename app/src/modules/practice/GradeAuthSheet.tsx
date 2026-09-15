'use client';

import { ClipboardCheck } from 'lucide-react';
import AuthSheet from '@/modules/auth/AuthSheet';

/** sessionStorage key marking a pending grade to auto-run after OAuth returns. */
export const PENDING_GRADE_KEY = (id: string) => `practice_pending_grade:${id}`;

interface Props {
  questionId: string;
  /** Close the sheet without authenticating. */
  onClose: () => void;
  /**
   * Called synchronously before the Google redirect so the current editor code
   * is flushed to localStorage — the debounced autosave would otherwise lose
   * the last keystrokes when the tab navigates away.
   */
  onFlushBeforeOAuth: () => void;
  /**
   * Called after a successful in-page (credentials) sign-in, so the workspace
   * can refresh the session and grade without leaving the page.
   */
  onAuthenticated: () => void | Promise<void>;
}

/**
 * LeetCode-style in-page auth prompt shown when an anonymous student tries to
 * check a Medium/Hard question. It never navigates to /auth/signin: Google
 * round-trips back to this exact question (?check=1) and the email path grades
 * in place.
 */
export default function GradeAuthSheet({ questionId, onClose, onFlushBeforeOAuth, onAuthenticated }: Props) {
  return (
    <AuthSheet
      ariaLabel="Create a free account to check this answer"
      headerLabel="Check My Answer"
      headerIcon={ClipboardCheck}
      title="Create a free account to check this answer."
      description="Your code stays in this tab. After you sign in we will run the tests."
      signInSource="practice_grade"
      role="STUDENT"
      googleCallbackUrl={`/practice/${questionId}?check=1`}
      onClose={onClose}
      onFlushBeforeOAuth={onFlushBeforeOAuth}
      onAuthenticated={onAuthenticated}
      onBeforeGoogle={() => {
        try { sessionStorage.setItem(PENDING_GRADE_KEY(questionId), '1'); } catch { /* unavailable */ }
      }}
    />
  );
}
