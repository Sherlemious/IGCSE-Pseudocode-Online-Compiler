'use client';

import { useEffect, useState } from 'react';
import { X, CalendarDays, Check } from 'lucide-react';
import { SITTINGS, type Sitting } from './sittings';

interface Props {
  onPick: (sitting: Sitting) => void;
  onDismiss: () => void;
}

/** One-tap "which exam are you preparing for?" card. Shows a thank-you, then closes itself. */
export default function SittingCard({ onPick, onDismiss }: Props) {
  const [picked, setPicked] = useState<Sitting | null>(null);

  useEffect(() => {
    if (!picked) return;
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [picked, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-76 bg-surface border border-border rounded-xl shadow-intense animate-fade-in-up overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <div className="flex items-start justify-between px-4 pt-3 pb-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 shrink-0">
            <CalendarDays size={14} className="text-primary" />
          </div>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="text-dark-text hover:text-light-text transition-colors p-0.5 rounded -mt-0.5"
        >
          <X size={13} />
        </button>
      </div>

      <div className="px-4 pt-2.5 pb-4 space-y-3">
        {picked ? (
          <div className="flex items-center gap-2 py-2">
            <Check size={16} className="text-primary shrink-0" />
            <p className="text-sm font-medium text-light-text leading-snug">Thanks, good luck with your paper.</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-light-text leading-snug">Which exam are you preparing for?</p>
            <p className="text-xs text-dark-text leading-relaxed">
              One tap, so we can send the right practice at the right time.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {SITTINGS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setPicked(s.value);
                    onPick(s.value);
                  }}
                  className="py-2 rounded-lg text-xs font-semibold border border-border text-light-text hover:border-primary hover:text-primary transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
