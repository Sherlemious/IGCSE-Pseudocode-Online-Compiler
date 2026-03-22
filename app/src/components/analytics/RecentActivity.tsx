import Link from 'next/link';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface ActivityItem {
  questionTitle: string;
  difficulty: string;
  status: string;
  bestScore: number;
  totalTests: number;
  attempts: number;
  updatedAt: string;
}

interface Props {
  items: ActivityItem[];
}

export default function RecentActivity({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
        <h3 className="mono-label text-dark-text mb-5">Recent Activity</h3>
        <div className="text-center py-8">
          <Circle size={20} className="text-dark-text/20 mx-auto mb-2" />
          <p className="text-xs text-dark-text/50 mb-3">No activity yet</p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
          >
            Start practicing <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
      <h3 className="mono-label text-dark-text mb-4">Recent Activity</h3>
      <div className="space-y-0.5">
        {items.map((item, i) => {
          const solved = item.status === 'SOLVED';
          const pct = item.totalTests > 0 ? Math.round((item.bestScore / item.totalTests) * 100) : 0;
          return (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0 group"
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                solved ? 'bg-success/15' : 'bg-background'
              }`}>
                {solved ? (
                  <CheckCircle size={11} className="text-success" />
                ) : (
                  <Circle size={11} className="text-dark-text/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-light-text truncate">{item.questionTitle}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-mono ${
                    item.difficulty === 'EASY' ? 'text-success' :
                    item.difficulty === 'MEDIUM' ? 'text-warning' : 'text-error'
                  }`}>
                    {item.difficulty}
                  </span>
                  <span className="text-border text-[10px]">&middot;</span>
                  <span className="text-[10px] text-dark-text font-mono">
                    {item.attempts}x
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-[11px] font-mono font-semibold tabular-nums ${
                  pct === 100 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-dark-text'
                }`}>
                  {item.bestScore}/{item.totalTests}
                </div>
                <div className="text-[9px] text-dark-text/50 font-mono">
                  {new Date(item.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
