'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  FileText,
  PanelLeftOpen,
  PanelRightOpen,
  PanelTopOpen,
  PanelBottomOpen,
  Undo2,
} from 'lucide-react';
import CodeInput, { type EditorTab, type CursorPosition } from './codeInput';
import { useRegisterCommands } from '../common/CommandPalette';
import OutputDisplay from './outputDisplay';
import SplitDivider from '../common/SplitDivider';
import { convertToPython, type PythonConversion } from '../../interpreter/converters/pythonConverter';
import { convertToFlowchart, type FlowchartConversion } from '../../interpreter/converters/flowchartConverter';
import { formatPseudocode } from '../../interpreter/formatter';
import Footer from '../layout/footer';
import OnboardingTour from '../onboarding/OnboardingTour';
import FeedbackSurvey, { shouldShowFeedbackSurvey } from '../feedback/FeedbackSurvey';
import { useInterpreter } from '../../interpreter/useInterpreter';
import { toast } from 'sonner';
import {
  AUTOSAVE_KEY,
  BUG_REPORT_OUTPUT_KEY,
  FILE_PREFIX,
  FILES_CHANGED_EVENT,
  AUTOSAVE_DELAY,
  ONBOARDING_KEY,
  SPLIT_COMPILER_KEY,
  SPLIT_COMPILER_COLLAPSED_KEY,
  loadSplitPercent,
} from '../../utils/constants';
import { formatOutputEntries } from '../../utils/formatOutputEntries';

const FEEDBACK_RUN_THRESHOLD = 2;
const FEEDBACK_RUN_LS_KEY = 'compiler_run_count';

function loadInitialCode(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('code');
    if (shared) {
      window.history.replaceState({}, '', window.location.pathname);
      return decodeURIComponent(atob(shared));
    }
  } catch {
    /* invalid shared code — ignore */
  }

  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved !== null) return saved;
    // First-time visitor — show a hello world starter
    const isFirstVisit = !localStorage.getItem(ONBOARDING_KEY);
    if (isFirstVisit) return [
      '// Welcome! Press Run (or Ctrl+Enter) to execute this code.',
      '',
      'DECLARE name : STRING',
      'DECLARE age  : INTEGER',
      '',
      'OUTPUT "What is your name? "',
      'INPUT name',
      '',
      'OUTPUT "How old are you? "',
      'INPUT age',
      '',
      'OUTPUT "Hello, " & name & "!"',
      '',
      'IF age < 18 THEN',
      '   OUTPUT "You are a student."',
      '   ELSE',
      '  OUTPUT "You are an adult."',
      'ENDIF',
    ].join('\n');
    return '';
  } catch {
    return '';
  }
}

