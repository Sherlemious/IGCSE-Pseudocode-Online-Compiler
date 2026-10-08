import type { Difficulty } from '@prisma/client';
import { route } from '@/shared/http/route';
import { clampedNumber, oneOf, optionalText, readJsonOrEmpty } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { startRandomExam } from '@/modules/exams/definitions';

const DIFFICULTIES: readonly Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

/** Start a random timed exam from the question bank. */
export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await readJsonOrEmpty(req);
  return startRandomExam(user.id, {
    topic: optionalText(body.topic, 100),
    difficulty: oneOf(body.difficulty, DIFFICULTIES),
    questionCount: clampedNumber(body.questionCount, 1, 20, 5),
    timeLimitMin: clampedNumber(body.timeLimitMin, 10, 180, 60),
  });
});
