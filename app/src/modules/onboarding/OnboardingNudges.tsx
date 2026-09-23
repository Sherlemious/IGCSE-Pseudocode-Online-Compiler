'use client';

/**
 * Gradual onboarding nudge system.
 *
 * State storage:
 *  - Anonymous users:      localStorage only
 *  - Authenticated users:  DB (nudgesShown on User) + localStorage as cache
 *    On mount, DB is fetched and wins over localStorage, so nudges stay
 *    dismissed across devices and browser clears.
 *
 * Timeline:
 *  - 90 s cumulative usage, unauthenticated:  sign-up prompt
 *  - 15 min cumulative usage, no Learn progress: "Follow the Paper 2 Path"
 *  - 2nd+ session, anyone:                    "Try an Exam"
 *
 * Trimmed Sept 2026 (30-day PostHog): the 25-min "share" card was clicked by
 * 0.3% and the 15-min "Try Practice" card led to no solves, so share is gone
 * and that slot now points at Learn, where students convert. Nothing shows
 * on Learn, pricing, checkout, sign-in or exam pages (QUIET_PATHS) so the
 * lesson and upgrade prompts aren't competing with a corner card.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';
import { usePathname, useRouter } from 'next/navigation';
import { UserPlus, Map as MapIcon } from 'lucide-react';
import { authHref } from '@/modules/auth/callback';
import NudgeCard from './NudgeCard';
import ExamNudgeCard from './ExamNudgeCard';
import { SAVE_PROGRAM_PROMPT_FLAG } from '@/modules/telemetry/experiments';
import { loadProgress } from '@/modules/learn/progress';

const LS = {
  usageMs: 'nudge_usage_ms',
  sessionCount: 'nudge_sessions',
  signup: 'nudge_shown_signup',
  learn: 'nudge_shown_learn',
  exam: 'nudge_shown_exam',
} as const;

type NudgeKey = 'signup' | 'learn' | 'exam';
type ActiveNudge = NudgeKey | null;

const THRESHOLDS = {
  signupMs: 90_000,
  learnMs: 15 * 60_000,
  examSession: 2,
} as const;

/** Pages with their own prompts (lessons, paywall, checkout) or no room for a card. */
const QUIET_PATHS = ['/learn', '/pricing', '/welcome', '/onboarding', '/auth', '/exam', '/e/'];

