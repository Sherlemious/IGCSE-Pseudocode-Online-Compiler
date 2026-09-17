import { Code, Crown, HelpCircle, PenLine, Play, type LucideIcon } from 'lucide-react';
import { isBossLesson } from './pathLayout';
import type { LearnLesson, LearnLevel } from './types';

/**
 * One accent per level, drawn from the editor's syntax palette so it follows the
 * active theme (One Dark, Dracula, Nord, GitHub Light, custom). Green is kept off
 * the early levels because completed nodes already use `--color-success`.
 */
const LEVEL_HUES = [
  '--color-primary',
  '--color-syntax-type',
  '--color-syntax-operator',
  '--color-syntax-keyword',
  '--color-syntax-string',
  '--color-syntax-number',
  '--color-syntax-variable',
  '--color-primary',
  '--color-syntax-type',
  '--color-syntax-keyword',
] as const;

export function levelHue(level: Pick<LearnLevel, 'number'>): string {
  const index = (Math.max(1, level.number) - 1) % LEVEL_HUES.length;
  return `var(${LEVEL_HUES[index]})`;
}

export type LessonTypeMeta = { icon: LucideIcon; label: string };

/** Icon + short student-facing label for what a lesson asks you to do. */
export function lessonTypeMeta(lesson: LearnLesson): LessonTypeMeta {
  if (isBossLesson(lesson)) return { icon: Crown, label: 'Boss' };
  switch (lesson.type) {
    case 'quiz':
      return { icon: HelpCircle, label: 'Quiz' };
    case 'mutate':
      return { icon: PenLine, label: 'Edit' };
    case 'grade':
      return { icon: Code, label: 'Write' };
    default:
      return { icon: Play, label: 'Run' };
  }
}

export function levelMinutes(level: Pick<LearnLevel, 'lessons'>): number {
  return level.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours} h`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Muted track colour that stays visible on every theme (border is often darker than the page). */
export const TRACK = 'color-mix(in srgb, var(--color-dark-text) 28%, transparent)';
