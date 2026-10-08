export const IGCSE_COURSE_ID = 'igcse-paper-2';
export const ALEVEL_COURSE_ID = 'alevel-9618';
/** IGCSE Paper 2 path. Kept as the default so existing progress keys stay put. */
export const COURSE_ID = IGCSE_COURSE_ID;

export type CourseId = typeof IGCSE_COURSE_ID | typeof ALEVEL_COURSE_ID;

/** `flowchart`: the answer is drawn on the flowchart builder and checked like code. */
export type LessonType = 'run' | 'mutate' | 'grade' | 'quiz' | 'flowchart';

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
  /** Pseudocode drawn as a read-only flowchart under the lesson text. */
  diagramCode?: string;
  /**
   * `flowchart` lessons: boxes of solutionCode's flowchart left blank for the
   * student to fill in. Without it the student draws on a blank canvas.
   */
  flowchartBlanks?: string[];
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
  id: CourseId;
  /** Lesson URLs are `${basePath}/${level}/${lesson}`. No trailing slash. */
  basePath: string;
  /** Short exam line above the title. */
  kicker: string;
  title: string;
  subtitle: string;
  /** Shown when every playable lesson on this path is done. */
  completeNote: string;
  otherPath: { href: string; label: string };
  levels: LearnLevel[];
};
