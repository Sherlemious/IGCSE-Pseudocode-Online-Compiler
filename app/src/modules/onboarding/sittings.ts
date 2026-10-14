/**
 * The exam sittings a student can say they are preparing for. The value is
 * stored on `User.examSitting` and set as the PostHog person property
 * `exam_sitting`, so reminder emails can be timed to the paper.
 */
export const SITTINGS = [
  { value: 'oct_nov_2026', label: 'Oct/Nov 2026' },
  { value: 'feb_mar_2027', label: 'Feb/Mar 2027' },
  { value: 'may_jun_2027', label: 'May/Jun 2027' },
  { value: 'later', label: 'Later than that' },
] as const;

export type Sitting = (typeof SITTINGS)[number]['value'];

export const SITTING_VALUES: readonly Sitting[] = SITTINGS.map((s) => s.value);

export function isSitting(value: unknown): value is Sitting {
  return typeof value === 'string' && (SITTING_VALUES as readonly string[]).includes(value);
}
