import { prisma } from '@/shared/db';
import type { LearnProgressRecord } from './progress';

/** Server-side Paper 2 Path progress (one row per user, course and lesson). */

const ROW_SELECT = {
  lessonId: true,
  status: true,
  attempts: true,
  lastOk: true,
  lastReason: true,
  lastCode: true,
  completedAt: true,
  updatedAt: true,
} as const;

export async function listLessonProgress(
  userId: string,
  courseId: string,
  lessonIds?: string[],
): Promise<LearnProgressRecord[]> {
  const rows = await prisma.learnProgress.findMany({
    where: { userId, courseId, ...(lessonIds ? { lessonId: { in: lessonIds } } : {}) },
    select: ROW_SELECT,
  });
  return rows as LearnProgressRecord[];
}

export interface LessonWrite {
  lessonId: string;
  status: 'COMPLETED' | 'ATTEMPTED';
  attempts: number;
  lastOk: boolean;
  lastReason: string | null;
  lastCode: string | null;
  completedAt: Date | null;
}

/** Writes every lesson in one transaction. */
export function saveLessonProgress(userId: string, courseId: string, lessons: LessonWrite[]) {
  return prisma.$transaction(
    lessons.map(({ lessonId, ...data }) =>
      prisma.learnProgress.upsert({
        where: { userId_courseId_lessonId: { userId, courseId, lessonId } },
        create: { userId, courseId, lessonId, ...data },
        update: data,
      }),
    ),
  );
}
