'use client';

/**
 * Lightweight in-app feedback survey.
 *
 * Triggered by the parent after a threshold is crossed (e.g. 5 successful runs).
 * Responses are captured in PostHog's standard survey event format so the data
 * is already structured correctly when you wire up a native PostHog survey later.
 *
 * Survey ID kept stable so historical events stay connected to any future
 * PostHog survey object with the same ID.
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';

const LS_KEY = 'feedback_survey_shown';

const RATINGS = [1, 2, 3, 4, 5] as const;
const RATING_LABELS: Record<number, string> = {
  1: 'Very frustrating',
  2: 'Needs work',
  3: 'Decent',
  4: 'Pretty good',
  5: 'Love it',
};

interface Props {
  onDismiss: () => void;
}

export default function FeedbackSurvey({ onDismiss }: Props) {
  const ph = usePostHog();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const dismiss = () => {
    try { localStorage.setItem(LS_KEY, 'true'); } catch { /* ignore */ }
    onDismiss();
  };

  const submit = () => {
    if (!rating) return;
    ph?.capture('feedback_submitted', {
      rating,
      comment: comment.trim() || undefined,
    });
    try { localStorage.setItem(LS_KEY, 'true'); } catch { /* ignore */ }
    setSubmitted(true);
    setTimeout(onDismiss, 1800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-surface border border-border rounded-xl shadow-intense animate-fade-in-up">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border">
        <span className="text-xs font-semibold text-light-text">Quick feedback</span>
        <button onClick={dismiss} className="text-dark-text hover:text-light-text transition-colors p-0.5 rounded">
          <X size={13} />
        </button>
      </div>

      {submitted ? (
        <div className="px-4 py-5 text-center text-sm text-dark-text">
          Thanks — that really helps.
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3">
          <p className="text-xs text-dark-text">How is the compiler working for you?</p>

          {/* Rating */}
          <div className="flex items-center justify-between gap-1">
            {RATINGS.map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                title={RATING_LABELS[r]}
                className={`flex-1 py-1.5 rounded text-xs font-mono font-semibold border transition-all duration-150
                  ${rating === r
                    ? 'bg-primary border-primary text-on-primary'
                    : 'bg-background border-border text-dark-text hover:border-primary/50 hover:text-light-text'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>
          {rating && (
            <p className="text-[10px] text-dark-text/60 -mt-1">{RATING_LABELS[rating]}</p>
          )}

          {/* Optional comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything specific? (optional)"
            rows={2}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-2
              text-light-text placeholder-dark-text/40 resize-none outline-none
              focus:border-primary/50 transition-colors"
          />

          <div className="flex items-center justify-between">
            <button onClick={dismiss} className="text-[10px] text-dark-text hover:text-light-text transition-colors">
              Maybe later
            </button>
            <button
              onClick={submit}
              disabled={!rating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary
                hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Returns true if the survey should be shown (not already seen) */
export function shouldShowFeedbackSurvey(): boolean {
  try { return !localStorage.getItem(LS_KEY); } catch { return false; }
}
