import { unstable_cache } from 'next/cache';
import { prisma } from '@/shared/db';
import { toPublicSocialStat, type QuestionSocialStat, type SocialStatRow } from './socialStats';

export const SOCIAL_STATS_REVALIDATE_SECONDS = 3600;

async function querySocialStats(): Promise<Record<string, QuestionSocialStat>> {
  const rows = await prisma.$queryRaw<SocialStatRow[]>`
    SELECT "questionId",
           count(*)::int AS attempted,
           count(*) FILTER (WHERE status = 'SOLVED')::int AS solved,
           count(*) FILTER (WHERE status = 'SOLVED' AND attempts = 1)::int AS "firstTry"
    FROM "Progress"
    GROUP BY "questionId"
  `;
  const out: Record<string, QuestionSocialStat> = {};
  for (const row of rows) {
    const stat = toPublicSocialStat({
      questionId: row.questionId,
      attempted: Number(row.attempted),
      solved: Number(row.solved),
      firstTry: Number(row.firstTry),
    });
    if (stat) out[row.questionId] = stat;
  }
  return out;
}

export const getQuestionSocialStats = unstable_cache(querySocialStats, ['practice-social-stats'], {
  revalidate: SOCIAL_STATS_REVALIDATE_SECONDS,
});
