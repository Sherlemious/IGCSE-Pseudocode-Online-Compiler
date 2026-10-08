import { prisma } from '@/shared/db';

/** The signed-in user's latest playground code (one row per user). Server-only. */

export function findPlaygroundSnapshot(userId: string) {
  return prisma.playgroundSnapshot.findUnique({ where: { userId }, select: { code: true, updatedAt: true } });
}

export function savePlaygroundSnapshot(userId: string, code: string) {
  return prisma.playgroundSnapshot.upsert({
    where: { userId },
    create: { userId, code },
    update: { code },
    select: { updatedAt: true },
  });
}
