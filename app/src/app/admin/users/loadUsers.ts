import { unstable_cache } from 'next/cache';
import { prisma } from '@/shared/db';

export type UserFacets = {
  total: number;
  students: number;
  teachers: number;
  admins: number;
  paid: number;
  trial: number;
  expiring: number;
  quiet: number;
  path: number;
  practice: number;
  exams: number;
};

/**
 * Chip counts for the whole user table. Cached like the analytics dashboard so
 * flipping a filter doesn't recount every account. The page of rows itself
 * stays live.
 */
const FACET_REVALIDATE_SECONDS = 300;

async function loadUserFacets(): Promise<UserFacets> {
  const now = new Date();
  const soon = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const rows = await prisma.$queryRaw<UserFacets[]>`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE role = 'STUDENT'::"Role")::int AS students,
      count(*) FILTER (WHERE role = 'TEACHER'::"Role")::int AS teachers,
      count(*) FILTER (WHERE role = 'ADMIN'::"Role")::int AS admins,
      count(*) FILTER (WHERE plan <> 'FREE'::"Plan" AND ("planExpiresAt" IS NULL OR "planExpiresAt" > ${now}))::int AS paid,
      count(*) FILTER (WHERE "trialEndsAt" IS NOT NULL AND "trialEndsAt" > ${now})::int AS trial,
      count(*) FILTER (WHERE plan <> 'FREE'::"Plan" AND "planExpiresAt" IS NOT NULL AND "planExpiresAt" > ${now} AND "planExpiresAt" <= ${soon})::int AS expiring,
      count(*) FILTER (
        WHERE NOT EXISTS (SELECT 1 FROM "LearnProgress" lp WHERE lp."userId" = "User".id)
          AND NOT EXISTS (SELECT 1 FROM "Progress" p WHERE p."userId" = "User".id)
          AND NOT EXISTS (SELECT 1 FROM "ExamAttempt" e WHERE e."userId" = "User".id)
      )::int AS quiet,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "LearnProgress" lp WHERE lp."userId" = "User".id))::int AS path,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Progress" p WHERE p."userId" = "User".id))::int AS practice,
      count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "ExamAttempt" e WHERE e."userId" = "User".id))::int AS exams
    FROM "User"
  `;
  return rows[0] ?? {
    total: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    paid: 0,
    trial: 0,
    expiring: 0,
    quiet: 0,
    path: 0,
    practice: 0,
    exams: 0,
  };
}

export const getUserFacets = unstable_cache(loadUserFacets, ['admin-user-facets'], {
  revalidate: FACET_REVALIDATE_SECONDS,
});
