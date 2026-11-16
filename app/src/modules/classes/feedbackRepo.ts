import { prisma } from '@/shared/db';

/**
 * Teacher feedback on assignment answers. Prisma only; who may write and what
 * counts as valid text is the service's job (feedback.ts).
 */

/** The answer with the class its attempt's assignment belongs to (null for non-assignment attempts). */
export function findAnswerForFeedback(answerId: string) {
  return prisma.examAnswer.findUnique({
    where: { id: answerId },
    select: {
      id: true,
      examAttempt: {
        select: {
          assignmentId: true,
          assignment: { select: { classId: true, class: { select: { ownerId: true } } } },
        },
      },
    },
  });
}

/** Set (or clear, with null) the feedback. Clearing also clears who wrote it and when. */
export function saveAnswerFeedback(answerId: string, feedback: string | null, teacherId: string, at: Date) {
  return prisma.examAnswer.update({
    where: { id: answerId },
    data: feedback
      ? { teacherFeedback: feedback, feedbackAt: at, feedbackById: teacherId }
      : { teacherFeedback: null, feedbackAt: null, feedbackById: null, feedbackSeenAt: null },
    select: { id: true, teacherFeedback: true, feedbackAt: true },
  });
}

/** Mark every piece of feedback on the student's own attempt as read. */
export function markAttemptFeedbackSeen(attemptId: string, userId: string, at: Date) {
  return prisma.examAnswer.updateMany({
    where: { examAttemptId: attemptId, examAttempt: { userId }, teacherFeedback: { not: null } },
    data: { feedbackSeenAt: at },
  });
}
