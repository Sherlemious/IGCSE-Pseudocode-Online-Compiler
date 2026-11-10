/**
 * Playground mistakes that have a short easy question. Anything else keeps
 * Sum of Two Numbers, the question the toast already promised.
 */

export const DEFAULT_PRACTICE_TITLE = 'Sum of Two Numbers';

export interface MistakeQuestion {
  /** Query value on `/practice?mistake=`. */
  key: string;
  title: string;
  /** One sentence under the toast title. No student code. */
  blurb: string;
}

const MATCHES: { hintId: string; detail?: string; question: MistakeQuestion }[] = [
  {
    hintId: 'output_missing_comma',
    question: {
      key: 'output_missing_comma',
      title: 'Receipt Line',
      blurb: 'You left out the comma between OUTPUT items. There is a short easy question for that.',
    },
  },
  {
    hintId: 'for_loop_assignment',
    question: {
      key: 'for_loop_assignment',
      title: 'Count Down',
      blurb: 'A FOR loop sets its counter with <-, not =. There is a short easy question for that.',
    },
  },
  {
    hintId: 'python_syntax',
    question: {
      key: 'python_syntax',
      title: 'Count Down',
      blurb: 'That was Python. There is a short easy question written in IGCSE pseudocode.',
    },
  },
  {
    hintId: 'array_out_of_bounds',
    detail: 'index_zero',
    question: {
      key: 'array_index_zero',
      title: 'Ends of a List',
      blurb: 'Arrays here start at 1, not 0. There is a short easy question for that.',
    },
  },
];

export function matchMistake(hintId: string | null, detail: string | null): MistakeQuestion | null {
  if (!hintId) return null;
  const found = MATCHES.find((row) => row.hintId === hintId && (row.detail == null || row.detail === detail));
  return found?.question ?? null;
}

export function mistakeByKey(key: string | null): MistakeQuestion | null {
  if (!key) return null;
  return MATCHES.find((row) => row.question.key === key)?.question ?? null;
}
