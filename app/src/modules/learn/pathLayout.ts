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

export type Side = 'left' | 'right';

export type LessonStop = {
  kind: 'lesson';
  id: string;
  level: LearnLevel;
  lesson: LearnLesson;
  /** Percent of the column width. */
  x: number;
  /** Pixels from the top of the map. */
  y: number;
  /** Signed offset from centre in [-1, 1]; negative is left. */
  offset: number;
  /** Side of the node where the always-visible label sits — away from the curve. */
  labelSide: Side;
  stopIndex: number;
};

export type PathStop = LessonStop;

export type LevelSection = {
  level: LearnLevel;
  bannerY: number;
  bannerHeight: number;
  /** +1 winds right, -1 winds left. Alternates per level so 4–5 lesson levels don't all swing one way. */
  snakeDir: 1 | -1;
  /** Opposite the snake, so the big numeral sits in the empty half. */
  watermarkSide: Side;
  stops: LessonStop[];
  /** Section extent in px: banner top → padded bottom. */
  top: number;
  bottom: number;
};

export type PathLayout = {
  width: number;
  height: number;
  /** One section per playable level, in order. */
  sections: LevelSection[];
  /** Every playable lesson stop, in path order. */
  stops: LessonStop[];
  /** Levels that are not playable yet — rendered as the roadmap after the map. */
  ahead: LearnLevel[];
};

export const PATH_WIDTH = 100;
const CENTER = 50;
const AMP = 17;
export const NODE_STEP = 108;
export const BANNER_HEIGHT = 140;
const BANNER_TO_NODE = 92;
const NODE_TO_END = 64;
const LEVEL_GAP = 28;
const START_Y = 8;
const TAIL = 24;

export function layoutPath(course: LearnCourse): PathLayout {
  const sections: LevelSection[] = [];
  const stops: LessonStop[] = [];
  const ahead: LearnLevel[] = [];
  let y = START_Y;
  let stopIndex = 0;

  for (const level of course.levels) {
    if (!level.playable) {
      ahead.push(level);
      continue;
    }

    const snakeDir: 1 | -1 = level.number % 2 === 1 ? 1 : -1;
    const top = y;
    const bannerY = y;
    y += BANNER_HEIGHT + BANNER_TO_NODE;

    const sectionStops: LessonStop[] = level.lessons.map((lesson, i) => {
      const offset = snakeDir * snakeOffset(i);
      const labelSide: Side =
        offset > 0 ? 'right' : offset < 0 ? 'left' : snakeDir > 0 ? 'left' : 'right';
      return {
        kind: 'lesson',
        id: lesson.id,
        level,
        lesson,
        x: CENTER + offset * AMP,
        y: y + i * NODE_STEP,
        offset,
        labelSide,
        stopIndex: stopIndex + i,
      };
    });
    stopIndex += level.lessons.length;
    y += Math.max(0, level.lessons.length - 1) * NODE_STEP + NODE_TO_END;

    sections.push({
      level,
      bannerY,
      bannerHeight: BANNER_HEIGHT,
      snakeDir,
      watermarkSide: snakeDir > 0 ? 'left' : 'right',
      stops: sectionStops,
      top,
      bottom: y,
    });
    stops.push(...sectionStops);
    y += LEVEL_GAP;
  }

  const height = (sections.length > 0 ? y - LEVEL_GAP : y) + TAIL;
  return { width: PATH_WIDTH, height, sections, stops, ahead };
}

/** Number of leading stops that are complete — the connector is lit up to here. */
export function leadingCompleted(stops: PathStop[], completedIds: Set<string>): number {
  let lit = 0;
  for (const stop of stops) {
    if (completedIds.has(stop.lesson.id)) {
      lit += 1;
      continue;
    }
    break;
  }
  return lit;
}

/** Fraction of the connector to light, stopping at the first incomplete stop. */
export function progressAlongPath(stops: PathStop[], completedIds: Set<string>): number {
  if (stops.length < 2) return 0;
  return Math.min(1, leadingCompleted(stops, completedIds) / (stops.length - 1));
}

export function isBossLesson(lesson: LearnLesson): boolean {
  return lesson.slug === 'boss' || lesson.title.startsWith('Boss:');
}
