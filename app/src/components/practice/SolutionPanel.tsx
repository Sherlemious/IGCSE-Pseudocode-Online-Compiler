'use client';

import { useState, useCallback } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Lock, Eye, Loader2, Lightbulb } from 'lucide-react';

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
  const [revealed, setRevealed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(REVEALED_KEY(questionId)) === 'true';
    } catch {
      return false;
    }
  });

  const fetchSolution = useCallback(async (giveUp = false) => {
    setLoading(true);
    try {
      const url = `/api/questions/${questionId}/solution${giveUp ? '?giveUp=true' : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const result: SolutionData = await res.json();
        setData(result);
        if (!result.locked) {
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

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && !data) fetchSolution();
  };

  const handleGiveUp = () => {
    if (!confirm('Are you sure? This will reveal the model solution.')) return;
    fetchSolution(true);
  };

  const canView = isSolved || attemptCount >= 3;

  return (
    <div className="mt-4">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-semibold text-dark-text hover:text-light-text transition-colors w-full group"
      >
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <BookOpen size={13} className="text-primary" />
        <span>Model Solution</span>
        {isSolved && (
          <span className="ml-auto text-[10px] text-success font-mono">unlocked</span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-dark-text py-2">
              <Loader2 size={12} className="animate-spin" />
              Loading...
            </div>
          )}

          {/* Locked state */}
          {data?.locked && !loading && (
            <div className="bg-surface rounded-lg border border-border p-4 text-center">
              <Lock size={16} className="text-dark-text/40 mx-auto mb-2" />
              <p className="text-xs text-dark-text mb-2">
                {data.attemptsNeeded && data.attemptsNeeded > 0
                  ? `Grade ${data.attemptsNeeded} more time${data.attemptsNeeded > 1 ? 's' : ''} to unlock, or solve the question.`
                  : 'Sign in and attempt the question to unlock.'}
              </p>
              {attemptCount > 0 && (
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
                    <span className="mono-label text-primary">Solution</span>
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
    </div>
  );
}
