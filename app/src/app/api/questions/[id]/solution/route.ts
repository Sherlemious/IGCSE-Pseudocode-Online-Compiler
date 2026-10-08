import { notFound } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { findProgress } from '@/modules/practice/repo';
import { getQuestionSolution } from '@/shared/lib/catalogCache';

/** The model answer, once the student has solved it, tried twice, or given up. */
export const GET = route(async (req, { params }: RouteContext<'/api/questions/[id]/solution'>) => {
  const user = await requireUser('Sign in to view solutions');
  const { id } = await params;
  const giveUp = new URL(req.url).searchParams.get('giveUp') === 'true';

  const question = await getQuestionSolution(id);
  if (!question) throw notFound('Question not found');

  const progress = await findProgress(user.id, id);
  const attempts = progress?.attempts ?? 0;
  if (!(progress?.status === 'SOLVED' || attempts >= 2 || giveUp)) {
    return { locked: true, attemptsNeeded: Math.max(0, 2 - attempts) };
  }
  return { locked: false, solution: question.solution, explanation: question.solutionExplanation };
});
