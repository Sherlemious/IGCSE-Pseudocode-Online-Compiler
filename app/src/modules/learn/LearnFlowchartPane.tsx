'use client';

// Lesson pane for `flowchart` lessons: draw (or complete) a flowchart, run it,
// and Check it against the lesson's tests.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, Play, Square, Terminal, XCircle } from 'lucide-react';
import type { FlowchartDoc } from '@/modules/interpreter/converters/flowchartDoc';
import FlowchartBuilder from '@/modules/flowchart/FlowchartBuilder';
import FlowchartTerminal from '@/modules/flowchart/FlowchartTerminal';
import { useFlowchartRun } from '@/modules/flowchart/useFlowchartRun';
import { checkLessonFlowchart, type LessonCheckResult } from './check';
import { lessonFlowchartStart } from './flowchartLesson';
import { markAttempt } from './progress';
import { persistLearnProgress } from './progressSync';
import { captureLearn, learnLessonProps } from './telemetry';
import type { LearnLesson, LearnLevel } from './types';

type Props = {
  level: LearnLevel;
  lesson: LearnLesson;
  onPassed: (attempts: number) => void;
};

export default function LearnFlowchartPane({ level, lesson, onPassed }: Props) {
  const start = useMemo(() => lessonFlowchartStart(lesson), [lesson]);
  const fillIn = !!lesson.flowchartBlanks?.length;
  const [doc, setDoc] = useState<FlowchartDoc>(start);
  const [canvasKey, setCanvasKey] = useState(0);
  const [check, setCheck] = useState<LessonCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [tried, setTried] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ nodeId: string; nonce: number } | null>(null);

  const runner = useFlowchartRun(doc, { feature: 'learn', questionId: lesson.id, surface: 'learn' });
  const { program, issues, activeNodeId, entries, isRunning, waitingForInput, provideInput, stop, clearEntries, runFlowchart } =
    runner;

  useEffect(() => {
    setDoc(start);
    setCanvasKey((k) => k + 1);
    setCheck(null);
    setAttempts(0);
    setTried(false);
    clearEntries();
  }, [lesson.id, start, clearEntries]);

  const handleRun = useCallback(() => {
    setCheck(null);
    setTried(true);
    if (!runFlowchart()) {
      const first = program.errors.find((e) => e.nodeId);
      if (first?.nodeId) setFocusRequest({ nodeId: first.nodeId, nonce: Date.now() });
    }
  }, [runFlowchart, program.errors]);

  const handleCheck = useCallback(async () => {
    setChecking(true);
    setTried(true);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    try {
      const result = await checkLessonFlowchart(lesson, doc);
      setCheck(result);
      if (result.nodeId) setFocusRequest({ nodeId: result.nodeId, nonce: Date.now() });
      const map = markAttempt(lesson.id, {
        lastOk: result.ok,
        lastReason: result.reason,
        lastCode: program.code,
      });
      captureLearn(
        'learn_check_submitted',
        learnLessonProps(level, lesson, {
          ok: result.ok,
          reason: result.reason,
          answer_format: 'flowchart',
          error_category: result.errorCategory ?? null,
          attempts: nextAttempts,
          message: result.message.slice(0, 180),
        }),
      );
      if (result.ok) onPassed(nextAttempts);
      else {
        const entry = map[lesson.id];
        if (entry) void persistLearnProgress({ [lesson.id]: entry });
      }
    } finally {
      setChecking(false);
    }
  }, [attempts, lesson, level, doc, program.code, onPassed]);

  const shownIssues =
    check && !check.ok && check.nodeId
      ? [{ nodeId: check.nodeId, message: check.message, category: check.reason }]
      : tried || !program.errors.length
        ? issues
        : [];

  return (
    <div className="flex flex-col min-h-0 h-full min-w-0 w-full border border-border rounded-xl overflow-hidden bg-surface">
      <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 border-b border-border bg-background/60 min-w-0">
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning && !waitingForInput}
          className="inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-md bg-primary text-on-primary text-xs font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <Play size={12} />
          Run
        </button>
        {isRunning && (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-md border border-border text-xs text-dark-text hover:text-light-text"
          >
            <Square size={12} />
            Stop
          </button>
        )}
        <button
          type="button"
          onClick={() => void handleCheck()}
          disabled={checking}
          className="inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-md border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 disabled:opacity-50"
        >
          <CheckCircle size={12} />
          {checking ? 'Checking…' : 'Check'}
        </button>
        <span className="ml-auto hidden sm:inline text-[10px] uppercase tracking-wider text-dark-text/60 truncate min-w-0">
          {fillIn ? 'Fill in the dashed boxes' : 'Draw the flowchart'}
        </span>
      </div>

      <div className="flex-1 min-h-[18rem] flex flex-col min-w-0 overflow-hidden">
        <FlowchartBuilder
          key={`${lesson.id}:${canvasKey}`}
          doc={doc}
          onChange={setDoc}
          mode={fillIn ? 'template' : 'free'}
          issues={shownIssues}
          activeNodeId={activeNodeId}
          focusRequest={focusRequest}
          surface="learn"
          ariaLabel={`${lesson.title} flowchart`}
        />
      </div>

      <div className="shrink-0 border-t border-border bg-background max-h-28 sm:max-h-40 overflow-y-auto overflow-x-hidden scrollbar-pretty min-w-0">
        <div className="flex items-center gap-1.5 px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-dark-text/60">
          <Terminal size={12} />
          Terminal
        </div>
        <FlowchartTerminal
          entries={entries}
          isRunning={isRunning}
          waitingForInput={waitingForInput}
          onInput={provideInput}
          emptyText="Run to see output. Check runs the flowchart against the expected result."
        />
      </div>

      {check && (
        <div
          className={`shrink-0 px-3 py-2 border-t text-xs flex items-start gap-2 min-w-0 ${
            check.ok ? 'border-success/30 bg-success/10 text-success' : 'border-error/30 bg-error/10 text-error'
          }`}
        >
          {check.ok ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> : <XCircle size={14} className="shrink-0 mt-0.5" />}
          <span className="min-w-0 break-words whitespace-pre-wrap">{check.message}</span>
        </div>
      )}
    </div>
  );
}
