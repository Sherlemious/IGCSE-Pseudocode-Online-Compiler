'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Target } from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { DIFF_META, type PracticeListQuestion } from './filterUtils';
import { readStreak, type StreakState } from './practiceStreak';

type Props = {
  question: PracticeListQuestion;
  /** `first`: nothing solved yet. `next`: already solving, here's another. */
  kind: 'first' | 'next';
};

/**
 * One clear next step at the top of the practice list. Most visitors who open
 * the list never solve anything, so we pick an easy, widely-solved question
 * for them instead of leaving them to choose from dozens.
 */
export default function StartHereCard({ question, kind }: Props) {
  const [streak, setStreak] = useState<StreakState | null>(null);
  const shownFor = useRef<string | null>(null);
  const meta = DIFF_META[question.difficulty as keyof typeof DIFF_META];

  useEffect(() => {
    const state = readStreak();
    setStreak(state);
    if (shownFor.current === question.id) return;
    shownFor.current = question.id;
    captureEvent('practice_start_here_shown', {
      question_id: question.id,
      kind,
      difficulty: question.difficulty,
      streak: state.streak,
      solved_today: state.solvedToday,
    });
  }, [question.id, question.difficulty, kind]);

  const streakLine =
    streak && streak.streak > 0
      ? streak.solvedToday
        ? `${streak.streak}-day streak. Today is done, see you tomorrow.`
        : `${streak.streak}-day streak. Solve one today to keep it.`
      : null;

  return (
    <Link
      href={`/practice/${question.id}`}
      onClick={() =>
        captureEvent('practice_start_here_clicked', {
          question_id: question.id,
          kind,
          difficulty: question.difficulty,
          streak: streak?.streak ?? 0,
        })
      }
      className="group relative flex items-center gap-3 mb-5 pl-3.5 pr-4 py-3 rounded-xl border border-success/25 bg-success/[0.06] hover:bg-success/10 hover:border-success/40 transition-all duration-200 overflow-hidden animate-fade-in-up"
    >
      <span className="relative shrink-0 w-8 h-8 rounded-lg bg-success/15 border border-success/25 flex items-center justify-center">
        <Target size={14} className="text-success" />
      </span>
      <div className="relative min-w-0 flex-1">
        <div className="mono-label text-success/80 mb-0.5">
          {kind === 'first' ? 'New here? Start with this one' : 'Up next'}
        </div>
        <div className="text-sm font-medium text-light-text truncate">
          {question.title}
          {meta && <span className={`ml-2 text-[10px] font-semibold ${meta.text}`}>{meta.label}</span>}
        </div>
        {streakLine && (
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-warning">
            <Flame size={11} aria-hidden="true" />
            {streakLine}
          </div>
        )}
      </div>
      <ArrowRight size={14} className="relative shrink-0 text-success group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
