import type { PracticeListQuestion, PracticeProgress } from './filterUtils';
import type { QuestionSocialStat } from './socialStats';

const DIFFICULTY_RANK: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

/**
 * The question to point a student at next: unsolved, not locked, easiest
 * difficulty first, and within a difficulty the one most students finish
 * (solve count, then first-try rate). 85% of practice visitors never solve
 * anything, so the first pick has to be one they will actually get.
 * Signed-out students can only grade EASY, so they only get EASY picks.
 */
export function recommendNextQuestion(opts: {
  questions: PracticeListQuestion[];
  progress: Map<string, PracticeProgress>;
  stats: Map<string, QuestionSocialStat>;
  hasFullAccess: boolean;
  signedIn: boolean;
}): PracticeListQuestion | null {
  const { questions, progress, stats, hasFullAccess, signedIn } = opts;
  const candidates = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => progress.get(q.id)?.status !== 'SOLVED')
    .filter(({ q }) => hasFullAccess || !q.isPremium)
    .filter(({ q }) => signedIn || q.difficulty === 'EASY');
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    const diff = (DIFFICULTY_RANK[a.q.difficulty] ?? 9) - (DIFFICULTY_RANK[b.q.difficulty] ?? 9);
    if (diff !== 0) return diff;
    const sa = stats.get(a.q.id);
    const sb = stats.get(b.q.id);
    const solved = (sb?.solved ?? 0) - (sa?.solved ?? 0);
    if (solved !== 0) return solved;
    const firstTry = (sb?.firstTryRate ?? 0) - (sa?.firstTryRate ?? 0);
    if (firstTry !== 0) return firstTry;
    return a.index - b.index;
  });
  return candidates[0].q;
}

type StarterQuestion = {
  id: string;
  title: string;
  difficulty: string;
  isPremium: boolean;
  answerFormat?: string;
};

/**
 * First work for an empty class: easy questions students can actually start.
 * Premium questions are blocked for a free class, and flowchart answers are not exam questions.
 */
export function recommendStarterQuestions<T extends StarterQuestion>(
  questions: readonly T[],
  stats: Map<string, { solved: number; firstTryRate: number | null }>,
  count = 3,
): T[] {
  const candidates = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => q.difficulty === 'EASY' && !q.isPremium && q.answerFormat !== 'FLOWCHART');
  candidates.sort((a, b) => {
    const solved = (stats.get(b.q.id)?.solved ?? 0) - (stats.get(a.q.id)?.solved ?? 0);
    if (solved !== 0) return solved;
    const firstTry = (stats.get(b.q.id)?.firstTryRate ?? 0) - (stats.get(a.q.id)?.firstTryRate ?? 0);
    if (firstTry !== 0) return firstTry;
    return a.index - b.index;
  });
  return candidates.slice(0, count).map((item) => item.q);
}
