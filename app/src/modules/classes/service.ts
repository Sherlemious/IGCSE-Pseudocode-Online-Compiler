import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';
import { normalizeShareCode } from '@/shared/lib/shareCode';
import { getPremiumAccess, limitsFor, tierForUser } from '@/modules/billing/entitlements';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';

export class ClassRequestError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
  }
}

const unavailable = () => new ClassRequestError(404, 'ASSIGNMENT_UNAVAILABLE', 'This assignment is no longer available.');

export function joinClass(userId: string, code: string, assignmentId?: string) {
  const joinCode = normalizeShareCode(code);
  return prisma.$transaction(async (tx) => {
    // Every join locks the class before counting seats, including legacy join links.
    const locked = await tx.$queryRaw<{ id: string }[]>`
      SELECT "id" FROM "Class" WHERE "joinCode" = ${joinCode} AND "archived" = false FOR UPDATE
    `;
    if (!locked.length) throw new ClassRequestError(404, 'CLASS_NOT_FOUND', 'No class found for that code.');
    const cls = await tx.class.findUniqueOrThrow({
      where: { id: locked[0].id },
      select: {
        id: true, name: true, ownerId: true,
        owner: { select: { plan: true, planTier: true, trialEndsAt: true, planExpiresAt: true } },
      },
    });
    if (assignmentId) {
      const assignment = await tx.assignment.findFirst({
        where: { id: assignmentId, classId: cls.id, exam: { isPublished: true, questions: { some: {} } } },
        select: { id: true },
      });
      if (!assignment) throw unavailable();
    }
    if (cls.ownerId === userId) {
      throw new ClassRequestError(400, 'OWN_CLASS', "That's your own class — you already manage it.");
    }
    const member = await tx.classMembership.findUnique({
      where: { classId_userId: { classId: cls.id, userId } }, select: { id: true },
    });
    if (member) return { classId: cls.id, name: cls.name, alreadyMember: true };
    // Seats are priced by TOTAL students across the teacher's classes, not per class.
    const totalStudents = await tx.classMembership.count({
      where: { class: { ownerId: cls.ownerId, archived: false } },
    });
    if (totalStudents >= limitsFor(tierForUser(cls.owner)).maxStudentsTotal) {
      throw new ClassRequestError(403, 'LIMIT_STUDENTS', 'This class is full. Ask your teacher to make room.');
    }
    await tx.classMembership.create({ data: { classId: cls.id, userId } });
    return { classId: cls.id, name: cls.name, alreadyMember: false };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}

export function startAssignment(userId: string, assignmentId: string) {
  return prisma.$transaction(async (tx) => {
    // Serialize duplicate launches across tabs/instances before looking for an attempt.
    const locked = await tx.$queryRaw<{ id: string }[]>`
      SELECT "id" FROM "Assignment" WHERE "id" = ${assignmentId} FOR UPDATE
    `;
    if (!locked.length) throw unavailable();
    const assignment = await tx.assignment.findUniqueOrThrow({
      where: { id: assignmentId },
      select: {
        classId: true, class: { select: { archived: true } },
        exam: { select: {
          id: true, isPublished: true, timeLimitMin: true,
          questions: { orderBy: { sortOrder: 'asc' }, select: { questionId: true, question: { select: { isPremium: true } } } },
        } },
      },
    });
    const exam = assignment.exam;
    if (assignment.class.archived || !exam.isPublished || !exam.questions.length) throw unavailable();
    const membership = await tx.classMembership.findUnique({
      where: { classId_userId: { classId: assignment.classId, userId } }, select: { id: true },
    });
    if (!membership) throw new ClassRequestError(403, 'NOT_ENROLLED', "You're not a member of this class.");
    if (PREMIUM_GATING_ENABLED && exam.questions.some((q) => q.question.isPremium) && !await getPremiumAccess(userId, tx)) {
      throw new ClassRequestError(403, 'PREMIUM_REQUIRED', 'This assignment includes premium questions. Ask your teacher about class access.');
    }
    const existing = await tx.examAttempt.findFirst({
      where: { userId, assignmentId }, orderBy: { createdAt: 'desc' }, select: { id: true },
    });
    // Completed assignments lead to their results; sharing never creates a retake.
    if (existing) return { attemptId: existing.id, resumed: true };
    const attempt = await tx.examAttempt.create({
      data: {
        userId, assignmentId, examId: exam.id, questionCount: exam.questions.length,
        timeLimitMin: exam.timeLimitMin,
        answers: { create: exam.questions.map((q, sortOrder) => ({ questionId: q.questionId, sortOrder })) },
      },
      select: { id: true },
    });
    return { attemptId: attempt.id, resumed: false };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}

/** Read only invitation metadata and the current student's membership/attempt. */
export function getAssignmentInvitation(userId: string, code: string, assignmentId: string) {
  return prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      class: { joinCode: normalizeShareCode(code), archived: false },
      exam: { isPublished: true, questions: { some: {} } },
    },
    select: {
      id: true, classId: true, dueDate: true,
      class: { select: {
        name: true, ownerId: true,
        owner: { select: { plan: true, trialEndsAt: true } },
        _count: { select: { memberships: true } },
        memberships: { where: { userId }, select: { id: true } },
      } },
      exam: { select: { title: true, timeLimitMin: true, _count: { select: { questions: true } } } },
      attempts: { where: { userId }, orderBy: { createdAt: 'desc' }, take: 1, select: { id: true, status: true } },
    },
  });
}
