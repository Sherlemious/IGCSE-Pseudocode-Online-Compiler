import React, { useState, useCallback, useEffect, useRef } from 'react';
import CodeInput from '../components/compiler/codeInput';
import type { CursorPosition } from '../components/compiler/codeInput';
import OutputDisplay from '../components/compiler/outputDisplay';
import { useInterpreter } from '../interpreter/useInterpreter';

export interface EditorTab {
  id: string;
  name: string;
  content: string;
}

interface HomeProps {
  onRunningChange?: (running: boolean) => void;
  onCursorChange?: (pos: CursorPosition) => void;
  onLineCountChange?: (count: number) => void;
}

const AUTOSAVE_KEY = 'pseudocode_autosave';
const AUTOSAVE_DELAY = 500; // ms

function loadInitialCode(): string {
  // Check URL for shared code first
  try {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('code');
    if (shared) {
      // Clean URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
      return decodeURIComponent(atob(shared));
    }
  } catch { /* invalid shared code — ignore */ }

  // Fall back to auto-saved code
  try {
    return localStorage.getItem(AUTOSAVE_KEY) ?? '';
  } catch {
    return '';
  }
}

const Home: React.FC<HomeProps> = ({ onRunningChange, onCursorChange, onLineCountChange }) => {
  const savedCode = useRef(loadInitialCode());
  const [tabs, setTabs] = useState<EditorTab[]>([
    { id: 'main', name: 'main.pseudo', content: savedCode.current },
  ]);
  const [activeTabId, setActiveTabId] = useState('main');
  const {
    entries, isRunning, waitingForInput,
    isStepping, debugLine, debugVariables,
    errorLine,
    breakpoints,
    run, debugRun, step, continueExecution,
    provideInput, stop, clearEntries,
    toggleBreakpoint, clearBreakpoints,
  } = useInterpreter();

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  // ── Auto-save main tab with debounce ─────────────────────
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const mainTab = tabs.find((t) => t.id === 'main');
    if (!mainTab) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, mainTab.content);
      } catch { /* quota exceeded — ignore */ }
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(saveTimer.current);
  }, [tabs]);

  // ── Propagate running state to parent (for status bar) ───
  const prevRunning = useRef(false);
  useEffect(() => {
    if (prevRunning.current !== isRunning) {
      prevRunning.current = isRunning;
      onRunningChange?.(isRunning);
    }
  }, [isRunning, onRunningChange]);

  // ── Update line count when active tab changes ────────────
  useEffect(() => {
    onLineCountChange?.(activeTab.content.split('\n').length);
  }, [activeTab.content, onLineCountChange]);

  // ── Resizable split pane ─────────────────────────────────
  const [splitPercent, setSplitPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isLg = window.innerWidth >= 1024; // lg breakpoint
      const clientPos = 'touches' in ev ? ev.touches[0] : ev;
      let pct: number;
      if (isLg) {
        pct = ((clientPos.clientX - rect.left) / rect.width) * 100;
      } else {
        pct = ((clientPos.clientY - rect.top) / rect.height) * 100;
      }
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

    document.body.style.cursor = window.innerWidth >= 1024 ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
  }, []);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setTabs((prev) => prev.map((t) => (t.id === activeTabId ? { ...t, content: newCode } : t)));
    },
    [activeTabId],
  );

  const handleExampleSelect = useCallback(
    (exampleCode: string) => {
      setTabs((prev) => prev.map((t) => (t.id === 'main' ? { ...t, content: exampleCode } : t)));
      setActiveTabId('main');
    },
    [],
  );

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
      setTabs((prev) => {
        const newTabs = prev.filter((t) => t.id !== tabId);
        if (tabId === activeTabId) {
          const closedIndex = prev.findIndex((t) => t.id === tabId);
          const newActive = newTabs[Math.min(closedIndex, newTabs.length - 1)] ?? newTabs[0];
          setActiveTabId(newActive.id);
        }
        return newTabs;
      });
    },
    [activeTabId],
  );

  const handleTabSwitch = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const handleRunCode = async () => {
    if (!activeTab.content.trim()) return;
    await run(activeTab.content);
  };

  const handleDebugCode = async () => {
    if (!activeTab.content.trim()) return;
    await debugRun(activeTab.content);
  };

  return (
    <div className="h-full flex flex-col bg-background text-light-text overflow-hidden">
      <div
        ref={containerRef}
        className="flex-1 min-h-0 flex flex-col lg:flex-row"
      >
        {/* Editor pane */}
        <div
          className="min-h-0 flex flex-col overflow-hidden"
          style={{ flex: `0 0 ${splitPercent}%` }}
        >
          <CodeInput
            code={activeTab.content}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            onDebugCode={handleDebugCode}
            isRunning={isRunning}
            isStepping={isStepping}
            debugLine={debugLine}
            errorLine={errorLine}
            onStep={step}
            onContinue={continueExecution}
            onStop={stop}
            onSelectExample={handleExampleSelect}
            onCursorChange={onCursorChange}
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSwitch={handleTabSwitch}
            onCloseTab={handleCloseTab}
            onOpenFile={handleOpenFile}
            breakpoints={breakpoints}
            onBreakpointToggle={toggleBreakpoint}
          />
        </div>

        {/* Drag handle */}
        <div
          className="shrink-0 bg-border hover:bg-primary transition-colors
            lg:w-1 lg:cursor-col-resize lg:h-auto
            w-auto h-1 cursor-row-resize"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />

        {/* Terminal pane */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <OutputDisplay
            entries={entries}
            isRunning={isRunning}
            waitingForInput={waitingForInput}
            onInputSubmit={provideInput}
            onClear={clearEntries}
            isStepping={isStepping}
            debugVariables={debugVariables}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
