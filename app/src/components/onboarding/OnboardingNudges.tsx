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
 *  - 15 min cumulative usage, anyone:         "Try Practice"
 *  - 2nd+ session, anyone:                    "Try an Exam"
 */

import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const LS = {
  usageMs: 'nudge_usage_ms',
  sessionCount: 'nudge_sessions',
  signup: 'nudge_shown_signup',
  practice: 'nudge_shown_practice',
  exam: 'nudge_shown_exam',
  share: 'nudge_shown_share',
} as const;

type NudgeKey = 'signup' | 'practice' | 'exam' | 'share';

const THRESHOLDS = {
  signupMs: 90_000,
  practiceMs: 15 * 60_000,
  examSession: 2,
  shareMs: 25 * 60_000, // 25 min — they've invested enough to care
} as const;

function lsGet(key: string) {
  return localStorage.getItem(key);
}
function lsNum(key: string) {
  return parseInt(localStorage.getItem(key) ?? '0', 10) || 0;
}
function lsSet(key: string, val: string) {
  localStorage.setItem(key, val);
}

export default function OnboardingNudges() {
  const { data: session, status } = useSession();
  const ph = usePostHog();
  const router = useRouter();
  const startRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dbSyncedRef = useRef(false);

  // Mark nudge shown in localStorage; if authenticated also persist to DB.
  const markShown = useCallback(
    (key: NudgeKey) => {
      lsSet(`nudge_shown_${key}`, '1');
      if (session?.user?.id) {
        fetch('/api/nudges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nudge: key }),
        }).catch(() => {}); // fire-and-forget; localStorage is the fallback
      }
    },
    [session?.user?.id],
  );

  const showNudge = useCallback(
    (key: NudgeKey, title: string, description: string, label: string, onAction: () => void, delay = 0) => {
      markShown(key);
      ph?.capture('nudge_shown', { nudge: key });
      setTimeout(() => {
        toast(title, {
          description,
          duration: 14_000,
          action: {
            label,
            onClick: () => {
              ph?.capture('nudge_clicked', { nudge: key });
              onAction();
            },
          },
        });
      }, delay);
    },
    [markShown, ph],
  );

  const checkNudges = useCallback(
    (totalMs: number, sessions: number, isAuthed: boolean) => {
      if (!isAuthed && totalMs >= THRESHOLDS.signupMs && !lsGet(LS.signup)) {
        showNudge('signup', 'Track your progress', 'Create a free account to save progress and unlock practice questions.', 'Sign up free', () => router.push('/auth/signup'));
      }
      if (totalMs >= THRESHOLDS.practiceMs && !lsGet(LS.practice)) {
        showNudge('practice', 'Ready for a challenge?', 'Test your pseudocode skills with IGCSE-style practice questions.', 'Try Practice', () => router.push('/practice'));
      }
      if (sessions >= THRESHOLDS.examSession && !lsGet(LS.exam)) {
        showNudge('exam', 'Simulate a real exam', 'Try a timed IGCSE exam — see how you score under pressure.', 'Start Exam', () => router.push('/exam'), 3_000);
      }
      if (totalMs >= THRESHOLDS.shareMs && !lsGet(LS.share)) {
        const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';
        const text = `If you're studying IGCSE Computer Science, this free pseudocode compiler is worth checking out.\n${SITE_URL}`;
        showNudge('share', 'Know someone studying IGCSE CS?', "Share this tool with classmates or your teacher — it's completely free.", 'Share now', () => {
          if (navigator.share) {
            navigator.share({ title: 'IGCSE Pseudocode Compiler', text, url: SITE_URL }).catch(() => {});
          } else {
            navigator.clipboard.writeText(SITE_URL).catch(() => {});
          }
        }, 6_000);
      }
    },
    [showNudge],
  );

  // Sync DB nudge state → localStorage on first authenticated load
  useEffect(() => {
    if (status !== 'authenticated' || dbSyncedRef.current) return;
    dbSyncedRef.current = true;

    fetch('/api/nudges')
      .then((r) => r.json())
      .then(({ nudgesShown }: { nudgesShown: string[] }) => {
        for (const key of nudgesShown) {
          lsSet(`nudge_shown_${key}`, '1'); // DB wins — suppress locally too
        }
      })
      .catch(() => {}); // non-critical; fall back to localStorage
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

    // Check immediately for returning users already past thresholds
    checkNudges(lsNum(LS.usageMs), sessions, status === 'authenticated');

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const elapsed = Date.now() - startRef.current;
      lsSet(LS.usageMs, String(lsNum(LS.usageMs) + elapsed));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return null;
}
