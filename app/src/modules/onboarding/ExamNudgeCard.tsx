'use client';

import { X, GraduationCap, Clock } from 'lucide-react';

interface Props {
  onStart: () => void;
  onDismiss: () => void;
}

export default function ExamNudgeCard({ onStart, onDismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-76 bg-surface border border-border rounded-xl shadow-intense animate-fade-in-up overflow-hidden">
      {/* Accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <div className="flex items-start justify-between px-4 pt-3 pb-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 shrink-0">
            <GraduationCap size={14} className="text-primary" />
          </div>
          <span className="text-xs font-semibold text-light-text">Practice exam</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-dark-text hover:text-light-text transition-colors p-0.5 rounded -mt-0.5"
        >
          <X size={13} />
        </button>
      </div>

      <div className="px-4 pt-2.5 pb-4 space-y-3">
        <p className="text-sm font-medium text-light-text leading-snug">
          Simulate a real IGCSE exam
        </p>
        <p className="text-xs text-dark-text leading-relaxed">
          Timed questions, automatic grading, and a score at the end — just like the real thing.
        </p>

        <div className="flex items-center gap-1.5 text-[10px] text-dark-text/60">
          <Clock size={10} />
          <span>45 min · multiple topics · instant results</span>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={onStart}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            Start Exam
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
