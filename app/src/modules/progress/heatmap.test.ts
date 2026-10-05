import { afterEach, describe, expect, it } from 'vitest';
import { buildHeatmap } from './heatmap';

// 22:30 UTC on Monday 5 Oct: already Tuesday 6 Oct in Jakarta, still Monday in LA.
const NOW = Date.parse('2026-10-05T22:30:00Z');
const activity = { '2026-10-05': 2, '2026-10-04': 1, '2026-10-03': 3, '2026-09-30': 1 };

const originalTz = process.env.TZ;
afterEach(() => {
  process.env.TZ = originalTz;
});

describe('buildHeatmap', () => {
  it('ends on the UTC day the activity keys use', () => {
    const { weeks } = buildHeatmap(activity, NOW);
    expect(weeks).toHaveLength(52);
    const last = weeks[51];
    // Sunday 4 Oct, Monday 5 Oct, then the rest of the week is in the future.
    expect(last.slice(0, 2)).toEqual([
      { date: '2026-10-04', count: 1 },
      { date: '2026-10-05', count: 2 },
    ]);
    expect(last.slice(2)).toEqual([null, null, null, null, null]);
    expect(weeks[0][0]).toEqual({ date: '2025-10-12', count: 0 });
  });

  it('counts the streak back from today, or from yesterday before today has activity', () => {
    expect(buildHeatmap(activity, NOW).currentStreak).toBe(3);
    expect(buildHeatmap(activity, Date.parse('2026-10-06T08:00:00Z')).currentStreak).toBe(3);
    expect(buildHeatmap(activity, Date.parse('2026-10-07T08:00:00Z')).currentStreak).toBe(0);
    expect(buildHeatmap(activity, NOW).totalActiveDays).toBe(4);
  });

  it('labels each month once, on its first column', () => {
    const { monthLabels } = buildHeatmap(activity, NOW);
    expect(monthLabels.filter(Boolean)).toEqual(['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']);
  });

  it('is the same in every time zone (server render = browser hydrate)', () => {
    process.env.TZ = 'UTC';
    const server = JSON.stringify(buildHeatmap(activity, NOW));
    for (const tz of ['Asia/Jakarta', 'America/Los_Angeles', 'Africa/Cairo', 'Pacific/Kiritimati']) {
      process.env.TZ = tz;
      expect(JSON.stringify(buildHeatmap(activity, NOW))).toBe(server);
    }
  });
});
