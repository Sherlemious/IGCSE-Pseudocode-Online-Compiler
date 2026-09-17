'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle, Play, Square, Terminal, XCircle } from 'lucide-react';
import { CodeMirrorEditor, TraceTable } from '@/modules/compiler/editor';
import { useInterpreter } from '@/modules/interpreter/useInterpreter';
import { checkLessonCode, type LessonCheckResult } from './check';
import { markAttempt } from './progress';
import { persistLearnProgress } from './progressSync';
import { captureLearn, learnLessonProps } from './telemetry';
import type { LearnLesson, LearnLevel } from './types';

type Props = {
  level: LearnLevel;
  lesson: LearnLesson;
  onPassed: (attempts: number) => void;
};

export default function LearnEditorPane({ level, lesson, onPassed }: Props) {
  const [code, setCode] = useState(lesson.starterCode ?? '');
  const [inputValue, setInputValue] = useState('');
  const [check, setCheck] = useState<LessonCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { run, stop, clearEntries, provideInput, entries, isRunning, waitingForInput, errorLine, traceRows, maxTraceRows } =
    useInterpreter({ feature: 'learn', questionId: lesson.id });
  const canCheck = lesson.type !== 'quiz';

  useEffect(() => {
    setCode(lesson.starterCode ?? '');
    setCheck(null);
    setAttempts(0);
    clearEntries();
  }, [lesson.id, lesson.starterCode, clearEntries]);

  useEffect(() => {
    if (waitingForInput) inputRef.current?.focus();
  }, [waitingForInput]);

  const handleRun = useCallback(() => {
    setCheck(null);
    void run(code);
  }, [code, run]);

  const handleCheck = useCallback(async () => {
    setChecking(true);
    setCheck(null);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    try {
      const result = await checkLessonCode(lesson, code);
      setCheck(result);
      const map = markAttempt(lesson.id, {
        lastOk: result.ok,
        lastReason: result.reason,
        lastCode: code,
      });
      captureLearn(
        'learn_check_submitted',
        learnLessonProps(level, lesson, {
          ok: result.ok,
          reason: result.reason,
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
  }, [attempts, code, lesson, level, onPassed]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    provideInput(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col min-h-0 h-full min-w-0 w-full border border-border rounded-xl overflow-hidden bg-surface">
      <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 border-b border-border bg-background/60 min-w-0">
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning && !waitingForInput}
          className="inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-md bg-primary text-on-primary text-xs font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {isRunning && !waitingForInput ? <Square size={12} /> : <Play size={12} />}
          {isRunning && !waitingForInput ? 'Running' : 'Run'}
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
        {canCheck && (
        <button
          type="button"
          onClick={() => void handleCheck()}
          disabled={checking}
          className="inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-md border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 disabled:opacity-50"
        >
          <CheckCircle size={12} />
          {checking ? 'Checking…' : 'Check'}
        </button>
        )}
        <span className="ml-auto hidden sm:inline text-[10px] uppercase tracking-wider text-dark-text/60 truncate min-w-0">
        {lesson.type === 'mutate' ? 'Change the starter' : lesson.type === 'grade' ? 'Hidden tests' : lesson.type === 'quiz' ? 'Run to fill the trace' : 'Match the output'}
        </span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col min-w-0 overflow-hidden">
        <CodeMirrorEditor
          value={code}
          onChange={setCode}
          onRun={handleRun}
          onStop={stop}
          isRunning={isRunning}
          errorLine={errorLine}
          ariaLabel={`${lesson.title} editor`}
        />
      </div>

      <div className="shrink-0 border-t border-border bg-background max-h-28 sm:max-h-40 lg:max-h-48 overflow-y-auto overflow-x-hidden p-3 font-mono text-xs scrollbar-pretty min-w-0">
        <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold uppercase tracking-wider text-dark-text/60">
          <Terminal size={12} />
          Terminal
        </div>
        {entries.length === 0 && !isRunning && (
          <p className="text-dark-text/50">Run to see output. Check compares against the expected result.</p>
        )}
        {entries.map((entry, i) => {
          if (entry.kind === 'output') {
            return (
              <div key={i} className="whitespace-pre-wrap text-light-text">
                {entry.text}
              </div>
            );
          }
          if (entry.kind === 'error') {
            return (
              <div key={i} className="whitespace-pre-wrap text-error">
                {entry.text}
              </div>
            );
          }
          if (entry.kind === 'input') {
            if (entry.submitted) {
              return (
                <div key={i} className="text-info/80">
                  {entry.variableName}: {entry.value}
                </div>
              );
            }
            return (
              <form key={i} onSubmit={handleInputSubmit} className="flex items-center gap-2 my-1 min-w-0">
                <span className="text-primary shrink-0 max-w-[40%] truncate sm:max-w-none">
                  {entry.prompt || entry.variableName}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent border-b border-primary/50 text-info outline-none py-1"
                  autoFocus
                />
              </form>
            );
          }
          return null;
        })}
      </div>

      {traceRows.length > 0 && (
        <div className="shrink-0 border-t border-border max-h-40 sm:max-h-52 overflow-auto">
          <TraceTable rows={traceRows} maxRows={maxTraceRows} isLive={isRunning} />
        </div>
      )}

      {check && (
        <div
          className={`shrink-0 px-3 py-2 border-t text-xs flex items-start gap-2 min-w-0 ${
            check.ok
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-error/30 bg-error/10 text-error'
          }`}
        >
          {check.ok ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> : <XCircle size={14} className="shrink-0 mt-0.5" />}
          <span className="min-w-0 break-words">{check.message}</span>
        </div>
      )}
    </div>
  );
}
