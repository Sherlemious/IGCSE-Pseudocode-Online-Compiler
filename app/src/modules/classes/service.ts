import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';
import { HttpError, conflict, notFound } from '@/shared/http/errors';
import { generateShareCode, normalizeShareCode } from '@/shared/lib/shareCode';
import {
  getEntitlements,
  getPremiumAccess,
  isAtStudentCap,
  limitsForUser,
  revalidatePremiumAccess,
} from '@/modules/billing/entitlements';
import { PREMIUM_GATING_ENABLED } from '@/modules/billing/featureFlags';
import { findOwnedExam } from '@/modules/exams/repo';
import { promoteToTeacher } from '@/modules/auth/userRepo';
import * as repo from './repo';

/** A class/assignment failure with its HTTP status and machine-readable code. */
export class ClassRequestError extends HttpError {
  constructor(status: number, code: string, message: string) {
    super(status, message, code);
  }
}

const unavailable = () => new ClassRequestError(404, 'ASSIGNMENT_UNAVAILABLE', 'This assignment is no longer available.');
const plural = (n: number) => `${n} class${n === 1 ? '' : 'es'}`;
const isUniqueViolation = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';

/** Throws a 404 unless `userId` owns the class. Same answer for "missing" and "not yours". */
async function requireOwnedClass(classId: string, userId: string) {
  const cls = await repo.findClassOwnership(classId);
  if (!cls || cls.ownerId !== userId) throw notFound();
  return cls;
}

// ── Teacher: classes ───────────────────────────────────────────────────────

/** Create a class within the plan's class limit. The first class makes a student a teacher. */
export async function createClass(user: { id: string; role: string }, name: string) {
  const { limits } = await getEntitlements(user.id);
  if ((await repo.countActiveClasses(user.id)) >= limits.maxClasses) {
    throw new ClassRequestError(403, 'LIMIT_CLASSES', `Your plan allows ${plural(limits.maxClasses)}. Upgrade to add more.`);
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const created = await repo.createClass({ ownerId: user.id, name, joinCode: generateShareCode() });
      if (user.role !== 'ADMIN') await promoteToTeacher(user.id);
      return created;
    } catch (err) {
      if (isUniqueViolation(err)) continue; // joinCode collision — regenerate
      throw err;
    }
  }
  throw new HttpError(500, 'Could not generate a unique join code. Please try again.');
}

export async function listClasses(userId: string) {
  const [owned, enrolled] = await Promise.all([repo.listOwnedClasses(userId), repo.listEnrolledClasses(userId)]);
  return { owned, enrolled };
}

export async function getOwnedClassWithRoster(classId: string, userId: string) {
  const cls = await repo.findClassWithRoster(classId);
  if (!cls || cls.ownerId !== userId) throw notFound();
  return cls;
}

/**
 * Rename and/or archive a class. Archived classes don't count toward the plan
 * limits, so restoring one is checked like creating a class and adding its students.
 */
export async function updateClass(classId: string, userId: string, data: { name?: string; archived?: boolean }) {
  const cls = await requireOwnedClass(classId, userId);
  if (data.archived === false && cls.archived) {
    const { limits } = await getEntitlements(userId);
    const [activeClasses, activeStudents] = await Promise.all([
      repo.countActiveClasses(userId),
      repo.countActiveStudents(userId),
    ]);
    if (activeClasses >= limits.maxClasses) {
      throw new ClassRequestError(
        403,
        'LIMIT_CLASSES',
        `Your plan allows ${plural(limits.maxClasses)}. Archive another class or upgrade to restore this one.`,
      );
    }
    if (activeStudents + cls._count.memberships > limits.maxStudentsTotal) {
      throw new ClassRequestError(403, 'LIMIT_STUDENTS', 'Restoring this class would go over your plan’s student limit.');
    }
  }
  await repo.updateClass(classId, data);
}

export async function removeStudent(classId: string, ownerId: string, studentId: string) {
  await requireOwnedClass(classId, ownerId);
  await repo.removeMember(classId, studentId);
}

// ── Teacher: assignments ───────────────────────────────────────────────────

