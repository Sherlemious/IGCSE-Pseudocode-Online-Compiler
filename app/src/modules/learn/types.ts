export const COURSE_ID = 'igcse-paper-2';

export type LessonType = 'run' | 'mutate' | 'grade' | 'quiz';

export type LessonTest = {
  inputs: string[];
  expectedOutput: string;
  /** Seeded into the autograder VFS (`filename → contents`) for file-handling checks. */
  initialFiles?: Record<string, string>;
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizItem = {
  prompt: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
};

export type LearnLesson = {
  id: string;
  slug: string;
  title: string;
  type: LessonType;
  minutes: number;
  /** One exam-facing sentence shown at the top of the player. */
  why: string;
  /** Markdown. Keep short — the editor is the lesson. */
  body: string;
  playable: boolean;
  docsAnchor?: string;
  trap?: string;
  starterCode?: string;
  /** Used by tests and as the known-good program for Check. */
  solutionCode?: string;
  expectedOutput?: string;
  tests?: LessonTest[];
  mustContain?: string[];
  mustNotContain?: string[];
  quiz?: QuizItem[];
};

export type LearnLevel = {
  number: number;
  slug: string;
  name: string;
  hours: string;
  leaveWith: string;
  syllabus: string;
  free: boolean;
  playable: boolean;
  lessons: LearnLesson[];
};

export type LearnCourse = {
  id: typeof COURSE_ID;
  title: string;
  subtitle: string;
  levels: LearnLevel[];
};
