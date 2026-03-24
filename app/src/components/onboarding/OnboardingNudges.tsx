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
 *  - 25 min cumulative usage, anyone:         "Share with classmates"
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';
import { useRouter } from 'next/navigation';
import { UserPlus, GraduationCap, Share2, Clock } from 'lucide-react';
import NudgeCard from './NudgeCard';
import ExamNudgeCard from './ExamNudgeCard';

const LS = {
  usageMs: 'nudge_usage_ms',
  sessionCount: 'nudge_sessions',
  signup: 'nudge_shown_signup',
  practice: 'nudge_shown_practice',
  exam: 'nudge_shown_exam',
  share: 'nudge_shown_share',
} as const;

type NudgeKey = 'signup' | 'practice' | 'exam' | 'share';
type ActiveNudge = NudgeKey | null;

const THRESHOLDS = {
  signupMs: 90_000,
  practiceMs: 15 * 60_000,
  examSession: 2,
  shareMs: 25 * 60_000,
} as const;

const SITE_URL = 'https://pseudocode-compiler.sherlemious.com';

function lsGet(key: string) { return localStorage.getItem(key); }
function lsNum(key: string) { return parseInt(localStorage.getItem(key) ?? '0', 10) || 0; }
function lsSet(key: string, val: string) { localStorage.setItem(key, val); }

export default function OnboardingNudges() {
  const { data: session, status } = useSession();
  const ph = usePostHog();
  const router = useRouter();
  const startRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dbSyncedRef = useRef(false);
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

  const dismissNudge = useCallback(() => setActiveNudge(null), []);

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
      if (!isAuthed && totalMs >= THRESHOLDS.signupMs && !lsGet(LS.signup)) {
        triggerNudge('signup');
        return;
      }
      if (totalMs >= THRESHOLDS.practiceMs && !lsGet(LS.practice)) {
        triggerNudge('practice');
        return;
      }
      if (sessions >= THRESHOLDS.examSession && !lsGet(LS.exam)) {
        triggerNudge('exam', 3_000);
        return;
      }
      if (totalMs >= THRESHOLDS.shareMs && !lsGet(LS.share)) {
        triggerNudge('share', 6_000);
        return;
      }
    },
    [triggerNudge],
  );

  // Dev shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('exam_nudge') === '1') setActiveNudge('exam');
    if (params.get('signup_nudge') === '1') setActiveNudge('signup');
    if (params.get('practice_nudge') === '1') setActiveNudge('practice');
    if (params.get('share_nudge') === '1') setActiveNudge('share');
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
        onCta={() => handleCta('signup', () => router.push('/auth/signup'))}
        onDismiss={dismissNudge}
      />
    );
  }

  if (activeNudge === 'practice') {
    return (
      <NudgeCard
        icon={GraduationCap}
        title="Ready for a challenge?"
        description="Test your pseudocode skills with IGCSE-style practice questions — instant feedback on every attempt."
        ctaLabel="Try Practice"
        onCta={() => handleCta('practice', () => router.push('/practice'))}
        onDismiss={dismissNudge}
      />
    );
  }

  if (activeNudge === 'exam') {
    return (
      <ExamNudgeCard
        onStart={() => handleCta('exam', () => router.push('/exam'))}
        onDismiss={dismissNudge}
      />
    );
  }

  if (activeNudge === 'share') {
    return (
      <NudgeCard
        icon={Share2}
        title="Know someone studying IGCSE CS?"
        description="Share this free tool with classmates or your teacher — it works on any device, no install needed."
        meta={SITE_URL.replace('https://', '')}
        ctaLabel="Share now"
        onCta={() =>
          handleCta('share', () => {
            const text = `If you're studying IGCSE Computer Science, this free pseudocode compiler is worth checking out.\n${SITE_URL}`;
            if (navigator.share) {
              navigator.share({ title: 'IGCSE Pseudocode Compiler', text, url: SITE_URL }).catch(() => {});
            } else {
              navigator.clipboard.writeText(SITE_URL).catch(() => {});
            }
          })
        }
        onDismiss={dismissNudge}
      />
    );
  }

  return null;
}
