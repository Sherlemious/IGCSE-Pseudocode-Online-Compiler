interface Props {
  data: Record<string, { attempted: number; solved: number }>;
}

const COLORS: Record<string, { bar: string; label: string }> = {
  EASY: { bar: 'bg-success', label: 'text-success' },
  MEDIUM: { bar: 'bg-warning', label: 'text-warning' },
  HARD: { bar: 'bg-error', label: 'text-error' },
};

export default function DifficultyBreakdown({ data }: Props) {
  const maxAttempted = Math.max(...Object.values(data).map((d) => d.attempted), 1);

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-light-text mb-4 uppercase tracking-wider">By Difficulty</h3>
      <div className="space-y-4">
        {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => {
          const d = data[diff] || { attempted: 0, solved: 0 };
          const pct = d.attempted > 0 ? Math.round((d.solved / d.attempted) * 100) : 0;
          const barWidth = d.attempted > 0 ? (d.attempted / maxAttempted) * 100 : 0;
          const solvedWidth = d.solved > 0 ? (d.solved / maxAttempted) * 100 : 0;

          return (
            <div key={diff}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${COLORS[diff].label}`}>{diff}</span>
                <span className="text-[10px] text-dark-text">
                  {d.solved}/{d.attempted} solved ({pct}%)
                </span>
              </div>
              <div className="h-3 bg-background rounded-full overflow-hidden relative">
                <div
                  className={`absolute inset-y-0 left-0 ${COLORS[diff].bar} opacity-20 rounded-full transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
                <div
                  className={`absolute inset-y-0 left-0 ${COLORS[diff].bar} rounded-full transition-all duration-500`}
                  style={{ width: `${solvedWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
