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
      label: 'Solved',
      value: `${totalSolved}/${totalQuestions}`,
      sub: `${totalAttempted} attempted`,
      icon: CheckCircle,
      color: 'text-success',
      glow: 'rgba(var(--color-primary-rgb), 0.08)',
      borderHover: 'hover:border-success/30',
    },
    {
      label: 'Submissions',
      value: String(totalAttempts),
      sub: totalAttempted > 0 ? `${(totalAttempts / totalAttempted).toFixed(1)} avg/question` : 'No submissions',
      icon: Repeat,
      color: 'text-primary',
      glow: 'rgba(var(--color-primary-rgb), 0.08)',
      borderHover: 'hover:border-primary/30',
    },
    {
      label: 'Solve Rate',
      value: totalAttempted > 0 ? `${Math.round((totalSolved / totalAttempted) * 100)}%` : '\u2014',
      sub: `${totalSolved} of ${totalAttempted}`,
      icon: Target,
      color: 'text-warning',
      glow: 'rgba(var(--color-warning-rgb), 0.06)',
      borderHover: 'hover:border-warning/30',
    },
    {
      label: 'Exams',
      value: String(examsCompleted),
      sub: 'Timed sessions',
      icon: Trophy,
      color: 'text-info',
      glow: 'rgba(var(--color-primary-rgb), 0.06)',
      borderHover: 'hover:border-info/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 stagger-children">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`bg-surface rounded-xl border border-border p-4 transition-all duration-200 ${c.borderHover}`}
          style={{ boxShadow: `0 0 20px -8px ${c.glow}` }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <c.icon size={13} className={c.color} />
            <span className="mono-label text-dark-text">{c.label}</span>
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums leading-none ${c.color}`}>
            {c.value}
          </div>
          <div className="text-[10px] text-dark-text mt-1.5 font-mono">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
