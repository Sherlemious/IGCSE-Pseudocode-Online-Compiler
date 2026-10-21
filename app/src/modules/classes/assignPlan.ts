/** Exam titles authored in the app are capped at 200 characters. */
export const ASSIGNMENT_TITLE_MAX = 200;
export const MINUTES_PER_ASSIGNED_QUESTION = 30;
export const ASSIGNMENT_TIME_LIMIT_CAP = 120;

/** 30 minutes per question, never more than two hours. */
export function assignmentTimeLimitMin(questionCount: number): number {
  return Math.min(ASSIGNMENT_TIME_LIMIT_CAP, Math.max(1, questionCount) * MINUTES_PER_ASSIGNED_QUESTION);
}

/**
 * One question keeps its bank title. Several become "N questions".
 * A teacher-supplied title wins, still capped like an exam title.
 */
export function assignmentTitle(opts: {
  questionCount: number;
  questionTitles: readonly string[];
  requested?: string | null;
}): string {
  const requested = opts.requested?.trim();
  if (requested) return requested.slice(0, ASSIGNMENT_TITLE_MAX);
  if (opts.questionCount === 1) {
    const title = opts.questionTitles[0]?.trim();
    if (title) return title.slice(0, ASSIGNMENT_TITLE_MAX);
  }
  const noun = opts.questionCount === 1 ? 'question' : 'questions';
  return `${opts.questionCount} ${noun}`;
}

/** Same questions, whatever order the two lists use. */
export function sameQuestionSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const left = new Set(a);
  if (left.size !== b.length) return false;
  return b.every((id) => left.has(id));
}
