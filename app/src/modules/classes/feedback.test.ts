import { beforeEach, describe, expect, it, vi } from 'vitest';

const { repo, capture } = vi.hoisted(() => ({
  repo: { findAnswerForFeedback: vi.fn(), saveAnswerFeedback: vi.fn(), markAttemptFeedbackSeen: vi.fn() },
  capture: vi.fn(),
}));

vi.mock('@/shared/db', () => ({ prisma: {} }));
vi.mock('./feedbackRepo', () => repo);
vi.mock('@/modules/telemetry/serverCapture', () => ({ captureServerEvent: capture }));

import { HttpError } from '@/shared/http/errors';
import {
  FEEDBACK_MAX_CHARS,
  feedbackLengthBucket,
  hasUnseenFeedback,
  markFeedbackSeen,
  parseFeedbackText,
  saveAnswerFeedback,
} from './feedback';

const OWNER = 'teacher-1';
const CLASS = 'class-1';

function answerIn(classId: string, ownerId: string) {
  return {
    id: 'ans-1',
    examAttempt: { assignmentId: 'asg-1', assignment: { classId, class: { ownerId } } },
  };
}

async function statusOf(promise: Promise<unknown>) {
  try {
    await promise;
    return 200;
  } catch (err) {
    if (err instanceof HttpError) return err.status;
    throw err;
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  repo.findAnswerForFeedback.mockResolvedValue(answerIn(CLASS, OWNER));
  repo.saveAnswerFeedback.mockImplementation(async (_id: string, text: string | null, _by: string, at: Date) => ({
    id: 'ans-1',
    teacherFeedback: text,
    feedbackAt: text ? at : null,
  }));
});

describe('saveAnswerFeedback authorization', () => {
  it('lets the class owner write feedback', async () => {
    const result = await saveAnswerFeedback(OWNER, CLASS, 'ans-1', '  Good use of a FOR loop.  ');
    expect(result.feedback).toBe('Good use of a FOR loop.');
    expect(result.feedbackAt).toEqual(expect.any(String));
    expect(repo.saveAnswerFeedback).toHaveBeenCalledWith('ans-1', 'Good use of a FOR loop.', OWNER, expect.any(Date));
  });

  it('refuses another teacher', async () => {
    expect(await statusOf(saveAnswerFeedback('teacher-2', CLASS, 'ans-1', 'Nice'))).toBe(404);
    expect(repo.saveAnswerFeedback).not.toHaveBeenCalled();
  });

  it('refuses a student (including the one who wrote the answer)', async () => {
    expect(await statusOf(saveAnswerFeedback('student-1', CLASS, 'ans-1', 'I did great'))).toBe(404);
    expect(repo.saveAnswerFeedback).not.toHaveBeenCalled();
  });

  it('refuses an answer from another class, even one the teacher also owns', async () => {
    repo.findAnswerForFeedback.mockResolvedValue(answerIn('class-2', OWNER));
    expect(await statusOf(saveAnswerFeedback(OWNER, CLASS, 'ans-1', 'Nice'))).toBe(404);
    expect(repo.saveAnswerFeedback).not.toHaveBeenCalled();
  });

  it('refuses an answer on a non-assignment attempt', async () => {
    repo.findAnswerForFeedback.mockResolvedValue({ id: 'ans-1', examAttempt: { assignmentId: null, assignment: null } });
    expect(await statusOf(saveAnswerFeedback(OWNER, CLASS, 'ans-1', 'Nice'))).toBe(404);
  });

  it('refuses a missing answer', async () => {
    repo.findAnswerForFeedback.mockResolvedValue(null);
    expect(await statusOf(saveAnswerFeedback(OWNER, CLASS, 'nope', 'Nice'))).toBe(404);
  });
});

describe('saveAnswerFeedback input', () => {
  it('clears feedback on an empty string', async () => {
    const result = await saveAnswerFeedback(OWNER, CLASS, 'ans-1', '   ');
    expect(result).toEqual({ feedback: null, feedbackAt: null });
    expect(repo.saveAnswerFeedback).toHaveBeenCalledWith('ans-1', null, OWNER, expect.any(Date));
  });

  it('rejects feedback over the cap without saving', async () => {
    expect(await statusOf(saveAnswerFeedback(OWNER, CLASS, 'ans-1', 'x'.repeat(FEEDBACK_MAX_CHARS + 1)))).toBe(400);
    expect(repo.findAnswerForFeedback).not.toHaveBeenCalled();
  });

  it('rejects a non-string', async () => {
    expect(await statusOf(saveAnswerFeedback(OWNER, CLASS, 'ans-1', 42))).toBe(400);
    expect(await statusOf(saveAnswerFeedback(OWNER, CLASS, 'ans-1', undefined))).toBe(400);
  });

  it('accepts exactly the cap', () => {
    expect(parseFeedbackText('y'.repeat(FEEDBACK_MAX_CHARS))).toHaveLength(FEEDBACK_MAX_CHARS);
  });

  it('sends only ids, a length bucket and cleared to analytics', async () => {
    await saveAnswerFeedback(OWNER, CLASS, 'ans-1', 'Secret words');
    expect(capture).toHaveBeenCalledWith(OWNER, 'class_feedback_saved', {
      class_id: CLASS,
      assignment_id: 'asg-1',
      length_bucket: 'short',
      cleared: false,
    });
    expect(JSON.stringify(capture.mock.calls)).not.toContain('Secret words');
  });
});

describe('helpers', () => {
  it('buckets length', () => {
    expect(feedbackLengthBucket(null)).toBe('none');
    expect(feedbackLengthBucket('a'.repeat(199))).toBe('short');
    expect(feedbackLengthBucket('a'.repeat(200))).toBe('medium');
    expect(feedbackLengthBucket('a'.repeat(1000))).toBe('long');
  });

  it('flags feedback newer than the last view', () => {
    const at = new Date('2026-11-10T10:00:00Z');
    expect(hasUnseenFeedback({ teacherFeedback: 'x', feedbackAt: at, feedbackSeenAt: null })).toBe(true);
    expect(hasUnseenFeedback({ teacherFeedback: 'x', feedbackAt: at, feedbackSeenAt: new Date('2026-11-09T00:00:00Z') })).toBe(true);
    expect(hasUnseenFeedback({ teacherFeedback: 'x', feedbackAt: at, feedbackSeenAt: new Date('2026-11-11T00:00:00Z') })).toBe(false);
    expect(hasUnseenFeedback({ teacherFeedback: null, feedbackAt: null, feedbackSeenAt: null })).toBe(false);
  });

  it('marks only the caller’s own attempt as seen', async () => {
    repo.markAttemptFeedbackSeen.mockResolvedValue({ count: 2 });
    await expect(markFeedbackSeen('student-1', 'att-1')).resolves.toEqual({ updated: 2 });
    expect(repo.markAttemptFeedbackSeen).toHaveBeenCalledWith('att-1', 'student-1', expect.any(Date));
  });
});
