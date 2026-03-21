import { Trophy, Clock, AlertTriangle } from 'lucide-react';

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
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-xs font-semibold text-light-text mb-4 uppercase tracking-wider">Exam History</h3>
        <p className="text-xs text-dark-text text-center py-4">No exams taken yet</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-light-text mb-3 uppercase tracking-wider">Exam History</h3>
      <div className="space-y-2">
        {exams.map((exam) => {
          const pct = exam.totalTests && exam.totalTests > 0
            ? Math.round(((exam.score ?? 0) / exam.totalTests) * 100)
            : null;
          const durationMs = exam.completedAt
            ? new Date(exam.completedAt).getTime() - new Date(exam.startedAt).getTime()
            : null;
          const durationMin = durationMs ? Math.ceil(durationMs / 60000) : null;

          return (
            <div key={exam.id} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-2">
                {exam.status === 'TIMED_OUT' ? (
                  <AlertTriangle size={12} className="text-error shrink-0" />
                ) : (
                  <Trophy size={12} className="text-warning shrink-0" />
                )}
                <div>
                  <div className="text-xs text-light-text">
                    {exam.questionCount}Q · {exam.timeLimitMin}min
                    {exam.topic && ` · ${exam.topic}`}
                  </div>
                  <div className="text-[10px] text-dark-text">
                    {new Date(exam.startedAt).toLocaleDateString()}
                    {durationMin !== null && ` · ${durationMin} min`}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                {pct !== null ? (
                  <>
                    <div className={`text-xs font-bold ${pct >= 70 ? 'text-success' : pct >= 40 ? 'text-warning' : 'text-error'}`}>
                      {pct}%
                    </div>
                    <div className="text-[9px] text-dark-text flex items-center gap-0.5 justify-end">
                      <Clock size={8} />
                      {exam.score}/{exam.totalTests}
                    </div>
                  </>
                ) : (
                  <span className="text-[10px] text-dark-text">{exam.status.replace('_', ' ')}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
