'use client';

import { useEffect } from 'react';
import { Save } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import AuthSheet from '@/modules/auth/AuthSheet';

interface Props {
  onClose: () => void;
  onFlushBeforeOAuth: () => void;
  onAuthenticated: () => void | Promise<void>;
}

/**
 * Skippable “Save this program” prompt after the first successful playground
 * run. Reuses the shared in-page auth sheet (Google + email).
 */
export default function SaveProgramSheet({ onClose, onFlushBeforeOAuth, onAuthenticated }: Props) {
  const ph = usePostHog();

  useEffect(() => {
    ph?.capture('nudge_shown', { nudge: 'save_program' });
  }, [ph]);

  return (
    <AuthSheet
      ariaLabel="Save this program"
      headerLabel="Save this program"
      headerIcon={Save}
      title="Keep this program on your account."
      description="Your code is already in this browser. A free account also saves it across devices and tracks practice progress."
      signInSource="playground_save"
      googleCallbackUrl="/"
      skipLabel="Skip for now"
      onClose={onClose}
      onFlushBeforeOAuth={onFlushBeforeOAuth}
      onAuthenticated={onAuthenticated}
    />
  );
}
