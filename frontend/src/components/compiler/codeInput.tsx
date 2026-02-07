import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FileCode, Play, Square, Keyboard } from 'lucide-react';
import ExamplePicker from './examplePicker';
import FileViewer from './fileViewer';

export interface CursorPosition {
  line: number;
  col: number;
}

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  onStop: () => void;
  onSelectExample: (code: string) => void;
  onCursorChange?: (pos: CursorPosition) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  onCodeChange,
  onRunCode,
  isRunning,
  onStop,
  onSelectExample,
  onCursorChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [activeLine, setActiveLine] = useState(1);

  // Sync line count
  useEffect(() => {
    const count = code.split('\n').length;
    setLineCount(count);
  }, [code]);

  // Sync gutter scroll with textarea scroll
  const handleScroll = useCallback(() => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Track cursor position
  const updateCursor = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = ta.value.substring(0, pos);
    const line = textBefore.split('\n').length;
    const lastNewline = textBefore.lastIndexOf('\n');
    const col = pos - lastNewline;
    setActiveLine(line);
    onCursorChange?.({ line, col });
  }, [onCursorChange]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl/Cmd + Enter → Run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) onRunCode();
      }
      // Ctrl/Cmd + Shift + K → Stop
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        if (isRunning) onStop();
      }
      // Tab → insert 4 spaces
      if (e.key === 'Tab') {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue = code.substring(0, start) + '    ' + code.substring(end);
        onCodeChange(newValue);
        // Restore cursor position after React re-render
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 4;
        });
      }
    },
    [code, isRunning, onCodeChange, onRunCode, onStop],
  );

  // Render line numbers
  const renderLineNumbers = () => {
    const lines = [];
    for (let i = 1; i <= Math.max(lineCount, 1); i++) {
      lines.push(
        <span key={i} className={i === activeLine ? 'active' : ''}>
          {i}
        </span>,
      );
    }
    return lines;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Tab bar */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-1 shrink-0">
        {/* Left: file tab + tools */}
        <div className="flex items-center min-w-0">
          {/* Active file tab */}
          <div className="flex items-center gap-1.5 px-3 h-9 border-t-2 border-t-primary bg-background text-sm text-light-text shrink-0">
            <FileCode className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-xs">main.pseudo</span>
          </div>
          {/* Tool buttons */}
          <div className="flex items-center gap-1 ml-2">
            <ExamplePicker onSelectExample={onSelectExample} />
            <FileViewer />
          </div>
        </div>

        {/* Right: run/stop + shortcut hint */}
        <div className="flex items-center gap-1 shrink-0">
          {isRunning && (
            <button
              onClick={onStop}
              className="flex items-center gap-1 px-2 py-1 text-xs text-error hover:bg-error/10 rounded transition-colors"
              title="Stop (Ctrl+Shift+K)"
            >
              <Square className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors
              ${isRunning ? 'text-dark-text cursor-not-allowed' : 'text-success hover:bg-success/10'}`}
            title="Run Code (Ctrl+Enter)"
          >
            <Play className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run'}</span>
            <kbd className="hidden lg:inline ml-1">Ctrl+Enter</kbd>
          </button>
        </div>
      </div>

      {/* Editor area with line numbers */}
      <div className="flex-1 min-h-0 flex relative">
        {/* Line number gutter */}
        <div
          ref={gutterRef}
          className="line-numbers shrink-0 bg-surface/50 border-r border-border overflow-hidden
            py-4 pr-3 pl-2 font-mono select-none"
          style={{ fontSize: 'var(--editor-font-size)', lineHeight: '1.5' }}
        >
          {renderLineNumbers()}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCursor}
          onClick={updateCursor}
          onFocus={updateCursor}
          style={{ fontSize: 'var(--editor-font-size)', lineHeight: '1.5' }}
          className="flex-1 min-w-0 p-4 pl-3 font-mono
            bg-background
            text-light-text
            border-0 resize-none
            focus:ring-0 focus:outline-none
            scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
            scrollbar-track-background scrollbar-thumb-rounded-full"
          placeholder="// Start typing pseudocode here..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
        />

        {/* Empty state hint */}
        {code.length === 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="flex items-center gap-1.5 text-xs text-dark-text/40">
              <Keyboard size={12} />
              <span>Press <kbd>Ctrl+Enter</kbd> to run</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeInput;
