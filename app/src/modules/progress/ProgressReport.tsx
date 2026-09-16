import Link from 'next/link';
import { BarChart3, BookOpen, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import SummaryCards from './SummaryCards';
import DifficultyBreakdown from './DifficultyBreakdown';
import TopicBreakdown from './TopicBreakdown';
import RecentActivity from './RecentActivity';
import ExamHistory from './ExamHistory';
import ActivityHeatmap from './ActivityHeatmap';
import type { ProgressReportData, ProgressVoice } from './report';

const RING = 76;
const RING_STROKE = 6;
const RING_R = (RING - RING_STROKE) / 2;
const RING_C = 2 * Math.PI * RING_R;

interface Props {
  report: ProgressReportData;
  title?: string;
  subtitle?: ReactNode;
  viewer?: ProgressVoice;
}

export default function ProgressReport({
  report,
  title = 'Report Card',
  subtitle,
  viewer = 'self',
}: Props) {
  const ringColor =
    report.overallPct >= 70 ? 'var(--color-success)' : report.overallPct >= 40 ? 'var(--color-warning)' : 'var(--color-error)';
  const RING_OFFSET = RING_C * (1 - report.overallPct / 100);
  const showCta = viewer === 'self';

  return (
    <>
      <div className="relative mb-6 rounded-2xl border border-border bg-surface/60 p-6 overflow-hidden animate-fade-in-up">
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgba(var(--color-primary-rgb), 0.07), transparent 55%)' }}
        />
        <div className="relative flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="mono-label text-primary/70 mb-1.5 flex items-center gap-1.5">
              <BarChart3 size={11} className="shrink-0" />
              Progress report
            </div>
            <h1 className="display-serif text-[1.9rem] leading-tight font-semibold text-light-text">{title}</h1>
            {subtitle && <p className="text-sm text-dark-text mt-1">{subtitle}</p>}
          </div>

          {report.totalAttempted > 0 && (
            <div className="relative shrink-0 animate-scale-in" style={{ width: RING, height: RING }}>
              <svg width={RING} height={RING} className="-rotate-90">
                <circle cx={RING / 2} cy={RING / 2} r={RING_R} fill="none" stroke="var(--color-border)" strokeWidth={RING_STROKE} />
                <circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={RING_R}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={RING_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_OFFSET}
                  style={{ animation: 'draw-progress 1s ease-out forwards' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="display-serif text-xl font-semibold leading-none" style={{ color: ringColor }}>{report.overallPct}%</span>
                <span className="mono-label text-dark-text/60 mt-1">solved</span>
              </div>
            </div>
          )}
        </div>

        {report.totalAttempted > 0 && (
          <div className="relative mt-5 pt-4 border-t border-border/60">
            <div className="mono-label text-dark-text/55 mb-1">Remarks</div>
            <p className="display-serif italic text-base leading-snug text-light-text/85">{report.remark}</p>
          </div>
        )}
      </div>

      {!report.hasActivity ? (
        viewer === 'teacher' ? (
          <p className="text-sm text-dark-text/70 px-1 py-6">This student hasn&apos;t practised yet.</p>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-primary/60" />
            </div>
            <h2 className="display-serif text-xl font-semibold text-light-text mb-2">No activity yet</h2>
            <p className="text-sm text-dark-text max-w-xs mb-6">
              Attempt your first practice question to start tracking your progress here.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 text-primary font-medium text-sm hover:bg-primary/25 transition-colors group"
            >
              Try your first question
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )
      ) : (
        <>
          <ActivityHeatmap activityByDate={report.activityByDate} />
          <SummaryCards
            totalQuestions={report.totalQuestions}
            totalAttempted={report.totalAttempted}
            totalSolved={report.totalSolved}
            totalAttempts={report.totalAttempts}
            examsCompleted={report.examsCompleted}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <DifficultyBreakdown data={report.difficultyMap} />
            <TopicBreakdown data={report.topicMap} showCta={showCta} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RecentActivity items={report.recentActivity} showCta={showCta} />
            <ExamHistory exams={report.exams} linkResults={showCta} showCta={showCta} />
          </div>
        </>
      )}
    </>
  );
}
