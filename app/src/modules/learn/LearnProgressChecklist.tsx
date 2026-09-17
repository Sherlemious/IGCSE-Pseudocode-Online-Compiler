import { CheckCircle2, Circle, Clock } from 'lucide-react';
import CodeDetails from '@/modules/classes/CodeDetails';
import { groupLessonsByLevel, type LearnProgressView } from './progressView';

export default function LearnProgressChecklist({
  view,
  classId,
  showCode = false,
}: {
  view: LearnProgressView;
  classId?: string;
  showCode?: boolean;
}) {
  const groups = groupLessonsByLevel(view.lessons);

  return (
    <div className="space-y-4">
      <p className="text-xs text-dark-text font-mono tabular-nums">
        <span className="text-success">{view.completedCount} done</span>
        {' · '}
        <span className="text-warning">{view.attemptedCount} tried</span>
        {' · '}
        <span className="text-dark-text/70">{view.notStartedCount} not started</span>
        {' · '}
        {view.completedCount}/{view.playableCount} playable
      </p>
      {groups.map((group) => (
        <div key={group.levelSlug}>
          <h3 className="mono-label text-dark-text mb-2">
            Level {group.levelNumber} · {group.levelName}
          </h3>
          <ul className="space-y-1.5">
            {group.lessons.map((lesson) => (
              <li key={lesson.lessonId} className="bg-surface border border-border rounded-lg px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-light-text truncate">
                    {lesson.lessonId} {lesson.title}
                  </span>
                  <span className="shrink-0 text-[11px] font-mono flex items-center gap-1.5">
                    {lesson.state === 'completed' ? (
                      <>
                        <CheckCircle2 size={13} className="text-success" />
                        <span className="text-success">Done</span>
                      </>
                    ) : lesson.state === 'attempted' ? (
                      <>
                        <Clock size={13} className="text-warning" />
                        <span className="text-warning">Tried</span>
                      </>
                    ) : (
                      <>
                        <Circle size={13} className="text-dark-text/40" />
                        <span className="text-dark-text/50">Not started</span>
                      </>
                    )}
                    {lesson.attempts > 0 && (
                      <span className="text-dark-text/40">· {lesson.attempts} tries</span>
                    )}
                  </span>
                </div>
                {showCode && lesson.lastCode && (
                  <div className="mt-2 border-t border-border/50 pt-2">
                    <CodeDetails
                      label={lesson.lastReason ? `Latest code · ${lesson.lastReason}` : 'Latest code'}
                      code={lesson.lastCode}
                      classId={classId}
                      surface={classId ? 'learn' : undefined}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
