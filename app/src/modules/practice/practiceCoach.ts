'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { usePostHog } from 'posthog-js/react';

/**
 * Results panel: one sentence on a wrong output, and Fix it on a syntax error.
 * Variants: `control` | `test`. Missing flag ships the change.
 */
export const PRACTICE_CHECK_HELP_FLAG = 'practice-check-help';

/**
 * Which question the toast and the start-here card open.
 * Variants: `control` | `test`. Missing flag ships the change.
 */
export const PRACTICE_QUESTION_MATCH_FLAG = 'practice-question-match';

export type PracticeVariant = 'test' | 'control';

function override(): PracticeVariant | null {
  try {
    const value = new URLSearchParams(window.location.search).get('practice_coach');
    if (value === '1') return 'test';
    if (value === '0') return 'control';
  } catch {
    /* no window */
  }
  return null;
}

/**
 * Read the flag at a decision point (a failed check, the toast). `getFeatureFlag`
 * records exposure. A missing flag, or flags that have not loaded, ships the change.
 */
export function readPracticeVariant(flag: string): PracticeVariant {
  const forced = override();
  if (forced) return forced;
  try {
    const value = posthog.getFeatureFlag(flag);
    if (value === 'control') return 'control';
    if (value === 'test') return 'test';
  } catch {
    /* analytics must not break the page */
  }
  return 'test';
}

/**
 * `pending` until flags load, so a control student never sees the test question
 * and then loses it. `?practice_coach=1` or `=0` skips the wait. No PostHog
 * (local dev) ships the change.
 */
export function usePracticeVariant(flag: string): PracticeVariant | 'pending' {
  const ph = usePostHog();
  const [variant, setVariant] = useState<PracticeVariant | 'pending'>('pending');

  useEffect(() => {
    const forced = override();
    if (forced) {
      setVariant(forced);
      return;
    }
    if (!ph) {
      setVariant('test');
      return;
    }
    let settled = false;
    const apply = () => {
      settled = true;
      try {
        const value = ph.getFeatureFlag(flag);
        if (value === 'control' || value === 'test') setVariant(value);
        else setVariant('test');
      } catch {
        setVariant('test');
      }
    };
    const unsubscribe = ph.onFeatureFlags(apply);
    // Flags that never arrive (blocked analytics) must not hide the start-here card.
    const timer = window.setTimeout(() => {
      if (!settled) setVariant('test');
    }, 2500);
    return () => {
      unsubscribe?.();
      window.clearTimeout(timer);
    };
  }, [ph, flag]);

  return variant;
}
