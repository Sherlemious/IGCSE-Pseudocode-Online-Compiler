'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import CodeMirrorEditor from '../compiler/CodeMirrorEditor';
import { useInterpreter } from '../../interpreter/useInterpreter';
import { AUTOSAVE_DELAY } from '../../utils/constants';
import {
  Play,
  Square,
  Bug,
  SkipForward,
  FastForward,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Terminal,
  ClipboardCheck,
  Trash2,
  EyeOff,
  Lightbulb,
  BookOpen,
  FileText,
  X,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */

interface GradeResultItem {
  testCaseId: string;
  description: string | null;
  hidden: boolean;
  passed: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  inputs?: string[];
  error?: { kind: string; message: string; line?: number } | null;
  executionMs: number;
}

interface GradeResponse {
  results: GradeResultItem[];
  passCount: number;
  totalCount: number;
}

interface Props {
  questionId: string;
  starterCode: string;
  savedCode?: string | null;
  preloadedFileNames?: string[];
}

/* ── Helpers ────────────────────────────────────────────── */

const STORAGE_KEY = (id: string) => `practice_code:${id}`;

function loadSavedCode(questionId: string, starterCode: string): string {
  try {
    return localStorage.getItem(STORAGE_KEY(questionId)) ?? starterCode;
  } catch {
    return starterCode;
  }
}

function errorLabel(kind: string): string {
  switch (kind) {
    case 'timeout': return 'Timed out';
    case 'parse':   return 'Syntax error';
    case 'runtime': return 'Runtime error';
    default:        return 'Error';
  }
}

function errorHint(error: NonNullable<GradeResultItem['error']>): string {
  if (error.kind === 'timeout')
    return `${error.message} \u2014 check for infinite loops or missing loop counters.`;
  return error.line ? `Line ${error.line}: ${error.message}` : error.message;
}

/* ── Component ──────────────────────────────────────────── */

export default function PracticeWorkspace({ questionId, starterCode, savedCode, preloadedFileNames }: Props) {
  /* ── Code state ─────────────────────────────────────── */
  const [code, setCode] = useState(() => savedCode || loadSavedCode(questionId, starterCode));

  /* ── Interpreter ────────────────────────────────────── */
  const {
    entries, isRunning, waitingForInput,
    isStepping, debugLine, debugVariables, errorLine, breakpoints,
    run, debugRun, step, continueExecution, provideInput, stop, clearEntries, toggleBreakpoint,
  } = useInterpreter();

  /* ── Output panel ───────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<'output' | 'results'>('output');
  const [splitPercent, setSplitPercent] = useState(55);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Grading ────────────────────────────────────────── */
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResponse, setGradeResponse] = useState<GradeResponse | null>(null);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [showFailuresOnly, setShowFailuresOnly] = useState(false);

  /* ── Confirm dialogs + mobile view + jump to line ───── */
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'output'>('editor');
  const [jumpToLine, setJumpToLine] = useState<number | null>(null);

  /* ── Input field (for terminal INPUT prompts) ───────── */
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Autosave ───────────────────────────────────────── */
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY(questionId), code); } catch { /* full */ }
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(saveTimer.current);
  }, [code, questionId]);

  /* ── Auto-scroll terminal ──────────────────────────── */
  useEffect(() => {
    if (activeTab === 'output' && scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      });
    }
  }, [entries, waitingForInput, activeTab]);

  /* ── Auto-focus input ──────────────────────────────── */
  useEffect(() => {
    if (waitingForInput && inputRef.current) inputRef.current.focus();
  }, [waitingForInput]);

  /* ── Handlers ───────────────────────────────────────── */
  const handleRun = useCallback(async () => {
    if (!code.trim() || isRunning) return;
    setActiveTab('output');
    await run(code);
  }, [code, isRunning, run]);

  const handleDebug = useCallback(async () => {
    if (!code.trim() || isRunning) return;
    setActiveTab('output');
    await debugRun(code);
  }, [code, isRunning, debugRun]);

  const handleGrade = useCallback(async () => {
    if (!code.trim() || isGrading || isRunning) return;
    setIsGrading(true);
    setGradeResponse(null);
    setGradingError(null);
    setActiveTab('results');

    try {
      const res = await fetch(`/api/questions/${questionId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => 'Unknown error');
        setGradingError(`Server error (${res.status}): ${text}`);
        return;
      }
      const data: GradeResponse = await res.json();
      setGradeResponse(data);
      setMobileView('output');
      window.dispatchEvent(new CustomEvent('practice:graded', {
        detail: { isSolved: data.passCount === data.totalCount },
      }));
    } catch {
      setGradingError('Failed to connect to the grading server. Please try again.');
    } finally {
      setIsGrading(false);
    }
  }, [code, isGrading, isRunning, questionId]);

  const handleReset = useCallback(() => {
    if (code === starterCode) return;
    setResetConfirmOpen(true);
  }, [code, starterCode]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitingForInput) {
      provideInput(inputValue);
      setInputValue('');
    }
  };

  /* ── Keyboard shortcuts ─────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleGrade();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleRun, handleGrade]);

  /* ── Vertical resize drag ──────────────────────────── */
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientPos = 'touches' in ev ? ev.touches[0] : ev;
      const pct = ((clientPos.clientY - rect.top) / rect.height) * 100;
      setSplitPercent(Math.max(20, Math.min(80, pct)));
    };
    const onEnd = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
  }, []);

  /* ── Derived state ──────────────────────────────────── */
  const busy = isRunning || isGrading;

  /* ── Desktop detection for split pane sizing ─────── */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────── */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-2 shrink-0">
        {/* Left: reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            disabled={busy || code === starterCode}
            className="flex items-center gap-1 px-2 py-1 text-xs text-dark-text hover:text-light-text
              hover:bg-background rounded transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Reset to starter code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Right: execution + grade controls */}
        <div className="flex items-center gap-0.5">
          {/* Debug step/continue controls */}
          {isStepping && (
            <>
              <button
                onClick={step}
                className="flex items-center gap-1 px-2 py-1 text-xs text-info hover:bg-info/10 rounded transition-colors"
                title="Step Over (next statement)"
              >
                <SkipForward className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Step</span>
              </button>
              <button
                onClick={continueExecution}
                className="flex items-center gap-1 px-2 py-1 text-xs text-success hover:bg-success/10 rounded transition-colors"
                title="Continue execution"
              >
                <FastForward className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Continue</span>
              </button>
            </>
          )}

          {/* Stop */}
          {isRunning && (
            <button
              onClick={stop}
              className="flex items-center gap-1 px-2 py-1 text-xs text-error hover:bg-error/10 rounded transition-colors"
              title="Stop (Ctrl+Shift+K)"
            >
              <Square className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}

          {/* Run & Debug */}
          {!isRunning && !isGrading && (
            <>
              <button
                onClick={handleDebug}
                disabled={!code.trim()}
                className="flex items-center gap-1 px-2 py-1 text-xs text-warning hover:bg-warning/10 rounded
                  transition-colors disabled:opacity-50 disabled:pointer-events-none"
                title="Debug (step through code)"
              >
                <Bug className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Debug</span>
              </button>
              <button
                onClick={handleRun}
                disabled={!code.trim()}
                className="flex items-center gap-1 px-2 py-1 text-xs text-success hover:bg-success/10 rounded
                  transition-colors disabled:opacity-50 disabled:pointer-events-none"
                title="Run Code (Ctrl+Enter)"
              >
                <Play className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Run</span>
              </button>
            </>
          )}

          {/* Divider */}
          <div className="w-px h-4 bg-border mx-1" />

          {/* Grade */}
          <button
            onClick={handleGrade}
            disabled={busy || !code.trim()}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded
              bg-primary/15 text-primary hover:bg-primary/25 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            title="Check My Answer (Ctrl+Shift+Enter)"
          >
            {isGrading ? (
              <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            ) : (
              <ClipboardCheck className="h-3.5 w-3.5" />
            )}
            {isGrading ? 'Checking\u2026' : 'Check My Answer'}
          </button>
        </div>
      </div>

      {/* ── Mobile tab switcher ──────────────────────── */}
      <div className="lg:hidden flex shrink-0 border-b border-border bg-surface">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${
            mobileView === 'editor' ? 'text-light-text border-b-2 border-primary' : 'text-dark-text'
          }`}
        >
          <FileText className="h-3 w-3" />
          Editor
        </button>
        <button
          onClick={() => setMobileView('output')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${
            mobileView === 'output' ? 'text-light-text border-b-2 border-primary' : 'text-dark-text'
          }`}
        >
          <Terminal className="h-3 w-3" />
          Output
          {gradeResponse && (
            <span className={`text-[10px] font-mono font-semibold ${gradeResponse.passCount === gradeResponse.totalCount ? 'text-success' : 'text-warning'}`}>
              {gradeResponse.passCount}/{gradeResponse.totalCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Editor + Output split ────────────────────── */}
      <div ref={containerRef} className="flex-1 min-h-0 flex flex-col">
        {/* Editor */}
        <div
          className={mobileView === 'output' ? 'hidden lg:flex min-h-0 overflow-hidden' : 'flex min-h-0 overflow-hidden'}
          style={isDesktop ? { flex: `0 0 ${splitPercent}%` } : { flex: '1' }}
        >
          <CodeMirrorEditor
            value={code}
            onChange={setCode}
            onRun={handleRun}
            onStop={stop}
            isRunning={busy}
            readOnly={isStepping}
            debugLine={debugLine}
            errorLine={errorLine}
            breakpoints={breakpoints}
            onBreakpointToggle={toggleBreakpoint}
            ariaLabel="Practice Code Editor"
            jumpToLine={jumpToLine}
            onJumpToLineConsumed={() => setJumpToLine(null)}
          />
        </div>

        {/* Drag handle - desktop only */}
        <div
          className="hidden lg:block shrink-0 h-1 w-full bg-border hover:bg-primary transition-colors cursor-row-resize"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />

        {/* Output panel */}
        <div className={`min-h-0 flex-col overflow-hidden ${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'} flex-1`}>
          {/* Tab bar */}
          <div className="h-8 bg-surface border-b border-border flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setActiveTab('output')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
                  activeTab === 'output'
                    ? 'bg-background text-light-text font-medium'
                    : 'text-dark-text hover:text-light-text hover:bg-background/50'
                }`}
              >
                <Terminal className="h-3 w-3" />
                Output
                {isRunning && !isStepping && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                )}
                {isStepping && <Bug className="h-3 w-3 text-warning" />}
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
                  activeTab === 'results'
                    ? 'bg-background text-light-text font-medium'
                    : 'text-dark-text hover:text-light-text hover:bg-background/50'
                }`}
              >
                <ClipboardCheck className="h-3 w-3" />
                Results
                {gradeResponse && (
                  <span className={`text-[10px] font-semibold ${
                    gradeResponse.passCount === gradeResponse.totalCount ? 'text-success' : 'text-dark-text'
                  }`}>
                    {gradeResponse.passCount}/{gradeResponse.totalCount}
                  </span>
                )}
                {isGrading && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              {activeTab === 'output' && (
                <button
                  onClick={clearEntries}
                  className="text-dark-text hover:text-light-text p-1 rounded hover:bg-background transition-colors"
                  title="Clear output"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="hidden lg:inline text-[10px] text-dark-text bg-background px-1.5 py-0.5 rounded border border-border font-mono ml-1">
                {activeTab === 'results' ? 'Ctrl+Shift+Enter' : 'Ctrl+Enter'}
              </kbd>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'output' ? (
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 bg-background overflow-y-auto
                scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full"
            >
              {renderTerminal()}
            </div>
          ) : (
            <div className="flex-1 min-h-0 bg-background overflow-y-auto
              scrollbar-thin scrollbar-thumb-primary scrollbar-track-background scrollbar-thumb-rounded-full">
              {renderResults()}
            </div>
          )}
        </div>
      </div>

      {/* Reset confirm dialog */}
      {resetConfirmOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setResetConfirmOpen(false)}
        >
          <div
            className="bg-surface border border-border rounded-xl p-5 max-w-sm w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-light-text flex items-center gap-2">
                <RotateCcw size={14} className="text-warning shrink-0" />
                Reset to starter code?
              </h3>
              <button onClick={() => setResetConfirmOpen(false)} className="text-dark-text hover:text-light-text transition-colors p-0.5">
                <X size={14} />
              </button>
            </div>
            <p className="text-xs text-dark-text mb-4 leading-relaxed">Your current code will be lost.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-dark-text hover:text-light-text transition-colors rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={() => { setResetConfirmOpen(false); setCode(starterCode); }}
                className="px-3 py-1.5 text-xs font-medium text-warning bg-warning/10 hover:bg-warning/20 rounded-lg border border-warning/30 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Terminal tab content ───────────────────────────── */
  function renderTerminal() {
    // Empty state
    if (!isRunning && entries.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-dark-text select-none p-4">
          <Terminal className="h-8 w-8 text-dark-text/20" />
          <div className="text-center space-y-1">
            <div className="text-xs text-dark-text/50">
              Press <kbd>Ctrl+Enter</kbd> to run your code
            </div>
            <div className="text-xs text-dark-text/30">
              or <kbd>Ctrl+Shift+Enter</kbd> to check
            </div>
          </div>
          {preloadedFileNames && preloadedFileNames.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-info/70 bg-info/5 border border-info/20 rounded px-2.5 py-1.5 max-w-xs text-center">
              <FileText size={11} className="shrink-0" />
              <span>
                <strong className="font-semibold">{preloadedFileNames.join(', ')}</strong>
                {' '}pre-loaded during grading — not available in local runs
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-3 font-mono" style={{ fontSize: 'var(--editor-font-size)' }}>
        {/* Debug variables */}
        {isStepping && debugVariables.length > 0 && (
          <div className="mb-3 pb-2 border-b border-border/30">
            <div className="flex items-center gap-1.5 text-xs text-warning mb-1.5">
              <Bug className="h-3 w-3" />
              <span className="font-semibold">Variables</span>
            </div>
            <div className="space-y-0.5">
              {debugVariables.map((v) => (
                <div key={v.name} className="flex gap-2 text-xs">
                  <span className="text-light-text">{v.name}</span>
                  <span className="text-dark-text">=</span>
                  <span className="text-info">
                    {v.type === 'STRING' ? `"${v.value}"` : v.type === 'CHAR' ? `'${v.value}'` : v.value}
                  </span>
                  <span className="text-dark-text/40 text-[10px]">{v.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Output entries */}
        {entries.map((entry, i) => {
          if (entry.kind === 'output') {
            return (
              <div key={i} className="flex gap-2 whitespace-pre-wrap">
                <ChevronRight size={14} className="text-primary/40 shrink-0 mt-0.5" />
                <span className="text-light-text">{entry.text}</span>
              </div>
            );
          }
          if (entry.kind === 'error') {
            const lineMatch = entry.text.match(/^Line (\d+)/);
            const errLine = lineMatch ? parseInt(lineMatch[1], 10) : null;
            return (
              <div
                key={i}
                className={`flex gap-2 whitespace-pre-wrap py-0.5 ${errLine ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''}`}
                onClick={errLine ? () => { setJumpToLine(errLine); setMobileView('editor'); } : undefined}
                title={errLine ? `Click to jump to line ${errLine}` : undefined}
              >
                <span className="text-error shrink-0 font-bold">!</span>
                <span className="text-error">{entry.text}</span>
              </div>
            );
          }
          if (entry.kind === 'input') {
            if (entry.submitted) {
              return (
                <div key={i} className="flex gap-2 whitespace-pre-wrap">
                  <span className="text-info/50 shrink-0">&larr;</span>
                  <span className="text-dark-text/70">{entry.variableName}:</span>
                  <span className="text-info">{entry.value}</span>
                </div>
              );
            }
            return (
              <form key={i} onSubmit={handleInputSubmit} className="flex items-center gap-2 my-1">
                <span className="text-info terminal-cursor shrink-0">&gt;</span>
                <span className="text-dark-text/70 shrink-0">{entry.variableName}:</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-transparent border-b border-primary/50
                    text-info outline-none font-mono py-0.5 px-0.5 focus:border-info"
                  style={{ fontSize: 'inherit' }}
                  autoFocus
                />
              </form>
            );
          }
          return null;
        })}

        {/* Status indicators */}
        {isStepping && entries.length === 0 && (
          <div className="flex items-center gap-2 text-warning">
            <Bug size={14} />
            <span>Debugging \u2014 use Step or Continue</span>
          </div>
        )}
        {isRunning && !isStepping && !waitingForInput && entries.length === 0 && (
          <div className="flex items-center gap-2 text-primary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Executing...</span>
          </div>
        )}
        {!isRunning && entries.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/50 text-xs text-dark-text/40 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-dark-text/30" />
            Process exited
          </div>
        )}
      </div>
    );
  }

  /* ── Results tab content ────────────────────────────── */
  function renderResults() {
    if (isGrading) {
      return (
        <div className="p-3 space-y-2 animate-pulse">
          <div className="rounded-lg border border-border p-3">
            <div className="h-5 bg-surface rounded w-10 mx-auto mb-1.5" />
            <div className="h-3 bg-surface rounded w-24 mx-auto" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-3.5 w-3.5 rounded-full bg-surface shrink-0" />
                <div className="h-3 bg-surface rounded w-28" />
                <div className="ml-auto h-3 bg-surface rounded w-10" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (gradingError) {
      return (
        <div className="p-4">
          <div className="rounded border border-error/30 bg-error/10 p-3 text-xs text-error flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {gradingError}
          </div>
        </div>
      );
    }

    if (!gradeResponse) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-dark-text select-none p-4">
          <ClipboardCheck className="h-8 w-8 text-dark-text/20" />
          <div className="text-center space-y-1">
            <div className="text-xs text-dark-text/50">
              Click <strong>Check My Answer</strong> or press <kbd>Ctrl+Shift+Enter</kbd>
            </div>
            <div className="text-xs text-dark-text/30">
              Your code will be tested against all test cases, including hidden ones.
            </div>
          </div>
        </div>
      );
    }

    const { results, passCount, totalCount } = gradeResponse;
    const allPassed = passCount === totalCount;
    const visibleResults = showFailuresOnly ? results.filter((r) => !r.passed) : results;

    return (
      <div className="p-3 space-y-2">
        {/* Summary banner */}
        <div className={`rounded-lg border p-3 text-center ${
          allPassed
            ? 'border-success/30 bg-success/10 text-success'
            : 'border-error/30 bg-error/10 text-error'
        }`}>
          <div className="text-lg font-bold">{passCount}/{totalCount}</div>
          <div className="text-xs">{allPassed ? 'All tests passed!' : 'Some tests failed'}</div>
          {!allPassed && (
            <div className="text-[10px] text-dark-text mt-1.5 flex items-center justify-center gap-1">
              <Lightbulb size={10} className="text-warning" />
              Stuck? Check the <strong className="text-light-text">Hints</strong> in the sidebar.
            </div>
          )}
          {allPassed && (
            <div className="text-[10px] text-dark-text mt-1.5 flex items-center justify-center gap-1">
              <BookOpen size={10} className="text-primary" />
              Compare with the <strong className="text-light-text">Model Solution</strong> in the sidebar.
            </div>
          )}
        </div>

        {/* Filter toggle */}
        {!allPassed && results.some((r) => r.passed) && (
          <button
            onClick={() => setShowFailuresOnly((v) => !v)}
            className={`text-[10px] px-2 py-1 rounded border transition-colors font-mono ${
              showFailuresOnly
                ? 'border-error/40 bg-error/10 text-error'
                : 'border-border text-dark-text hover:border-error/30 hover:text-error'
            }`}
          >
            {showFailuresOnly ? `Showing ${visibleResults.length} failure${visibleResults.length !== 1 ? 's' : ''}` : 'Show failures only'}
          </button>
        )}

        {/* Individual results */}
        {visibleResults.map((r, i) => (
          <div
            key={r.testCaseId}
            className={`rounded border p-3 text-xs ${
              r.passed
                ? 'border-success/30 bg-success/5'
                : 'border-error/30 bg-error/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {r.passed ? (
                <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-error shrink-0" />
              )}
              <span className="font-medium text-light-text">
                {r.hidden ? (
                  <span className="flex items-center gap-1">
                    <EyeOff className="h-3 w-3 text-dark-text" />
                    Hidden Test {i + 1}
                  </span>
                ) : (
                  <>Test {i + 1}{r.description ? `: ${r.description}` : ''}</>
                )}
              </span>
              {r.executionMs > 0 && (
                <span className="ml-auto flex items-center gap-1 text-dark-text">
                  <Clock className="h-3 w-3" />
                  {r.executionMs}ms
                </span>
              )}
            </div>

            {/* Error details */}
            {!r.passed && r.error && (
              <div className="mt-1.5 rounded bg-background/50 px-2.5 py-2 border border-error/20">
                <div className="flex items-center gap-1.5 text-error font-semibold mb-0.5">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  {errorLabel(r.error.kind)}
                </div>
                <div className="text-light-text/70 font-mono">{errorHint(r.error)}</div>
              </div>
            )}

            {/* Expected vs Got (visible tests only) */}
            {!r.passed && !r.error && !r.hidden && (
              <div className="mt-2 font-mono text-xs space-y-1.5">
                {r.inputs && r.inputs.length > 0 && (
                  <div className="px-2 py-1 rounded bg-info/5 border border-info/20">
                    <span className="text-dark-text/60">Input: </span>
                    <span className="text-info">{r.inputs.join(', ')}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="rounded border border-success/30 bg-success/5 overflow-hidden">
                    <div className="px-2 py-1 border-b border-success/20 text-[9px] font-semibold text-success/70 uppercase tracking-wider">Expected</div>
                    <pre className="px-2 py-1.5 text-success whitespace-pre-wrap break-all">{r.expectedOutput || '(empty)'}</pre>
                  </div>
                  <div className="rounded border border-error/30 bg-error/5 overflow-hidden">
                    <div className="px-2 py-1 border-b border-error/20 text-[9px] font-semibold text-error/70 uppercase tracking-wider">Your Output</div>
                    <pre className="px-2 py-1.5 text-error whitespace-pre-wrap break-all">{r.actualOutput || '(empty)'}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden test: no details */}
            {!r.passed && !r.error && r.hidden && (
              <div className="mt-1 text-dark-text/60 italic">
                Hidden test \u2014 inputs and expected output are not shown.
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}
