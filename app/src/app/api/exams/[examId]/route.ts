import { route } from '@/shared/http/route';
import { clampedNumber, optionalText, readJsonOrEmpty, requiredText, stringList } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { deleteExam, EXAM_DESCRIPTION_MAX, EXAM_TITLE_MAX, updateExam } from '@/modules/exams/definitions';

type Ctx = RouteContext<'/api/exams/[examId]'>;

/** Edit an exam you own; `questionIds` replaces the whole question set. */
export const PATCH = route(async (req, { params }: Ctx) => {
  const user = await requireUser();
  const { examId } = await params;
  const body = await readJsonOrEmpty(req);

  const data: { title?: string; description?: string | null; timeLimitMin?: number; isPublished?: boolean } = {};
  if (typeof body.title === 'string') data.title = requiredText(body.title, EXAM_TITLE_MAX, 'Please give the exam a title.');
  if (typeof body.description === 'string') data.description = optionalText(body.description, EXAM_DESCRIPTION_MAX);
  if (body.timeLimitMin !== undefined) data.timeLimitMin = clampedNumber(body.timeLimitMin, 10, 180, 60);
  if (typeof body.isPublished === 'boolean') data.isPublished = body.isPublished;

  await updateExam(examId, user.id, data, Array.isArray(body.questionIds) ? stringList(body.questionIds) : null);
  return { ok: true };
});

export const DELETE = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { examId } = await params;
  await deleteExam(examId, user.id);
  return { ok: true };
});