const CompilerPage: React.FC = () => {
  const savedCode = useRef('');
  const [tabs, setTabs] = useState<EditorTab[]>([{ id: 'main', name: 'main.pseudo', content: '' }]);
  const [activeTabId, setActiveTabId] = useState('main');
  const [isRunning, setIsRunning] = useState(false);
  const [cursor, setCursor] = useState<CursorPosition | undefined>();
  const [lineCount, setLineCount] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const feedbackShownRef = useRef(false);
  const [jumpToLine, setJumpToLine] = useState<number | null>(null);
  const [outputTab, setOutputTab] = useState<'terminal' | 'trace' | 'python' | 'flowchart'>('terminal');

  const {
    entries,
    isRunning: interpreterRunning,
    waitingForInput,
    isStepping,
    debugLine,
    debugVariables,
    debugCursor,
    debugStepCount,
    errorLine,
    breakpoints,
    traceRows,
    maxTraceRows,
    run,
    debugRun,
    step,
    stepBack,
    continueExecution,
    provideInput,
    stop,
    clearEntries,
    toggleBreakpoint,
  } = useInterpreter();

  // Load initial code on mount (client-only)
  useEffect(() => {
    const code = loadInitialCode();
    savedCode.current = code;
    setTabs([{ id: 'main', name: 'main.pseudo', content: code }]);
    // Dev shortcut: ?survey=1 forces the feedback survey open immediately
    if (new URLSearchParams(window.location.search).get('survey') === '1') {
      setTimeout(() => setShowFeedback(true), 500);
    }
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  // Pseudocode → Python is converted on an explicit action (opening the Python
  // tab or the Convert button), never live as the student types. We keep the
  // snapshot plus the source it came from so we can flag it as stale after edits.
  const [pythonConversion, setPythonConversion] = useState<PythonConversion & { source: string }>({
    code: '',
    errors: [],
    source: '',
  });

  const convertToPythonNow = useCallback(() => {
    setPythonConversion({ ...convertToPython(activeTab.content), source: activeTab.content });
  }, [activeTab.content]);

  // Pseudocode → flowchart follows the same on-demand model as the Python view.
  const [flowchartConversion, setFlowchartConversion] = useState<FlowchartConversion & { source: string }>({
    nodes: [],
    edges: [],
    notes: [],
    errors: [],
    source: '',
  });

  const convertToFlowchartNow = useCallback(() => {
    setFlowchartConversion({ ...convertToFlowchart(activeTab.content), source: activeTab.content });
  }, [activeTab.content]);

  const handleOutputTabChange = useCallback(
    (tab: 'terminal' | 'trace' | 'python' | 'flowchart') => {
      if (tab === 'python') convertToPythonNow();
      if (tab === 'flowchart') convertToFlowchartNow();
      setOutputTab(tab);
    },
    [convertToPythonNow, convertToFlowchartNow],
  );

  const pythonStale = outputTab === 'python' && pythonConversion.source !== activeTab.content;
  const flowchartStale = outputTab === 'flowchart' && flowchartConversion.source !== activeTab.content;

  // Sync running state for footer
  useEffect(() => {
    setIsRunning(interpreterRunning);
  }, [interpreterRunning]);

  // Keep a session-only snapshot so the global bug-report modal can attach the
  // exact terminal context without coupling itself to the compiler component.
  useEffect(() => {
    try {
      const output = formatOutputEntries(entries);
      if (output.trim()) sessionStorage.setItem(BUG_REPORT_OUTPUT_KEY, output);
      else sessionStorage.removeItem(BUG_REPORT_OUTPUT_KEY);
    } catch {
      /* ignore unavailable/full storage */
    }
  }, [entries]);

  // The INPUT field lives in the Terminal tab. If the student is watching the
  // Trace table when the program asks for input, pull them back to the Terminal
  // so they can actually type their answer. Fire only on the false→true edge so
  // we don't fight a student who deliberately flips to Trace while paused.
  const outputTabRef = useRef(outputTab);
  useEffect(() => { outputTabRef.current = outputTab; }, [outputTab]);
  useEffect(() => {
    if (waitingForInput && outputTabRef.current !== 'terminal') {
      setOutputTab('terminal');
      toast.info('Input needed — switched to the Terminal tab');
    }
  }, [waitingForInput]);

  // Update line count when active tab content changes
  useEffect(() => {
    setLineCount(activeTab.content.split('\n').length);
  }, [activeTab.content]);

  // Auto-save the main scratch file with a debounce. Files opened from the
  // virtual filesystem are persisted immediately in handleCodeChange so a
  // stale open tab cannot overwrite fresh WRITEFILE output on this timer.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mainTabContent = tabs.find((tab) => tab.id === 'main')?.content ?? '';
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, mainTabContent);
      } catch {
        toast.error('Autosave failed: Storage full?');
      }
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(saveTimer.current);
  }, [mainTabContent]);

  // Keep file editor tabs in sync with WRITEFILE/PUTRECORD and editor saves.
  // This prevents an open, stale tab from later restoring old
  // content over an interpreter write.
  useEffect(() => {
    const handleFilesChanged = (event: Event) => {
      const changedFiles = (event as CustomEvent<{ files?: string[] }>).detail?.files;
      if (!changedFiles?.length) return;
      const changed = new Set(changedFiles);

      setTabs((prev) => {
        let didChange = false;
        const next = prev.map((tab) => {
          if (!tab.id.startsWith('file:') || !changed.has(tab.name)) return tab;
          const latest = localStorage.getItem(FILE_PREFIX + tab.name);
          if (latest === null || latest === tab.content) return tab;
          didChange = true;
          return { ...tab, content: latest };
        });
        return didChange ? next : prev;
      });
    };

    window.addEventListener(FILES_CHANGED_EVENT, handleFilesChanged);
    return () => window.removeEventListener(FILES_CHANGED_EVENT, handleFilesChanged);
  }, []);

  // Resizable split pane (persisted; loaded post-mount to avoid SSR mismatch).
  // Dragging past the clamp zone snaps the pane shut, leaving a slim rail
  // that reopens it at its previous size.
  const COLLAPSE_SNAP = 10; // % from either edge where the pane snaps closed
  const [splitPercent, setSplitPercent] = useState(50);
  const [collapsed, setCollapsed] = useState<'editor' | 'output' | null>(null);
  const splitPercentRef = useRef(splitPercent);
  const collapsedRef = useRef(collapsed);
  useEffect(() => { splitPercentRef.current = splitPercent; }, [splitPercent]);
  useEffect(() => { collapsedRef.current = collapsed; }, [collapsed]);
  useEffect(() => {
    setSplitPercent(loadSplitPercent(SPLIT_COMPILER_KEY, 50, 20, 80));
    try {
      const c = localStorage.getItem(SPLIT_COMPILER_COLLAPSED_KEY);
      if (c === 'editor' || c === 'output') setCollapsed(c);
    } catch { /* ignore */ }
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const persistSplit = useCallback(() => {
    try {
      localStorage.setItem(SPLIT_COMPILER_KEY, String(splitPercentRef.current));
      const c = collapsedRef.current;
      if (c) localStorage.setItem(SPLIT_COMPILER_COLLAPSED_KEY, c);
      else localStorage.removeItem(SPLIT_COMPILER_COLLAPSED_KEY);
    } catch { /* ignore */ }
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isLg = window.innerWidth >= 1024;
      const clientPos = 'touches' in ev ? ev.touches[0] : ev;
      let pct: number;
      if (isLg) {
        pct = ((clientPos.clientX - rect.left) / rect.width) * 100;
      } else {
        pct = ((clientPos.clientY - rect.top) / rect.height) * 100;
      }
      // Magnetic collapse: the pane resists below 20%, then snaps shut.
      if (pct < COLLAPSE_SNAP) {
        setCollapsed('editor');
        return;
      }
      if (pct > 100 - COLLAPSE_SNAP) {
        setCollapsed('output');
        return;
      }
      setCollapsed(null);
      setSplitPercent(Math.max(20, Math.min(80, pct)));
    };

    const onEnd = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      persistSplit();
    };

    document.body.style.cursor = window.innerWidth >= 1024 ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
    // Snapping the pane shut unmounts the divider mid-drag, so the browser
    // fires touchcancel instead of touchend. Without this the drag never ends
    // and the next scroll re-expands the collapsed pane.
    document.addEventListener('touchcancel', onEnd);
  }, [persistSplit]);

  const setSplit = useCallback((pct: number, coll: 'editor' | 'output' | null) => {
    splitPercentRef.current = pct;
    collapsedRef.current = coll;
    setSplitPercent(pct);
    setCollapsed(coll);
    persistSplit();
  }, [persistSplit]);

  const reopenPane = useCallback(() => {
    setSplit(splitPercentRef.current, null);
  }, [setSplit]);

  const resetSplit = useCallback(() => {
    setSplit(50, null);
  }, [setSplit]);

  // Keyboard resizing on the divider: arrows nudge, Home/End collapse, Enter resets.
  const handleDividerKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    const nudge = (delta: number) =>
      setSplit(Math.max(20, Math.min(80, splitPercentRef.current + delta)), null);
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nudge(-step);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nudge(step);
        break;
      case 'Home':
        setSplit(splitPercentRef.current, 'editor');
        break;
      case 'End':
        setSplit(splitPercentRef.current, 'output');
        break;
      case 'Enter':
        resetSplit();
        break;
      default:
        return;
    }
    e.preventDefault();
  }, [setSplit, resetSplit]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, content: newCode } : t)));

      if (activeTabId.startsWith('file:')) {
        const fileName = activeTabId.slice('file:'.length);
        try {
          localStorage.setItem(FILE_PREFIX + fileName, newCode);
          window.dispatchEvent(
            new CustomEvent(FILES_CHANGED_EVENT, { detail: { files: [fileName] } }),
          );
        } catch {
          toast.error('Autosave failed: Storage full?');
        }
      }
    },
    [activeTabId]
  );

  const handleFormat = useCallback(() => {
    handleCodeChange(formatPseudocode(activeTab.content));
  }, [handleCodeChange, activeTab.content]);

  const handleExampleSelect = useCallback((exampleCode: string) => {
    setTabs((prev) => prev.map((t) => (t.id === 'main' ? { ...t, content: exampleCode } : t)));
    setActiveTabId('main');
  }, []);

  const handleOpenFile = useCallback((fileName: string, content: string) => {
    const tabId = `file:${fileName}`;
    setTabs((prev) => {
      const existing = prev.find((t) => t.id === tabId);
      if (existing) {
        return prev.map((t) => (t.id === tabId ? { ...t, content } : t));
      }
      return [...prev, { id: tabId, name: fileName, content }];
    });
    setActiveTabId(tabId);
  }, []);

  const handleCloseTab = useCallback(
    (tabId: string) => {
      if (tabId === 'main') return;
      const closedIndex = tabs.findIndex((tab) => tab.id === tabId);
      if (closedIndex === -1) return;

      const closed = tabs[closedIndex];
      const newTabs = tabs.filter((tab) => tab.id !== tabId);
      setTabs(newTabs);

      if (tabId === activeTabId) {
        const newActive = newTabs[Math.min(closedIndex, newTabs.length - 1)] ?? newTabs[0];
        setActiveTabId(newActive.id);
      }

      toast.custom(
        (toastId) => (
          <div className="relative flex min-w-[280px] max-w-[calc(100vw-2rem)] items-center gap-3 overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-2.5 pr-3 text-light-text shadow-intense backdrop-blur-md">
            <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary" />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              <FileText size={17} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold" title={closed.name}>
                {closed.name}
              </span>
              <span className="block text-[10px] text-dark-text">Closed · saved in Files</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setTabs((currentTabs) => {
                  if (currentTabs.some((tab) => tab.id === closed.id)) return currentTabs;
                  const restoredTabs = [...currentTabs];
                  restoredTabs.splice(Math.min(closedIndex, restoredTabs.length), 0, closed);
                  return restoredTabs;
                });
                setActiveTabId(closed.id);
                toast.dismiss(toastId);
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/20"
              aria-label={`Undo closing ${closed.name}`}
            >
              <Undo2 size={12} aria-hidden="true" />
              Undo
            </button>
          </div>
        ),
        {
          duration: 3500,
          position: 'bottom-right',
          unstyled: true,
        }
      );
    },
    [activeTabId, tabs]
  );

  const handleTabSwitch = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const triggerFeedback = useCallback(() => {
    if (!feedbackShownRef.current && shouldShowFeedbackSurvey()) {
      feedbackShownRef.current = true;
      setShowFeedback(true);
    }
  }, []);

  // 20-minute time-based survey trigger
  useEffect(() => {
    const timer = setTimeout(triggerFeedback, 20 * 60_000);
    return () => clearTimeout(timer);
  }, [triggerFeedback]);

  const handleRunCode = async () => {
    if (!activeTab.content.trim()) return;
    setOutputTab('terminal');
    await run(activeTab.content);

    // Track run count and trigger feedback survey after threshold
    try {
      const count = (parseInt(localStorage.getItem(FEEDBACK_RUN_LS_KEY) ?? '0', 10) || 0) + 1;
      localStorage.setItem(FEEDBACK_RUN_LS_KEY, String(count));
      if (count >= FEEDBACK_RUN_THRESHOLD) {
        setTimeout(triggerFeedback, 1500);
      }
    } catch { /* ignore */ }
  };

  const handleDebugCode = async () => {
    if (!activeTab.content.trim()) return;
    setOutputTab('terminal');
    await debugRun(activeTab.content);
  };

  // Register run/convert/format actions in the command palette.
  useRegisterCommands([
    { id: 'run-run', label: 'Run', group: 'Run', keywords: 'execute play', run: () => handleRunCode() },
    { id: 'run-debug', label: 'Debug (step through)', group: 'Run', keywords: 'breakpoint', run: () => handleDebugCode() },
    { id: 'run-stop', label: 'Stop execution', group: 'Run', keywords: 'cancel halt', run: () => stop() },
    { id: 'run-step', label: 'Step over', group: 'Run', keywords: 'next forward line', run: () => step() },
    { id: 'run-step-back', label: 'Step back', group: 'Run', keywords: 'previous back line', run: () => stepBack() },
    { id: 'run-continue', label: 'Continue', group: 'Run', keywords: 'resume', run: () => continueExecution() },
    { id: 'code-python', label: 'Convert to Python', group: 'Code', keywords: 'translate', run: () => handleOutputTabChange('python') },
    { id: 'code-flowchart', label: 'Convert to Flowchart', group: 'Code', keywords: 'diagram', run: () => handleOutputTabChange('flowchart') },
    { id: 'code-format', label: 'Format code', group: 'Code', keywords: 'tidy indent prettify', run: () => handleFormat() },
  ]);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background text-light-text overflow-hidden">
      <div ref={containerRef} className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Collapsed-editor rail — click to bring the editor back */}
        {collapsed === 'editor' && (
          <button
            onClick={reopenPane}
            className="group shrink-0 flex items-center justify-center gap-2 bg-surface text-dark-text
              hover:text-light-text hover:bg-surface/70 transition-colors
              h-9 w-full border-b border-border lg:h-auto lg:w-9 lg:border-b-0 lg:border-r"
            title="Show editor"
            aria-label="Show editor pane"
          >
            <PanelTopOpen className="h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors lg:hidden" />
            <PanelLeftOpen className="hidden h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors lg:block" />
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase lg:[writing-mode:vertical-rl]">
              Editor
            </span>
          </button>
        )}

        {/* Editor pane — kept mounted while collapsed so editor state survives */}
        <div
          className={`min-h-0 flex-col overflow-hidden ${collapsed === 'editor' ? 'hidden' : 'flex'}`}
          style={
            collapsed === 'editor'
              ? undefined
              : { flex: collapsed === 'output' ? '1 1 0%' : `0 0 ${splitPercent}%` }
          }
        >
          <CodeInput
            code={activeTab.content}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            onDebugCode={handleDebugCode}
            isRunning={interpreterRunning}
            isStepping={isStepping}
            debugLine={debugLine}
            errorLine={errorLine}
            onStep={step}
            onStepBack={stepBack}
            debugCursor={debugCursor}
            debugStepCount={debugStepCount}
            onContinue={continueExecution}
            onStop={stop}
            onSelectExample={handleExampleSelect}
            onCursorChange={setCursor}
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSwitch={handleTabSwitch}
            onCloseTab={handleCloseTab}
            onOpenFile={handleOpenFile}
            breakpoints={breakpoints}
            onBreakpointToggle={toggleBreakpoint}
            jumpToLine={jumpToLine}
            onJumpToLineConsumed={() => setJumpToLine(null)}
          />
        </div>

        {/* Drag handle — double-click resets, arrows nudge, Home/End collapse */}
        {collapsed === null && (
          <SplitDivider
            orientation="responsive"
            onDragStart={handleDragStart}
            onDoubleClick={resetSplit}
            onKeyDown={handleDividerKeyDown}
            ariaLabel="Resize editor and output panes"
            ariaValueNow={Math.round(splitPercent)}
          />
        )}

        {/* Terminal pane */}
        <div className={`flex-1 min-h-0 flex-col overflow-hidden ${collapsed === 'output' ? 'hidden' : 'flex'}`}>
          <OutputDisplay
            entries={entries}
            isRunning={interpreterRunning}
            waitingForInput={waitingForInput}
            onInputSubmit={provideInput}
            onClear={clearEntries}
            isStepping={isStepping}
            debugVariables={debugVariables}
            onJumpToLine={(line) => setJumpToLine(line)}
            traceRows={traceRows}
            maxTraceRows={maxTraceRows}
            activeTab={outputTab}
            onTabChange={handleOutputTabChange}
            pythonCode={pythonConversion.code}
            pythonErrors={pythonConversion.errors}
            pythonStale={pythonStale}
            onRefreshPython={convertToPythonNow}
            flowchartNodes={flowchartConversion.nodes}
            flowchartEdges={flowchartConversion.edges}
            flowchartNotes={flowchartConversion.notes}
            flowchartErrors={flowchartConversion.errors}
            flowchartStale={flowchartStale}
            onRefreshFlowchart={convertToFlowchartNow}
          />
        </div>

        {/* Collapsed-output rail — click to bring the terminal back */}
        {collapsed === 'output' && (
          <button
            onClick={reopenPane}
            className="group shrink-0 flex items-center justify-center gap-2 bg-surface text-dark-text
              hover:text-light-text hover:bg-surface/70 transition-colors
              h-9 w-full border-t border-border lg:h-auto lg:w-9 lg:border-t-0 lg:border-l"
            title="Show output"
            aria-label="Show output pane"
          >
            <PanelBottomOpen className="h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors lg:hidden" />
            <PanelRightOpen className="hidden h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors lg:block" />
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase lg:[writing-mode:vertical-rl]">
              Output
            </span>
          </button>
        )}
      </div>
      <Footer isRunning={isRunning} cursor={cursor} lineCount={lineCount} />
      <OnboardingTour />
      {showFeedback && <FeedbackSurvey onDismiss={() => setShowFeedback(false)} />}
    </div>
  );
};

export default CompilerPage;
