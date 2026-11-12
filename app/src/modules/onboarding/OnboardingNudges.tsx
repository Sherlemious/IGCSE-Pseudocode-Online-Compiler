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
 *  - 60 s cumulative usage, signed-in student who hasn't said which sitting they
 *    are preparing for: "Which exam are you preparing for?" (see sittings.ts)
 *  - 90 s cumulative usage, flowchart maker not opened yet: "Draw and run flowcharts"
 *  - 15 min cumulative usage, no Learn progress: "Follow the Paper 2 Path"
 *  - 2nd+ session, anyone:                    "Try an Exam"
 *  - Right after sign-in, teachers only, once per account: the partner card
 *    for The Learning Mate (paper-script marking). Waits for the DB nudge
 *    sync so it never shows twice across devices.
 *  - 3rd+ session, free student (or signed out), May/June on sale: a small
 *    May/June pass toast (passToast.tsx). Also right after a student answers
 *    the sitting card with May/Jun 2027. Once per browser.
 *
 * One card at a time. A card that is already up is left alone until it is
 * dismissed or the visitor lands on a quiet page, so a later threshold
 * doesn't swap it out from under them.
 *
 * The 90 s sign-up card is retired. Anonymous playground visitors get the
 * save-program sheet after their first successful run instead.
 *
 * Trimmed Sept 2026 (30-day PostHog): the 25-min "share" card was clicked by
 * 0.3% and the 15-min "Try Practice" card led to no solves, so share is gone
 * and that slot now points at Learn, where students convert. Nothing shows
 * on Learn, the flowchart maker, pricing, checkout, sign-in or exam pages
 * (QUIET_PATHS) so those prompts aren't competing with a corner card.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';
import { usePathname, useRouter } from 'next/navigation';
import { UserPlus, Map as MapIcon, Workflow, Camera } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { PARTNERS, partnerOutHref } from '@/modules/partners/partners';
import { authHref } from '@/modules/auth/callback';
import { FLOWCHART_VISITED_KEY } from '@/modules/flowchart/constants';
import NudgeCard from './NudgeCard';
import ExamNudgeCard from './ExamNudgeCard';
import SittingCard from './SittingCard';
import { isSitting, type Sitting } from './sittings';
import { loadProgress } from '@/modules/learn/progress';
import { shouldOfferSessionPass } from '@/modules/billing/paddle/passes';
import { PASS_TOAST_SHOWN_KEY, PHONE_QR_FROM, showPassToast } from './passToast';

const LS = {
  usageMs: 'nudge_usage_ms',
  sessionCount: 'nudge_sessions',
  flowchart: 'nudge_shown_flowchart',
  learn: 'nudge_shown_learn',
  exam: 'nudge_shown_exam',
  sitting: 'nudge_shown_sitting',
  partner: 'nudge_shown_partner',
} as const;

type NudgeKey = 'signup' | 'learn' | 'exam' | 'flowchart' | 'sitting' | 'partner';
type ActiveNudge = NudgeKey | null;

const THRESHOLDS = {
  sittingMs: 60_000,
  flowchartMs: 90_000,
  learnMs: 15 * 60_000,
  examSession: 2,
  passSession: 3,
} as const;

/** Pages with their own prompts (lessons, paywall, checkout, the maker) or no room for a card. */
const QUIET_PATHS = ['/learn', '/flowchart', '/pricing', '/welcome', '/onboarding', '/auth', '/exam', '/e/', '/pay/'];

