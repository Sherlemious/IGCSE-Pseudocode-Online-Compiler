import { prisma, type Db } from '@/shared/db';
import { OWNER_PLAN_SELECT } from '@/modules/billing/entitlements';

/**
 * Class data access. Only Prisma lives here; ownership, plan limits and
 * messages are the service's job (service.ts). Functions that can run inside a
 * transaction take `db` (defaults to the shared client).
 */

export function findClassOwnership(classId: string, db: Db = prisma) {
  return db.class.findUnique({
    where: { id: classId },
    select: { ownerId: true, archived: true, _count: { select: { memberships: true } } },
  });
}

export function findClassWithRoster(classId: string) {
  return prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      ownerId: true,
      name: true,
      joinCode: true,
      archived: true,
      createdAt: true,
      memberships: {
        orderBy: { joinedAt: 'asc' },
        select: { userId: true, joinedAt: true, user: { select: { name: true, email: true, image: true } } },
      },
    },
  });
}

export function listOwnedClasses(ownerId: string) {
  return prisma.class.findMany({
    where: { ownerId, archived: false },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, joinCode: true, createdAt: true, _count: { select: { memberships: true } } },
  });
}

export function listEnrolledClasses(userId: string) {
  return prisma.classMembership.findMany({
    where: { userId, class: { archived: false } },
    orderBy: { joinedAt: 'desc' },
    select: { joinedAt: true, class: { select: { id: true, name: true, owner: { select: { name: true } } } } },
  });
}

export function countActiveClasses(ownerId: string, db: Db = prisma) {
  return db.class.count({ where: { ownerId, archived: false } });
}

/** Students across the owner's non-archived classes. */
export function countActiveStudents(ownerId: string, db: Db = prisma) {
  return db.classMembership.count({ where: { class: { ownerId, archived: false } } });
}

export function countClassMembers(classId: string, db: Db = prisma) {
  return db.classMembership.count({ where: { classId } });
}

export function createClass(data: { ownerId: string; name: string; joinCode: string }) {
  return prisma.class.create({ data, select: { id: true, joinCode: true } });
}

export function updateClass(classId: string, data: { name?: string; archived?: boolean }) {
  return prisma.class.update({ where: { id: classId }, data });
}

/** Locks the class row (by join code) so concurrent joins count seats one at a time. */
export async function lockClassByJoinCode(joinCode: string, db: Db): Promise<string | null> {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "Class" WHERE "joinCode" = ${joinCode} AND "archived" = false FOR UPDATE
  `;
  return rows[0]?.id ?? null;
}

export function findClassForJoin(classId: string, db: Db) {
  return db.class.findUniqueOrThrow({
    where: { id: classId },
    select: { id: true, name: true, ownerId: true, owner: { select: OWNER_PLAN_SELECT } },
  });
}

export function findMembership(classId: string, userId: string, db: Db = prisma) {
  return db.classMembership.findUnique({
    where: { classId_userId: { classId, userId } },
    select: { id: true },
  });
}

export function addMember(classId: string, userId: string, db: Db) {
  return db.classMembership.create({ data: { classId, userId } });
}

export function removeMember(classId: string, userId: string) {
  return prisma.classMembership.deleteMany({ where: { classId, userId } });
}

// ── Assignments ────────────────────────────────────────────────────────────

/** A published, non-empty exam assigned to this class. */
export function findJoinableAssignment(assignmentId: string, classId: string, db: Db) {
  return db.assignment.findFirst({
    where: { id: assignmentId, classId, exam: { isPublished: true, questions: { some: {} } } },
    select: { id: true },
  });
}

export function findAssignmentOwnership(assignmentId: string) {
  return prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { classId: true, class: { select: { ownerId: true } } },
  });
}

export function createAssignment(data: { classId: string; examId: string; dueDate: Date | null }) {
  return prisma.assignment.create({ data, select: { id: true } });
}

export function deleteAssignment(assignmentId: string) {
  return prisma.assignment.delete({ where: { id: assignmentId } });
}

/** Locks the assignment row so duplicate launches across tabs create one attempt. */
export async function lockAssignment(assignmentId: string, db: Db): Promise<boolean> {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "Assignment" WHERE "id" = ${assignmentId} FOR UPDATE
  `;
  return rows.length > 0;
}

export function findAssignmentForStart(assignmentId: string, db: Db) {
  return db.assignment.findUniqueOrThrow({
    where: { id: assignmentId },
    select: {
      classId: true,
      class: { select: { archived: true } },
      exam: {
        select: {
          id: true,
          isPublished: true,
          timeLimitMin: true,
          questions: {
            orderBy: { sortOrder: 'asc' },
            select: { questionId: true, question: { select: { isPremium: true } } },
          },
        },
      },
    },
  });
}

export function findLatestAssignmentAttempt(userId: string, assignmentId: string, db: Db) {
  return db.examAttempt.findFirst({
    where: { userId, assignmentId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });
}

export function createAssignmentAttempt(
  data: { userId: string; assignmentId: string; examId: string; timeLimitMin: number; questionIds: string[] },
  db: Db,
) {
  return db.examAttempt.create({
    data: {
      userId: data.userId,
      assignmentId: data.assignmentId,
      examId: data.examId,
      questionCount: data.questionIds.length,
      timeLimitMin: data.timeLimitMin,
      answers: { create: data.questionIds.map((questionId, sortOrder) => ({ questionId, sortOrder })) },
    },
    select: { id: true },
  });
}

/** Invitation metadata plus the current student's membership and latest attempt. */
export function findAssignmentInvitation(userId: string, joinCode: string, assignmentId: string) {
  return prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      class: { joinCode, archived: false },
      exam: { isPublished: true, questions: { some: {} } },
    },
    select: {
      id: true, classId: true, dueDate: true,
      class: { select: {
        name: true, ownerId: true,
        owner: { select: OWNER_PLAN_SELECT },
        _count: { select: { memberships: true } },
        memberships: { where: { userId }, select: { id: true } },
      } },
      exam: { select: { title: true, timeLimitMin: true, _count: { select: { questions: true } } } },
      attempts: { where: { userId }, orderBy: { createdAt: 'desc' }, take: 1, select: { id: true, status: true } },
    },
  });
}
