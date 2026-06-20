'use client';

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
  ChevronDown,
  Book,
  HardDrive,
  FilePlus,
  Download,
  Link2,
  Copy,
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { toast } from 'sonner';
import ExamplePicker from './examplePicker';
import FileViewer from './fileViewer';
import CodeMirrorEditor from './CodeMirrorEditor';
import { useTheme } from '../../theme/ThemeContext';
import { useRegisterCommands } from '../common/CommandPalette';

const SHORTCUT_HINT_KEY = 'pseudocode_seen_shortcut_hint';

export interface EditorTab {
  id: string;
  name: string;
  content: string;
}

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
  breakpoints?: Set<number>;
  onBreakpointToggle?: (line: number) => void;
  jumpToLine?: number | null;
  onJumpToLineConsumed?: () => void;
}

/** A labelled item inside the Open / Export dropdowns. */
const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
}> = ({ icon, label, onSelect }) => (
  <Popover.Close asChild>
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-light-text rounded-md
        hover:bg-background transition-colors text-left"
    >
      <span className="text-dark-text shrink-0">{icon}</span>
      {label}
    </button>
  </Popover.Close>
);

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
  breakpoints,
  onBreakpointToggle,
  jumpToLine,
  onJumpToLineConsumed,
}) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showShortcutHint, setShowShortcutHint] = useState(false);
  const { wordWrap } = useTheme();

  // Controlled modals — the triggers live in the Open menu (and the palette).
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [filesCreating, setFilesCreating] = useState(false);

  // Flash the Run button once when a run settles — success-tinted on a clean
  // finish, error-tinted when the run produced an error. Watches the falling
  // edge of isRunning and the rising edge of errorLine so it fires for normal
  // runs, runtime errors and instant parse errors alike.
  const [runPulse, setRunPulse] = useState<'idle' | 'success' | 'error'>('idle');
  const prevRunning = useRef(false);
  const prevErrorLine = useRef<number | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const justFinished = prevRunning.current && !isRunning;
    const justErrored = errorLine != null && prevErrorLine.current == null;
    if (justErrored || justFinished) {
      setRunPulse(justErrored ? 'error' : 'success');
      clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setRunPulse('idle'), 700);
    }
    prevRunning.current = isRunning;
    prevErrorLine.current = errorLine ?? null;
  }, [isRunning, errorLine]);
  useEffect(() => () => clearTimeout(pulseTimer.current), []);

  useEffect(() => {
    try {
      if (!localStorage.getItem(SHORTCUT_HINT_KEY)) {
        const showTimer = setTimeout(() => setShowShortcutHint(true), 2500);
        const hideTimer = setTimeout(() => {
          setShowShortcutHint(false);
          try { localStorage.setItem(SHORTCUT_HINT_KEY, 'true'); } catch { /* ignore */ }
        }, 5 * 60_000);
        return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
      }
    } catch { /* ignore */ }
  }, []);

  const dismissShortcutHint = useCallback(() => {
    setShowShortcutHint(false);
    try { localStorage.setItem(SHORTCUT_HINT_KEY, 'true'); } catch { /* ignore */ }
  }, []);

  const handleCursorChange = useCallback(
    (line: number, col: number) => {
      onCursorChange?.({ line, col });
    },
    [onCursorChange]
  );

  const handleTabMouseDown = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      if (e.button === 1 && tabId !== 'main') {
        e.preventDefault();
        onCloseTab(tabId);
      }
    },
    [onCloseTab]
  );

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

  const handleShareCode = useCallback(() => {
    const encoded = btoa(encodeURIComponent(code));
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link to your code copied to clipboard');
    }).catch(() => { /* clipboard unavailable */ });
  }, [code]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied to clipboard');
    }).catch(() => { /* clipboard unavailable */ });
  }, [code]);

  const openExamples = useCallback(() => setExamplesOpen(true), []);
  const browseFiles = useCallback(() => { setFilesCreating(false); setFilesOpen(true); }, []);
  const newFile = useCallback(() => { setFilesCreating(true); setFilesOpen(true); }, []);

  // Register the editor's open/export actions in the command palette.
  useRegisterCommands([
    { id: 'open-examples', label: 'Open example…', group: 'Open', keywords: 'sample template browse', run: () => openExamples() },
    { id: 'open-files', label: 'Browse files', group: 'Open', keywords: 'storage localstorage', run: () => browseFiles() },
    { id: 'open-new-file', label: 'New file', group: 'Open', keywords: 'create', run: () => newFile() },
    { id: 'code-download', label: 'Download code (.pseudo)', group: 'Code', keywords: 'save export', run: () => handleDownload() },
    { id: 'code-share', label: 'Share code (copy link)', group: 'Code', keywords: 'permalink url', run: () => handleShareCode() },
    { id: 'code-copy', label: 'Copy code', group: 'Code', keywords: 'clipboard', run: () => handleCopyCode() },
  ]);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const activeTabName = activeTab.name;

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

          {/* Tool menus — Open (bring code in) · Export (act on this file) */}
          <div className="flex items-center gap-0.5 ml-1 px-1 shrink-0">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="flex items-center gap-1 px-2 h-7 text-xs text-dark-text hover:text-light-text
                    hover:bg-background rounded transition-colors"
                  title="Open examples or files"
                >
                  <Book size={14} />
                  <span className="hidden sm:inline">Open</span>
                  <ChevronDown size={12} className="opacity-60" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  sideOffset={6}
                  align="start"
                  className="z-50 min-w-[200px] rounded-lg bg-surface border border-border p-1 shadow-intense"
                >
                  <MenuItem icon={<Book size={13} />} label="Examples…" onSelect={openExamples} />
                  <MenuItem icon={<HardDrive size={13} />} label="Browse files" onSelect={browseFiles} />
                  <MenuItem icon={<FilePlus size={13} />} label="New file" onSelect={newFile} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="flex items-center gap-1 px-2 h-7 text-xs text-dark-text hover:text-light-text
                    hover:bg-background rounded transition-colors"
                  title="Download, share or copy this code"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown size={12} className="opacity-60" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  sideOffset={6}
                  align="start"
                  className="z-50 min-w-[200px] rounded-lg bg-surface border border-border p-1 shadow-intense"
                >
                  <MenuItem icon={<Download size={13} />} label="Download (.pseudo)" onSelect={handleDownload} />
                  <MenuItem icon={<Link2 size={13} />} label="Copy link to this code" onSelect={handleShareCode} />
                  <MenuItem icon={<Copy size={13} />} label="Copy code" onSelect={handleCopyCode} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>

        {/* Right: debug/run controls */}
        <div className="flex items-center gap-0.5 shrink-0 px-1">
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
                className={`flex items-center gap-1 px-2 py-1 text-xs text-success hover:bg-success/10 rounded transition-colors ${
                  runPulse === 'success' ? 'run-pulse-success' : runPulse === 'error' ? 'run-pulse-error' : ''
                }`}
                title="Run Code (Ctrl+Enter)"
                data-tour="run-button"
              >
                <Play className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Run</span>
                <kbd className="hidden lg:inline ml-1">Ctrl+Enter</kbd>
              </button>
            </>
          )}
        </div>
      </div>

      {/* One-time shortcut hint */}
      {showShortcutHint && (
        <div className="hidden md:flex items-center justify-between px-3 py-1 bg-primary/5 border-b border-primary/15 text-[11px] text-primary/60 animate-fade-in shrink-0">
          <span>
            <kbd className="font-mono">Ctrl+Enter</kbd> run &middot; <kbd className="font-mono">Ctrl+K</kbd> command palette &middot; <kbd className="font-mono">Ctrl+Shift+K</kbd> stop
          </span>
          <button onClick={dismissShortcutHint} aria-label="Dismiss shortcut hint" className="ml-3 text-primary/40 hover:text-primary/70 transition-colors leading-none">
            <X size={11} />
          </button>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 min-h-0 flex relative" data-tour="editor">
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
          breakpoints={breakpoints}
          onBreakpointToggle={onBreakpointToggle}
          ariaLabel={`Code Editor for ${activeTabName}`}
          wordWrap={wordWrap}
          jumpToLine={jumpToLine}
          onJumpToLineConsumed={onJumpToLineConsumed}
        />

        {code.length === 0 && !isRunning && (
          <div className="absolute bottom-4 left-0 right-0 hidden md:flex justify-center pointer-events-none">
            <div className="flex items-center gap-1.5 text-xs text-dark-text/40">
              <Keyboard size={12} />
              <span>
                Press <kbd>Ctrl+Enter</kbd> to run
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controlled modals (render nothing until opened) */}
      <ExamplePicker open={examplesOpen} onOpenChange={setExamplesOpen} onSelectExample={onSelectExample} />
      <FileViewer open={filesOpen} onOpenChange={setFilesOpen} initialCreating={filesCreating} onOpenFile={onOpenFile} />
    </div>
  );
};

export default CodeInput;
