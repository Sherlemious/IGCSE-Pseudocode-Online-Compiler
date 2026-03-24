'use client';

import { useState } from 'react';
import { X, MessageSquare, Check } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';

const LS_KEY = 'feedback_survey_shown';

const RATING_META: Record<number, { label: string; color: string }> = {
  1: { label: 'Very frustrating', color: 'text-red-400 border-red-400/60 bg-red-400/10' },
  2: { label: 'Needs work',       color: 'text-orange-400 border-orange-400/60 bg-orange-400/10' },
  3: { label: 'Decent',           color: 'text-yellow-400 border-yellow-400/60 bg-yellow-400/10' },
  4: { label: 'Pretty good',      color: 'text-primary border-primary/60 bg-primary/10' },
  5: { label: 'Love it',          color: 'text-success border-success/60 bg-success/10' },
};

const FOLLOW_UP: Record<'low' | 'mid' | 'high', {
  question: string;
  placeholder: string;
  tags: { id: string; label: string }[];
}> = {
  low: {
    question: "Sorry to hear that. What went wrong?",
    placeholder: "Tell us what happened — even a few words help.",
    tags: [
      { id: 'errors_confusing',  label: 'Error messages are confusing' },
      { id: 'bugs',              label: 'Something is broken' },
      { id: 'missing_features',  label: 'Missing features I need' },
      { id: 'too_slow',          label: 'Slow or laggy' },
      { id: 'hard_to_use',       label: 'Hard to use' },
    ],
  },
  mid: {
    question: "What would make it better for you?",
    placeholder: "What's the one thing you'd most like improved?",
    tags: [
      { id: 'better_errors',    label: 'Clearer error messages' },
      { id: 'more_examples',    label: 'More starter examples' },
      { id: 'more_features',    label: 'More language features' },
      { id: 'faster',           label: 'Faster execution' },
      { id: 'better_editor',    label: 'Better code editor' },
    ],
  },
  high: {
    question: "Glad it's working! What do you love?",
    placeholder: "Anything you'd like to see added? (optional)",
    tags: [
      { id: 'errors',       label: 'Error messages' },
      { id: 'editor',       label: 'Code editor' },
      { id: 'speed',        label: 'Speed' },
      { id: 'exam_mode',    label: 'Exam mode' },
      { id: 'practice',     label: 'Practice questions' },
    ],
  },
};

interface Props {
  onDismiss: () => void;
}

export default function FeedbackSurvey({ onDismiss }: Props) {
  const ph = usePostHog();
  const [step, setStep] = useState<'rating' | 'followup' | 'done'>('rating');
  const [rating, setRating] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const dismiss = () => {
    try { localStorage.setItem(LS_KEY, 'true'); } catch { /* ignore */ }
    onDismiss();
  };

  const tier = rating == null ? 'mid'
    : rating <= 2 ? 'low'
    : rating === 3 ? 'mid'
    : 'high';

  const toggleTag = (id: string) =>
    setTags((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const goNext = () => {
    if (!rating) return;
    setStep('followup');
  };

  const submit = () => {
    ph?.capture('feedback_submitted', {
      rating,
      tier,
      tags: tags.length ? tags : undefined,
      comment: comment.trim() || undefined,
    });
    try { localStorage.setItem(LS_KEY, 'true'); } catch { /* ignore */ }
    setStep('done');
    setTimeout(onDismiss, 2000);
  };

  const followUp = FOLLOW_UP[tier];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-surface border border-border rounded-xl shadow-intense animate-fade-in-up overflow-hidden">
      {/* Accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
            <MessageSquare size={12} className="text-primary" />
          </div>
          <span className="text-xs font-semibold text-light-text">
            {step === 'rating'   ? 'Quick feedback'      :
             step === 'followup' ? 'A little more detail' :
             'Thank you'}
          </span>
        </div>
        <button onClick={dismiss} className="text-dark-text hover:text-light-text transition-colors p-0.5 rounded">
          <X size={13} />
        </button>
      </div>

      {/* Step: rating */}
      {step === 'rating' && (
        <div className="px-4 py-3.5 space-y-3.5">
          <p className="text-xs text-dark-text leading-relaxed">
            How is the pseudocode compiler working for you so far?
          </p>

          {/* 1–5 buttons */}
          <div className="flex items-center gap-1.5">
            {([1, 2, 3, 4, 5] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                title={RATING_META[r].label}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all duration-150
                  ${rating === r
                    ? RATING_META[r].color
                    : 'bg-background border-border text-dark-text hover:border-primary/40 hover:text-light-text'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Label */}
          <div className="h-3">
            {rating && (
              <p className="text-[10px] text-dark-text/70">{RATING_META[rating].label}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <button onClick={dismiss} className="text-[10px] text-dark-text hover:text-light-text transition-colors">
              Maybe later
            </button>
            <button
              onClick={goNext}
              disabled={!rating}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary
                hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step: follow-up */}
      {step === 'followup' && (
        <div className="px-4 py-3.5 space-y-3">
          <p className="text-xs text-dark-text leading-relaxed">{followUp.question}</p>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-1.5">
            {followUp.tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border transition-all duration-150
                  ${tags.includes(tag.id)
                    ? 'bg-primary/15 border-primary/50 text-primary'
                    : 'bg-background border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                  }`}
              >
                {tags.includes(tag.id) && <Check size={9} />}
                {tag.label}
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={followUp.placeholder}
            rows={3}
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-2
              text-light-text placeholder-dark-text/40 resize-none outline-none
              focus:border-primary/50 transition-colors"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={submit}
              className="text-[10px] text-dark-text hover:text-light-text transition-colors"
            >
              Skip
            </button>
            <button
              onClick={submit}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary
                hover:opacity-90 transition-opacity"
            >
              Send feedback
            </button>
          </div>
        </div>
      )}

      {/* Step: done */}
      {step === 'done' && (
        <div className="px-4 py-6 flex flex-col items-center gap-2 text-center">
          <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
            <Check size={15} className="text-success" />
          </div>
          <p className="text-sm font-medium text-light-text">Thanks for the feedback</p>
          <p className="text-xs text-dark-text">It genuinely helps make this better.</p>
        </div>
      )}
    </div>
  );
}

/** Returns true if the survey should be shown (not already seen) */
export function shouldShowFeedbackSurvey(): boolean {
  try { return !localStorage.getItem(LS_KEY); } catch { return false; }
}
