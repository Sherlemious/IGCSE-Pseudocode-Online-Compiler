import { badRequest, notFound } from '@/shared/http/errors';
import { optionalText } from '@/shared/http/input';
import { captureServerEvent } from '@/modules/telemetry/serverCapture';
import * as repo from './feedbackRepo';

/** Longest feedback a teacher can leave on one answer. */
export const FEEDBACK_MAX_CHARS = 5000;

export type FeedbackLengthBucket = 'none' | 'short' | 'medium' | 'long';

/** Coarse length for analytics: the text itself is never sent. */
export function feedbackLengthBucket(text: string | null): FeedbackLengthBucket {
  if (!text) return 'none';
  if (text.length < 200) return 'short';
  if (text.length < 1000) return 'medium';
  return 'long';
}

/**
 * The request's `feedback` field: a string up to FEEDBACK_MAX_CHARS once
 * trimmed. Blank clears it (null). Too long is a 400, never a silent cut.
 */
export function parseFeedbackText(value: unknown): string | null {
  if (typeof value !== 'string') throw badRequest('Feedback must be text.');
  if (value.trim().length > FEEDBACK_MAX_CHARS) {
    throw badRequest(`Feedback can be at most ${FEEDBACK_MAX_CHARS.toLocaleString('en-GB')} characters.`, 'FEEDBACK_TOO_LONG');
  }
  return optionalText(value, FEEDBACK_MAX_CHARS);
}

/**
 * The one place a plan gate for written feedback goes. Every teacher tier can
 * write feedback for now; to gate it, look up `getEntitlements(userId)` here and
 * throw a 403 `PLAN_REQUIRED` ClassRequestError.
 */
async function assertFeedbackAllowed(_userId: string): Promise<void> {}

/**
 * Write (or clear) a teacher's feedback on one answer. Only the owner of the
 * class whose assignment the attempt belongs to may write; any other case is
 * the same 404, so ids can't be probed.
 */
export async function saveAnswerFeedback(userId: string, classId: string, answerId: string, value: unknown) {
  const feedback = parseFeedbackText(value);
  const answer = await repo.findAnswerForFeedback(answerId);
  const assignment = answer?.examAttempt.assignment;
  if (!answer || !assignment || assignment.classId !== classId || assignment.class.ownerId !== userId) {
    throw notFound();
  }
  await assertFeedbackAllowed(userId);

  const saved = await repo.saveAnswerFeedback(answerId, feedback, userId, new Date());
  await captureServerEvent(userId, 'class_feedback_saved', {
    class_id: classId,
    assignment_id: answer.examAttempt.assignmentId,
    length_bucket: feedbackLengthBucket(feedback),
    cleared: feedback === null,
  });
  return {
    feedback: saved.teacherFeedback,
    feedbackAt: saved.feedbackAt ? saved.feedbackAt.toISOString() : null,
  };
}

/** The student opened their results: their feedback is no longer "new". Own attempts only. */
export async function markFeedbackSeen(userId: string, attemptId: string) {
  const { count } = await repo.markAttemptFeedbackSeen(attemptId, userId, new Date());
  return { updated: count };
}

/** True when a teacher wrote feedback the student hasn't opened since. */
export function hasUnseenFeedback(answer: { teacherFeedback: string | null; feedbackAt: Date | null; feedbackSeenAt: Date | null }) {
  if (!answer.teacherFeedback || !answer.feedbackAt) return false;
  return !answer.feedbackSeenAt || answer.feedbackSeenAt < answer.feedbackAt;
}
