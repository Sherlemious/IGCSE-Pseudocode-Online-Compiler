'use client';

import { useEffect, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { PRACTICE_SOCIAL_PROOF_FLAG } from '@/modules/telemetry/experiments';
import type { QuestionSocialStat } from './socialStats';

const OVERRIDE_KEY = 'practice_social_proof_override';

/** Local preview: `/practice?social_proof=1` (sticky for the tab). `?social_proof=0` clears it. */
export function isPracticeSocialProofOverride(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('social_proof') === '1') {
      sessionStorage.setItem(OVERRIDE_KEY, '1');
      return true;
    }
    if (params.get('social_proof') === '0') {
      sessionStorage.removeItem(OVERRIDE_KEY);
      return false;
    }
    return sessionStorage.getItem(OVERRIDE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * True for the experiment `test` variant. Always calls `getFeatureFlag` so
 * `$feature_flag_called` fires and the user is counted as exposed — unless
 * the local override is on, which is for preview only.
 */
export function usePracticeSocialProofEnabled(): boolean {
  const ph = usePostHog();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isPracticeSocialProofOverride()) {
      setEnabled(true);
      return;
    }
    if (!ph) return;
    const apply = () => {
      try {
        setEnabled(ph.getFeatureFlag(PRACTICE_SOCIAL_PROOF_FLAG) === 'test');
      } catch {
        setEnabled(false);
      }
    };
    apply();
    const unsubscribe = ph.onFeatureFlags(apply);
    return () => {
      unsubscribe?.();
    };
  }, [ph]);

  return enabled;
}

let statsPromise: Promise<Map<string, QuestionSocialStat>> | null = null;

function loadQuestionSocialStats(): Promise<Map<string, QuestionSocialStat>> {
  if (!statsPromise) {
    statsPromise = fetch('/api/practice/social-stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { stats?: Record<string, QuestionSocialStat> } | null) =>
        new Map(Object.entries(data?.stats ?? {})),
      )
      .catch(() => {
        statsPromise = null;
        return new Map<string, QuestionSocialStat>();
      });
  }
  return statsPromise;
}

export function useQuestionSocialStats(): Map<string, QuestionSocialStat> {
  const enabled = usePracticeSocialProofEnabled();
  const [stats, setStats] = useState<Map<string, QuestionSocialStat>>(new Map());

  useEffect(() => {
    if (!enabled) {
      setStats(new Map());
      return;
    }
    let cancelled = false;
    void loadQuestionSocialStats().then((next) => {
      if (!cancelled) setStats(next);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return stats;
}
