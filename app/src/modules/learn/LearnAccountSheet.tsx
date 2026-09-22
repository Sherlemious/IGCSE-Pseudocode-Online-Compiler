'use client';

import { Crown, UserPlus } from 'lucide-react';
import AuthSheet from '@/modules/auth/AuthSheet';

/** sessionStorage key: which Learn gate sent the student to Google, read on return. */
export const LEARN_PENDING_AUTH_KEY = 'learn_pending_auth';

export type LearnAuthGate = 'account' | 'paywall';

interface Props {
  gate: LearnAuthGate;
  /** Lesson path Google returns to. */
  returnPath: string;
  onClose: () => void;
  onAuthenticated: () => void | Promise<void>;
}

const COPY: Record<LearnAuthGate, { header: string; title: string; description: string }> = {
  account: {
    header: 'Keep going',
    title: 'Create a free account to start level 3.',
    description:
      'It is free. Your progress so far comes with you and is saved across devices, and you pick up right here.',
  },
  paywall: {
    header: 'Level 4',
    title: 'Sign in to unlock levels 4–10.',
    description:
      'Sign in first so the plan lands on your account. Your progress so far comes with you.',
  },
};

/**
 * In-page auth for the Paper 2 Path. Never navigates to /auth/signin: Google
 * round-trips back to this lesson and email signs in in place.
 */
export default function LearnAccountSheet({ gate, returnPath, onClose, onAuthenticated }: Props) {
  const copy = COPY[gate];
  return (
    <AuthSheet
      ariaLabel={copy.title}
      headerLabel={copy.header}
      headerIcon={gate === 'paywall' ? Crown : UserPlus}
      title={copy.title}
      description={copy.description}
      signInSource={`learn_${gate}_gate`}
      role="STUDENT"
      googleCallbackUrl={returnPath}
      onClose={onClose}
      onFlushBeforeOAuth={() => {}}
      onAuthenticated={onAuthenticated}
      onBeforeGoogle={() => {
        try { sessionStorage.setItem(LEARN_PENDING_AUTH_KEY, gate); } catch { /* unavailable */ }
      }}
    />
  );
}
