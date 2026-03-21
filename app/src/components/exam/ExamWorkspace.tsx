'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CodeMirrorEditor from '../compiler/CodeMirrorEditor';
import { useInterpreter } from '../../interpreter/useInterpreter';
import type { OutputEntry } from '../../interpreter';
import ExamTimer from './ExamTimer';
import {
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  XCircle,
  Loader2,
  Terminal,
  ClipboardCheck,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */

interface TestCase {
  id: string;
  inputs: string[];
  expectedOutput: string;
  description: string | null;
}

interface ExamQuestion {
  answerId: string;
  questionId: string;
  title: string;
  description: string;
  difficulty: string;
  starterCode: string;
  savedCode: string;
  graded: boolean;
  passCount: number;
  totalTests: number;
  testCases: TestCase[];
}

interface Props {
  examId: string;
  questions: ExamQuestion[];
  timeLimitMin: number;
  startedAt: string;
}

/* ── Component ──────────────────────────────────────────── */

export default function ExamWorkspace({ examId, questions, timeLimitMin, startedAt }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    questions.forEach((q) => {
      map[q.questionId] = q.savedCode || q.starterCode;
    });
    return map;
  });
  const [gradeResults, setGradeResults] = useState<
    Record<string, { passCount: number; totalTests: number; graded: boolean }>
  >(() => {
    const map: Record<string, { passCount: number; totalTests: number; graded: boolean }> = {};
    questions.forEach((q) => {
      map[q.questionId] = { passCount: q.passCount, totalTests: q.totalTests, graded: q.graded };
    });
    return map;
  });
  const [activeTab, setActiveTab] = useState<'terminal' | 'results'>('terminal');
  const [grading, setGrading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const question = questions[currentIndex];
  const code = codes[question.questionId] || '';

  const {
    entries,
    isRunning,
    waitingForInput,
    run: interpreterRun,
    stop: interpreterStop,
    provideInput,
    clearEntries,
  } = useInterpreter();

  const saveCode = useCallback(
    async (qId: string, c: string) => {
      try {
        await fetch(`/api/exam/${examId}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: qId, code: c }),
        });
      } catch {
        /* silent */
      }
    },
    [examId]
  );

  const handleCodeChange = useCallback(
    (newCode: string) => {
      const qId = question.questionId;
      setCodes((prev) => ({ ...prev, [qId]: newCode }));
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => saveCode(qId, newCode), 2000);
    },
    [question.questionId, saveCode]
  );

  const handleRun = useCallback(() => {
    if (isRunning) {
      interpreterStop();
      return;
    }
    clearEntries();
    setActiveTab('terminal');
    interpreterRun(code);
  }, [isRunning, code, interpreterRun, interpreterStop, clearEntries]);

  const handleGrade = useCallback(async () => {
    if (grading) return;
    setGrading(true);
    if (isRunning) interpreterStop();
    await saveCode(question.questionId, code);

    try {
      const res = await fetch(`/api/exam/${examId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.questionId, code }),
      });

      if (res.ok) {
        const data = await res.json();
        setGradeResults((prev) => ({
          ...prev,
          [question.questionId]: { passCount: data.passCount, totalTests: data.totalTests, graded: true },
        }));
        setActiveTab('results');
      }
    } catch {
      /* silent */
    }
    setGrading(false);
  }, [grading, isRunning, interpreterStop, saveCode, question.questionId, code, examId]);

  const handleSubmit = useCallback(
    async (timedOut = false) => {
      if (submitting) return;
      setSubmitting(true);
      await saveCode(question.questionId, code);

      try {
        await fetch(`/api/exam/${examId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timedOut }),
        });
        router.push(`/exam/${examId}/results`);
      } catch {
        setSubmitting(false);
      }
    },
    [submitting, saveCode, question.questionId, code, examId, router]
  );

  const handleTimeUp = useCallback(() => {
    handleSubmit(true);
  }, [handleSubmit]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) handleGrade();
        else handleRun();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleRun, handleGrade]);

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const goNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const result = gradeResults[question.questionId];

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-background flex flex-col">
      {/* Top bar */}
      <div className="h-11 border-b border-border bg-surface flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-3">
          <ExamTimer startedAt={startedAt} timeLimitMin={timeLimitMin} onTimeUp={handleTimeUp} />
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="p-1 rounded hover:bg-background transition-colors disabled:opacity-20"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-light-text font-mono font-medium min-w-[60px] text-center tabular-nums">
              Q{currentIndex + 1}/{questions.length}
            </span>
            <button
              onClick={goNext}
              disabled={currentIndex === questions.length - 1}
              className="p-1 rounded hover:bg-background transition-colors disabled:opacity-20"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Question dots */}
        <div className="flex items-center gap-1 max-w-[50%] overflow-x-auto scrollbar-none">
          {questions.map((q, i) => {
            const r = gradeResults[q.questionId];
            const isActive = i === currentIndex;
            const allPassed = r?.graded && r.passCount === r.totalTests;
            const partial = r?.graded && !allPassed;
            return (
              <button
                key={q.questionId}
                onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 rounded-md text-[10px] font-mono font-bold shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-[0_0_12px_-2px_rgba(var(--color-primary-rgb),0.5)]'
                    : allPassed
                      ? 'bg-success/15 text-success border border-success/30'
                      : partial
                        ? 'bg-warning/15 text-warning border border-warning/30'
                        : 'bg-background text-dark-text border border-border hover:border-primary/30'
                }`}
                title={q.title}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg
            bg-primary text-on-primary text-xs font-semibold
            hover:opacity-90 active:scale-[0.97] transition-all duration-200 disabled:opacity-50
            shadow-[0_0_12px_-2px_rgba(var(--color-primary-rgb),0.3)]"
        >
          {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          Submit
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Left: question description */}
        <div className="lg:w-80 shrink-0 border-r border-border overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-primary">
          <h2 className="text-sm font-bold text-light-text mb-1.5">{question.title}</h2>
          <span
            className={`inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border mb-3 ${
              question.difficulty === 'EASY'
                ? 'text-success border-success/30 bg-success/8'
                : question.difficulty === 'MEDIUM'
                  ? 'text-warning border-warning/30 bg-warning/8'
                  : 'text-error border-error/30 bg-error/8'
            }`}
          >
            {question.difficulty}
          </span>
          <div className="text-xs text-light-text/80 whitespace-pre-wrap leading-relaxed">{question.description}</div>

          {question.testCases.length > 0 && (
            <div className="mt-5">
              <h3 className="mono-label text-dark-text mb-2">Sample Tests</h3>
              <div className="space-y-2">
                {question.testCases.map((tc, i) => (
                  <div
                    key={tc.id}
                    className="bg-background rounded-lg border border-border p-2.5 text-[11px] font-mono"
                  >
                    <div className="text-dark-text/60 mb-1 text-[10px]">
                      #{i + 1}
                      {tc.description ? ` — ${tc.description}` : ''}
                    </div>
                    {tc.inputs.length > 0 && (
                      <div className="mb-0.5">
                        <span className="text-info">in: </span>
                        {tc.inputs.join(', ')}
                      </div>
                    )}
                    <div>
                      <span className="text-success">out: </span>
                      <span className="whitespace-pre-wrap">{tc.expectedOutput}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: editor + output */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Toolbar */}
          <div className="h-9 border-b border-border bg-surface flex items-center gap-1.5 px-2 shrink-0">
            <button
              onClick={handleRun}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                isRunning
                  ? 'bg-error/15 text-error hover:bg-error/25'
                  : 'bg-success/15 text-success hover:bg-success/25'
              }`}
            >
              {isRunning ? <Square size={11} /> : <Play size={11} />}
              {isRunning ? 'Stop' : 'Run'}
            </button>
            <button
              onClick={handleGrade}
              disabled={grading || isRunning}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium
                bg-primary/15 text-primary hover:bg-primary/25 transition-all duration-200 disabled:opacity-40"
            >
              {grading ? <Loader2 size={11} className="animate-spin" /> : <ClipboardCheck size={11} />}
              Grade
            </button>
            <button
              onClick={() => handleCodeChange(question.starterCode)}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs
                text-dark-text hover:text-light-text hover:bg-background transition-all duration-200"
            >
              <RotateCcw size={11} />
              Reset
            </button>

            {result?.graded && (
              <div className="ml-auto flex items-center gap-1.5 text-xs font-mono font-semibold">
                {result.passCount === result.totalTests ? (
                  <CheckCircle size={13} className="text-success" />
                ) : (
                  <XCircle size={13} className="text-error" />
                )}
                <span className={result.passCount === result.totalTests ? 'text-success' : 'text-warning'}>
                  {result.passCount}/{result.totalTests}
                </span>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0 flex flex-col" style={{ flex: '1 1 60%' }}>
            <CodeMirrorEditor value={code} onChange={handleCodeChange} />
          </div>

          {/* Output panel */}
          <div className="border-t border-border flex flex-col" style={{ flex: '0 0 35%', minHeight: '120px' }}>
            <div className="h-8 border-b border-border bg-surface flex items-center gap-0.5 px-2 shrink-0">
              {(['terminal', 'results'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-background text-light-text shadow-sm'
                      : 'text-dark-text hover:text-light-text'
                  }`}
                >
                  {tab === 'terminal' ? <Terminal size={11} /> : <ClipboardCheck size={11} />}
                  {tab === 'terminal' ? 'Terminal' : 'Results'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 font-mono text-xs scrollbar-thin scrollbar-thumb-primary">
              {activeTab === 'terminal' ? (
                <div className="space-y-0.5">
                  {entries.map((entry: OutputEntry, i: number) => (
                    <div
                      key={i}
                      className={
                        entry.kind === 'error' ? 'text-error' : entry.kind === 'input' ? 'text-info' : 'text-light-text'
                      }
                    >
                      {entry.kind === 'input' ? `> ${entry.value}` : entry.text}
                    </div>
                  ))}
                  {waitingForInput && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const input = form.elements.namedItem('input') as HTMLInputElement;
                        provideInput(input.value);
                        input.value = '';
                      }}
                      className="flex items-center gap-1 mt-1"
                    >
                      <span className="text-info terminal-cursor">{'>'}</span>
                      <input
                        name="input"
                        autoFocus
                        className="flex-1 bg-transparent text-light-text outline-none caret-primary"
                        autoComplete="off"
                      />
                    </form>
                  )}
                  {entries.length === 0 && !waitingForInput && (
                    <div className="text-dark-text/40 text-center py-6">
                      Press <kbd>Ctrl+Enter</kbd> to run
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {!result?.graded ? (
                    <div className="text-dark-text/40 text-center py-6">
                      Press <kbd>Ctrl+Shift+Enter</kbd> to grade
                    </div>
                  ) : (
                    <div className="text-center py-3 animate-scale-in">
                      <span
                        className={`text-2xl font-bold font-mono ${
                          result.passCount === result.totalTests ? 'text-success' : 'text-warning'
                        }`}
                      >
                        {result.passCount}/{result.totalTests}
                      </span>
                      <div className="mono-label text-dark-text mt-1">tests passed</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
