import { describe, expect, it } from 'vitest';
import { IGCSE_PAPER_2 } from './curriculum';
import {
  curveThrough,
  layoutPath,
  leadingCompleted,
  progressAlongPath,
  snakeOffset,
} from './pathLayout';

describe('path layout', () => {
  it('winds with a repeating offset', () => {
    expect(snakeOffset(0)).toBe(0);
    expect(snakeOffset(2)).toBeGreaterThan(snakeOffset(1));
    expect(snakeOffset(8)).toBe(snakeOffset(0));
  });

  it('lays out one section per playable level and lists the rest as ahead', () => {
    const layout = layoutPath(IGCSE_PAPER_2);
    const playable = IGCSE_PAPER_2.levels.filter((level) => level.playable);
    const locked = IGCSE_PAPER_2.levels.filter((level) => !level.playable);

    expect(layout.sections.map((section) => section.level.slug)).toEqual(playable.map((level) => level.slug));
    expect(layout.ahead).toHaveLength(0);
    expect(layout.ahead.map((level) => level.slug)).toEqual(locked.map((level) => level.slug));
    expect(layout.stops).toHaveLength(playable.reduce((sum, level) => sum + level.lessons.length, 0));
    expect(layout.stops.every((stop, i) => i === 0 || stop.y >= layout.stops[i - 1]!.y)).toBe(true);

    for (const section of layout.sections) {
      expect(section.stops[0]!.y).toBeGreaterThan(section.bannerY + section.bannerHeight);
      expect(section.bottom).toBeGreaterThan(section.stops[section.stops.length - 1]!.y);
    }
    expect(layout.height).toBeGreaterThan(layout.sections[layout.sections.length - 1]!.bottom);
  });

  it('alternates the winding direction per level and starts each level on centre', () => {
    const layout = layoutPath(IGCSE_PAPER_2);
    for (const section of layout.sections) {
      expect(section.snakeDir).toBe(section.level.number % 2 === 1 ? 1 : -1);
      expect(section.watermarkSide).toBe(section.snakeDir > 0 ? 'left' : 'right');
      expect(section.stops[0]!.x).toBe(50);
      const second = section.stops[1];
      if (second) expect(Math.sign(second.x - 50)).toBe(section.snakeDir);
    }
  });

  it('puts every label on the side away from the curve', () => {
    const layout = layoutPath(IGCSE_PAPER_2);
    for (const stop of layout.stops) {
      if (stop.offset > 0) expect(stop.labelSide).toBe('right');
      if (stop.offset < 0) expect(stop.labelSide).toBe('left');
    }
  });

  it('lights the connector only through completed playable stops', () => {
    const layout = layoutPath(IGCSE_PAPER_2);
    const ids = layout.stops.map((stop) => stop.lesson.id);
    const firstTwo = ids.slice(0, 2);
    expect(progressAlongPath(layout.stops, new Set())).toBe(0);
    expect(progressAlongPath(layout.stops, new Set(firstTwo))).toBeCloseTo(2 / (layout.stops.length - 1));
    // A gap stops the light at the first incomplete stop.
    expect(leadingCompleted(layout.stops, new Set([ids[0]!, ids[2]!]))).toBe(1);
    // Everything done never overshoots the end of the path.
    expect(progressAlongPath(layout.stops, new Set(ids))).toBe(1);
  });

  it('builds a cubic path through two or more points', () => {
    expect(curveThrough([])).toBe('');
    expect(curveThrough([{ x: 1, y: 2 }])).toBe('M 1.00 2.00');
    expect(curveThrough([{ x: 0, y: 0 }, { x: 10, y: 20 }])).toMatch(/^M 0\.00 0\.00 C /);
  });
});
