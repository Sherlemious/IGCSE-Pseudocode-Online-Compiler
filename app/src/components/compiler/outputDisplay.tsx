'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Terminal, Trash2, ChevronRight, Bug, ChevronDown, Copy, Check, Table2, Code2, Workflow, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import type { OutputEntry, DebugVariable, TraceRow, PseudocodeError } from '../../interpreter/core/types';
import type { FlowNode, FlowEdge } from '../../interpreter/converters/flowchartConverter';
import TraceTable from './TraceTable';
import PythonView from './PythonView';
import PythonLogo from '../icons/PythonLogo';
import { SPLIT_VARS_KEY, loadSplitPercent } from '../../utils/constants';

// React Flow + dagre are heavy and only needed when the Flowchart tab is opened,
// so the whole view (and its deps) is code-split out of the main bundle.
const FlowchartView = dynamic(() => import('./FlowchartView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-xs text-dark-text/60">Loading flowchart…</div>
  ),
});

type OutputTab = 'terminal' | 'trace' | 'python' | 'flowchart';

interface OutputDisplayProps {
  entries: OutputEntry[];
  isRunning: boolean;
  waitingForInput: boolean;
  onInputSubmit: (value: string) => void;
  onClear: () => void;
  isStepping?: boolean;
  debugVariables?: DebugVariable[];
  onJumpToLine?: (line: number) => void;
  traceRows?: TraceRow[];
  maxTraceRows?: number;
  activeTab?: OutputTab;
  onTabChange?: (tab: OutputTab) => void;
  pythonCode?: string;
  pythonErrors?: PseudocodeError[];
  pythonStale?: boolean;
  onRefreshPython?: () => void;
  flowchartNodes?: FlowNode[];
  flowchartEdges?: FlowEdge[];
  flowchartNotes?: string[];
  flowchartErrors?: PseudocodeError[];
  flowchartStale?: boolean;
  onRefreshFlowchart?: () => void;
}

