import { route } from '@/shared/http/route';
import { clampedNumber, optionalText, readJsonOrEmpty, requiredText, stringList } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { createExam, EXAM_DESCRIPTION_MAX, EXAM_TITLE_MAX } from '@/modules/exams/definitions';

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await readJsonOrEmpty(req);
  return createExam(user.id, {
    title: requiredText(body.title, EXAM_TITLE_MAX, 'Please give the exam a title.'),
    description: optionalText(body.description, EXAM_DESCRIPTION_MAX),
    timeLimitMin: clampedNumber(body.timeLimitMin, 10, 180, 60),
    questionIds: stringList(body.questionIds),
  });
});
