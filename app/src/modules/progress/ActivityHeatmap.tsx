'use client';

import type { CSSProperties } from 'react';
import { buildHeatmap } from './heatmap';

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

export default function ActivityHeatmap({ activityByDate, asOf }: { activityByDate: Record<string, number>; asOf: number }) {
  // UTC days from the server's timestamp, so the server render and the browser
  // hydrate the same grid.
  const { weeks, monthLabels, totalActiveDays, currentStreak } = buildHeatmap(activityByDate, asOf);

  return (
    <div className="bg-surface rounded-xl border border-border p-4 mb-4 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <span className="display-serif text-base font-semibold text-light-text">Activity</span>
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