function isQuietPath(pathname: string | null): boolean {
  return !!pathname && QUIET_PATHS.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`));
}

function hasLearnProgress(): boolean {
  return Object.keys(loadProgress()).length > 0;
}

function lsGet(key: string) { return localStorage.getItem(key); }
function lsNum(key: string) { return parseInt(localStorage.getItem(key) ?? '0', 10) || 0; }
function lsSet(key: string, val: string) { localStorage.setItem(key, val); }

export default function OnboardingNudges() {
  const { data: session, status } = useSession();
  const ph = usePostHog();
  const router = useRouter();
  const pathname = usePathname();
  const quietRef = useRef(isQuietPath(pathname));
  quietRef.current = isQuietPath(pathname);
  const startRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dbSyncedRef = useRef(false);
  const savePromptVariantRef = useRef<string | null>(null);
  const savePromptFlagsReadyRef = useRef(false);
  const [activeNudge, setActiveNudge] = useState<ActiveNudge>(null);

  const markShown = useCallback(
    (key: NudgeKey) => {
      lsSet(`nudge_shown_${key}`, '1');
      if (session?.user?.id) {
        fetch('/api/nudges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nudge: key }),
        }).catch(() => {});
      }
    },
    [session?.user?.id],
  );

  const triggerNudge = useCallback(
    (key: NudgeKey, delay = 0) => {
      markShown(key);
      ph?.capture('nudge_shown', { nudge: key });
      setTimeout(() => setActiveNudge(key), delay);
    },
    [markShown, ph],
  );

  const dismissNudge = useCallback(
    (key: NudgeKey) => {
      ph?.capture('nudge_dismissed', { nudge: key });
      setActiveNudge(null);
    },
    [ph],
  );

  // Moving onto a quiet page hides a card that's already up.
  useEffect(() => {
    if (isQuietPath(pathname)) setActiveNudge(null);
  }, [pathname]);

  const handleCta = useCallback(
    (key: NudgeKey, action: () => void) => {
      ph?.capture('nudge_clicked', { nudge: key });
      setActiveNudge(null);
      action();
    },
    [ph],
  );

  const checkNudges = useCallback(
    (totalMs: number, sessions: number, isAuthed: boolean) => {
      // Not marked as shown: it waits until they're back on a normal page.
      if (quietRef.current) return;
      const suppressSignup = savePromptVariantRef.current === 'test';
      if (
        !isAuthed &&
        savePromptFlagsReadyRef.current &&
        !suppressSignup &&
        totalMs >= THRESHOLDS.signupMs &&
        !lsGet(LS.signup)
      ) {
        triggerNudge('signup');
        return;
      }
      if (totalMs >= THRESHOLDS.learnMs && !lsGet(LS.learn) && !hasLearnProgress()) {
        triggerNudge('learn');
        return;
      }
      if (sessions >= THRESHOLDS.examSession && !lsGet(LS.exam)) {
        triggerNudge('exam', 3_000);
        return;
      }
    },
    [triggerNudge],
  );

  // Assign the save-prompt experiment for anonymous users so test suppresses
  // the 90s signup nudge. Wait for flags before that nudge so we don't flash control.
  useEffect(() => {
    if (status === 'authenticated') {
      savePromptVariantRef.current = null;
      savePromptFlagsReadyRef.current = true;
      return;
    }
    if (!ph) {
      savePromptFlagsReadyRef.current = true;
      return;
    }
    const apply = () => {
      try {
        const value = ph.getFeatureFlag(SAVE_PROGRAM_PROMPT_FLAG);
        savePromptVariantRef.current = typeof value === 'string' ? value : null;
      } catch {
        savePromptVariantRef.current = null;
      }
      savePromptFlagsReadyRef.current = true;
      if (savePromptVariantRef.current === 'test') {
        setActiveNudge((current) => (current === 'signup' ? null : current));
      } else {
        checkNudges(lsNum(LS.usageMs), lsNum(LS.sessionCount), false);
      }
    };
    apply();
    const unsubscribe = ph.onFeatureFlags(apply);
    return () => { unsubscribe?.(); };
  }, [ph, status, checkNudges]);

  // Dev shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('exam_nudge') === '1') setActiveNudge('exam');
    if (params.get('signup_nudge') === '1') setActiveNudge('signup');
    if (params.get('learn_nudge') === '1') setActiveNudge('learn');
  }, []);

  // Sync DB nudge state → localStorage on first authenticated load
  useEffect(() => {
    if (status !== 'authenticated' || dbSyncedRef.current) return;
    dbSyncedRef.current = true;
    fetch('/api/nudges')
      .then((r) => r.json())
      .then(({ nudgesShown }: { nudgesShown: string[] }) => {
        for (const key of nudgesShown) lsSet(`nudge_shown_${key}`, '1');
      })
      .catch(() => {});
  }, [status]);

  // Usage accumulator + threshold checks
  useEffect(() => {
    if (status === 'loading') return;
    const sessions = lsNum(LS.sessionCount) + 1;
    lsSet(LS.sessionCount, String(sessions));

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const total = lsNum(LS.usageMs) + elapsed;
      lsSet(LS.usageMs, String(total));
      startRef.current = Date.now();
      checkNudges(total, sessions, status === 'authenticated');
    }, 30_000);

    checkNudges(lsNum(LS.usageMs), sessions, status === 'authenticated');

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const elapsed = Date.now() - startRef.current;
      lsSet(LS.usageMs, String(lsNum(LS.usageMs) + elapsed));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (activeNudge === 'signup') {
    return (
      <NudgeCard
        icon={UserPlus}
        title="Save your code anywhere"
        description="Create a free account to save your code across devices, track your progress, and unlock practice questions."
        ctaLabel="Sign up free"
        onCta={() => handleCta('signup', () => router.push(authHref('signup', window.location.pathname + window.location.search)))}
        onDismiss={() => dismissNudge('signup')}
      />
    );
  }

  if (activeNudge === 'learn') {
    return (
      <NudgeCard
        icon={MapIcon}
        title="Learn it step by step"
        description="The Paper 2 Path takes you from OUTPUT to exam-style algorithms in short, auto-checked lessons. The first three levels are free."
        ctaLabel="Start the path"
        onCta={() => handleCta('learn', () => router.push('/learn?from=nudge_learn'))}
        onDismiss={() => dismissNudge('learn')}
      />
    );
  }

  if (activeNudge === 'exam') {
    return (
      <ExamNudgeCard
        onStart={() => handleCta('exam', () => router.push('/exam'))}
        onDismiss={() => dismissNudge('exam')}
      />
    );
  }

  return null;
}
