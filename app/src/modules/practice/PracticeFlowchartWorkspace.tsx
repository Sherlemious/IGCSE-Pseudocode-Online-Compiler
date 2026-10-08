'use client';

// Practice workspace for FLOWCHART questions: the answer is drawn (or, for a
// template, filled in) on the flowchart builder, run like code, and checked by
// the grade route, which turns it into pseudocode and runs the question's tests.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  AlertTriangle,
  Bug,
  CheckCircle,
  ClipboardCheck,
  Code2,
  FastForward,
  Flame,
  Play,
  RotateCcw,
  SkipForward,
  Square,
  Terminal,
  XCircle,
} from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import {
  fillBlanks,
  isTemplate,
  parseFlowchartDoc,
  starterFlowchart,
  type FlowchartDoc,
} from '@/modules/interpreter/converters/flowchartDoc';
import type { FlowchartIssue } from '@/modules/interpreter/converters/flowchartToPseudocode';
import FlowchartBuilder from '@/modules/flowchart/FlowchartBuilder';
import FlowchartTerminal from '@/modules/flowchart/FlowchartTerminal';
import { useFlowchartRun } from '@/modules/flowchart/useFlowchartRun';
import { suggestLearnPath } from '@/modules/learn/learnNudge';
import { AUTOSAVE_DELAY } from '@/shared/lib/persist';
import GradeAuthSheet, { PENDING_GRADE_KEY } from './GradeAuthSheet';
import { readStreak, recordSolveDay } from './practiceStreak';

interface GradeResultItem {
  testCaseId: string;
  description: string | null;
  hidden: boolean;
  passed: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  inputs?: string[];
  error?: { kind: string; message: string; hint?: string; category?: string } | null;
}

interface GradeResponse {
  results: GradeResultItem[];
  passCount: number;
  totalCount: number;
  flowchartErrors?: FlowchartIssue[];
}

type Props = {
  questionId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  /** The question's flowchart: a starting canvas, or a template with blank boxes. */
  questionFlowchart: unknown;
  savedFlowchart?: unknown;
};

type Tab = 'output' | 'code' | 'results';

const STORAGE_KEY = (id: string) => `practice_flowchart:${id}`;

