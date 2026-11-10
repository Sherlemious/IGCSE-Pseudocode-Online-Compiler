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

const NO_STATS = new Map<string, QuestionSocialStat>();

/**
 * Solve counts for a decision that needs them. The list chips stay behind their own flag.
 * `ready` is derived in render, so the render where `enabled` turns on already reads false
 * (an effect-set flag would report ready with empty stats for one render).
 */
export function useQuestionStats(enabled: boolean): { stats: Map<string, QuestionSocialStat>; ready: boolean } {
  const [loaded, setLoaded] = useState<Map<string, QuestionSocialStat> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void loadQuestionSocialStats().then((next) => {
      if (!cancelled) setLoaded(next);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  if (!enabled) return { stats: NO_STATS, ready: true };
  return { stats: loaded ?? NO_STATS, ready: loaded !== null };
}

export function useQuestionSocialStats(): Map<string, QuestionSocialStat> {
  return useQuestionStats(usePracticeSocialProofEnabled()).stats;
}
