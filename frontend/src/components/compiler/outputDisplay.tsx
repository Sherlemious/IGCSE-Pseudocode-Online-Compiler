import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Terminal, Trash2, ChevronRight, Bug, ChevronDown, Copy, Check } from 'lucide-react';
import type { OutputEntry, DebugVariable } from '../../interpreter/core/types';

interface OutputDisplayProps {
  entries: OutputEntry[];
  isRunning: boolean;
  waitingForInput: boolean;
  onInputSubmit: (value: string) => void;
  onClear: () => void;
  isStepping?: boolean;
  debugVariables?: DebugVariable[];
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
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [varsExpanded, setVarsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  // Resizable split between variables panel and terminal
  const [varsPanelHeight, setVarsPanelHeight] = useState(35); // percentage
  const varsContainerRef = useRef<HTMLDivElement>(null);
  const varsDragging = useRef(false);

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
              Write code on the left, run with <kbd>Ctrl+Enter</kbd>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 font-mono" style={{ fontSize: 'var(--editor-font-size)' }}>
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
            return (
              <div key={i} className="flex gap-2 whitespace-pre-wrap py-0.5">
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

            // Active input (last unsubmitted)
            return (
              <form key={i} onSubmit={handleSubmit} className="flex items-center gap-2 my-1">
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

        {/* Running indicator */}
        {isRunning && !isStepping && !waitingForInput && entries.length === 0 && (
          <div className="flex items-center gap-2 text-primary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Executing...</span>
          </div>
        )}

        {/* Process exit message */}
        {!isRunning && entries.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/50 text-xs text-dark-text/40 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-dark-text/30" />
            Process exited
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Panel header */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-dark-text" />
          <span className="text-xs font-semibold tracking-wider text-dark-text uppercase">Terminal</span>
          {isStepping && (
            <div className="flex items-center gap-1.5">
              <Bug size={12} className="text-warning" />
              <span className="text-[10px] text-warning hidden sm:inline">debugging</span>
            </div>
          )}
          {isRunning && !isStepping && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-success hidden sm:inline">running</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {entries.length > 0 && (
            <button
              onClick={handleCopyOutput}
              className="text-dark-text hover:text-light-text transition-colors p-1 rounded hover:bg-background"
              title="Copy output"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            onClick={onClear}
            className="text-dark-text hover:text-light-text transition-colors p-1 rounded hover:bg-background"
            title="Clear terminal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content area with variable panel and terminal */}
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
    </div>
  );
};

export default OutputDisplay;
