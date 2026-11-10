import type { PracticeListQuestion, PracticeProgress } from './filterUtils';
import type { QuestionSocialStat } from './socialStats';

const DIFFICULTY_RANK: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

/** A first question has to be one students finish, not merely one many people open. */
const FIRST_TRY_FLOOR = 50;

export type NextPickReason = 'mistake' | 'first_try' | 'same_topic' | 'fallback';

export interface NextRecommendation {
  question: PracticeListQuestion;
  reason: NextPickReason;
}

/**
 * The question to point a student at next.
 *
 * `classic` is the previous rule: easiest, then the one most students have
 * finished. `coach` (the test arm) only offers a first question when its
 * first-try rate is at least half, and after a solve stays on the same topic
 * one difficulty up. A pinned title (the playground toast) wins while it is
 * still unsolved. Signed-out students can only grade EASY.
 */
export function recommendNextQuestion(opts: {
  questions: PracticeListQuestion[];
  progress: Map<string, PracticeProgress>;
  stats: Map<string, QuestionSocialStat>;
  hasFullAccess: boolean;
  signedIn: boolean;
  mode?: 'coach' | 'classic';
  /** Unsolved question to open first, matched from a playground mistake. */
  pinnedTitle?: string | null;
}): NextRecommendation | null {
  const { questions, progress, stats, hasFullAccess, signedIn } = opts;
  const mode = opts.mode ?? 'coach';
  const candidates = questions
    .map((q, index) => ({ q, index }))
    .filter(({ q }) => progress.get(q.id)?.status !== 'SOLVED')
    .filter(({ q }) => hasFullAccess || !q.isPremium)
    .filter(({ q }) => signedIn || q.difficulty === 'EASY');
  if (candidates.length === 0) return null;

  if (mode === 'coach' && opts.pinnedTitle) {
    const pinned = candidates.find(({ q }) => q.title === opts.pinnedTitle);
    if (pinned) return { question: pinned.q, reason: 'mistake' };
  }

  if (mode === 'coach') {
    const coached = coachPick(questions, candidates, progress, stats);
    if (coached) return coached;
  }

  const classic = [...candidates].sort(byPopularity(stats));
  return { question: classic[0].q, reason: 'fallback' };
}

function coachPick(
  questions: PracticeListQuestion[],
  candidates: { q: PracticeListQuestion; index: number }[],
  progress: Map<string, PracticeProgress>,
  stats: Map<string, QuestionSocialStat>,
): NextRecommendation | null {
  const solved = lastSolved(questions, progress);
  if (!solved) {
    const finishable = candidates.filter(
      ({ q }) => q.difficulty === 'EASY' && (stats.get(q.id)?.firstTryRate ?? -1) >= FIRST_TRY_FLOOR,
    );
    if (finishable.length === 0) return null;
    finishable.sort(byFinishable(stats));
    return { question: finishable[0].q, reason: 'first_try' };
  }

  if (!solved.q.topic) return null;
  const from = DIFFICULTY_RANK[solved.q.difficulty] ?? 0;
  const step = Math.min(from + 1, 2);
  let pool = candidates.filter(
    ({ q }) => q.topic === solved.q.topic && (DIFFICULTY_RANK[q.difficulty] ?? 9) === step,
  );
  if (pool.length === 0) {
    pool = candidates.filter(
      ({ q }) => q.topic === solved.q.topic && (DIFFICULTY_RANK[q.difficulty] ?? 9) > from,
    );
  }
  if (pool.length === 0) return null;
  pool.sort(byFinishable(stats));
  return { question: pool[0].q, reason: 'same_topic' };
}

function lastSolved(
  questions: PracticeListQuestion[],
  progress: Map<string, PracticeProgress>,
): { q: PracticeListQuestion } | null {
  let best: { q: PracticeListQuestion; at: number } | null = null;
  for (const q of questions) {
    const row = progress.get(q.id);
    if (row?.status !== 'SOLVED') continue;
    const at = new Date(row.updatedAt).getTime();
    if (!Number.isFinite(at)) continue;
    if (!best || at >= best.at) best = { q, at };
  }
  return best;
}

/** Higher first-try rate, then more solves. A rate we have not measured sorts last. */
function byFinishable(stats: Map<string, QuestionSocialStat>) {
  return (a: { q: PracticeListQuestion; index: number }, b: { q: PracticeListQuestion; index: number }) => {
    const fa = stats.get(a.q.id)?.firstTryRate ?? null;
    const fb = stats.get(b.q.id)?.firstTryRate ?? null;
    if (fa != null && fb != null && fa !== fb) return fb - fa;
    if (fa != null && fb == null) return -1;
    if (fa == null && fb != null) return 1;
    const solved = (stats.get(b.q.id)?.solved ?? 0) - (stats.get(a.q.id)?.solved ?? 0);
    if (solved !== 0) return solved;
    return a.index - b.index;
  };
}

function byPopularity(stats: Map<string, QuestionSocialStat>) {
  return (a: { q: PracticeListQuestion; index: number }, b: { q: PracticeListQuestion; index: number }) => {
    const diff = (DIFFICULTY_RANK[a.q.difficulty] ?? 9) - (DIFFICULTY_RANK[b.q.difficulty] ?? 9);
    if (diff !== 0) return diff;
    const solved = (stats.get(b.q.id)?.solved ?? 0) - (stats.get(a.q.id)?.solved ?? 0);
    if (solved !== 0) return solved;
    const firstTry = (stats.get(b.q.id)?.firstTryRate ?? 0) - (stats.get(a.q.id)?.firstTryRate ?? 0);
    if (firstTry !== 0) return firstTry;
    return a.index - b.index;
  };
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
 * This list stays on solve-count. It is not the student start-here card.
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
