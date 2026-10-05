/**
 * The Activity heatmap grid, in UTC days. `activityByDate` is keyed by UTC date
 * (report.ts), and the heatmap renders on the server (UTC) then hydrates in the
 * browser. Building it from local midnight gave the browser a different "today"
 * than the server whenever the student wasn't on UTC (React #418 on /analytics),
 * and shifted every cell by a day for anyone east of UTC.
 */
export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface DayCell {
  date: string;
  count: number;
}

export interface Heatmap {
  /** 52 columns, Sunday first; days after today are null. */
  weeks: (DayCell | null)[][];
  /** Month name on the first column of each month, else null. */
  monthLabels: (string | null)[];
  totalActiveDays: number;
  /** Consecutive active days ending today, or yesterday if today has none yet. */
  currentStreak: number;
}

const DAY_MS = 86_400_000;
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function buildHeatmap(activityByDate: Record<string, number>, now: number): Heatmap {
  const today = Math.floor(now / DAY_MS) * DAY_MS;
  // The Sunday 51 weeks before this week's Sunday.
  const start = today - (new Date(today).getUTCDay() + 51 * 7) * DAY_MS;

  const weeks: (DayCell | null)[][] = [];
  const monthLabels: (string | null)[] = [];
  let prevMonth = -1;
  for (let w = 0; w < 52; w++) {
    const week: (DayCell | null)[] = [];
    let label: string | null = null;
    for (let d = 0; d < 7; d++) {
      const day = start + (w * 7 + d) * DAY_MS;
      if (day > today) {
        week.push(null);
        continue;
      }
      const month = new Date(day).getUTCMonth();
      if (month !== prevMonth) {
        label = MONTH_LABELS[month];
        prevMonth = month;
      }
      const date = isoDay(day);
      week.push({ date, count: activityByDate[date] ?? 0 });
    }
    weeks.push(week);
    monthLabels.push(label);
  }

  const totalActiveDays = Object.values(activityByDate).filter((v) => v > 0).length;

  let currentStreak = 0;
  const from = activityByDate[isoDay(today)] ? 0 : activityByDate[isoDay(today - DAY_MS)] ? 1 : -1;
  if (from >= 0) {
    for (let i = from; activityByDate[isoDay(today - i * DAY_MS)]; i++) currentStreak++;
  }

  return { weeks, monthLabels, totalActiveDays, currentStreak };
}
