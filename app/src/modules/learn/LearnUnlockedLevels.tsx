'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { IGCSE_PAPER_2 } from './curriculum';
import { levelStartHref } from './path';
import { readPaywallLevel } from './paywallLevel';
import { captureLearn } from './telemetry';

/**
 * Post-checkout next step for a student: every paid level, each opening at its
 * first lesson, with the level they were blocked on (if this browser saw the
 * paywall) promoted to the main button. Rendered on `/welcome`.
 */
export default function LearnUnlockedLevels() {
  const [blockedSlug, setBlockedSlug] = useState<string | null>(null);

  useEffect(() => {
    setBlockedSlug(readPaywallLevel());
  }, []);

  const levels = IGCSE_PAPER_2.levels.flatMap((level) => {
    const href = !level.free && level.playable ? levelStartHref(level) : null;
    return href ? [{ level, href }] : [];
  });
  const blocked = levels.find((item) => item.level.slug === blockedSlug) ?? null;

  function track(destination: string, level: number | null) {
    captureLearn('welcome_cta_clicked', {
      destination,
      level,
      recommended: level !== null && level === blocked?.level.number,
    });
  }

  return (
    <div className="mt-6 text-left">
      {blocked && (
        <Link
          href={blocked.href}
          onClick={() => track('learn_level', blocked.level.number)}
          className="flex items-center justify-between gap-3 rounded-lg bg-primary px-4 py-3 text-white hover:bg-primary-hover transition-colors"
        >
          <span className="min-w-0">
            <span className="block text-sm font-semibold">
              Start Level {blocked.level.number}: {blocked.level.name}
            </span>
            <span className="block text-xs text-white/80 truncate">{blocked.level.leaveWith}</span>
          </span>
          <ArrowRight size={16} className="shrink-0" />
        </Link>
      )}

      <p className="mono-label text-dark-text mt-6 mb-2">
        {blocked ? 'Or jump to any level' : 'Jump to any level'}
      </p>
      <ul className="divide-y divide-border rounded-lg border border-border">
        {levels.map(({ level, href }) => (
          <li key={level.slug}>
            <Link
              href={href}
              onClick={() => track('learn_level', level.number)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-background/60 transition-colors"
            >
              <span className="mono-label text-primary w-6 shrink-0 tabular-nums">{level.number}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-light-text">{level.name}</span>
                <span className="block text-xs text-dark-text truncate">{level.leaveWith}</span>
              </span>
              <ArrowRight size={14} className="shrink-0 text-dark-text" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        <Link href="/learn" onClick={() => track('learn_path', null)} className="text-primary hover:underline">
          See the whole path
        </Link>
        <Link href="/" onClick={() => track('editor', null)} className="text-primary hover:underline">
          Open the editor
        </Link>
      </div>
    </div>
  );
}
