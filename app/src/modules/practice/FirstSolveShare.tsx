'use client';

import { useEffect, useRef, useState } from 'react';
import { Share2, X } from 'lucide-react';
import ShareButton from '@/modules/share/ShareButton';
import { absoluteUrl } from '@/shared/lib/seo';
import { firstSolveShareText } from './socialStats';
import { usePracticeSocialProofEnabled, useQuestionSocialStats } from './usePracticeSocialProof';

const SHOWN_KEY = (id: string) => `practice_first_solve_share:${id}`;

type Props = {
  questionId: string;
  title: string;
  paperRef: string | null;
  initiallySolved: boolean;
};

export default function FirstSolveShare({ questionId, title, paperRef, initiallySolved }: Props) {
  const enabled = usePracticeSocialProofEnabled();
  const stats = useQuestionSocialStats();
  const alreadySolved = useRef(initiallySolved);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    alreadySolved.current = initiallySolved;
  }, [initiallySolved, questionId]);

  useEffect(() => {
    if (!enabled || alreadySolved.current) return;

    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent<{ questionId?: string; isSolved?: boolean }>).detail;
      if (detail?.questionId === questionId && detail.isSolved) {
        alreadySolved.current = true;
      }
    };
    const onGraded = (e: Event) => {
      const detail = (e as CustomEvent<{ allPassed?: boolean }>).detail;
      if (!detail?.allPassed || alreadySolved.current) return;
      alreadySolved.current = true;
      try {
        if (sessionStorage.getItem(SHOWN_KEY(questionId)) === '1') return;
        sessionStorage.setItem(SHOWN_KEY(questionId), '1');
      } catch {
        /* private mode */
      }
      setOpen(true);
    };

    window.addEventListener('practice:progress', onProgress);
    window.addEventListener('practice:graded', onGraded);
    return () => {
      window.removeEventListener('practice:progress', onProgress);
      window.removeEventListener('practice:graded', onGraded);
    };
  }, [enabled, questionId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const url = absoluteUrl(`/practice/${questionId}`);
  const solved = stats.get(questionId)?.solved ?? null;
  const shareText = firstSolveShareText({ paperRef, title, solved, url });

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Share that you solved this question"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-surface border border-border rounded-lg w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-success/10">
              <Share2 size={13} className="text-success" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-light-text uppercase">
              Solved
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-dark-text hover:text-light-text p-0.5 rounded hover:bg-background transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4">
          <ShareButton
            headline="Send this question to a classmate"
            shareText={shareText}
            url={url}
            context="practice_first_solve"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full text-xs text-dark-text/70 hover:text-light-text transition-colors py-1"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