/** Assign one of the teacher's own exams to a class they own. */
export async function assignExam(classId: string, userId: string, examId: string, dueDate: Date | null) {
  await requireOwnedClass(classId, userId);
  if (!(await findOwnedExam(examId, userId))) throw notFound('That exam could not be found.');
  try {
    return await repo.createAssignment({ classId, examId, dueDate });
  } catch (err) {
    if (isUniqueViolation(err)) throw conflict('That exam is already assigned to this class.', 'ALREADY_ASSIGNED');
    throw err;
  }
}

/** Remove an assignment. Student attempts survive (assignmentId is set null). */
export async function unassignExam(classId: string, userId: string, assignmentId: string) {
  const assignment = await repo.findAssignmentOwnership(assignmentId);
  if (!assignment || assignment.classId !== classId || assignment.class.ownerId !== userId) throw notFound();
  await repo.deleteAssignment(assignmentId);
}

// ── Student: joining and starting ──────────────────────────────────────────

export async function joinClass(userId: string, code: string, assignmentId?: string) {
  const joinCode = normalizeShareCode(code);
  const result = await prisma.$transaction(async (tx) => {
    // Every join locks the class before counting seats, including legacy join links.
    const classId = await repo.lockClassByJoinCode(joinCode, tx);
    if (!classId) throw new ClassRequestError(404, 'CLASS_NOT_FOUND', 'No class found for that code.');
    const cls = await repo.findClassForJoin(classId, tx);
    if (assignmentId && !(await repo.findJoinableAssignment(assignmentId, cls.id, tx))) throw unavailable();
    if (cls.ownerId === userId) {
      throw new ClassRequestError(400, 'OWN_CLASS', "That's your own class — you already manage it.");
    }
    if (await repo.findMembership(cls.id, userId, tx)) {
      return { classId: cls.id, name: cls.name, alreadyMember: true };
    }
    const [studentsInClass, studentsAcrossClasses] = await Promise.all([
      repo.countClassMembers(cls.id, tx),
      repo.countActiveStudents(cls.ownerId, tx),
    ]);
    if (isAtStudentCap({ limits: limitsForUser(cls.owner), studentsInClass, studentsAcrossClasses })) {
      throw new ClassRequestError(403, 'LIMIT_STUDENTS', 'This class is full. Ask your teacher to make room.');
    }
    await repo.addMember(cls.id, userId, tx);
    return { classId: cls.id, name: cls.name, alreadyMember: false };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
  // Joining a premium teacher's class grants entitlement; drop the cached
  // answer now rather than letting the student wait out the TTL.
  if (!result.alreadyMember) revalidatePremiumAccess(userId);
  return result;
}

export function startAssignment(userId: string, assignmentId: string) {
  return prisma.$transaction(async (tx) => {
    // Serialize duplicate launches across tabs/instances before looking for an attempt.
    if (!(await repo.lockAssignment(assignmentId, tx))) throw unavailable();
    const assignment = await repo.findAssignmentForStart(assignmentId, tx);
    const exam = assignment.exam;
    if (assignment.class.archived || !exam.isPublished || !exam.questions.length) throw unavailable();
    if (!(await repo.findMembership(assignment.classId, userId, tx))) {
      throw new ClassRequestError(403, 'NOT_ENROLLED', "You're not a member of this class.");
    }
    if (PREMIUM_GATING_ENABLED && exam.questions.some((q) => q.question.isPremium) && !await getPremiumAccess(userId, tx)) {
      throw new ClassRequestError(403, 'PREMIUM_REQUIRED', 'This assignment includes premium questions. Ask your teacher about class access.');
    }
    // Completed assignments lead to their results; sharing never creates a retake.
    const existing = await repo.findLatestAssignmentAttempt(userId, assignmentId, tx);
    if (existing) return { attemptId: existing.id, resumed: true };
    const attempt = await repo.createAssignmentAttempt({
      userId,
      assignmentId,
      examId: exam.id,
      timeLimitMin: exam.timeLimitMin,
      questionIds: exam.questions.map((q) => q.questionId),
    }, tx);
    return { attemptId: attempt.id, resumed: false };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}

/** Read only invitation metadata and the current student's membership/attempt. */
export function getAssignmentInvitation(userId: string, code: string, assignmentId: string) {
  return repo.findAssignmentInvitation(userId, normalizeShareCode(code), assignmentId);
}