function isQuietPath(pathname: string | null): boolean {
  return !!pathname && QUIET_PATHS.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`));
}

function hasLearnProgress(): boolean {
  return Object.keys(loadProgress()).length > 0;
}

function hasOpenedFlowchart(): boolean {
  return lsGet(FLOWCHART_VISITED_KEY) === '1';
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
  const cardUp = useRef(false);
  // Only a signed-in student who hasn't answered yet is asked; 'unknown' until the DB answers.
  const sittingStateRef = useRef<'unknown' | 'answered' | 'unanswered'>('unknown');
  const sittingAnsweredRef = useRef(false);
  const [activeNudge, setActiveNudge] = useState<ActiveNudge>(null);
  const passEligibleRef = useRef(false);
  const signedInRef = useRef(false);
  signedInRef.current = status === 'authenticated';
  const teacherRef = useRef(false);
  teacherRef.current = status === 'authenticated' && session?.user?.role === 'TEACHER';
  // Set once the DB's nudgesShown is in localStorage, so the partner card can't repeat on a new device.
  const nudgesSyncedRef = useRef(false);
  passEligibleRef.current =
    status !== 'loading' &&
    shouldOfferSessionPass({
      role: status === 'authenticated' ? session?.user?.role : null,
      plan: status === 'authenticated' ? session?.user?.plan : 'FREE',
      planExpiresAt: status === 'authenticated' ? session?.user?.planExpiresAt : null,
    });
  const capture = useCallback(
    (event: string, props: Record<string, unknown>) => ph?.capture(event, props),
    [ph],
  );

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
      if (cardUp.current) return;
      cardUp.current = true;
      markShown(key);
      ph?.capture('nudge_shown', { nudge: key });
      setTimeout(() => setActiveNudge(key), delay);
    },
    [markShown, ph],
  );

  const dismissNudge = useCallback(
    (key: NudgeKey) => {
      cardUp.current = false;
      // The sitting card closes itself after an answer; that isn't a dismissal.
      if (!(key === 'sitting' && sittingAnsweredRef.current)) ph?.capture('nudge_dismissed', { nudge: key });
      setActiveNudge(null);
    },
    [ph],
  );

  const saveSitting = useCallback(
    (sitting: Sitting) => {
      sittingAnsweredRef.current = true;
      sittingStateRef.current = 'answered';
      lsSet(LS.sitting, '1');
      ph?.capture('nudge_clicked', { nudge: 'sitting' });
      ph?.capture('exam_sitting_set', { sitting, source: 'card' });
      ph?.setPersonProperties({ exam_sitting: sitting });
      fetch('/api/me/sitting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sitting }),
      }).catch(() => {});
      // They just said May/June: the pass is the thing that covers it.
      if (sitting === 'may_jun_2027' && passEligibleRef.current) {
        setTimeout(() => showPassToast('sitting', capture, { signedIn: signedInRef.current }), 3_000);
      }
    },
    [ph, capture],
  );

  // Moving onto a quiet page hides a card that's already up.
  useEffect(() => {
    if (isQuietPath(pathname)) {
      cardUp.current = false;
      setActiveNudge(null);
    }
  }, [pathname]);

  const handleCta = useCallback(
    (key: NudgeKey, action: () => void) => {
      cardUp.current = false;
      ph?.capture('nudge_clicked', { nudge: key });
      setActiveNudge(null);
      action();
    },
    [ph],
  );

  const checkNudges = useCallback(
    (totalMs: number, sessions: number) => {
      // Not marked as shown: it waits until they're back on a normal page.
      if (quietRef.current || cardUp.current) return;
      if (teacherRef.current && nudgesSyncedRef.current && !lsGet(LS.partner)) {
        triggerNudge('partner', 4_000);
        captureEvent('partner_ad_shown', { partner: 'learningmate', surface: 'popup' });
        return;
      }
      if (sittingStateRef.current === 'unanswered' && totalMs >= THRESHOLDS.sittingMs && !lsGet(LS.sitting)) {
        triggerNudge('sitting');
        return;
      }
      if (totalMs >= THRESHOLDS.flowchartMs && !lsGet(LS.flowchart) && !hasOpenedFlowchart()) {
        triggerNudge('flowchart');
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
      // A toast, not a card: it doesn't hold the card slot, so it waits for a session with no card.
      if (sessions >= THRESHOLDS.passSession && passEligibleRef.current && !lsGet(PASS_TOAST_SHOWN_KEY)) {
        showPassToast('returning', capture, { signedIn: signedInRef.current });
      }
    },
    [triggerNudge, capture],
  );

  // Dev shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('exam_nudge') === '1') setActiveNudge('exam');
    if (params.get('signup_nudge') === '1') setActiveNudge('signup');
    if (params.get('learn_nudge') === '1') setActiveNudge('learn');
    if (params.get('sitting_nudge') === '1' && !quietRef.current) {
      cardUp.current = true; // claim the slot, or the next threshold swaps the card out
      setActiveNudge('sitting');
    }
    const from = params.get('from');
    if (from === PHONE_QR_FROM.pay || from === PHONE_QR_FROM.signup) ph?.capture('phone_qr_opened', { from });
    if (params.get('pass_nudge') === '1') showPassToast('returning', capture, { force: true, signedIn: signedInRef.current });
    if (params.get('partner_nudge') === '1' && !quietRef.current) {
      cardUp.current = true;
      setActiveNudge('partner');
    }
    if (params.get('flowchart_nudge') === '1' && !quietRef.current) {
      cardUp.current = true;
      setActiveNudge('flowchart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync DB nudge state → localStorage once per browser session (not every page load:
  // each fetch is a billed function call, and this tab's own writes already hit localStorage).
  useEffect(() => {
    if (status !== 'authenticated' || dbSyncedRef.current) return;
    dbSyncedRef.current = true;
    const syncKey = `nudges_synced_${session?.user?.id ?? ''}`;
    const synced = sessionStorage.getItem(syncKey);
    if (synced) {
      nudgesSyncedRef.current = true;
      if (lsGet(LS.sitting) === '1') sittingStateRef.current = 'answered';
      else if (synced === 'answered' || synced === 'unanswered') sittingStateRef.current = synced;
      return;
    }
    const student = session?.user?.role === 'STUDENT';
    fetch('/api/nudges')
      .then((r) => r.json())
      .then(({ nudgesShown }: { nudgesShown: string[] }) => {
        for (const key of nudgesShown) lsSet(`nudge_shown_${key}`, '1');
        if (!student) sessionStorage.setItem(syncKey, '1');
        nudgesSyncedRef.current = true;
        // Don't wait for the 30 s tick: the partner card is meant for right after sign-in.
        checkNudges(lsNum(LS.usageMs), lsNum(LS.sessionCount));
      })
      .catch(() => {});
    if (!student) return;
    fetch('/api/me/sitting')
      .then((r) => r.json())
      .then(({ sitting }: { sitting: string | null }) => {
        if (isSitting(sitting)) {
          sittingStateRef.current = 'answered';
          lsSet(LS.sitting, '1');
          ph?.setPersonProperties({ exam_sitting: sitting });
        } else {
          sittingStateRef.current = 'unanswered';
        }
        sessionStorage.setItem(syncKey, sittingStateRef.current);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      checkNudges(total, sessions);
    }, 30_000);

    checkNudges(lsNum(LS.usageMs), sessions);

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

  if (activeNudge === 'sitting') {
    return <SittingCard onPick={saveSitting} onDismiss={() => dismissNudge('sitting')} />;
  }

  if (activeNudge === 'flowchart') {
    return (
      <NudgeCard
        icon={Workflow}
        title="Draw and run a flowchart"
        description="The flowchart maker uses the Cambridge symbols. Draw a program, run it with real input, or turn code you already have into a diagram."
        ctaLabel="Open the flowchart maker"
        onCta={() => handleCta('flowchart', () => router.push('/flowchart?from=nudge_flowchart'))}
        onDismiss={() => dismissNudge('flowchart')}
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

  if (activeNudge === 'partner') {
    return (
      <NudgeCard
        icon={Camera}
        title="Marking paper scripts too?"
        description={`${PARTNERS.learningmate.name} grades a student's paper from a photo or upload, with feedback on each question.`}
        meta="Partner"
        ctaLabel="Grade a paper free"
        onCta={() =>
          handleCta('partner', () => {
            captureEvent('partner_ad_clicked', { partner: 'learningmate', surface: 'popup' });
            window.open(partnerOutHref('learningmate', 'popup'), '_blank', 'noopener');
          })
        }
        onDismiss={() => {
          captureEvent('partner_ad_dismissed', { partner: 'learningmate', surface: 'popup' });
          dismissNudge('partner');
        }}
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
