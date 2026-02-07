import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FileCode, Play, Square, Keyboard, X } from 'lucide-react';
import ExamplePicker from './examplePicker';
import FileViewer from './fileViewer';
import type { EditorTab } from '../../pages/home';

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
  tabs: EditorTab[];
  activeTabId: string;
  onTabSwitch: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onOpenFile: (fileName: string, content: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  onCodeChange,
  onRunCode,
  isRunning,
  onStop,
  onSelectExample,
  onCursorChange,
  tabs,
  activeTabId,
  onTabSwitch,
  onCloseTab,
  onOpenFile,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
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

  // Handle middle-click to close tab
  const handleTabMouseDown = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      if (e.button === 1 && tabId !== 'main') {
        e.preventDefault();
        onCloseTab(tabId);
      }
    },
    [onCloseTab],
  );

  // Scroll active tab into view
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeEl = tabsContainerRef.current.querySelector('[data-active-tab="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeTabId]);

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
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between shrink-0">
        {/* Left: tabs + tools (scrollable) */}
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          {/* Tabs container */}
          <div
            ref={tabsContainerRef}
            className="flex items-center min-w-0 overflow-x-auto scrollbar-none"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  data-active-tab={isActive}
                  className={`group flex items-center gap-1.5 px-3 h-9 text-xs shrink-0 border-r border-border/50 transition-colors
                    ${isActive
                      ? 'bg-background text-light-text border-t-2 border-t-primary'
                      : 'bg-surface text-dark-text hover:text-light-text hover:bg-surface/80 border-t-2 border-t-transparent'
                    }`}
                  onClick={() => onTabSwitch(tab.id)}
                  onMouseDown={(e) => handleTabMouseDown(e, tab.id)}
                  title={tab.name}
                >
                  <FileCode className={`h-3 w-3 shrink-0 ${isActive ? 'text-primary' : 'text-dark-text/60'}`} />
                  <span className="font-mono truncate max-w-[120px]">{tab.name}</span>
                  {tab.id !== 'main' && (
                    <span
                      className={`ml-0.5 rounded-sm p-0.5 shrink-0 transition-colors
                        ${isActive ? 'hover:bg-primary/20' : 'opacity-0 group-hover:opacity-100 hover:bg-primary/20'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                    >
                      <X size={10} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tool buttons */}
          <div className="flex items-center gap-0.5 ml-1 px-1 shrink-0">
            <ExamplePicker onSelectExample={onSelectExample} />
            <FileViewer onOpenFile={onOpenFile} />
          </div>
        </div>

        {/* Right: run/stop */}
        <div className="flex items-center gap-1 shrink-0 px-1">
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
