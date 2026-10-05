import { unstable_cache } from 'next/cache';
import { prisma } from '@/shared/db';
import { COURSE_CHOICES } from '@/modules/learn/courseChoice';
import { courseById } from '@/modules/learn/curriculum';
import { buildLearnAdminCourse, type LearnAdminRow } from './learnAdmin';

/** Same Neon window as analytics. Opening one learner still reads that row live. */
const LEARN_ADMIN_REVALIDATE_SECONDS = 300;

async function loadLearnAdmin() {
  const now = new Date();
  const rows = await prisma.learnProgress.findMany({
    where: { courseId: { in: COURSE_CHOICES.map((choice) => choice.id) } },
    select: {
      userId: true,
      courseId: true,
      lessonId: true,
      status: true,
      attempts: true,
      lastOk: true,
      lastReason: true,
      completedAt: true,
      updatedAt: true,
      user: { select: { name: true, email: true } },
    },
  });

  const flat: LearnAdminRow[] = rows.map((row) => ({
    userId: row.userId,
    courseId: row.courseId,
    lessonId: row.lessonId,
    status: row.status,
    attempts: row.attempts,
    lastOk: row.lastOk,
    lastReason: row.lastReason,
    completedAt: row.completedAt,
    updatedAt: row.updatedAt,
    name: row.user.name,
    email: row.user.email,
  }));

  return {
    generatedAt: now.toISOString(),
    learnerCount: new Set(flat.map((row) => row.userId)).size,
    courses: COURSE_CHOICES.flatMap((choice) => {
      const course = courseById(choice.id);
      if (!course) return [];
      return [buildLearnAdminCourse(flat, course, choice, now)];
    }),
  };
}

export const getLearnAdmin = unstable_cache(loadLearnAdmin, ['admin-learn'], {
  revalidate: LEARN_ADMIN_REVALIDATE_SECONDS,
});