const WELCOME_ART = `  ___  ___  ___ _   _ ___   ___
 | _ \\/ __|| __| | | |   \\ / _ \\
 |  _/\\__ \\| _|| |_| | |) | (_) |
 |_|  |___/|___|\\___/|___/ \\___/`;

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  entries,
  isRunning,
  waitingForInput,
  onInputSubmit,
  onClear,
  isStepping = false,
  debugVariables = [],
  onJumpToLine,
  traceRows = [],
  maxTraceRows = 1000,
  activeTab = 'terminal',
  onTabChange,
  pythonCode = '',
  pythonErrors = [],
  pythonStale = false,
  onRefreshPython,
  flowchartNodes = [],
  flowchartEdges = [],
  flowchartNotes = [],
  flowchartErrors = [],
  flowchartStale = false,
  onRefreshFlowchart,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [varsExpanded, setVarsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set());

  // Resizable split between variables panel and terminal (persisted)
  const [varsPanelHeight, setVarsPanelHeight] = useState(35); // percentage
  const varsPanelHeightRef = useRef(varsPanelHeight);
  useEffect(() => { varsPanelHeightRef.current = varsPanelHeight; }, [varsPanelHeight]);
  useEffect(() => { setVarsPanelHeight(loadSplitPercent(SPLIT_VARS_KEY, 35, 15, 70)); }, []);
  const varsContainerRef = useRef<HTMLDivElement>(null);
  const varsDragging = useRef(false);

  // Reset expanded errors when a new run starts (entries array replaced)
  useEffect(() => { setExpandedErrors(new Set()); }, [entries]);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [entries, waitingForInput]);

  // Auto-focus input field
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  // Handle drag for variables panel resize
  const handleVarsDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isStepping || !varsExpanded) return;
      e.preventDefault();
      varsDragging.current = true;

      const onMove = (ev: MouseEvent | TouchEvent) => {
        if (!varsDragging.current || !varsContainerRef.current) return;
        const rect = varsContainerRef.current.getBoundingClientRect();
        const clientPos = 'touches' in ev ? ev.touches[0] : ev;
        const pct = ((clientPos.clientY - rect.top) / rect.height) * 100;
        setVarsPanelHeight(Math.max(15, Math.min(70, pct)));
      };

      const onEnd = () => {
        varsDragging.current = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        try { localStorage.setItem(SPLIT_VARS_KEY, String(varsPanelHeightRef.current)); } catch { /* ignore */ }
      };

      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove);
      document.addEventListener('touchend', onEnd);
    },
    [isStepping, varsExpanded]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitingForInput) {
      onInputSubmit(inputValue);
      setInputValue('');
    }
  };

  const handleCopyOutput = () => {
    const text = entries
      .map((e) => {
        if (e.kind === 'output') return e.text;
        if (e.kind === 'error') return `[ERROR] ${e.text}`;
        if (e.kind === 'input' && e.submitted) return `[INPUT] ${e.variableName}: ${e.value}`;
        return '';
      })
      .filter(Boolean)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleCopyPython = () => {
    navigator.clipboard.writeText(pythonCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownloadPython = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pseudocode.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatValue = (v: DebugVariable) => {
    if (v.type === 'STRING') return `"${v.value}"`;
    if (v.type === 'CHAR') return `'${v.value}'`;
    return v.value;
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'INTEGER':
      case 'REAL':
        return 'text-info';
      case 'STRING':
      case 'CHAR':
        return 'text-success';
      case 'BOOLEAN':
        return 'text-warning';
      case 'ARRAY':
        return 'text-primary';
      default:
        return 'text-dark-text';
    }
  };

  /* ── Variable watch panel ──────────────────────────────── */
  const renderVariablePanel = () => {
    if (!isStepping) return null;

    return (
      <>
        <div
          className="border-b border-border bg-surface/50 shrink-0 flex flex-col overflow-hidden"
          style={{ height: varsExpanded ? `${varsPanelHeight}%` : 'auto' }}
        >
          <button
            onClick={() => setVarsExpanded(!varsExpanded)}
            className="w-full h-8 px-3 flex items-center gap-2 text-xs hover:bg-surface transition-colors shrink-0"
          >
            <ChevronDown
              size={12}
              className={`text-dark-text transition-transform ${varsExpanded ? '' : '-rotate-90'}`}
            />
            <Bug size={12} className="text-warning" />
            <span className="font-semibold tracking-wider text-dark-text uppercase">Variables</span>
            <span className="text-dark-text/50">({debugVariables.length})</span>
          </button>

          {varsExpanded && (
            <div
              className="flex-1 overflow-y-auto px-3 pb-2
                scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
                scrollbar-track-background scrollbar-thumb-rounded-full"
            >
              {debugVariables.length === 0 ? (
                <div className="text-xs text-dark-text/50 py-1 italic">No variables declared yet</div>
              ) : (
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-dark-text/50 border-b border-border/30">
                      <th className="text-left py-1 pr-3 font-normal">Name</th>
                      <th className="text-left py-1 pr-3 font-normal">Value</th>
                      <th className="text-left py-1 font-normal">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debugVariables.map((v) => (
                      <tr key={v.name} className="border-b border-border/10 hover:bg-surface/50">
                        <td className="py-1 pr-3 text-light-text">
                          {v.name}
                          {v.constant && <span className="text-warning/50 ml-1 text-[9px]">const</span>}
                        </td>
                        <td className={`py-1 pr-3 ${typeColor(v.type)}`}>{formatValue(v)}</td>
                        <td className="py-1 text-dark-text/50 text-[10px]">{v.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Drag handle for resizing variables panel */}
        {varsExpanded && (
          <div
            className="shrink-0 h-1 w-full bg-border hover:bg-primary transition-colors cursor-row-resize"
            onMouseDown={handleVarsDragStart}
            onTouchStart={handleVarsDragStart}
          />
        )}
      </>
    );
  };

  const renderPythonContent = () => {
    if (pythonErrors.length > 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-dark-text select-none p-6 text-center">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <div className="text-sm text-light-text">Fix the syntax errors before converting</div>
          <div className="text-xs text-dark-text/70 max-w-md font-mono">
            {pythonErrors[0].line ? `Line ${pythonErrors[0].line}: ` : ''}{pythonErrors[0].message}
          </div>
        </div>
      );
    }
    if (!pythonCode.trim()) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-2 text-dark-text select-none p-6 text-center">
          <Code2 className="h-6 w-6 text-primary/40" />
          <div className="text-sm text-dark-text/70">Write some pseudocode to see the Python translation</div>
        </div>
      );
    }
    return <PythonView code={pythonCode} />;
  };

  const renderFlowchartContent = () => {
    if (flowchartErrors.length > 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-dark-text select-none p-6 text-center">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <div className="text-sm text-light-text">Fix the syntax errors before converting</div>
          <div className="text-xs text-dark-text/70 max-w-md font-mono">
            {flowchartErrors[0].line ? `Line ${flowchartErrors[0].line}: ` : ''}{flowchartErrors[0].message}
          </div>
        </div>
      );
    }
    if (flowchartNodes.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-2 text-dark-text select-none p-6 text-center">
          <Workflow className="h-6 w-6 text-primary/40" />
          <div className="text-sm text-dark-text/70">Write some pseudocode to see the flowchart</div>
        </div>
      );
    }
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
          <FlowchartView nodes={flowchartNodes} edges={flowchartEdges} />
        </div>
        {flowchartNotes.length > 0 && (
          <div className="shrink-0 max-h-24 overflow-y-auto border-t border-border bg-surface/50 px-3 py-1.5 text-[11px] text-dark-text/70">
            {flowchartNotes.map((note, i) => (
              <div key={i} className="flex gap-1.5">
                <span className="text-warning/70">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    // Welcome state — no run yet
    if (!isRunning && entries.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-dark-text select-none p-4">
          <pre className="text-primary/30 text-[10px] sm:text-xs leading-tight font-mono hidden sm:block">
            {WELCOME_ART}
          </pre>
          <div className="text-center space-y-1">
            <div className="text-sm text-dark-text/70">IGCSE Pseudocode Compiler</div>
            <div className="text-xs text-dark-text/40">
              <span className="hidden md:inline">Write code on the left, run with <kbd>Ctrl+Enter</kbd></span>
              <span className="md:hidden">Write code above, tap Run to execute</span>
            </div>
          </div>
        </div>
      );
    }

    const hadError = entries.some((e) => e.kind === 'error');

    return (
      <div
        className="p-4 font-mono"
        style={{
          fontSize: 'var(--editor-font-size)',
          fontFamily: 'var(--editor-font-family)',
          letterSpacing: 'var(--editor-letter-spacing)',
        }}
      >
        {entries.map((entry, i) => {
          if (entry.kind === 'output') {
            return (
              <div key={i} className="terminal-line flex gap-2 whitespace-pre-wrap">
                <ChevronRight className="text-primary/40 shrink-0 mt-0.5 w-[1em] h-[1em]" />
                <span className="text-light-text">{entry.text}</span>
              </div>
            );
          }

          if (entry.kind === 'error') {
            const lineMatch = entry.text.match(/^Line (\d+)/);
            const errLine = lineMatch ? parseInt(lineMatch[1], 10) : null;
            const clickable = errLine !== null && onJumpToLine;
            const newlineIdx = entry.text.indexOf('\n');
            const summary = newlineIdx === -1 ? entry.text : entry.text.slice(0, newlineIdx);
            const detail = newlineIdx === -1 ? null : entry.text.slice(newlineIdx + 1);
            const isExpanded = expandedErrors.has(i);
            const toggleExpand = (e: React.MouseEvent) => {
              e.stopPropagation();
              setExpandedErrors(prev => {
                const next = new Set(prev);
                next.has(i) ? next.delete(i) : next.add(i);
                return next;
              });
            };
            return (
              <div
                key={i}
                className={`terminal-line flex gap-2 py-0.5 ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                onClick={clickable ? () => onJumpToLine!(errLine!) : undefined}
                title={clickable ? `Click to jump to line ${errLine}` : undefined}
              >
                <span className="text-error shrink-0 font-bold">!</span>
                <span className="text-error">
                  <span className="whitespace-pre-wrap">{summary}</span>
                  {detail && (
                    <>
                      {' '}
                      <button
                        onClick={toggleExpand}
                        className="text-error/60 hover:text-error text-xs underline underline-offset-2 transition-colors"
                      >
                        {isExpanded ? 'hide example ▲' : 'show example ▼'}
                      </button>
                      {isExpanded && (
                        <pre className="mt-1 whitespace-pre-wrap text-error/80">{detail}</pre>
                      )}
                    </>
                  )}
                </span>
              </div>
            );
          }

          if (entry.kind === 'input') {
            if (entry.submitted) {
              return (
                <div key={i} className="terminal-line flex flex-col">
                  {entry.prompt && (
                    <span className="text-primary whitespace-pre-wrap">{entry.prompt}</span>
                  )}
                  <div className="flex gap-2 whitespace-pre-wrap">
                    <span className="text-info/50 shrink-0">&larr;</span>
                    <span className="text-dark-text/70">{entry.variableName}:</span>
                    <span className="text-info">{entry.value}</span>
                  </div>
                </div>
              );
            }

            // Active input (last unsubmitted)
            return (
              <div key={i} className="terminal-line flex flex-col my-1">
                {entry.prompt && (
                  <span className="text-primary whitespace-pre-wrap">{entry.prompt}</span>
                )}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <span className="text-info terminal-cursor shrink-0">&gt;</span>
                  <span className="text-dark-text/70 shrink-0">{entry.variableName}:</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-transparent border-b border-primary/50
                      text-info outline-none font-mono py-0.5 px-0.5
                      focus:border-info"
                    style={{ fontSize: 'inherit' }}
                    autoFocus
                  />
                </form>
              </div>
            );
          }

          return null;
        })}

        {/* Stepping indicator */}
        {isStepping && entries.length === 0 && (
          <div className="flex items-center gap-2 text-warning">
            <Bug size={14} />
            <span>Debugging — use Step or Continue</span>
          </div>
        )}

        {/* Running indicator — the "compiling" beat before output streams in */}
        {isRunning && !isStepping && !waitingForInput && entries.length === 0 && (
          <div className="terminal-line flex items-center gap-2 text-primary">
            <span className="flex items-end gap-1">
              <span className="exec-dot inline-block w-1.5 h-1.5 rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
              <span className="exec-dot inline-block w-1.5 h-1.5 rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
              <span className="exec-dot inline-block w-1.5 h-1.5 rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
            </span>
            <span>Running&hellip;</span>
          </div>
        )}

        {/* Process exit — status-aware so a clean run reads as success */}
        {!isRunning && entries.length > 0 && (
          <div
            className={`terminal-line mt-3 pt-2 border-t border-border/50 text-xs flex items-center gap-1.5 ${
              hadError ? 'text-error/70' : 'text-success/70'
            }`}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${hadError ? 'bg-error/60' : 'bg-success/60'}`} />
            {hadError ? 'Process exited with errors' : 'Process finished'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Panel header — Terminal / Trace tabs */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onTabChange?.('terminal')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
              activeTab === 'terminal'
                ? 'bg-background text-light-text font-medium'
                : 'text-dark-text hover:text-light-text hover:bg-background/50'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Terminal
            {isStepping && <Bug size={12} className="text-warning" />}
            {isRunning && !isStepping && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            )}
          </button>
          <button
            onClick={() => onTabChange?.('trace')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
              activeTab === 'trace'
                ? 'bg-background text-light-text font-medium'
                : 'text-dark-text hover:text-light-text hover:bg-background/50'
            }`}
          >
            <Table2 className="h-3.5 w-3.5" />
            Trace
            {traceRows.length > 0 && (
              <span className="text-[10px] font-mono text-dark-text/60">{traceRows.length}</span>
            )}
          </button>
          <button
            onClick={() => onTabChange?.('python')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
              activeTab === 'python'
                ? 'bg-background text-light-text font-medium'
                : 'text-dark-text hover:text-light-text hover:bg-background/50'
            }`}
            title="Convert this pseudocode to Python"
          >
            <PythonLogo className="h-3.5 w-3.5" />
            Python
          </button>
          <button
            onClick={() => onTabChange?.('flowchart')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
              activeTab === 'flowchart'
                ? 'bg-background text-light-text font-medium'
                : 'text-dark-text hover:text-light-text hover:bg-background/50'
            }`}
            title="Convert this pseudocode to a flowchart"
          >
            <Workflow className="h-3.5 w-3.5" />
            Flowchart
          </button>
        </div>
        <div className="flex items-center gap-0.5">
          {activeTab === 'terminal' && entries.length > 0 && (
            <button
              onClick={handleCopyOutput}
              className="opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-background"
              title="Copy output"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
          {activeTab === 'terminal' && (
            <button
              onClick={onClear}
              className="opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-background"
              title="Clear terminal"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          {activeTab === 'python' && (
            <button
              onClick={onRefreshPython}
              className={`transition-opacity p-1 rounded hover:bg-background ${
                pythonStale ? 'text-warning opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              title={pythonStale ? 'Code changed since converting — click to re-convert' : 'Re-convert from current code'}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
          {activeTab === 'python' && pythonCode && pythonErrors.length === 0 && (
            <>
              <button
                onClick={handleCopyPython}
                className="opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-background"
                title="Copy Python"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={handleDownloadPython}
                className="opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-background"
                title="Download .py"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          {activeTab === 'flowchart' && (
            <button
              onClick={onRefreshFlowchart}
              className={`transition-opacity p-1 rounded hover:bg-background ${
                flowchartStale ? 'text-warning opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              title={flowchartStale ? 'Code changed since converting — click to re-convert' : 'Re-convert from current code'}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      {activeTab === 'python' ? (
        <div className="flex-1 min-h-0 bg-background overflow-hidden flex flex-col">
          {pythonStale && pythonCode && pythonErrors.length === 0 && (
            <button
              onClick={onRefreshPython}
              className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1 text-[11px]
                bg-warning/10 text-warning/90 hover:bg-warning/20 border-b border-warning/20 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Code changed since this was converted — click to refresh
            </button>
          )}
          {renderPythonContent()}
        </div>
      ) : activeTab === 'flowchart' ? (
        <div className="flex-1 min-h-0 bg-background overflow-hidden flex flex-col">
          {flowchartStale && flowchartNodes.length > 0 && flowchartErrors.length === 0 && (
            <button
              onClick={onRefreshFlowchart}
              className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1 text-[11px]
                bg-warning/10 text-warning/90 hover:bg-warning/20 border-b border-warning/20 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Code changed since this was converted — click to refresh
            </button>
          )}
          <div className="flex-1 min-h-0">{renderFlowchartContent()}</div>
        </div>
      ) : activeTab === 'trace' ? (
        <div
          className="flex-1 min-h-0 bg-background overflow-auto
            scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
            scrollbar-track-background scrollbar-thumb-rounded-full"
        >
          <TraceTable rows={traceRows} maxRows={maxTraceRows} isLive={isRunning || isStepping} />
        </div>
      ) : (
        <div ref={varsContainerRef} className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Variable watch panel (shown during debug) */}
          {renderVariablePanel()}

          {/* Terminal output */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 bg-background overflow-y-auto
              scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
              scrollbar-track-background scrollbar-thumb-rounded-full"
          >
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputDisplay;