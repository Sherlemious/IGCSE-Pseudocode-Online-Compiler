'use client';

import type { CSSProperties } from 'react';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Alpha levels picked so that every step is visually distinct regardless of the
// primary colour (works for yellow Monokai, light-cyan Nord, dark-blue GitHub Light, etc.)
const ACTIVE_ALPHA = [0.28, 0.52, 0.75, 1] as const;

/**
 * Returns className + style for a heatmap cell.
 * Empty cells get a surface background + border so they're always visible as a grid.
 * Active cells use rgba(primary-rgb, alpha) via inline style — this correctly
 * tracks the theme's primary colour because ThemeContext updates --color-primary-rgb
 * whenever the theme changes.
 */
function cellProps(count: number): { className: string; style: CSSProperties } {
  if (count === 0) {
    return { className: 'bg-surface border border-border', style: {} };
  }
  const alpha = ACTIVE_ALPHA[Math.min(count, ACTIVE_ALPHA.length) - 1];
  return {
    className: '',
    style: { backgroundColor: `rgba(var(--color-primary-rgb), ${alpha})` },
  };
}

interface DayCell {
  date: string;
  count: number;
}

export default function ActivityHeatmap({ activityByDate }: { activityByDate: Record<string, number> }) {
  // Build 52-week grid anchored to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  // Start from the Sunday that is 51 weeks before the Sunday of this week
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay() - 51 * 7);

  type WeekCol = (DayCell | null)[];
  const weeks: WeekCol[] = [];
  const monthLabels: (string | null)[] = [];
  let prevMonth = -1;

  for (let w = 0; w < 52; w++) {
    const week: WeekCol = [];
    let labelForWeek: string | null = null;
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);
      date.setHours(0, 0, 0, 0);
      if (date.getTime() > todayTime) {
        week.push(null);
        continue;
      }
      const dateStr = date.toISOString().split('T')[0];
      const month = date.getMonth();
      if (month !== prevMonth) {
        labelForWeek = MONTH_LABELS[month];
        prevMonth = month;
      }
      week.push({ date: dateStr, count: activityByDate[dateStr] ?? 0 });
    }
    weeks.push(week);
    monthLabels.push(labelForWeek);
  }

  // Stats
  const totalActiveDays = Object.values(activityByDate).filter((v) => v > 0).length;

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = new Date(todayTime - 86400000).toISOString().split('T')[0];
  let currentStreak = 0;
  const hasToday = !!activityByDate[todayStr];
  const startOffset = hasToday ? 0 : activityByDate[yesterdayStr] ? 1 : -1;
  if (startOffset >= 0) {
    for (let i = startOffset; ; i++) {
      const ds = new Date(todayTime - i * 86400000).toISOString().split('T')[0];
      if (activityByDate[ds]) currentStreak++;
      else break;
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-4 mb-4 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-light-text">Activity</span>
        <div className="flex items-center gap-3 text-[10px] text-dark-text">
          {currentStreak > 0 && (
            <span className="text-primary font-medium">{currentStreak}-day streak</span>
          )}
          <span>{totalActiveDays} active days this year</span>
        </div>
      </div>

      <div className="flex gap-1.5">
        {/* Day-of-week labels */}
        <div className="flex flex-col pt-4">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-3 mb-[2px] text-[9px] text-dark-text/40 flex items-center w-6 justify-end pr-1">
              {label}
            </div>
          ))}
        </div>

        {/* Grid + month labels */}
        <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
          <div className="min-w-max">
            {/* Month labels row */}
            <div className="flex gap-[2px] mb-1">
              {weeks.map((_, w) => (
                <div key={w} className="w-3 text-[9px] text-dark-text/40 shrink-0 overflow-visible whitespace-nowrap">
                  {monthLabels[w] ?? ''}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[2px]">
              {weeks.map((week, w) => (
                <div key={w} className="flex flex-col gap-[2px]">
                  {week.map((cell, d) => {
                    if (cell === null) return <div key={d} className="w-3 h-3 shrink-0" />;
                    const { className, style } = cellProps(cell.count);
                    return (
                      <div
                        key={d}
                        className={`w-3 h-3 rounded-[2px] shrink-0 ${className}`}
                        style={style}
                        title={`${cell.date}: ${cell.count} ${cell.count === 1 ? 'activity' : 'activities'}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[9px] text-dark-text/40">Less</span>
        {[0, 1, 2, 3, 4].map((level) => {
          const { className, style } = cellProps(level);
          return <div key={level} className={`w-3 h-3 rounded-[2px] ${className}`} style={style} />;
        })}
        <span className="text-[9px] text-dark-text/40">More</span>
      </div>
    </div>
  );
}
