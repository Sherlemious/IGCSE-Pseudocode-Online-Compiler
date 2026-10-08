import { MAX_GRADE_CODE_CHARS } from '@/modules/practice/autograder';
import { ExamRequestError, type AnswerSubmission } from './attempts';

export async function readAnswerSubmission(req: Request): Promise<AnswerSubmission> {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      !('questionId' in body) || typeof body.questionId !== 'string' || !body.questionId.trim() ||
      !('code' in body) || typeof body.code !== 'string') {
    throw new ExamRequestError(400, 'INVALID_ANSWER', 'Provide a question ID and code as strings.');
  }
  if (body.code.length > MAX_GRADE_CODE_CHARS) {
    throw new ExamRequestError(413, 'ANSWER_TOO_LONG', 'This answer is too long to save.');
  }
  return { questionId: body.questionId, code: body.code };
}
