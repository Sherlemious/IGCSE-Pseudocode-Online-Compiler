'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, Ticket, X } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { seriesEnd, studentCheckoutHref, studentCheckoutLabel } from '@/modules/billing/paddle/passes';
import { RETURN_PASS_SHOWN_KEY, RETURN_RUN_DAYS_KEY, recordPlaygroundRun } from './returnPass';

const NUDGE = 'playground_return';
const SESSION_KEY = 'nudge_sessions';

function forcedFromUrl(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('return_prompt') === '1';
  } catch {
    return false;
  }
}

/**
 * After a successful playground run, once per browser: the editor is free,
 * and the May/June paper is the part that is locked. Shows on a later day
 * than the first recorded run (or on the next run of someone already on
 * their 3rd session). Returns true when the toast is scheduled, so the
 * easy-question toast does not share that run.
 */
export function offerReturnPass(opts: { eligible: boolean; signedIn: boolean }): boolean {
  const force = forcedFromUrl();
  let stored: string | null = null;
  let shown = false;
  let sessions = 0;
  try {
    stored = localStorage.getItem(RETURN_RUN_DAYS_KEY);
    shown = localStorage.getItem(RETURN_PASS_SHOWN_KEY) === '1';
    sessions = parseInt(localStorage.getItem(SESSION_KEY) ?? '0', 10) || 0;
  } catch {
    return false;
  }

  const decision = recordPlaygroundRun(stored, sessions, new Date());
  try {
    localStorage.setItem(RETURN_RUN_DAYS_KEY, JSON.stringify(decision.days));
  } catch {
    /* the ask can still show this once */
  }

  if (!force && (shown || !decision.show || !opts.eligible)) return false;
  try {
    if (!force) localStorage.setItem(RETURN_PASS_SHOWN_KEY, '1');
  } catch {
    return false;
  }

  const until = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    seriesEnd('may_june'),
  );
  const href = studentCheckoutHref('playground_return');
  const label = studentCheckoutLabel();
  const props = {
    nudge: NUDGE,
    surface: 'playground',
    signed_in: opts.signedIn,
    run_days: decision.days.length,
  };

  window.setTimeout(() => {
    captureEvent('nudge_shown', props);
    toast.custom(
      (toastId) => (
        <div className="relative flex w-[340px] max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-3 pr-8 text-light-text shadow-intense backdrop-blur-md">
          <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Ticket size={17} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">You&apos;ve been back.</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-dark-text">
              The editor stays free. The May/June paper is the part that&apos;s locked: every Paper 2 level until{' '}
              {until}, one payment.
              {opts.signedIn ? ' No card? A parent can pay it.' : ' A parent can pay it from their phone.'}
            </span>
            <Link
              href={href}
              onClick={() => {
                captureEvent('nudge_clicked', props);
                toast.dismiss(toastId);
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/20"
            >
              {label}
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </span>
          <button
            type="button"
            onClick={() => {
              captureEvent('nudge_dismissed', props);
              toast.dismiss(toastId);
            }}
            className="absolute right-2 top-2 rounded-md p-1 text-dark-text hover:bg-background hover:text-light-text"
            aria-label="Dismiss"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>
      ),
      { duration: Infinity, position: 'bottom-right', unstyled: true },
    );
  }, force ? 0 : 1500);

  return true;
}
