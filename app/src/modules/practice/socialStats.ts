import { BRAND } from '@/shared/brand';

/** Hide counts until a question has this many solves so new papers do not look dead. */
export const SOCIAL_STATS_MIN_SOLVES = 5;
/** First-try % needs a slightly larger sample or it swings on one attempt. */
export const SOCIAL_STATS_FIRST_TRY_MIN = 10;

export type QuestionSocialStat = {
  solved: number;
  attempted: number;
  firstTryRate: number | null;
};

export type SocialStatRow = {
  questionId: string;
  attempted: number;
  solved: number;
  firstTry: number;
};

export function formatSolveCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${Math.round(n / 1000)}k`;
}

export function toPublicSocialStat(row: SocialStatRow): QuestionSocialStat | null {
  if (row.solved < SOCIAL_STATS_MIN_SOLVES) return null;
  return {
    solved: row.solved,
    attempted: row.attempted,
    firstTryRate:
      row.solved >= SOCIAL_STATS_FIRST_TRY_MIN
        ? Math.round((row.firstTry / row.solved) * 100)
        : null,
  };
}

export function firstSolveShareText(opts: {
  paperRef: string | null;
  title: string;
  solved: number | null;
  url: string;
}): string {
  const label = opts.paperRef ?? opts.title;
  const crowd = opts.solved != null ? ` — ${formatSolveCount(opts.solved)} students have done it` : '';
  return `I just solved ${label} on the ${BRAND.shortName}${crowd}. Can you?\n${opts.url}`;
}

export function solveCountLabel(stat: QuestionSocialStat): string {
  const base = `${formatSolveCount(stat.solved)} solved`;
  return stat.firstTryRate != null ? `${base} · ${stat.firstTryRate}% first try` : base;
}
