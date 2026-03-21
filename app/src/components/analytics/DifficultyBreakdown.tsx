interface Props {
  data: Record<string, { attempted: number; solved: number }>;
}

const DIFFS = [
  { key: 'EASY', label: 'Easy', color: 'var(--color-success)', textClass: 'text-success' },
  { key: 'MEDIUM', label: 'Medium', color: 'var(--color-warning)', textClass: 'text-warning' },
  { key: 'HARD', label: 'Hard', color: 'var(--color-error)', textClass: 'text-error' },
] as const;

export default function DifficultyBreakdown({ data }: Props) {
  const maxAttempted = Math.max(...Object.values(data).map((d) => d.attempted), 1);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
      <h3 className="mono-label text-dark-text mb-5">By Difficulty</h3>
      <div className="space-y-5">
        {DIFFS.map(({ key, label, color, textClass }) => {
          const d = data[key] || { attempted: 0, solved: 0 };
          const pct = d.attempted > 0 ? Math.round((d.solved / d.attempted) * 100) : 0;
          const barWidth = d.attempted > 0 ? (d.attempted / maxAttempted) * 100 : 0;
          const solvedWidth = d.solved > 0 ? (d.solved / maxAttempted) * 100 : 0;

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className={`text-xs font-semibold ${textClass}`}>{label}</span>
                </div>
                <span className="text-[10px] text-dark-text font-mono tabular-nums">
                  {d.solved}/{d.attempted} <span className="text-dark-text/40">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 rounded-full opacity-15 transition-all duration-700 ease-out"
                  style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${solvedWidth}%`,
                    backgroundColor: color,
                    boxShadow: solvedWidth > 0 ? `0 0 8px -2px ${color}` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
