import { NextResponse } from 'next/server';
import { ExamRequestError, type AnswerSubmission } from './attempts';

export async function readAnswerSubmission(req: Request): Promise<AnswerSubmission> {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      !('questionId' in body) || typeof body.questionId !== 'string' || !body.questionId.trim() ||
      !('code' in body) || typeof body.code !== 'string') {
    throw new ExamRequestError(400, 'INVALID_ANSWER', 'Provide a question ID and code as strings.');
  }
  return { questionId: body.questionId, code: body.code };
}

export function examErrorResponse(error: unknown): NextResponse {
  if (error instanceof ExamRequestError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  throw error;
}
