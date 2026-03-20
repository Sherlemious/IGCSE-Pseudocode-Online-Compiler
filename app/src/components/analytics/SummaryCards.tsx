import { Target, CheckCircle, Repeat, Trophy } from 'lucide-react';

interface Props {
  totalQuestions: number;
  totalAttempted: number;
  totalSolved: number;
  totalAttempts: number;
  examsCompleted: number;
}

export default function SummaryCards({ totalQuestions, totalAttempted, totalSolved, totalAttempts, examsCompleted }: Props) {
  const cards = [
    {
      label: 'Questions Solved',
      value: `${totalSolved}/${totalQuestions}`,
      sub: `${totalAttempted} attempted`,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10 border-success/20',
    },
    {
      label: 'Total Submissions',
      value: totalAttempts,
      sub: totalAttempted > 0 ? `${(totalAttempts / totalAttempted).toFixed(1)} avg per question` : 'No submissions yet',
      icon: Repeat,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
    },
    {
      label: 'Solve Rate',
      value: totalAttempted > 0 ? `${Math.round((totalSolved / totalAttempted) * 100)}%` : '—',
      sub: `${totalSolved} of ${totalAttempted} attempted`,
      icon: Target,
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/20',
    },
    {
      label: 'Exams Completed',
      value: examsCompleted,
      sub: 'Timed practice sessions',
      icon: Trophy,
      color: 'text-info',
      bg: 'bg-info/10 border-info/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-lg border p-4 ${c.bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <c.icon size={14} className={c.color} />
            <span className="text-[10px] text-dark-text font-medium uppercase tracking-wider">{c.label}</span>
          </div>
          <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
          <div className="text-[10px] text-dark-text mt-0.5">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
