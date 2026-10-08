import type { Plan, Role } from '@prisma/client';
import { prisma } from '@/shared/db';

/** User-row data access for account routes (profile, role, nudges, signup, admin edits). */

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: { id: true } });
}

export function createPasswordUser(data: { name: string | null; email: string; passwordHash: string; role: Role }) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.passwordHash,
      role: data.role,
      roleChosen: true, // picked in the signup form; no onboarding step needed
    },
    select: { id: true, email: true, name: true },
  });
}

export function findUserRole(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
}

export function setRole(userId: string, role: Role, opts: { markChosen?: boolean } = {}) {
  return prisma.user.update({
    where: { id: userId },
    data: { role, ...(opts.markChosen ? { roleChosen: true } : {}) },
    select: { id: true, role: true },
  });
}

/** Creating a first class makes the owner a teacher and settles onboarding. */
export function promoteToTeacher(userId: string) {
  return setRole(userId, 'TEACHER', { markChosen: true });
}

export function setName(userId: string, name: string) {
  return prisma.user.update({ where: { id: userId }, data: { name }, select: { id: true, name: true } });
}

export async function listNudgesShown(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { nudgesShown: true } });
  return user?.nudgesShown ?? [];
}

/** Adds the nudge only when absent, so repeat calls don't grow the array. */
export function addNudgeShown(userId: string, nudge: string) {
  return prisma.user.updateMany({
    where: { id: userId, NOT: { nudgesShown: { has: nudge } } },
    data: { nudgesShown: { push: nudge } },
  });
}

/** Admin plan edit. Dropping to FREE clears billing fields so the shown plan matches the entitlement. */
export function setPlanByAdmin(userId: string, plan: Plan) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      planUpdatedAt: new Date(),
      ...(plan === 'FREE' ? { planTier: null, trialEndsAt: null, planExpiresAt: null, legacyCapacity: false } : {}),
    },
    select: { id: true, plan: true, planTier: true, trialEndsAt: true, planUpdatedAt: true },
  });
}
