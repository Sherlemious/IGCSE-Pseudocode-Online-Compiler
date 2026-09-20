'use client';

import { formatSolveCount, solveCountLabel, type QuestionSocialStat } from './socialStats';

export default function SolveCountChip({
  stat,
  compact = false,
}: {
  stat: QuestionSocialStat;
  compact?: boolean;
}) {
  const label = solveCountLabel(stat);
  if (compact) {
    return (
      <span
        className="hidden sm:inline text-[10px] text-dark-text/80 font-mono tabular-nums"
        title={label}
      >
        {formatSolveCount(stat.solved)} solved
      </span>
    );
  }
  return (
    <p className="text-[11px] text-dark-text font-mono tabular-nums mb-4" title={label}>
      {label}
    </p>
  );
}
