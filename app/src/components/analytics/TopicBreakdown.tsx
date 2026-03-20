interface Props {
  data: Record<string, { attempted: number; solved: number }>;
}

export default function TopicBreakdown({ data }: Props) {
  const entries = Object.entries(data).sort((a, b) => b[1].attempted - a[1].attempted);
  const maxAttempted = Math.max(...entries.map(([, d]) => d.attempted), 1);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '180ms' }}>
      <h3 className="mono-label text-dark-text mb-5">By Topic</h3>
      {entries.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-dark-text/50">No topic data yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(([topic, d]) => {
            const pct = d.attempted > 0 ? Math.round((d.solved / d.attempted) * 100) : 0;
            const barWidth = (d.attempted / maxAttempted) * 100;
            const solvedWidth = (d.solved / maxAttempted) * 100;

            return (
              <div key={topic}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-light-text">{topic}</span>
                  <span className="text-[10px] text-dark-text font-mono tabular-nums">
                    {d.solved}/{d.attempted} <span className="text-dark-text/40">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/15 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${solvedWidth}%`,
                      boxShadow: solvedWidth > 0 ? '0 0 8px -2px var(--color-primary)' : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
