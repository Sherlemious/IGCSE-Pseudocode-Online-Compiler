'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import CodeInput, { type EditorTab, type CursorPosition } from './codeInput';
import OutputDisplay from './outputDisplay';
import Footer from '../layout/footer';
import OnboardingTour from '../onboarding/OnboardingTour';
import FeedbackSurvey, { shouldShowFeedbackSurvey } from '../feedback/FeedbackSurvey';
import { useInterpreter } from '../../interpreter/useInterpreter';
import { toast } from 'sonner';
import { AUTOSAVE_KEY, FILE_PREFIX, AUTOSAVE_DELAY, ONBOARDING_KEY } from '../../utils/constants';

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

  const {
    entries,
    isRunning: interpreterRunning,
    waitingForInput,
    isStepping,
    debugLine,
    debugVariables,
    errorLine,
    breakpoints,
    run,
    debugRun,
    step,
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
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  // Sync running state for footer
  useEffect(() => {
    setIsRunning(interpreterRunning);
  }, [interpreterRunning]);

  // Update line count when active tab content changes
  useEffect(() => {
    setLineCount(activeTab.content.split('\n').length);
  }, [activeTab.content]);

  // Auto-save tabs with debounce
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      tabs.forEach((tab) => {
        try {
          if (tab.id === 'main') {
            localStorage.setItem(AUTOSAVE_KEY, tab.content);
          } else if (tab.id.startsWith('file:')) {
            localStorage.setItem(FILE_PREFIX + tab.name, tab.content);
          }
        } catch {
          toast.error('Autosave failed: Storage full?');
        }
      });
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(saveTimer.current);
  }, [tabs]);

  // Resizable split pane
  const [splitPercent, setSplitPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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
    [activeTabId]
  );

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
    [activeTabId]
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
    await debugRun(activeTab.content);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background text-light-text overflow-hidden">
      <div ref={containerRef} className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Editor pane */}
        <div className="min-h-0 flex flex-col overflow-hidden" style={{ flex: `0 0 ${splitPercent}%` }}>
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
            isRunning={interpreterRunning}
            waitingForInput={waitingForInput}
            onInputSubmit={provideInput}
            onClear={clearEntries}
            isStepping={isStepping}
            debugVariables={debugVariables}
          />
        </div>
      </div>
      <Footer isRunning={isRunning} cursor={cursor} lineCount={lineCount} />
      <OnboardingTour />
      {showFeedback && <FeedbackSurvey onDismiss={() => setShowFeedback(false)} />}
    </div>
  );
};

export default CompilerPage;
