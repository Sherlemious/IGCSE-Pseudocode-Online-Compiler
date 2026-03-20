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
    questions.forEach((q) => { map[q.questionId] = q.savedCode || q.starterCode; });
    return map;
  });
  const [gradeResults, setGradeResults] = useState<Record<string, { passCount: number; totalTests: number; graded: boolean }>>(() => {
    const map: Record<string, { passCount: number; totalTests: number; graded: boolean }> = {};
    questions.forEach((q) => { map[q.questionId] = { passCount: q.passCount, totalTests: q.totalTests, graded: q.graded }; });
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

  // Auto-save code to server
  const saveCode = useCallback(async (qId: string, c: string) => {
    try {
      await fetch(`/api/exam/${examId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qId, code: c }),
      });
    } catch { /* silent */ }
  }, [examId]);

  const handleCodeChange = useCallback((newCode: string) => {
    const qId = question.questionId;
    setCodes((prev) => ({ ...prev, [qId]: newCode }));
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveCode(qId, newCode), 2000);
  }, [question.questionId, saveCode]);

  // Run code
  const handleRun = useCallback(() => {
    if (isRunning) { interpreterStop(); return; }
    clearEntries();
    setActiveTab('terminal');
    interpreterRun(code);
  }, [isRunning, code, interpreterRun, interpreterStop, clearEntries]);

  // Grade current question
  const handleGrade = useCallback(async () => {
    if (grading) return;
    setGrading(true);
    if (isRunning) interpreterStop();

    // Save first
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
    } catch { /* silent */ }
    setGrading(false);
  }, [grading, isRunning, interpreterStop, saveCode, question.questionId, code, examId]);

  // Submit exam
  const handleSubmit = useCallback(async (timedOut = false) => {
    if (submitting) return;
    setSubmitting(true);

    // Save current code
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
  }, [submitting, saveCode, question.questionId, code, examId, router]);

  const handleTimeUp = useCallback(() => {
    handleSubmit(true);
  }, [handleSubmit]);

  // Ctrl+Enter to run
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

  // Navigate questions
  const goPrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const goNext = () => { if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1); };

  const result = gradeResults[question.questionId];

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-background flex flex-col">
      {/* Top bar: timer, question nav, submit */}
      <div className="h-10 border-b border-border bg-surface flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-3">
          <ExamTimer startedAt={startedAt} timeLimitMin={timeLimitMin} onTimeUp={handleTimeUp} />
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="p-1 rounded hover:bg-background transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-light-text font-medium min-w-[60px] text-center">
              Q{currentIndex + 1} / {questions.length}
            </span>
            <button
              onClick={goNext}
              disabled={currentIndex === questions.length - 1}
              className="p-1 rounded hover:bg-background transition-colors disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Question dots */}
        <div className="flex items-center gap-1">
          {questions.map((q, i) => {
            const r = gradeResults[q.questionId];
            const isActive = i === currentIndex;
            return (
              <button
                key={q.questionId}
                onClick={() => setCurrentIndex(i)}
                className={`w-6 h-6 rounded text-[10px] font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' :
                  r?.graded && r.passCount === r.totalTests ? 'bg-success/20 text-success border border-success/30' :
                  r?.graded ? 'bg-warning/20 text-warning border border-warning/30' :
                  'bg-background text-dark-text border border-border'
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-medium
            hover:bg-primary/25 transition-colors disabled:opacity-50"
        >
          {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          Submit Exam
        </button>
      </div>

      {/* Main content: question + editor + output */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Left: question description */}
        <div className="lg:w-80 shrink-0 border-r border-border overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary">
          <h2 className="text-sm font-bold text-light-text mb-1">{question.title}</h2>
          <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border mb-3 ${
            question.difficulty === 'EASY' ? 'text-success border-success/30 bg-success/10' :
            question.difficulty === 'MEDIUM' ? 'text-warning border-warning/30 bg-warning/10' :
            'text-error border-error/30 bg-error/10'
          }`}>
            {question.difficulty}
          </span>
          <div className="text-xs text-light-text/80 whitespace-pre-wrap leading-relaxed">
            {question.description}
          </div>

          {question.testCases.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-light-text mb-2">Sample Test Cases</h3>
              <div className="space-y-2">
                {question.testCases.map((tc, i) => (
                  <div key={tc.id} className="bg-background rounded border border-border p-2 text-[11px] font-mono">
                    <div className="text-dark-text mb-1">Test {i + 1}{tc.description ? `: ${tc.description}` : ''}</div>
                    {tc.inputs.length > 0 && (
                      <div className="mb-0.5">
                        <span className="text-info">Inputs: </span>{tc.inputs.join(', ')}
                      </div>
                    )}
                    <div>
                      <span className="text-success">Expected: </span>
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
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
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
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
                bg-primary/15 text-primary hover:bg-primary/25 transition-colors disabled:opacity-50"
            >
              {grading ? <Loader2 size={11} className="animate-spin" /> : <ClipboardCheck size={11} />}
              Grade
            </button>
            <button
              onClick={() => handleCodeChange(question.starterCode)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs
                text-dark-text hover:text-light-text hover:bg-background transition-colors"
            >
              <RotateCcw size={11} />
              Reset
            </button>

            {result?.graded && (
              <div className="ml-auto flex items-center gap-1 text-xs font-medium">
                {result.passCount === result.totalTests ? (
                  <CheckCircle size={12} className="text-success" />
                ) : (
                  <XCircle size={12} className="text-error" />
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
            {/* Tabs */}
            <div className="h-8 border-b border-border bg-surface flex items-center gap-0.5 px-2 shrink-0">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeTab === 'terminal' ? 'bg-background text-light-text' : 'text-dark-text hover:text-light-text'
                }`}
              >
                <Terminal size={11} />
                Terminal
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeTab === 'results' ? 'bg-background text-light-text' : 'text-dark-text hover:text-light-text'
                }`}
              >
                <ClipboardCheck size={11} />
                Results
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 font-mono text-xs scrollbar-thin scrollbar-thumb-primary">
              {activeTab === 'terminal' ? (
                <div className="space-y-0.5">
                  {entries.map((entry: OutputEntry, i: number) => (
                    <div key={i} className={
                      entry.kind === 'error' ? 'text-error' :
                      entry.kind === 'input' ? 'text-info' :
                      'text-light-text'
                    }>
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
                      <span className="text-info">{'>'}</span>
                      <input
                        name="input"
                        autoFocus
                        className="flex-1 bg-transparent text-light-text outline-none"
                        autoComplete="off"
                      />
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {!result?.graded ? (
                    <div className="text-dark-text text-center py-4">
                      Click &quot;Grade&quot; to test your solution
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className={`text-lg font-bold ${
                        result.passCount === result.totalTests ? 'text-success' : 'text-warning'
                      }`}>
                        {result.passCount}/{result.totalTests}
                      </span>
                      <span className="text-dark-text text-[11px] ml-1">tests passed</span>
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
