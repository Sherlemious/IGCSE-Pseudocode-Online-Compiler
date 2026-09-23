'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from 'posthog-js/react';

/**
 * Runs inside both PostHogProvider and SessionWrapper.
 * - Identifies authenticated users so all their events are linked in PostHog.
 * - Fires `user_authenticated` once per browser session (sessionStorage guard)
 *   so the conversion funnel can distinguish sign-in from page reloads.
 * - Calls ph.reset() on sign-out to start a fresh anonymous person.
 */
export default function SessionIdentifier() {
  const { data: session, status } = useSession();
  const ph = usePostHog();
  const prevUserIdRef = useRef<string | undefined>(undefined);
  const prevRoleRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!ph || status === 'loading') return;

    const userId = session?.user?.id;

    if (userId && prevUserIdRef.current !== userId) {
      // Identify the person so anonymous pre-auth events merge with the user
      ph.identify(userId, {
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        plan: session.user.plan,
        role: session.user.role,
      });

      // Fire conversion event once per browser session (not on every page reload)
      const storageKey = `ph_authed_${userId}`;
      if (!sessionStorage.getItem(storageKey)) {
        ph.capture('user_authenticated', {
          plan: session.user.plan,
        });
        sessionStorage.setItem(storageKey, '1');
      }

      prevUserIdRef.current = userId;
    } else if (!userId && prevUserIdRef.current) {
      // User just signed out — reset to a new anonymous person
      ph.capture('user_signed_out');
      ph.reset();
      prevUserIdRef.current = undefined;
      prevRoleRef.current = undefined;
    }

    // Role can change mid-session (the /onboarding role pick), after identify ran.
    const role = session?.user?.role;
    if (userId && role && role !== prevRoleRef.current) {
      if (prevRoleRef.current) ph.setPersonProperties({ role });
      prevRoleRef.current = role;
      // Triggers the teacher onboarding email workflow; once per browser, and
      // the workflow itself only runs once per person.
      if (role === 'TEACHER') {
        const teacherKey = `ph_teacher_${userId}`;
        try {
          if (!localStorage.getItem(teacherKey)) {
            ph.capture('teacher_identified', { plan: session.user.plan });
            localStorage.setItem(teacherKey, '1');
          }
        } catch {
          // storage blocked — skip; the next visit will retry
        }
      }
    }
  }, [session, status, ph]);

  return null;
}
