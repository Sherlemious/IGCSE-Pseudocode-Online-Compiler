'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, Target, X } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { readPlaygroundMistake } from '@/modules/interpreter/lastMistake';
import { DEFAULT_PRACTICE_TITLE, matchMistake } from './mistakeQuestions';
import { PRACTICE_QUESTION_MATCH_FLAG, readPracticeVariant } from './practiceCoach';

const SHOWN_KEY = 'playground_practice_shown';
const NUDGE = 'playground_practice';

function forcedFromUrl(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('practice_prompt') === '1';
  } catch {
    return false;
  }
}

/**
 * Once per browser, after a successful playground run: point at one easy
 * question. The test arm remembers the last playground mistake and opens the
 * question for it; with no mistake, Sum of Two Numbers stays the default.
 * Returns true when the toast is scheduled.
 */
export function suggestPlaygroundPractice(): boolean {
  const force = forcedFromUrl();
  try {
    if (!force && localStorage.getItem(SHOWN_KEY) === '1') return false;
    if (!force) localStorage.setItem(SHOWN_KEY, '1');
  } catch {
    return false;
  }

  window.setTimeout(() => {
    const variant = readPracticeVariant(PRACTICE_QUESTION_MATCH_FLAG);
    const remembered = variant === 'test' ? readPlaygroundMistake() : null;
    const matched = matchMistake(remembered?.hintId ?? null, remembered?.detail ?? null);
    const title = variant === 'test' ? (matched?.title ?? DEFAULT_PRACTICE_TITLE) : null;
    const href = title
      ? `/practice?from=playground_practice&mistake=${encodeURIComponent(matched?.key ?? 'sum')}`
      : '/practice?from=playground_practice';
    const props = {
      nudge: NUDGE,
      surface: 'playground',
      variant,
      hint_id: matched?.key ?? null,
      question_title: title ?? DEFAULT_PRACTICE_TITLE,
    };
    captureEvent('nudge_shown', props);
    toast.custom(
      (toastId) => (
        <div className="relative flex w-[340px] max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-3 pr-8 text-light-text shadow-intense backdrop-blur-md">
          <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Target size={17} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">
              {matched ? 'It ran. Practice that mistake.' : 'It ran. Try one easy question.'}
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-dark-text">
              {matched
                ? matched.blurb
                : 'Most people who only use the editor never solve a question. Practice has one short easy question picked for you — two numbers in, their sum out.'}
            </span>
            <Link
              href={href}
              onClick={() => {
                captureEvent('nudge_clicked', props);
                toast.dismiss(toastId);
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/20"
            >
              {matched ? 'Try that question' : 'Try the easy one'}
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
      { duration: 15_000, position: 'bottom-right', unstyled: true },
    );
  }, force ? 0 : 1500);

  return true;
}
