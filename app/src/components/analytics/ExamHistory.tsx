import { Trophy, Clock, AlertTriangle, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ExamItem {
  id: string;
  topic: string | null;
  difficulty: string | null;
  questionCount: number;
  timeLimitMin: number;
  status: string;
  score: number | null;
  totalTests: number | null;
  startedAt: string;
  completedAt: string | null;
}

interface Props {
  exams: ExamItem[];
}

export default function ExamHistory({ exams }: Props) {
  if (exams.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h3 className="mono-label text-dark-text mb-5">Exam History</h3>
        <div className="text-center py-8">
          <Circle size={20} className="text-dark-text/20 mx-auto mb-2" />
          <p className="text-xs text-dark-text/50 mb-3">No exams taken yet</p>
          <Link
            href="/exam"
            className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
          >
            Take an exam <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <h3 className="mono-label text-dark-text mb-4">Exam History</h3>
      <div className="space-y-0.5">
        {exams.map((exam) => {
          const pct = exam.totalTests && exam.totalTests > 0
            ? Math.round(((exam.score ?? 0) / exam.totalTests) * 100)
            : null;
          const durationMs = exam.completedAt
            ? new Date(exam.completedAt).getTime() - new Date(exam.startedAt).getTime()
            : null;
          const durationMin = durationMs ? Math.ceil(durationMs / 60000) : null;
          const timedOut = exam.status === 'TIMED_OUT';

          return (
            <Link
              key={exam.id}
              href={`/exam/${exam.id}/results`}
              className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0
                hover:bg-background/50 -mx-2 px-2 rounded-lg transition-colors group"
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                timedOut ? 'bg-error/15' : 'bg-warning/15'
              }`}>
                {timedOut ? (
                  <AlertTriangle size={11} className="text-error" />
                ) : (
                  <Trophy size={11} className="text-warning" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-light-text">
                  {exam.questionCount}Q &middot; {exam.timeLimitMin}min
                  {exam.topic && <span className="text-dark-text"> &middot; {exam.topic}</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-dark-text/50 font-mono">
                    {new Date(exam.startedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  {durationMin !== null && (
                    <>
                      <span className="text-border text-[10px]">&middot;</span>
                      <span className="text-[10px] text-dark-text/50 font-mono flex items-center gap-0.5">
                        <Clock size={8} />
                        {durationMin}m
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                {pct !== null ? (
                  <div className={`text-sm font-mono font-bold tabular-nums ${
                    pct >= 70 ? 'text-success' : pct >= 40 ? 'text-warning' : 'text-error'
                  }`}>
                    {pct}%
                  </div>
                ) : (
                  <span className="text-[10px] text-dark-text font-mono">
                    {exam.status.replace('_', ' ').toLowerCase()}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
