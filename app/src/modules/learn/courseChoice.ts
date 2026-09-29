import { ALEVEL_COURSE_ID, IGCSE_COURSE_ID, type CourseId } from './types';

/** The two exams a student can pick on the learn page. O Level stays first. */
export type CourseChoice = {
  id: CourseId;
  href: string;
  /** What a student calls the exam. */
  exam: string;
  /** Syllabus codes, shown small above the paper name. */
  codes: string;
  /** Short paper name. With `exam`, this is the page heading. */
  paper: string;
  /** Who this path is for. */
  audience: string;
  /** What the path walks through, in student language. */
  covers: string;
  levels: number;
  freeLevels: number;
};

export const COURSE_CHOICES: readonly CourseChoice[] = [
  {
    id: IGCSE_COURSE_ID,
    href: '/learn',
    exam: 'O Level',
    codes: '0478 · 0984 · 2210',
    paper: 'Paper 2',
    audience: 'Most students start here.',
    covers: 'From your first OUTPUT to a full Paper 2 question.',
    levels: 10,
    freeLevels: 3,
  },
  {
    id: ALEVEL_COURSE_ID,
    href: '/learn/9618',
    exam: 'A Level',
    codes: 'Paper 2 and Paper 4',
    paper: '9618',
    audience: 'When O Level already feels easy.',
    covers: 'Records, files, pointers, stacks, and classes.',
    levels: 8,
    freeLevels: 3,
  },
];

export function courseChoice(id: CourseId): CourseChoice {
  const found = COURSE_CHOICES.find((choice) => choice.id === id);
  if (!found) throw new Error(`Unknown learn course: ${id}`);
  return found;
}
