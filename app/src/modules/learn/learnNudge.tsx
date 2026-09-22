'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, Crown, Map as MapIcon, X } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { loadProgress } from './progress';

const SHOWN_KEY = 'learn_nudge_shown';

export type LearnNudgeSurface = 'playground' | 'practice';

/**
 * Students who reach the Paper 2 Path convert; most who only use the editor
 * never find it. After a success in the playground or practice, point them at
 * the path once per browser. Skipped if they have already started it.
 */
export function suggestLearnPath(surface: LearnNudgeSurface): void {
  try {
    if (localStorage.getItem(SHOWN_KEY) === '1') return;
    if (Object.keys(loadProgress()).length > 0) return;
    localStorage.setItem(SHOWN_KEY, '1');
  } catch {
    return;
  }

  const nudge = `learn_path_${surface}`;
  captureEvent('nudge_shown', { nudge, surface });

  const title = surface === 'practice' ? 'Nice — that one passed.' : 'It ran. Nice.';

  toast.custom(
    (toastId) => (
      <div className="relative flex w-[340px] max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-3 pr-8 text-light-text shadow-intense backdrop-blur-md">
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <MapIcon size={17} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold">{title}</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-dark-text">
            The Paper 2 Path takes you from OUTPUT to exam-style algorithms in short, auto-checked
            lessons. The first three levels are free.
          </span>
          <Link
            href={`/learn?from=${nudge}`}
            onClick={() => {
              captureEvent('nudge_clicked', { nudge, surface });
              toast.dismiss(toastId);
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/20"
          >
            Start the path
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </span>
        <button
          type="button"
          onClick={() => {
            captureEvent('nudge_dismissed', { nudge, surface });
            toast.dismiss(toastId);
          }}
          className="absolute right-2 top-2 rounded-md p-1 text-dark-text hover:bg-background hover:text-light-text"
          aria-label="Dismiss"
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>
    ),
    { duration: 15_000, position: 'bottom-right', unstyled: true },
  );
}

/**
 * Shown when a student finishes the last free level: they are signed in and
 * at peak momentum, so hand them straight to the student checkout.
 */
export function promptLearnUpgrade(finishedLevel: number, nextLevel: number): void {
  const nudge = 'learn_upgrade_level_complete';
  captureEvent('nudge_shown', { nudge, level: finishedLevel });

  toast.custom(
    (toastId) => (
      <div className="relative flex w-[340px] max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-3 pr-8 text-light-text shadow-intense backdrop-blur-md">
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-warning" />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning ring-1 ring-inset ring-warning/20">
          <Crown size={17} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold">Level {finishedLevel} done. That was the free part.</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-dark-text">
            Level {nextLevel} onwards is what Paper 2 actually tests: IF, loops, arrays, functions,
            files and exam-style problems.
          </span>
          <Link
            href="/pricing?view=student&checkout=student&from=learn_level_complete"
            onClick={() => {
              captureEvent('nudge_clicked', { nudge, level: finishedLevel });
              toast.dismiss(toastId);
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-warning/30 bg-warning/10 px-2.5 py-1.5 text-[11px] font-semibold text-warning transition-colors hover:border-warning/50 hover:bg-warning/20"
          >
            Unlock levels {nextLevel}–10
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </span>
        <button
          type="button"
          onClick={() => {
            captureEvent('nudge_dismissed', { nudge, level: finishedLevel });
            toast.dismiss(toastId);
          }}
          className="absolute right-2 top-2 rounded-md p-1 text-dark-text hover:bg-background hover:text-light-text"
          aria-label="Dismiss"
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>
    ),
    { duration: 20_000, position: 'bottom-right', unstyled: true },
  );
}
