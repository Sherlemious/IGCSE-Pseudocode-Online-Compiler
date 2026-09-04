'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Lock, Eye, Lightbulb, X, Copy, Check } from 'lucide-react';

interface Props {
  questionId: string;
  isSolved: boolean;
  attemptCount: number;
}

interface SolutionData {
  locked: boolean;
  solution?: string | null;
  explanation?: string | null;
  attemptsNeeded?: number;
}

const REVEALED_KEY = (id: string) => `solution_revealed:${id}`;

export default function SolutionPanel({ questionId, isSolved, attemptCount }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<SolutionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [localIsSolved, setLocalIsSolved] = useState(isSolved);
  const [localAttemptCount, setLocalAttemptCount] = useState(attemptCount);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(REVEALED_KEY(questionId)) === 'true';
    } catch {
      return false;
    }
  });

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const fetchSolution = useCallback(async (giveUp = false) => {
    setLoading(true);
    try {
      const url = `/api/questions/${questionId}/solution${giveUp ? '?giveUp=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const result: SolutionData = await res.json();
        setData(result);
        if (!result.locked) {
          setLocalIsSolved(true);
          setRevealed(true);
          try { localStorage.setItem(REVEALED_KEY(questionId), 'true'); } catch { /* ignore */ }
        }
      } else if (res.status === 401) {
        setData({ locked: true, attemptsNeeded: 0 });
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  // Listen for grade events from PracticeWorkspace
  useEffect(() => {
    const handler = (e: Event) => {
      const { isSolved: solved } = (e as CustomEvent<{ isSolved: boolean }>).detail;
      if (solved) setLocalIsSolved(true);
      setLocalAttemptCount((prev) => prev + 1);
      // Clear cache so next open re-fetches fresh data
      setData(null);
      // If panel is already open, immediately refetch
      if (isOpenRef.current) {
        fetchSolution();
      }
    };
    window.addEventListener('practice:graded', handler);
    return () => window.removeEventListener('practice:graded', handler);
  }, [fetchSolution]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && !data) fetchSolution();
  };

  const handleGiveUp = () => {
    setConfirmOpen(true);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-semibold text-dark-text hover:text-light-text transition-colors w-full group"
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <BookOpen size={13} className="text-primary" />
        <span>Model Solution</span>
        {localIsSolved && (
          <span className="ml-auto text-[10px] text-success font-mono">unlocked</span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          {/* Skeleton loader */}
          {loading && (
            <div className="animate-pulse">
              <div className="bg-surface rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/50 bg-primary/5">
                  <div className="h-3 w-3 bg-background/60 rounded" />
                  <div className="h-3 bg-background/60 rounded w-16" />
                </div>
                <div className="p-3 space-y-1.5">
                  {[70, 100, 85, 60, 90, 75].map((w, i) => (
                    <div key={i} className="h-3 bg-background/60 rounded" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Locked state */}
          {data?.locked && !loading && (
            <div className="bg-surface rounded-lg border border-border p-4 text-center">
              <Lock size={16} className="text-dark-text/40 mx-auto mb-2" />
              <p className="text-xs text-dark-text mb-2">
                {data.attemptsNeeded && data.attemptsNeeded > 0
                  ? `Check your answer ${data.attemptsNeeded} more time${data.attemptsNeeded > 1 ? 's' : ''} to unlock, or solve the question.`
                  : 'Sign in and attempt the question to unlock.'}
              </p>
              {localAttemptCount > 0 && (
                <button
                  onClick={handleGiveUp}
                  className="text-xs text-warning hover:text-light-text transition-colors flex items-center gap-1 mx-auto"
                >
                  <Eye size={11} />
                  Reveal anyway
                </button>
              )}
            </div>
          )}

          {/* Revealed state */}
          {data && !data.locked && !loading && (
            <div className="space-y-3">
              {data.solution && (
                <div className="bg-surface rounded-lg border border-border overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/50 bg-primary/5">
                    <BookOpen size={11} className="text-primary" />
                    <span className="mono-label text-primary flex-1">Solution</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(data.solution!).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                      className="text-dark-text/50 hover:text-primary transition-colors"
                      title="Copy solution"
                    >
                      {copied ? <Check size={11} className="text-success" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <pre className="p-3 text-xs font-mono text-light-text overflow-x-auto whitespace-pre-wrap
                    scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
                    {data.solution}
                  </pre>
                </div>
              )}

              {data.explanation && (
                <div className="bg-surface rounded-lg border border-border p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb size={11} className="text-warning" />
                    <span className="mono-label text-dark-text">Explanation</span>
                  </div>
                  <p className="text-xs text-light-text/85 leading-relaxed">
                    {data.explanation}
                  </p>
                </div>
              )}

              {!data.solution && !data.explanation && (
                <p className="text-xs text-dark-text/50 py-1">
                  No model solution available for this question yet.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirm reveal dialog */}
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="bg-surface border border-border rounded-xl p-5 max-w-sm w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-warning shrink-0" />
                <h3 className="text-sm font-semibold text-light-text">Reveal Model Solution?</h3>
              </div>
              <button
                onClick={() => setConfirmOpen(false)}
                className="text-dark-text hover:text-light-text transition-colors p-0.5"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs text-dark-text mb-4 leading-relaxed">
              This will show the full model solution before you&apos;ve solved the question. You&apos;ll learn more by solving it first.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-dark-text hover:text-light-text transition-colors rounded-lg hover:bg-background"
              >
                Keep trying
              </button>
              <button
                onClick={() => { setConfirmOpen(false); fetchSolution(true); }}
                className="px-3 py-1.5 text-xs font-medium text-warning bg-warning/10 hover:bg-warning/20 rounded-lg border border-warning/30 transition-colors"
              >
                Reveal anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
