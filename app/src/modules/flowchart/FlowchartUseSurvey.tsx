'use client';

// One-time question on the flowchart maker: how people want to use it.
// Shown once per browser, after they've had a moment with the canvas.

import { useEffect, useRef, useState } from 'react';
import { Check, Workflow, X } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { FLOWCHART_SURVEY_KEY } from './constants';

const DELAY_MS = 20_000;

export const FLOWCHART_USES = [
  { id: 'draw_and_run', label: 'Draw a flowchart and run it' },
  { id: 'from_code', label: 'Turn pseudocode into a flowchart' },
  { id: 'practice', label: 'Practise Paper 2 flowchart questions' },
  { id: 'teach', label: 'Set flowchart work for a class' },
  { id: 'looking', label: "I'm just looking" },
] as const;

export type FlowchartUseId = (typeof FLOWCHART_USES)[number]['id'];

function pageFrom(): string {
  try {
    return new URLSearchParams(window.location.search).get('from') ?? 'direct';
  } catch {
    return 'direct';
  }
}

function alreadyShown(): boolean {
  try {
    return localStorage.getItem(FLOWCHART_SURVEY_KEY) === '1';
  } catch {
    return true;
  }
}

function markShown() {
  try {
    localStorage.setItem(FLOWCHART_SURVEY_KEY, '1');
  } catch {
    // private mode
  }
}

export default function FlowchartUseSurvey() {
  const [open, setOpen] = useState(false);
  const [uses, setUses] = useState<FlowchartUseId[]>([]);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);
  const reported = useRef(false);

  useEffect(() => {
    const force = new URLSearchParams(window.location.search).get('flowchart_survey') === '1';
    if (!force && alreadyShown()) return;
    const t = setTimeout(() => setOpen(true), force ? 0 : DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open || reported.current) return;
    reported.current = true;
    markShown();
    captureEvent('flowchart_survey_shown', { from: pageFrom() });
  }, [open]);

  if (!open) return null;

  const toggle = (id: FlowchartUseId) =>
    setUses((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));

  const dismiss = () => {
    captureEvent('flowchart_survey_dismissed', { from: pageFrom() });
    setOpen(false);
  };

  const submit = () => {
    const note = comment.trim();
    const selected = uses.length ? uses : note ? (['other'] as const) : [];
    if (!selected.length) return;
    captureEvent('flowchart_survey_submitted', {
      uses: [...selected],
      comment: note || undefined,
      from: pageFrom(),
    });
    setDone(true);
    setTimeout(() => setOpen(false), 1800);
  };

  const canSend = uses.length > 0 || comment.trim().length > 0;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-surface border border-border rounded-xl shadow-intense animate-fade-in-up overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
            <Workflow size={12} className="text-primary" />
          </div>
          <span className="text-xs font-semibold text-light-text">
            {done ? 'Thanks' : 'How would you use this?'}
          </span>
        </div>
        {!done && (
          <button
            type="button"
            onClick={dismiss}
            className="text-dark-text hover:text-light-text transition-colors p-0.5 rounded"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {done ? (
        <div className="px-4 py-6 flex flex-col items-center gap-2 text-center">
          <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
            <Check size={15} className="text-success" />
          </div>
          <p className="text-sm font-medium text-light-text">That helps</p>
          <p className="text-xs text-dark-text">We&rsquo;ll use it to decide what to build next.</p>
        </div>
      ) : (
        <div className="px-4 py-3.5 space-y-2.5">
          <p className="text-xs text-dark-text leading-relaxed">
            Pick anything that fits. You can choose more than one.
          </p>
          <div className="space-y-1.5">
            {FLOWCHART_USES.map((use) => {
              const on = uses.includes(use.id);
              return (
                <button
                  key={use.id}
                  type="button"
                  onClick={() => toggle(use.id)}
                  className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] border transition-colors ${
                    on
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : 'bg-background border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                  }`}
                >
                  <span
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                      on ? 'border-primary bg-primary text-on-primary' : 'border-border'
                    }`}
                  >
                    {on && <Check size={9} />}
                  </span>
                  {use.label}
                </button>
              );
            })}
          </div>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Something else? (optional)"
            className="w-full text-xs bg-background border border-border rounded-lg px-2.5 py-2 text-light-text placeholder-dark-text/40 outline-none focus:border-primary/50 transition-colors"
          />
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={dismiss}
              className="text-[10px] text-dark-text hover:text-light-text transition-colors"
            >
              No thanks
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
