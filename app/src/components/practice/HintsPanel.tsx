'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  questionId: string;
}

const HINTS_KEY = (id: string) => `hints_revealed:${id}`;
const FAILS_KEY = (id: string) => `hints_fails:${id}`;
const NUDGED_KEY = (id: string) => `hints_nudged:${id}`;

/** Consecutive failed "Check My Answer" runs before we proactively offer a hint. */
const STUCK_THRESHOLD = 2;

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
  const [nudged, setNudged] = useState<boolean>(() => {
    try {
      return localStorage.getItem(NUDGED_KEY(questionId)) === 'true';
    } catch {
      return false;
    }
  });
  const [justNudged, setJustNudged] = useState(false);

  const totalHints = hints?.length ?? 0;
  const allRevealed = totalHints > 0 && revealed >= totalHints;

  // Refs so the (once-bound) grade listener always sees current values.
  const nudgedRef = useRef(nudged);
  const allRevealedRef = useRef(allRevealed);
  const hintsLenRef = useRef(totalHints);
  useEffect(() => { nudgedRef.current = nudged; }, [nudged]);
  useEffect(() => { allRevealedRef.current = allRevealed; }, [allRevealed]);
  useEffect(() => { hintsLenRef.current = totalHints; }, [totalHints]);

  const fetchHints = useCallback(async (): Promise<string[]> => {
    if (hints !== null) return hints;
    setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/hints`);
      if (res.ok) {
        const data = await res.json();
        const list: string[] = data.hints ?? [];
        setHints(list);
        return list;
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
    return [];
  }, [hints, questionId]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) fetchHints();
  };

  const revealNext = useCallback(() => {
    setRevealed((prev) => {
      if (hintsLenRef.current > 0 && prev >= hintsLenRef.current) return prev;
      const next = prev + 1;
      try {
        localStorage.setItem(HINTS_KEY(questionId), String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [questionId]);

  // Proactively surface a hint once the student appears stuck.
  const triggerNudge = useCallback(async () => {
    setIsOpen(true);
    const list = await fetchHints();
    if (list.length === 0) return; // nothing to offer
    setNudged(true);
    setJustNudged(true);
    try {
      localStorage.setItem(NUDGED_KEY(questionId), 'true');
    } catch {
      /* ignore */
    }
    revealNext();
  }, [fetchHints, revealNext, questionId]);

  // Listen for grade results from PracticeWorkspace.
  useEffect(() => {
    const handler = (e: Event) => {
      const { allPassed } = (e as CustomEvent<{ allPassed?: boolean; isSolved?: boolean }>).detail ?? {};
      const solved = allPassed ?? (e as CustomEvent<{ isSolved?: boolean }>).detail?.isSolved;
      if (solved) {
        // Solved — reset the stuck counter so a later revisit starts fresh.
        try { localStorage.setItem(FAILS_KEY(questionId), '0'); } catch { /* ignore */ }
        setJustNudged(false);
        return;
      }
      let fails = 0;
      try {
        fails = (parseInt(localStorage.getItem(FAILS_KEY(questionId)) ?? '0', 10) || 0) + 1;
        localStorage.setItem(FAILS_KEY(questionId), String(fails));
      } catch {
        /* ignore */
      }
      if (fails >= STUCK_THRESHOLD && !nudgedRef.current && !allRevealedRef.current) {
        triggerNudge();
      }
    };
    window.addEventListener('practice:graded', handler);
    return () => window.removeEventListener('practice:graded', handler);
  }, [questionId, triggerNudge]);

  return (
    <div className="mt-5">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-semibold text-dark-text hover:text-light-text transition-colors w-full group"
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Lightbulb size={13} className={`text-warning ${justNudged && !isOpen ? 'animate-pulse' : ''}`} />
        <span>Hints</span>
        {justNudged && (
          <span className="text-[10px] text-warning font-medium normal-case">Stuck? Here&apos;s a hint</span>
        )}
        {totalHints > 0 && revealed > 0 && (
          <span className="ml-auto text-[10px] font-mono text-dark-text/60">
            {Math.min(revealed, totalHints)}/{totalHints}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          {loading && (
            <div className="space-y-2 animate-pulse">
              <div className="bg-surface rounded-lg border border-border p-3">
                <div className="h-3 bg-background rounded w-3/4 mb-1.5" />
                <div className="h-3 bg-background rounded w-1/2" />
              </div>
              <div className="bg-surface rounded-lg border border-border p-3">
                <div className="h-3 bg-background rounded w-full mb-1.5" />
                <div className="h-3 bg-background rounded w-2/3" />
              </div>
            </div>
          )}

          {hints !== null && totalHints === 0 && (
            <p className="text-xs text-dark-text/50 py-1">No hints available for this question.</p>
          )}

          {hints !== null && totalHints > 0 && (
            <>
              {justNudged && (
                <p className="text-[11px] text-warning/80 leading-relaxed">
                  Looks like you&apos;re stuck — here&apos;s a hint to get you going.
                </p>
              )}
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
