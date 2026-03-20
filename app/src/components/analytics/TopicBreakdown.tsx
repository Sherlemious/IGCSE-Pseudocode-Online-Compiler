interface Props {
  data: Record<string, { attempted: number; solved: number }>;
}

export default function TopicBreakdown({ data }: Props) {
  const entries = Object.entries(data).sort((a, b) => b[1].attempted - a[1].attempted);
  const maxAttempted = Math.max(...entries.map(([, d]) => d.attempted), 1);

  if (entries.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-xs font-semibold text-light-text mb-4 uppercase tracking-wider">By Topic</h3>
        <p className="text-xs text-dark-text text-center py-4">No topic data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-light-text mb-4 uppercase tracking-wider">By Topic</h3>
      <div className="space-y-3">
        {entries.map(([topic, d]) => {
          const pct = d.attempted > 0 ? Math.round((d.solved / d.attempted) * 100) : 0;
          const barWidth = (d.attempted / maxAttempted) * 100;
          const solvedWidth = (d.solved / maxAttempted) * 100;

          return (
            <div key={topic}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-light-text">{topic}</span>
                <span className="text-[10px] text-dark-text">
                  {d.solved}/{d.attempted} ({pct}%)
                </span>
              </div>
              <div className="h-2.5 bg-background rounded-full overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 bg-primary opacity-20 rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
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
