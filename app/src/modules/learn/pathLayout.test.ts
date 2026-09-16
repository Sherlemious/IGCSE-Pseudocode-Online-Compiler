import { describe, expect, it } from 'vitest';
import { IGCSE_PAPER_2 } from './curriculum';
import {
  curveThrough,
  layoutPath,
  progressAlongPath,
  snakeOffset,
} from './pathLayout';

describe('path layout', () => {
  it('winds with a repeating offset', () => {
    expect(snakeOffset(0)).toBe(0);
    expect(snakeOffset(2)).toBeGreaterThan(snakeOffset(1));
    expect(snakeOffset(8)).toBe(snakeOffset(0));
  });

  it('fits every playable lesson plus one lock per coming level', () => {
    const layout = layoutPath(IGCSE_PAPER_2);
    const playable = IGCSE_PAPER_2.levels.filter((level) => level.playable);
    const locked = IGCSE_PAPER_2.levels.filter((level) => !level.playable);
    const lessonStops = layout.stops.filter((stop) => stop.kind === 'lesson');
    const lockStops = layout.stops.filter((stop) => stop.kind === 'locked-level');

    expect(layout.plaques).toHaveLength(10);
    expect(lessonStops).toHaveLength(playable.reduce((sum, level) => sum + level.lessons.length, 0));
    expect(lockStops).toHaveLength(locked.length);
    expect(layout.stops.every((stop, i) => i === 0 || stop.y >= layout.stops[i - 1]!.y)).toBe(true);
  });

  it('lights the connector only through completed playable stops', () => {
    const layout = layoutPath(IGCSE_PAPER_2);
    const firstTwo = layout.stops
      .filter((stop) => stop.kind === 'lesson')
      .slice(0, 2)
      .map((stop) => stop.lesson.id);
    expect(progressAlongPath(layout.stops, new Set())).toBe(0);
    expect(progressAlongPath(layout.stops, new Set(firstTwo))).toBeCloseTo(2 / (layout.stops.length - 1));
  });

  it('builds a cubic path through two or more points', () => {
    expect(curveThrough([])).toBe('');
    expect(curveThrough([{ x: 1, y: 2 }])).toBe('M 1.00 2.00');
    expect(curveThrough([{ x: 0, y: 0 }, { x: 10, y: 20 }])).toMatch(/^M 0\.00 0\.00 C /);
  });
});
