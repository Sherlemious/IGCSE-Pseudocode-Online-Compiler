'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';
import { X, Terminal, ClipboardCheck } from 'lucide-react';
import AuthForm from '@/modules/auth/AuthForm';

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
 * in place. Patterned on ReportBugModal (backdrop + Escape + theme tokens).
 */
export default function GradeAuthSheet({ questionId, onClose, onFlushBeforeOAuth, onAuthenticated }: Props) {
  const ph = usePostHog();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  // Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleGoogle = () => {
    ph?.capture('sign_in_clicked', { source: 'practice_grade' });
    // Preserve the draft, then flag the return so the workspace auto-grades.
    onFlushBeforeOAuth();
    try { sessionStorage.setItem(PENDING_GRADE_KEY(questionId), '1'); } catch { /* unavailable */ }
    signIn('google', { callbackUrl: `/practice/${questionId}?check=1` });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create a free account to check this answer"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-lg shadow-intense w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
              <ClipboardCheck size={13} className="text-primary" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-light-text uppercase">
              Check My Answer
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-dark-text hover:text-light-text p-0.5 rounded hover:bg-background transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-pretty px-5 py-4">
          <h2 className="text-base font-bold text-light-text">Create a free account to check this answer.</h2>
          <p className="text-xs text-dark-text mt-1.5 leading-relaxed">
            Your code stays in this tab. After you sign in we&apos;ll run the tests.
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="mt-4 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
              bg-background border border-border text-light-text text-sm font-medium
              hover:border-primary/40 hover:bg-background/80 transition-all duration-200 group"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-3 mono-label text-dark-text/50 flex items-center gap-1.5">
                <Terminal size={10} />
                or use email
              </span>
            </div>
          </div>

          <AuthForm mode={mode} onAuthenticated={onAuthenticated} />

          <p className="text-xs text-dark-text/60 text-center mt-4">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
