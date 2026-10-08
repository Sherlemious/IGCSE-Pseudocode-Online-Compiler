import { prisma } from '@/shared/db';

/** Saved custom editor themes. `colors` is stored as a JSON string; validation lives in validation.ts. Server-only. */

const SELECT = { id: true, name: true, colors: true } as const;

export function listThemes(userId: string) {
  return prisma.customTheme.findMany({ where: { userId }, orderBy: { createdAt: 'asc' }, select: SELECT });
}

export function countThemes(userId: string) {
  return prisma.customTheme.count({ where: { userId } });
}

export function findOwnedTheme(id: string, userId: string) {
  return prisma.customTheme.findFirst({ where: { id, userId }, select: { id: true } });
}

export function createTheme(userId: string, name: string, colorsJson: string) {
  return prisma.customTheme.create({ data: { userId, name, colors: colorsJson }, select: SELECT });
}

export function updateTheme(id: string, data: { name?: string; colors?: string }) {
  return prisma.customTheme.update({ where: { id }, data, select: SELECT });
}

export function deleteTheme(id: string) {
  return prisma.customTheme.delete({ where: { id } });
}
