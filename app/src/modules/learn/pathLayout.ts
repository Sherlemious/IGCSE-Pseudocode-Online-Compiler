import type { LearnCourse, LearnLesson, LearnLevel } from './types';

/** Repeating left/right offsets for the winding path, in [-1, 1]. */
export const SNAKE = [0, 0.4, 0.82, 0.4, 0, -0.4, -0.82, -0.4] as const;

export function snakeOffset(index: number): number {
  return SNAKE[index % SNAKE.length]!;
}

function fmt(n: number): string {
  return n.toFixed(2);
}

/** Catmull-Rom through `points`, emitted as cubic Beziers for SVG. */
export function curveThrough(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  const first = points[0]!;
  if (points.length === 1) return `M ${fmt(first.x)} ${fmt(first.y)}`;

  const parts = [`M ${fmt(first.x)} ${fmt(first.y)}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    parts.push(`C ${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(p2.x)} ${fmt(p2.y)}`);
  }
  return parts.join(' ');
}

export type LessonStop = {
  kind: 'lesson';
  id: string;
  level: LearnLevel;
  lesson: LearnLesson;
  x: number;
  y: number;
  stopIndex: number;
};

export type LockedLevelStop = {
  kind: 'locked-level';
  id: string;
  level: LearnLevel;
  x: number;
  y: number;
  stopIndex: number;
};

export type PathStop = LessonStop | LockedLevelStop;

export type LevelPlaque = {
  level: LearnLevel;
  x: number;
  y: number;
  side: 'left' | 'right';
};

export type PathLayout = {
  width: number;
  height: number;
  plaques: LevelPlaque[];
  stops: PathStop[];
};

const WIDTH = 100;
const CENTER = 50;
const AMP = 24;
const NODE_STEP = 104;
const LOCKED_STEP = 128;
const LEVEL_PAD = 72;
const START_Y = 52;

export function layoutPath(course: LearnCourse): PathLayout {
  const plaques: LevelPlaque[] = [];
  const stops: PathStop[] = [];
  let y = START_Y;
  let stopIndex = 0;

  for (const level of course.levels) {
    const side: 'left' | 'right' = level.number % 2 === 1 ? 'left' : 'right';
    plaques.push({
      level,
      x: side === 'left' ? 16 : 84,
      y: y + 4,
      side,
    });

    if (level.playable) {
      for (const lesson of level.lessons) {
        stops.push({
          kind: 'lesson',
          id: lesson.id,
          level,
          lesson,
          x: CENTER + snakeOffset(stopIndex) * AMP,
          y,
          stopIndex,
        });
        y += NODE_STEP;
        stopIndex += 1;
      }
    } else {
      stops.push({
        kind: 'locked-level',
        id: `level-${level.slug}`,
        level,
        x: CENTER + snakeOffset(stopIndex) * AMP,
        y,
        stopIndex,
      });
      y += LOCKED_STEP;
      stopIndex += 1;
    }
    y += LEVEL_PAD;
  }

  return { width: WIDTH, height: y + 28, plaques, stops };
}

/** Fraction of the connector to light, stopping at the first incomplete stop. */
export function progressAlongPath(stops: PathStop[], completedIds: Set<string>): number {
  if (stops.length < 2) return 0;
  let lit = 0;
  for (const stop of stops) {
    if (stop.kind === 'lesson' && completedIds.has(stop.lesson.id)) {
      lit += 1;
      continue;
    }
    break;
  }
  return lit / (stops.length - 1);
}

export function isBossLesson(lesson: LearnLesson): boolean {
  return lesson.slug === 'boss' || lesson.title.startsWith('Boss:');
}
