'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Braces, Map as MapIcon } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';

export const LEARN_FIRST_SEEN_KEY = 'learn_first_start_seen';

type Props = {
  /** Called when they pick the compiler; the playground carries on as usual. */
  onUseCompiler: () => void;
};

/**
 * `learn-first-start` experiment, test arm: a first-time visitor on the
 * playground is offered the Paper 2 Path as the default way in, with the
 * compiler one click away. Both paying students so far converted inside
 * Learn, but only ~6% of people who run code ever open it.
 */
export default function LearnFirstStart({ onUseCompiler }: Props) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    try {
      localStorage.setItem(LEARN_FIRST_SEEN_KEY, '1');
    } catch {
      /* the card may show again next visit; harmless */
    }
    captureEvent('learn_first_start_shown', {});
  }, []);

  const chooseCompiler = () => {
    captureEvent('learn_first_start_clicked', { choice: 'compiler' });
    onUseCompiler();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="learn-first-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-intense">
        <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        <div className="p-5 sm:p-6">
          <h2 id="learn-first-title" className="text-base font-semibold text-light-text">
            New to pseudocode? Start here.
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-dark-text">
            The Paper 2 Path teaches Cambridge pseudocode one short lesson at a time, from OUTPUT to
            exam-style algorithms. Every exercise is checked for you. The first three levels are free.
          </p>

          <Link
            href="/learn?from=first_visit"
            onClick={() => captureEvent('learn_first_start_clicked', { choice: 'learn' })}
            className="mt-5 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <MapIcon size={17} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-light-text">Start the Paper 2 Path</span>
              <span className="block text-xs text-dark-text">Short lessons, checked as you go</span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-primary" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={chooseCompiler}
            className="mt-2 flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-background"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-dark-text">
              <Braces size={17} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-light-text">Just use the compiler</span>
              <span className="block text-xs text-dark-text">Write and run your own pseudocode</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