function readDraft(id: string): FlowchartDoc | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(id));
    return raw ? parseFlowchartDoc(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

/** A saved answer, kept on the template's locked structure when there is one. */
function restore(template: FlowchartDoc | null, saved: FlowchartDoc | null): FlowchartDoc | null {
  if (!saved) return null;
  if (template && isTemplate(template)) {
    return fillBlanks(template, Object.fromEntries(saved.nodes.map((n) => [n.id, n.label])));
  }
  return saved;
}

export default function PracticeFlowchartWorkspace({ questionId, difficulty, questionFlowchart, savedFlowchart }: Props) {
  const { status: authStatus, update: updateSession } = useSession();
  const template = useMemo(() => parseFlowchartDoc(questionFlowchart), [questionFlowchart]);
  const fillIn = !!template && isTemplate(template);
  const initial = useCallback(() => template ?? starterFlowchart(), [template]);

  const [doc, setDoc] = useState<FlowchartDoc>(initial);
  const [ready, setReady] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [tab, setTab] = useState<Tab>('output');
  const [checked, setChecked] = useState(false);
  const [grading, setGrading] = useState(false);
  const [gradeResponse, setGradeResponse] = useState<GradeResponse | null>(null);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [focusRequest, setFocusRequest] = useState<{ nodeId: string; nonce: number } | null>(null);

  const runner = useFlowchartRun(doc, { feature: 'practice', questionId, surface: 'practice' });
  const {
    program,
    issues,
    activeNodeId,
    entries,
    isRunning,
    isStepping,
    waitingForInput,
    provideInput,
    stop,
    step,
    continueExecution,
    runFlowchart,
    debugFlowchart,
  } = runner;

  // Server progress, then a local draft, then the question's canvas.
  useEffect(() => {
    const saved = restore(template, parseFlowchartDoc(savedFlowchart)) ?? restore(template, readDraft(questionId));
    if (saved) {
      setDoc(saved);
      setCanvasKey((k) => k + 1);
    }
    setStreakDays(readStreak().streak);
    setReady(true);
    captureEvent('practice_opened', { question_id: questionId, answer_format: 'flowchart' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY(questionId), JSON.stringify(doc));
      } catch {
        // storage full / unavailable
      }
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(t);
  }, [doc, ready, questionId]);

  const focusFirst = useCallback((list: FlowchartIssue[]) => {
    const first = list.find((i) => i.nodeId);
    if (first?.nodeId) setFocusRequest({ nodeId: first.nodeId, nonce: Date.now() });
  }, []);

  const handleRun = useCallback(
    (debug: boolean) => {
      setChecked(true);
      const ok = debug ? debugFlowchart() : runFlowchart();
      setTab(ok ? 'output' : 'results');
      if (!ok) focusFirst(program.errors);
    },
    [runFlowchart, debugFlowchart, focusFirst, program.errors],
  );

  const handleGrade = useCallback(async () => {
    if (grading || isRunning) return;
    setGrading(true);
    setGradeResponse(null);
    setGradingError(null);
    setChecked(true);
    setTab('results');
    try {
      const body = fillIn
        ? { answers: Object.fromEntries(doc.nodes.filter((n) => n.blank).map((n) => [n.id, n.label])) }
        : { flowchart: doc };
      const res = await fetch(`/api/questions/${questionId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data && typeof data.error === 'string' ? data.error : null;
        if (res.status === 401 && data?.code === 'AUTH_REQUIRED') setSheetOpen(true);
        else setGradingError(message ?? `Server error (${res.status}). Please try again.`);
        return;
      }
      const data: GradeResponse = await res.json();
      setGradeResponse(data);
      if (data.flowchartErrors?.length) focusFirst(data.flowchartErrors);
      const allPassed = data.passCount === data.totalCount;
      const firstFail = data.results.find((r) => !r.passed);
      captureEvent('practice_graded', {
        question_id: questionId,
        answer_format: 'flowchart',
        pass_count: data.passCount,
        total_count: data.totalCount,
        solved: allPassed,
        fail_kind: firstFail ? (firstFail.error?.kind ?? 'wrong_output') : null,
        error_category: firstFail?.error ? (firstFail.error.category ?? firstFail.error.kind) : null,
      });
      if (allPassed) {
        captureEvent('practice_solved', { question_id: questionId, answer_format: 'flowchart' });
        const day = recordSolveDay();
        setStreakDays(day.streak);
        if (day.extended) captureEvent('practice_streak_extended', { question_id: questionId, streak: day.streak });
        setTimeout(() => suggestLearnPath('practice'), 1200);
      }
      window.dispatchEvent(
        new CustomEvent('practice:graded', {
          detail: { isSolved: allPassed, allPassed, passCount: data.passCount, totalCount: data.totalCount },
        }),
      );
    } catch {
      setGradingError('Failed to connect to the grading server. Please try again.');
    } finally {
      setGrading(false);
    }
  }, [grading, isRunning, fillIn, doc, questionId, focusFirst]);

  const attemptGrade = useCallback(() => {
    if (difficulty !== 'EASY' && authStatus === 'unauthenticated') {
      setSheetOpen(true);
      return;
    }
    void handleGrade();
  }, [difficulty, authStatus, handleGrade]);

  // Back from sign-in with a pending check: run it once.
  const autoGradeFired = useRef(false);
  useEffect(() => {
    if (!ready || authStatus !== 'authenticated' || autoGradeFired.current) return;
    let pending = false;
    try {
      pending =
        new URLSearchParams(window.location.search).get('check') === '1' ||
        sessionStorage.getItem(PENDING_GRADE_KEY(questionId)) === '1';
    } catch {
      pending = false;
    }
    if (!pending) return;
    autoGradeFired.current = true;
    try {
      sessionStorage.removeItem(PENDING_GRADE_KEY(questionId));
      window.history.replaceState(null, '', `/practice/${questionId}`);
    } catch {
      // ignore
    }
    void handleGrade();
  }, [ready, authStatus, questionId, handleGrade]);

  const reset = useCallback(() => {
    if (!window.confirm(fillIn ? 'Clear your answers?' : 'Start this flowchart again?')) return;
    setDoc(initial());
    setCanvasKey((k) => k + 1);
    setGradeResponse(null);
    setChecked(false);
  }, [fillIn, initial]);

  const shownIssues: FlowchartIssue[] = gradeResponse?.flowchartErrors?.length
    ? gradeResponse.flowchartErrors
    : checked || !program.errors.length
      ? issues
      : [];
  const allPassed = gradeResponse && gradeResponse.passCount === gradeResponse.totalCount;
  const btn =
    'inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0';
  const ghost = `${btn} border border-border text-dark-text hover:text-light-text hover:border-primary/40`;

  if (!ready) return <div className="flex-1 bg-background" />;

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 flex items-center gap-1.5 px-2 sm:px-3 py-2 border-b border-border bg-surface overflow-x-auto scrollbar-none">
        {!isRunning ? (
          <>
            <button type="button" onClick={() => handleRun(false)} className={ghost}>
              <Play size={13} />
              Run
            </button>
            <button type="button" onClick={() => handleRun(true)} className={ghost} title="Step through one box at a time">
              <Bug size={13} />
              <span className="hidden sm:inline">Step</span>
            </button>
          </>
        ) : (
          <>
            {isStepping && (
              <>
                <button type="button" onClick={step} disabled={waitingForInput} className={ghost}>
                  <SkipForward size={13} />
                  Next box
                </button>
                <button type="button" onClick={continueExecution} disabled={waitingForInput} className={ghost}>
                  <FastForward size={13} />
                </button>
              </>
            )}
            <button type="button" onClick={stop} className={`${ghost} hover:!text-error`}>
              <Square size={13} />
              Stop
            </button>
          </>
        )}
        <button
          type="button"
          onClick={attemptGrade}
          disabled={grading}
          className={`${btn} bg-primary text-on-primary hover:opacity-90`}
          data-tour="practice-check"
        >
          <ClipboardCheck size={13} />
          {grading ? 'Checking…' : 'Check my flowchart'}
        </button>
        <button type="button" onClick={reset} className={`${ghost} ml-auto`} title="Start again">
          <RotateCcw size={13} />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
        <section className="flex-1 min-h-[55%] xl:min-h-0 min-w-0 flex flex-col" aria-label="Your flowchart">
          <FlowchartBuilder
            key={canvasKey}
            doc={doc}
            onChange={setDoc}
            mode={fillIn ? 'template' : 'free'}
            issues={shownIssues}
            activeNodeId={activeNodeId}
            focusRequest={focusRequest}
            surface="practice"
            ariaLabel="Your flowchart answer"
          />
        </section>

        <aside className="h-[40%] xl:h-auto xl:w-[340px] shrink-0 min-h-0 flex flex-col border-t xl:border-t-0 xl:border-l border-border bg-surface">
          <div className="shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-border" role="tablist">
            {(
              [
                ['output', 'Output', <Terminal key="i" size={13} />],
                ['code', 'Pseudocode', <Code2 key="i" size={13} />],
                ['results', 'Results', <ClipboardCheck key="i" size={13} />],
              ] as const
            ).map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  tab === id ? 'bg-background text-light-text font-medium' : 'text-dark-text hover:text-light-text hover:bg-background/50'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-auto scrollbar-pretty bg-background">
            {tab === 'output' && (
              <FlowchartTerminal entries={entries} isRunning={isRunning} waitingForInput={waitingForInput} onInput={provideInput} />
            )}
            {tab === 'code' &&
              (program.errors.length ? (
                <p className="p-3 text-xs text-dark-text">
                  Your flowchart can&apos;t be written as pseudocode yet: {program.errors[0].message}
                </p>
              ) : (
                <pre className="p-3 font-mono text-xs leading-5 text-light-text whitespace-pre">
                  {program.code.trim() || 'Add boxes between START and STOP.'}
                </pre>
              ))}
            {tab === 'results' && (
              <div className="p-3 text-xs space-y-2">
                {grading && <p className="text-dark-text">Checking your flowchart…</p>}
                {gradingError && <p className="text-error">{gradingError}</p>}
                {!grading && !gradeResponse && !gradingError && (
                  shownIssues.length ? (
                    <ul className="space-y-1">
                      {shownIssues.map((issue, i) => (
                        <li key={i} className="flex gap-2 text-light-text">
                          <AlertTriangle size={13} className="shrink-0 mt-0.5 text-warning" />
                          <span className="whitespace-pre-wrap">{issue.message}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-dark-text/70">
                      {fillIn
                        ? 'Fill in every dashed box, then Check. Your flowchart is turned into pseudocode and run against the tests.'
                        : 'Draw your flowchart, then Check. It is turned into pseudocode and run against the tests.'}
                    </p>
                  )
                )}
                {gradeResponse && (
                  <>
                    <div
                      className={`flex items-center gap-2 rounded-md px-2.5 py-2 font-semibold ${
                        allPassed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}
                    >
                      {allPassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {gradeResponse.passCount} / {gradeResponse.totalCount} tests passed
                      {allPassed && streakDays > 0 && (
                        <span className="ml-auto inline-flex items-center gap-1 text-warning font-normal">
                          <Flame size={12} />
                          {streakDays}-day streak
                        </span>
                      )}
                    </div>
                    {gradeResponse.flowchartErrors?.length ? (
                      <p className="flex gap-2 text-light-text">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-warning" />
                        <span className="whitespace-pre-wrap">{gradeResponse.flowchartErrors[0].message}</span>
                      </p>
                    ) : (
                      gradeResponse.results.map((r, i) => (
                        <div key={r.testCaseId} className="rounded-md border border-border bg-surface p-2">
                          <div className="flex items-center gap-1.5 font-medium text-light-text">
                            {r.passed ? <CheckCircle size={12} className="text-success" /> : <XCircle size={12} className="text-error" />}
                            Test {i + 1}
                            {r.hidden ? ' (hidden)' : r.description ? `: ${r.description}` : ''}
                          </div>
                          {!r.passed && !r.hidden && (
                            <div className="mt-1.5 font-mono text-[11px] space-y-0.5">
                              {r.inputs && r.inputs.length > 0 && (
                                <div>
                                  <span className="text-info">Inputs: </span>
                                  {r.inputs.join(', ')}
                                </div>
                              )}
                              <div>
                                <span className="text-success">Expected: </span>
                                <span className="whitespace-pre-wrap">{r.expectedOutput}</span>
                              </div>
                              <div>
                                <span className="text-error">Got: </span>
                                <span className="whitespace-pre-wrap">{r.actualOutput || '(nothing)'}</span>
                              </div>
                            </div>
                          )}
                          {!r.passed && r.error && (
                            <p className="mt-1 text-error whitespace-pre-wrap">{r.error.hint ?? r.error.message}</p>
                          )}
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {sheetOpen && (
        <GradeAuthSheet
          questionId={questionId}
          onClose={() => setSheetOpen(false)}
          onFlushBeforeOAuth={() => {
            try {
              localStorage.setItem(STORAGE_KEY(questionId), JSON.stringify(doc));
            } catch {
              // full
            }
          }}
          onAuthenticated={async () => {
            await updateSession();
            setSheetOpen(false);
            void handleGrade();
          }}
        />
      )}
    </div>
  );
}
