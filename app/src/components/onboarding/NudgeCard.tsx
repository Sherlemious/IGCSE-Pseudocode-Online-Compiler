'use client';

import { X, type LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  ctaLabel: string;
  onCta: () => void;
  onDismiss: () => void;
}

export default function NudgeCard({ icon: Icon, title, description, meta, ctaLabel, onCta, onDismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-76 bg-surface border border-border rounded-xl shadow-intense animate-fade-in-up overflow-hidden">
      {/* Accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <div className="flex items-start justify-between px-4 pt-3 pb-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 shrink-0">
            <Icon size={14} className="text-primary" />
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-dark-text hover:text-light-text transition-colors p-0.5 rounded -mt-0.5"
        >
          <X size={13} />
        </button>
      </div>

      <div className="px-4 pt-2.5 pb-4 space-y-3">
        <p className="text-sm font-medium text-light-text leading-snug">{title}</p>
        <p className="text-xs text-dark-text leading-relaxed">{description}</p>

        {meta && (
          <p className="text-[10px] text-dark-text/50">{meta}</p>
        )}

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={onCta}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-2 rounded-lg text-xs text-dark-text hover:text-light-text hover:bg-background transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
