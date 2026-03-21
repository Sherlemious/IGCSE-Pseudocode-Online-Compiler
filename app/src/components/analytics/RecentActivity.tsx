import { CheckCircle, XCircle } from 'lucide-react';

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
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-xs font-semibold text-light-text mb-4 uppercase tracking-wider">Recent Activity</h3>
        <p className="text-xs text-dark-text text-center py-4">No activity yet. Start practicing!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-light-text mb-3 uppercase tracking-wider">Recent Activity</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-2 min-w-0">
              {item.status === 'SOLVED' ? (
                <CheckCircle size={12} className="text-success shrink-0" />
              ) : (
                <XCircle size={12} className="text-dark-text shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-xs text-light-text truncate">{item.questionTitle}</div>
                <div className="text-[10px] text-dark-text">
                  {item.difficulty} · {item.attempts} attempt{item.attempts !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <div className="text-[10px] font-medium text-light-text">
                {item.bestScore}/{item.totalTests}
              </div>
              <div className="text-[9px] text-dark-text">
                {new Date(item.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
