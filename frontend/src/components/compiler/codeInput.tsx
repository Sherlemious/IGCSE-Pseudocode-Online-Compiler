import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  FileCode,
  Play,
  Square,
  Keyboard,
  X,
  Bug,
  SkipForward,
  FastForward,
  Download,
  Share2,
  Check,
} from 'lucide-react';
import ExamplePicker from './examplePicker';
import FileViewer from './fileViewer';
import CodeMirrorEditor from './CodeMirrorEditor';
import type { EditorTab } from '../../pages/home';

export interface CursorPosition {
  line: number;
  col: number;
}

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  onDebugCode: () => void;
  isRunning: boolean;
  isStepping: boolean;
  debugLine: number | null;
  errorLine?: number | null;
  onStep: () => void;
  onContinue: () => void;
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
  onDebugCode,
  isRunning,
  isStepping,
  debugLine,
  errorLine,
  onStep,
  onContinue,
  onStop,
  onSelectExample,
  onCursorChange,
  tabs,
  activeTabId,
  onTabSwitch,
  onCloseTab,
  onOpenFile,
}) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  // Handle cursor position changes from CodeMirror
  const handleCursorChange = useCallback(
    (line: number, col: number) => {
      onCursorChange?.({ line, col });
    },
    [onCursorChange]
  );

  // Handle middle-click to close tab
  const handleTabMouseDown = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      if (e.button === 1 && tabId !== 'main') {
        e.preventDefault();
        onCloseTab(tabId);
      }
    },
    [onCloseTab]
  );

  // Scroll active tab into view
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeEl = tabsContainerRef.current.querySelector('[data-active-tab="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeTabId]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const activeT = tabs.find((t) => t.id === activeTabId);
    a.download = activeT?.name ?? 'code.pseudo';
    a.click();
    URL.revokeObjectURL(url);
  }, [code, tabs, activeTabId]);

  const handleShare = useCallback(() => {
    const encoded = btoa(encodeURIComponent(code));
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    });
  }, [code]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Tab bar */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between shrink-0">
        {/* Left: tabs + tools (scrollable) */}
        <div className="flex items-center min-w-0 flex-1 overflow-hidden">
          {/* Tabs container */}
          <div ref={tabsContainerRef} className="flex items-center min-w-0 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  data-active-tab={isActive}
                  className={`group flex items-center gap-1.5 px-3 h-9 text-xs shrink-0 border-r border-border/50 transition-colors
                    ${
                      isActive
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
            <button
              onClick={handleDownload}
              className="flex items-center justify-center w-7 h-7 text-dark-text hover:text-light-text
                hover:bg-background rounded transition-colors"
              title="Download code"
            >
              <Download size={14} />
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-7 h-7 text-dark-text hover:text-light-text
                hover:bg-background rounded transition-colors"
              title="Copy share link"
            >
              {shareStatus === 'copied' ? <Check size={14} className="text-success" /> : <Share2 size={14} />}
            </button>
          </div>
        </div>

        {/* Right: debug/run controls */}
        <div className="flex items-center gap-0.5 shrink-0 px-1">
          {/* Debug step controls — shown when stepping */}
          {isStepping && (
            <>
              <button
                onClick={onStep}
                className="flex items-center gap-1 px-2 py-1 text-xs text-info hover:bg-info/10 rounded transition-colors"
                title="Step Over (next statement)"
              >
                <SkipForward className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Step</span>
              </button>
              <button
                onClick={onContinue}
                className="flex items-center gap-1 px-2 py-1 text-xs text-success hover:bg-success/10 rounded transition-colors"
                title="Continue execution"
              >
                <FastForward className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Continue</span>
              </button>
            </>
          )}

          {/* Stop button — shown when running */}
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

          {/* Run + Debug buttons — shown when not running */}
          {!isRunning && (
            <>
              <button
                onClick={onDebugCode}
                className="flex items-center gap-1 px-2 py-1 text-xs text-warning hover:bg-warning/10 rounded transition-colors"
                title="Debug (step through code)"
              >
                <Bug className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Debug</span>
              </button>
              <button
                onClick={onRunCode}
                className="flex items-center gap-1 px-2 py-1 text-xs text-success hover:bg-success/10 rounded transition-colors"
                title="Run Code (Ctrl+Enter)"
              >
                <Play className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Run</span>
                <kbd className="hidden lg:inline ml-1">Ctrl+Enter</kbd>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 min-h-0 flex relative">
        <CodeMirrorEditor
          value={code}
          onChange={onCodeChange}
          onCursorChange={handleCursorChange}
          onRun={onRunCode}
          onStop={onStop}
          isRunning={isRunning}
          readOnly={isStepping}
          debugLine={debugLine}
          errorLine={errorLine}
        />

        {/* Empty state hint */}
        {code.length === 0 && !isRunning && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="flex items-center gap-1.5 text-xs text-dark-text/40">
              <Keyboard size={12} />
              <span>
                Press <kbd>Ctrl+Enter</kbd> to run
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeInput;
