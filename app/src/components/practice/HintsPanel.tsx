'use client';

import { useState, useCallback } from 'react';
import { Lightbulb, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

interface Props {
  questionId: string;
}

const HINTS_KEY = (id: string) => `hints_revealed:${id}`;

export default function HintsPanel({ questionId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hints, setHints] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(HINTS_KEY(questionId)) ?? '0', 10);
    } catch {
      return 0;
    }
  });

  const fetchHints = useCallback(async () => {
    if (hints !== null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/hints`);
      if (res.ok) {
        const data = await res.json();
        setHints(data.hints ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [hints, questionId]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) fetchHints();
  };

  const revealNext = () => {
    const next = revealed + 1;
    setRevealed(next);
    try {
      localStorage.setItem(HINTS_KEY(questionId), String(next));
    } catch {
      /* ignore */
    }
  };

  const totalHints = hints?.length ?? 0;
  const allRevealed = totalHints > 0 && revealed >= totalHints;

  return (
    <div className="mt-5">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-semibold text-dark-text hover:text-light-text transition-colors w-full group"
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Lightbulb size={13} className="text-warning" />
        <span>Hints</span>
        {totalHints > 0 && revealed > 0 && (
          <span className="ml-auto text-[10px] font-mono text-dark-text/60">
            {Math.min(revealed, totalHints)}/{totalHints}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-dark-text py-2">
              <Loader2 size={12} className="animate-spin" />
              Loading hints...
            </div>
          )}

          {hints !== null && totalHints === 0 && (
            <p className="text-xs text-dark-text/50 py-1">No hints available for this question.</p>
          )}

          {hints !== null && totalHints > 0 && (
            <>
              {hints.slice(0, revealed).map((hint, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-lg border border-border p-3 text-xs text-light-text/85 animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="text-warning font-mono font-semibold mr-1.5">
                    {i + 1}.
                  </span>
                  {hint}
                </div>
              ))}

              {!allRevealed && (
                <button
                  onClick={revealNext}
                  className="flex items-center gap-1.5 text-xs text-warning hover:text-light-text transition-colors px-1 py-0.5"
                >
                  <Lightbulb size={11} />
                  Reveal hint {revealed + 1} of {totalHints}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
